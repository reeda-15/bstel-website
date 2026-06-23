"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "../../lib/supabase/client";

type AuthMode = "signin" | "signup";

const providers = [
  { id: "google", label: "Google" },
  { id: "apple", label: "Apple" },
  { id: "facebook", label: "Facebook" },
] as const;

function getAuthCallbackUrl() {
  return `${window.location.origin}/auth/callback`;
}

function getFriendlyError(message: string) {
  if (message.toLowerCase().includes("invalid")) {
    return "Those credentials did not work. Check your details and try again.";
  }

  return message;
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("error");

    if (authError) {
      setError("Authentication was canceled or failed. Please try again.");
    }
  }, []);

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsWorking(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const result =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: { emailRedirectTo: getAuthCallbackUrl() },
            });

      if (result.error) {
        setError(getFriendlyError(result.error.message));
        return;
      }

      setNotice(
        mode === "signin"
          ? "You are signed in. Redirecting..."
          : "Check your email to confirm your account."
      );

      if (mode === "signin") {
        window.location.assign("/");
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed.");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleOAuth(provider: (typeof providers)[number]["id"]) {
    setError("");
    setNotice("");
    setIsWorking(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: getAuthCallbackUrl(),
          queryParams: { prompt: "select_account" },
        },
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsWorking(false);
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "OAuth sign-in failed.");
      setIsWorking(false);
    }
  }

  async function handleSendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsWorking(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({ phone });

      if (otpError) {
        setError(otpError.message);
        return;
      }

      setOtpSent(true);
      setNotice("Verification code sent. Codes can expire quickly, so enter it soon.");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Could not send the code.");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsWorking(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });

      if (verifyError) {
        setError("That code is invalid or expired. Request a new code and try again.");
        return;
      }

      setNotice("Phone verified. Redirecting...");
      window.location.assign("/");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Could not verify the code.");
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <Link className="back-link" href="/">
          Paddle
        </Link>
        <p className="eyebrow">Production account access</p>
        <h1 id="auth-title">Sign in to live auction tools.</h1>
        <p className="auth-copy">
          Use email, a social provider, or phone verification to access bidding and seller
          account features.
        </p>

        <div className="auth-tabs" role="tablist" aria-label="Email account mode">
          <button
            type="button"
            className={mode === "signin" ? "active" : ""}
            onClick={() => setMode("signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Create account
          </button>
        </div>

        <form className="auth-form" onSubmit={handleEmailAuth}>
          <label>
            Email
            <input
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
              type="email"
              value={email}
            />
          </label>
          <label>
            Password
            <input
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
              type="password"
              value={password}
            />
          </label>
          <button className="primary-button" disabled={isWorking} type="submit">
            {mode === "signin" ? "Sign in with email" : "Create email account"}
          </button>
        </form>

        <div className="divider">or continue with</div>
        <div className="oauth-grid">
          {providers.map((provider) => (
            <button
              disabled={isWorking}
              key={provider.id}
              onClick={() => handleOAuth(provider.id)}
              type="button"
            >
              {provider.label}
            </button>
          ))}
        </div>

        <div className="phone-box">
          <h2>Phone OTP</h2>
          <form className="auth-form compact" onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
            <label>
              Phone number
              <input
                autoComplete="tel"
                inputMode="tel"
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1 555 000 0000"
                required
                type="tel"
                value={phone}
              />
            </label>
            {otpSent ? (
              <label>
                Verification code
                <input
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="123456"
                  required
                  type="text"
                  value={otp}
                />
              </label>
            ) : null}
            <button className="secondary-button" disabled={isWorking} type="submit">
              {otpSent ? "Verify code" : "Send code"}
            </button>
          </form>
        </div>

        {notice ? <p className="notice">{notice}</p> : null}
        {error ? (
          <p className="notice error" role="alert">
            {error}
          </p>
        ) : null}
      </section>
    </main>
  );
}

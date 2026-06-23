"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "../../../lib/supabase/client";

export default function MfaPage() {
  const [factorId, setFactorId] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Set up or verify two-factor authentication.");

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.mfa.listFactors().then(({ data, error }) => {
      if (error) {
        setMessage("Could not load factors.");
        return;
      }

      const factor = data?.totp?.[0] || data?.phone?.[0];
      if (factor) setFactorId(factor.id);
    });
  }, []);

  async function challenge() {
    if (!factorId) {
      setMessage("Enter or enroll a factor before starting a challenge.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.mfa.challenge({ factorId });
    if (error) setMessage("Could not start challenge.");
    else {
      setChallengeId(data.id);
      setMessage("Enter your authenticator code.");
    }
  }

  async function verify() {
    if (!factorId || !challengeId || !code) {
      setMessage("Factor, challenge, and code are required.");
      return;
    }

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.mfa.verify({ factorId, challengeId, code });
    setMessage(error ? "Invalid code." : "Two-factor authentication verified.");
  }

  return (
    <main className="account-page">
      <section className="auth-panel">
        <p className="eyebrow">Security</p>
        <h1>Two-factor authentication</h1>
        <p>{message}</p>
        <label className="field-label">
          Factor ID
          <input
            value={factorId}
            onChange={(event) => setFactorId(event.target.value)}
            placeholder="Factor ID"
          />
        </label>
        <button className="primary-button" onClick={challenge}>
          Start challenge
        </button>
        <label className="field-label">
          Code
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="6 digit code"
            inputMode="numeric"
          />
        </label>
        <button className="secondary-button" onClick={verify}>
          Verify
        </button>
      </section>
    </main>
  );
}

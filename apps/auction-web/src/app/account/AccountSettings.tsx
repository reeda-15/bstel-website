"use client";

import { useState } from "react";
import { saveAddress, saveCompany, updateProfile } from "../../lib/account/account-api";

export function AccountSettings({ email, phone }: { email: string | null; phone: string | null }) {
  const [displayName, setDisplayName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function run(action: () => Promise<unknown>, success: string) {
    try {
      await action();
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Request failed");
    }
  }

  return (
    <main className="account-page">
      <section className="settings-grid">
        <article className="settings-panel">
          <p className="eyebrow">Account</p>
          <h1>Account settings</h1>
          <p>Email: {email || "Not connected"}</p>
          <p>Phone: {phone || "Not connected"}</p>
        </article>

        <article className="settings-panel">
          <h2>User profile</h2>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Display name"
          />
          <button onClick={() => run(() => updateProfile(displayName), "Profile saved")}>
            Save profile
          </button>
        </article>

        <article className="settings-panel">
          <h2>Company profile</h2>
          <input
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            placeholder="Company name"
          />
          <button
            onClick={() =>
              run(
                () =>
                  saveCompany({
                    company_name: companyName,
                    legal_name: null,
                    website_url: null,
                    support_email: email,
                    support_phone: phone,
                  }),
                "Company saved"
              )
            }
          >
            Save company
          </button>
        </article>

        <article className="settings-panel">
          <h2>Address book</h2>
          <input
            value={line1}
            onChange={(event) => setLine1(event.target.value)}
            placeholder="Address line 1"
          />
          <input value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" />
          <input
            value={postalCode}
            onChange={(event) => setPostalCode(event.target.value)}
            placeholder="Postal code"
          />
          <button
            onClick={() =>
              run(
                () =>
                  saveAddress({
                    type: "shipping",
                    name: null,
                    line1,
                    line2: null,
                    city,
                    region: null,
                    postal_code: postalCode,
                    country: "US",
                    phone,
                    is_default_shipping: true,
                    is_default_billing: false,
                  }),
                "Address saved"
              )
            }
          >
            Save shipping address
          </button>
        </article>

        {message ? <p className="notice settings-message">{message}</p> : null}
      </section>
    </main>
  );
}

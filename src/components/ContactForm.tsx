"use client";

import { useState } from "react";
import { validateContactRequest } from "@/lib/contact-validation";

const services = [
  "Passive Infrastructure (IP-1)",
  "Fibre Deployment & O&M",
  "Internet Leased Line",
  "FTTH / FTTB",
  "Wi-Fi Hotspots",
  "CCTV & Security",
  "Other / Not sure",
];

const initialValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  service: services[0],
  message: "",
};

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function update(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = validateContactRequest(values);
    setErrors(result.errors);
    if (result.valid) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="form-card success-card">
        <div className="checkmark">OK</div>
        <h2>Request received</h2>
        <p>Thank you - our team will get back to you within one business day. For urgent matters, call the NOC at +91 77090 42392.</p>
        <button className="button secondary" type="button" onClick={() => { setValues(initialValues); setSubmitted(false); }}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit} noValidate>
      <div className="form-intro">
        <span className="eyebrow">PROJECT ENQUIRY</span>
        <h2>Share the route, service or support requirement.</h2>
        <p>Use this form for fibre rollout, O&M, leased line, Wi-Fi, CCTV, NOC or district coverage enquiries.</p>
      </div>
      <div className="form-row">
        <label>
          Full name *
          <input value={values.name} onChange={(event) => update("name", event.target.value)} aria-invalid={Boolean(errors.name)} />
          {errors.name ? <span>{errors.name}</span> : null}
        </label>
        <label>
          Company
          <input value={values.company} onChange={(event) => update("company", event.target.value)} />
        </label>
      </div>
      <div className="form-row">
        <label>
          Email *
          <input type="email" value={values.email} onChange={(event) => update("email", event.target.value)} aria-invalid={Boolean(errors.email)} />
          {errors.email ? <span>{errors.email}</span> : null}
        </label>
        <label>
          Phone
          <input value={values.phone} onChange={(event) => update("phone", event.target.value)} />
        </label>
      </div>
      <label>
        Service of interest
        <select value={values.service} onChange={(event) => update("service", event.target.value)}>
          {services.map((service) => <option key={service}>{service}</option>)}
        </select>
      </label>
      <label>
        Requirement details *
        <textarea placeholder="Tell us the location, route length, service type, timeline or support requirement." value={values.message} onChange={(event) => update("message", event.target.value)} aria-invalid={Boolean(errors.message)} />
        {errors.message ? <span>{errors.message}</span> : null}
      </label>
      <div className="form-submit-row">
        <button className="button green" type="submit">Send request</button>
        <small>Response within one business day. Urgent NOC support is available by phone.</small>
      </div>
    </form>
  );
}

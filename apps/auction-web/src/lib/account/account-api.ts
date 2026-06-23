import type { AddressInput, CompanyProfile } from "./account-types";

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload as T;
}

export function updateProfile(displayName: string) {
  return requestJson<{ ok: true }>("/api/account/profile", {
    method: "PATCH",
    body: JSON.stringify({ display_name: displayName }),
  });
}

export function saveCompany(company: CompanyProfile) {
  return requestJson<{ ok: true }>("/api/account/company", {
    method: "PUT",
    body: JSON.stringify(company),
  });
}

export function saveAddress(address: AddressInput) {
  return requestJson<{ ok: true }>("/api/account/addresses", {
    method: "POST",
    body: JSON.stringify(address),
  });
}

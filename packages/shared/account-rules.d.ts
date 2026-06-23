export type ProfileRole = "bidder" | "seller" | "admin";
export type AssuranceLevel = "aal1" | "aal2";

export type SellerReadinessAccount = {
  roles: ProfileRole[];
  bannedAt: string | null;
  hasCompanyProfile: boolean;
  hasCompanyAddress: boolean;
  hasMfaEnrollment: boolean;
  assuranceLevel: AssuranceLevel;
};

export type PaymentMethodGuardAccount = {
  roles: ProfileRole[];
  isAuthenticated: boolean;
  assuranceLevel: AssuranceLevel;
};

export function requiresMfaForRole(roles: ProfileRole[]): boolean;
export function getMissingSellerReadiness(account: SellerReadinessAccount): string[];
export function canPublishListing(account: SellerReadinessAccount): { ok: boolean; missing: string[] };
export function canManagePaymentMethods(account: PaymentMethodGuardAccount): { ok: true } | { ok: false; reason: string };

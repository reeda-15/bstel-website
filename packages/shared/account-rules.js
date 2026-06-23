function hasAnyRole(roles, candidates) {
  return candidates.some((role) => roles.includes(role));
}

function requiresMfaForRole(roles) {
  return hasAnyRole(roles || [], ["seller", "admin"]);
}

function getMissingSellerReadiness(account) {
  const missing = [];
  if (account.bannedAt) missing.push("active_account");
  if (!account.hasCompanyProfile) missing.push("company_profile");
  if (!account.hasCompanyAddress) missing.push("company_address");
  if (!account.hasMfaEnrollment) missing.push("mfa_enrollment");
  if (account.assuranceLevel !== "aal2") missing.push("mfa_challenge");
  return missing;
}

function canPublishListing(account) {
  const missing = getMissingSellerReadiness(account);
  return { ok: missing.length === 0, missing };
}

function canManagePaymentMethods(account) {
  if (!account.isAuthenticated) return { ok: false, reason: "auth_required" };
  if (requiresMfaForRole(account.roles || []) && account.assuranceLevel !== "aal2") {
    return { ok: false, reason: "mfa_required" };
  }
  return { ok: true };
}

module.exports = {
  canManagePaymentMethods,
  canPublishListing,
  getMissingSellerReadiness,
  requiresMfaForRole,
};

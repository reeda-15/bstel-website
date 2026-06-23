const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getMissingSellerReadiness,
  canPublishListing,
  requiresMfaForRole,
  canManagePaymentMethods,
} = require("./account-rules");

test("seller readiness requires company profile, company address, MFA, and active account", () => {
  const account = {
    roles: ["seller"],
    bannedAt: null,
    hasCompanyProfile: false,
    hasCompanyAddress: false,
    hasMfaEnrollment: false,
    assuranceLevel: "aal1",
  };

  assert.deepEqual(getMissingSellerReadiness(account), [
    "company_profile",
    "company_address",
    "mfa_enrollment",
    "mfa_challenge",
  ]);
  assert.equal(canPublishListing(account).ok, false);
});

test("seller can publish after company readiness and aal2 session", () => {
  const account = {
    roles: ["seller"],
    bannedAt: null,
    hasCompanyProfile: true,
    hasCompanyAddress: true,
    hasMfaEnrollment: true,
    assuranceLevel: "aal2",
  };

  assert.deepEqual(getMissingSellerReadiness(account), []);
  assert.deepEqual(canPublishListing(account), { ok: true, missing: [] });
});

test("banned sellers cannot publish even when setup is complete", () => {
  const account = {
    roles: ["seller"],
    bannedAt: "2026-06-22T00:00:00.000Z",
    hasCompanyProfile: true,
    hasCompanyAddress: true,
    hasMfaEnrollment: true,
    assuranceLevel: "aal2",
  };

  assert.deepEqual(canPublishListing(account), { ok: false, missing: ["active_account"] });
});

test("MFA is required for sellers and admins but optional for bidders", () => {
  assert.equal(requiresMfaForRole(["bidder"]), false);
  assert.equal(requiresMfaForRole(["bidder", "seller"]), true);
  assert.equal(requiresMfaForRole(["admin"]), true);
});

test("payment method changes require authenticated aal2 for seller or admin but only auth for bidder", () => {
  assert.equal(canManagePaymentMethods({ roles: ["bidder"], isAuthenticated: true, assuranceLevel: "aal1" }).ok, true);
  assert.deepEqual(canManagePaymentMethods({ roles: ["seller"], isAuthenticated: true, assuranceLevel: "aal1" }), {
    ok: false,
    reason: "mfa_required",
  });
  assert.equal(canManagePaymentMethods({ roles: ["seller"], isAuthenticated: true, assuranceLevel: "aal2" }).ok, true);
  assert.deepEqual(canManagePaymentMethods({ roles: ["bidder"], isAuthenticated: false, assuranceLevel: "aal1" }), {
    ok: false,
    reason: "auth_required",
  });
});

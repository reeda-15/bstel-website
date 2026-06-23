import { canPublishListing } from "@paddle/shared/account-rules";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("roles,banned_at")
    .eq("id", userData.user.id)
    .single();

  const { data: company } = await supabase
    .from("company_profiles")
    .select("id")
    .eq("owner_id", userData.user.id)
    .maybeSingle();

  const { data: companyAddress } = await supabase
    .from("addresses")
    .select("id")
    .eq("user_id", userData.user.id)
    .eq("type", "company")
    .maybeSingle();

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const hasMfaEnrollment = !!((factors?.totp?.length || 0) + (factors?.phone?.length || 0));

  const result = canPublishListing({
    roles: profile?.roles || ["bidder"],
    bannedAt: profile?.banned_at || null,
    hasCompanyProfile: !!company,
    hasCompanyAddress: !!companyAddress,
    hasMfaEnrollment,
    assuranceLevel: aal?.currentLevel === "aal2" ? "aal2" : "aal1",
  });

  return NextResponse.json(result);
}

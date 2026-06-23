import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function PUT(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json();
  const companyName = String(body.company_name || "").trim();
  if (!companyName) return NextResponse.json({ error: "Company name is required" }, { status: 400 });

  const { error } = await supabase.from("company_profiles").upsert(
    {
      owner_id: data.user.id,
      company_name: companyName,
      legal_name: body.legal_name || null,
      website_url: body.website_url || null,
      support_email: body.support_email || null,
      support_phone: body.support_phone || null,
    },
    { onConflict: "owner_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

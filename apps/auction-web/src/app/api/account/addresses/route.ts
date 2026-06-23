import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

const requiredKeys = ["type", "line1", "city", "postal_code", "country"];

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json();
  for (const key of requiredKeys) {
    if (!String(body[key] || "").trim()) {
      return NextResponse.json({ error: `${key} is required` }, { status: 400 });
    }
  }

  const { error } = await supabase.from("addresses").insert({
    user_id: data.user.id,
    type: body.type,
    name: body.name || null,
    line1: body.line1,
    line2: body.line2 || null,
    city: body.city,
    region: body.region || null,
    postal_code: body.postal_code,
    country: body.country,
    phone: body.phone || null,
    is_default_shipping: !!body.is_default_shipping,
    is_default_billing: !!body.is_default_billing,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

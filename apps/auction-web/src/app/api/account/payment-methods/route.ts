import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { data: methods, error } = await supabase
    .from("saved_payment_methods")
    .select("id,brand,last4,exp_month,exp_year,is_default,status")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ methods });
}

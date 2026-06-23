import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const body = await request.json();
  const displayName = String(body.display_name || "").trim();
  if (!displayName) return NextResponse.json({ error: "Display name is required" }, { status: 400 });

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName })
    .eq("id", data.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}

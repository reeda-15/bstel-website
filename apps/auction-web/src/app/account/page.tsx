import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { AccountSettings } from "./AccountSettings";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/auth");

  return <AccountSettings email={data.user.email || null} phone={data.user.phone || null} />;
}

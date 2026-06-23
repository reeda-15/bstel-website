import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";
import { getStripe } from "../../../../../lib/stripe/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  try {
    const stripe = getStripe();
    const { data: existing } = await supabase
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    let customerId = existing?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: userData.user.email || undefined });
      customerId = customer.id;
      const { error } = await supabase
        .from("stripe_customers")
        .insert({ user_id: userData.user.id, stripe_customer_id: customerId });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not create setup intent" },
      { status: 500 }
    );
  }
}

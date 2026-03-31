import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

const leadSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal("")),
  state: z.string().min(1),
  production: z.string().min(1),
  current_imo: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

function scoreLead(production: string) {
  const normalized = production.replace(/\s+/g, "").toLowerCase();

  if (
    normalized === "$3m–$5m" ||
    normalized === "$3m-$5m" ||
    normalized === "3m-5m" ||
    normalized === "$5m–$10m" ||
    normalized === "$5m-$10m" ||
    normalized === "5m-10m" ||
    normalized === "$10m+" ||
    normalized === "10m+"
  ) {
    return "hot";
  }

  if (
    normalized === "$1m–$3m" ||
    normalized === "$1m-$3m" ||
    normalized === "1m-3m" ||
    normalized === "$500k–$1m" ||
    normalized === "$500k-$1m" ||
    normalized === "500k-1m"
  ) {
    return "warm";
  }

  return "cold";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = leadSchema.parse(body);

    const score = scoreLead(parsed.production);

    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        first_name: parsed.first_name,
        last_name: parsed.last_name,
        email: parsed.email,
        phone: parsed.phone || null,
        state: parsed.state,
        annual_fia_production: parsed.production,
        current_imo: parsed.current_imo || null,
        notes: parsed.notes || null,
        score,
        lead_type: "advisor",
        campaign: "direct-contract-test",
        source: "replit-landing-page",
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    await supabase.from("events").insert({
      lead_id: lead.id,
      type: "form_submitted",
      metadata: { score },
    });

    return NextResponse.json({ success: true, leadId: lead.id });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
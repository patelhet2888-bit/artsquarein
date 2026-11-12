"use client";

import { FormEvent, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ArrowRight } from "lucide-react";

export function NewsletterForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setBusy(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) throw new Error("Newsletter sign-up is temporarily unavailable. Please contact us on WhatsApp.");
      const supabase = createBrowserClient(url, key);
      const { error } = await supabase.from("newsletter_subscribers").insert({ email });
      if (error?.code === "23505") setStatus({ type: "success", text: "You’re already on our list. We’re glad you’re here." });
      else if (error) throw error;
      else { setStatus({ type: "success", text: "Thank you. You’re on the ART SQUARE list." }); form.reset(); }
    } catch {
      setStatus({ type: "error", text: "We couldn’t save your sign-up just now. Please try again or reach us on WhatsApp." });
    } finally { setBusy(false); }
  }
  return <div className="newsletter-content"><div><span className="eyebrow">A letter from our studio</span><h2>Artful notes, occasionally.</h2><p>New creations, thoughtful gifting and stories from the making table. No clutter, just the good things.</p></div><form className="newsletter-form" onSubmit={handleSubmit}><label htmlFor="newsletter-email" className="sr-only">Your email address</label><div className="newsletter-input"><input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="Your email address" required maxLength={254} /><button type="submit" aria-label="Join the newsletter" disabled={busy}><ArrowRight size={19} /></button></div><p className="form-note" aria-live="polite">{status?.text ?? "By signing up, you agree to receive occasional studio updates."}</p></form></div>;
}

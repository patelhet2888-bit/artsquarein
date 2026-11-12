"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(initialError === "not_admin"
    ? "This Supabase account is not authorized for storefront administration."
    : initialError === "auth_callback"
      ? "The sign-in link could not be verified. Please try again."
      : "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const supabase = createClient();

    if (isRecovering) {
      const redirect = new URL(process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`);
      redirect.searchParams.set("next", "/admin/update-password");
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: redirect.toString() });
      setMessage(error ? "We couldn’t send the reset link. Check the email address and try again." : "If the account is eligible, a password reset link will arrive by email.");
      setBusy(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error || !data.user) {
      setMessage("Invalid email or password.");
      setBusy(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      setMessage(adminError ? "Admin access is temporarily unavailable." : "This account is not authorized for storefront administration.");
      setBusy(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return <form className="admin-login-form" onSubmit={handleSubmit}>
    <div className="admin-login-icon"><LockKeyhole size={20} aria-hidden="true" /></div>
    <span className="admin-kicker">ART SQUARE · PRIVATE ACCESS</span>
    <h1>{isRecovering ? "Reset your password" : "Welcome back."}</h1>
    <p>{isRecovering ? "We’ll send a secure password reset link if the account is eligible." : "Sign in with your Supabase Auth account to manage the storefront."}</p>
    <label className="admin-field"><span>Email address</span><input type="email" autoComplete="username" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
    {!isRecovering && <label className="admin-field"><span>Password</span><input type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
    {message && <p className="admin-form-message" role="status">{message}</p>}
    <button className="admin-button admin-button-primary" type="submit" disabled={busy}>{busy ? "Please wait…" : isRecovering ? "Send reset link" : "Sign in"}<ArrowUpRight size={16} /></button>
    <button className="admin-text-button" type="button" onClick={() => { setIsRecovering((current) => !current); setMessage(""); }}>
      {isRecovering ? "Back to sign in" : "Forgot your password?"}
    </button>
    <p className="admin-login-note">Admin access is invitation-only. A Supabase Auth account must be present in the ART SQUARE admin allowlist.</p>
  </form>;
}

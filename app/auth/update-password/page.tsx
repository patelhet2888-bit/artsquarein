"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmation) {
      setMessage("The passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setMessage("Use at least 8 characters for your password.");
      return;
    }

    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setMessage("The reset link may have expired. Request a new password reset and try again.");
      setBusy(false);
      return;
    }
    router.replace("/admin/login?password_updated=1");
    router.refresh();
  }

  return <main className="admin-login-page"><form className="admin-login-form" onSubmit={submit}>
    <span className="admin-kicker">ART SQUARE · ACCOUNT SECURITY</span>
    <h1>Choose a new password.</h1>
    <p>Use at least eight characters. This password is managed securely by Supabase Auth.</p>
    <label className="admin-field"><span>New password</span><input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
    <label className="admin-field"><span>Confirm new password</span><input type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>
    {message && <p className="admin-form-message" role="status">{message}</p>}
    <button className="admin-button admin-button-primary" type="submit" disabled={busy}>{busy ? "Updating…" : "Update password"}</button>
  </form></main>;
}

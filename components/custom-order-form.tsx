"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function CustomOrderForm() {
  const [status, setStatus] = useState("");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const lines = ["Hello ART SQUARE, I’d love to enquire about a custom creation.", "", `Name: ${fields.get("name")}`, `Email: ${fields.get("email")}`, `Country: ${fields.get("country")}`, `WhatsApp: ${fields.get("phone")}`, `Product or design: ${fields.get("design")}`, `Customization details: ${fields.get("details")}`, "", "Could you please share availability and shipping options for my location?"];
    const whatsappUrl = `https://wa.me/919054934190?text=${encodeURIComponent(lines.join("\n"))}`;
    const popup = window.open(whatsappUrl, "_blank");
    if (popup) { popup.opener = null; setStatus("WhatsApp opened with your enquiry prepared. Send the message there to submit it."); form.reset(); }
    else setStatus("Your browser blocked the WhatsApp window. Allow pop-ups and submit again, or use the WhatsApp button on this page.");
  }
  return <form className="order-form" onSubmit={handleSubmit}><div className="form-row"><div className="field"><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" required maxLength={100} /></div><div className="field"><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} /></div></div><div className="form-row"><div className="field"><label htmlFor="country">Country</label><input id="country" name="country" autoComplete="country-name" required maxLength={80} placeholder="Where are you writing from?" /></div><div className="field"><label htmlFor="phone">WhatsApp contact</label><input id="phone" name="phone" type="tel" autoComplete="tel" required minLength={6} maxLength={25} pattern="\\+?[0-9 ()-]{6,25}" title="Enter a phone number with its country code, using digits, spaces, +, parentheses or hyphens." placeholder="Include country code" /></div></div><div className="field"><label htmlFor="design">Product or design requirement</label><input id="design" name="design" required maxLength={160} placeholder="A piece you saw, or an idea you have" /></div><div className="field"><label htmlFor="details">Tell us a little more</label><textarea id="details" name="details" rows={5} required minLength={12} maxLength={1200} placeholder="Colours, occasion, personal touches — share what matters to you." /></div><button className="button button-dark" type="submit">Prepare my enquiry <ArrowUpRight size={16} /></button><p className="form-note" aria-live="polite">{status || "Your details will be prepared in WhatsApp; nothing is sent until you choose to send it."}</p></form>;
}

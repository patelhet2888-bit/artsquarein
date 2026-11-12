import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFloat({ whatsappNumber, brandName }: { whatsappNumber: string; brandName: string }) {
  const message = `Hello ${brandName}, I would love to enquire about your handmade art.`;
  return <a className="whatsapp-float" href={whatsappLink(message, whatsappNumber)} target="_blank" rel="noreferrer" aria-label={`Chat with ${brandName} on WhatsApp`}><MessageCircle size={21} strokeWidth={1.8} /><span>Let&apos;s talk</span></a>;
}

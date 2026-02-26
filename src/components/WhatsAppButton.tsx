import { MessageCircle } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";

const WHATSAPP_NUMBER = "6281342890650";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi Neurial! I'd like to discuss a project.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function WhatsAppButton() {
    const magnetic = useMagnetic(0.4);
    return (
        <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            {...magnetic}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg shadow-foreground/10 btn-press active:scale-[0.97]"
        >
            <MessageCircle className="w-5 h-5" />
        </a>
    );
}

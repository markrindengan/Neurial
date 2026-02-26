import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "6281342890650";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi Neurial! I'd like to discuss a project.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function WhatsAppButton() {
    return (
        <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg shadow-foreground/10 btn-press hover:scale-110 transition-transform duration-200"
        >
            <MessageCircle className="w-5 h-5" />
        </a>
    );
}

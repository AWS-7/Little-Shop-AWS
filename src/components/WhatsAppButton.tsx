import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20your%20products"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[hsl(142,70%,40%)] text-card rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-6 h-6" />
  </a>
);

export default WhatsAppButton;

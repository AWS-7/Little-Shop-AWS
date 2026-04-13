import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ product, bottomOffset = 'bottom-6' }) => {
  // If product is passed, create a product-specific share link
  const getWhatsAppUrl = () => {
    if (product) {
      const message = `Hi! I'm interested in this beautiful product from Little Shop:\n\n${product.name}\nPrice: ₹${product.price.toLocaleString('en-IN')}\n\nView here: ${typeof window !== 'undefined' ? window.location.href : ''}`;
      return `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    }
    return "https://wa.me/919876543210?text=Hi!%20I'm%20interested%20in%20your%20products";
  };

  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed ${bottomOffset} right-6 z-50 w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;

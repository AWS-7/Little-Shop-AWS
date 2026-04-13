import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Share2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const StickyAddToCart = ({ product, onTryOnClick }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const wishlisted = isInWishlist(product?.id);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the main product image area
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to your bag!`);
  };

  const handleWhatsAppShare = () => {
    const message = `Hi! Check out this beautiful ${product.name} from Little Shop.\n\nPrice: ₹${product.price.toLocaleString('en-IN')}\n\nShop now: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!product) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg transition-transform duration-300 md:hidden ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Product thumbnail */}
          <img
            src={product.image}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-md"
          />
          
          {/* Price info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{product.name}</p>
            <p className="text-sm font-semibold text-foreground">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-2.5 rounded-full border transition-colors ${
                wishlisted 
                  ? 'bg-accent text-accent-foreground border-accent' 
                  : 'bg-card text-muted-foreground border-border hover:border-accent'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={handleWhatsAppShare}
              className="p-2.5 rounded-full border border-border bg-card text-muted-foreground hover:text-emerald-600 transition-colors"
              aria-label="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleAddToCart}
              className="flex-1 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyAddToCart;

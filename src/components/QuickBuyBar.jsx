import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/components/ProductCard';

const QuickBuyBar = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(product.id);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/90 backdrop-blur-xl border-t border-border/50 animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{product.name}</p>
          <p className="text-lg font-bold text-foreground">{formatPrice(product.price)}</p>
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`p-2.5 rounded-full border transition-all ${wishlisted ? 'border-accent text-accent' : 'border-border text-muted-foreground hover:border-accent hover:text-accent'}`}
          aria-label="Wishlist"
        >
          <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={() => addToCart(product)}
          className="flex items-center gap-2 gold-gradient text-primary-foreground px-6 py-2.5 text-sm font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity rounded-sm"
        >
          <ShoppingBag className="w-4 h-4" /> Buy Now
        </button>
      </div>
    </div>
  );
};

export default QuickBuyBar;

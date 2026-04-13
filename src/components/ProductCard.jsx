import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

// Simulated swatches per category
const categorySwatches = {
  kanjivaram: [
    { color: 'hsl(338, 45%, 30%)', label: 'Burgundy' },
    { color: 'hsl(145, 40%, 30%)', label: 'Emerald' },
    { color: 'hsl(38, 65%, 50%)', label: 'Gold' },
  ],
  banarasi: [
    { color: 'hsl(230, 50%, 40%)', label: 'Royal Blue' },
    { color: 'hsl(338, 45%, 35%)', label: 'Maroon' },
    { color: 'hsl(280, 40%, 35%)', label: 'Purple' },
  ],
  jewellery: [
    { color: 'hsl(38, 65%, 50%)', label: 'Gold' },
    { color: 'hsl(0, 0%, 75%)', label: 'Silver' },
    { color: 'hsl(15, 50%, 45%)', label: 'Rose Gold' },
  ],
  bags: [
    { color: 'hsl(38, 65%, 50%)', label: 'Gold' },
    { color: 'hsl(0, 0%, 15%)', label: 'Black' },
    { color: 'hsl(30, 30%, 85%)', label: 'Cream' },
  ],
};

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const wishlisted = isInWishlist(product.id);
  const swatches = categorySwatches[product.category] || [];
  const [activeSwatch, setActiveSwatch] = useState(0);

  return (
    <div className="group relative bg-card border border-border rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1">
          {product.badge}
        </span>
      )}
      <button
        onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-all ${wishlisted ? 'bg-accent text-accent-foreground' : 'bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-accent'}`}
        aria-label="Toggle wishlist"
      >
        <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary product-image-swap">
          <img src={product.image} alt={product.name} loading="lazy" width={400} height={533}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            style={activeSwatch > 0 ? { filter: `hue-rotate(${activeSwatch * 40}deg)` } : undefined}
          />
          {product.images[1] && product.images[1] !== product.image && (
            <img src={product.images[1]} alt={`${product.name} alt`} loading="lazy" width={400} height={533}
              className="w-full h-full object-cover" />
          )}
        </div>
      </Link>

      <div className="p-3 md:p-4">
        <p className="text-[10px] text-primary font-semibold tracking-widest uppercase mb-1">{product.categoryLabel}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="heading-serif text-sm md:text-base font-semibold text-foreground mb-1 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2 hidden md:block">{product.description}</p>

        {/* Color Swatches */}
        {swatches.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            {swatches.map((swatch, idx) => (
              <button
                key={swatch.label}
                onClick={(e) => { e.preventDefault(); setActiveSwatch(idx); }}
                className={`w-4 h-4 rounded-full border-2 transition-all hover:scale-110 ${activeSwatch === idx ? 'border-primary ring-1 ring-primary/30 scale-110' : 'border-border'}`}
                style={{ backgroundColor: swatch.color }}
                aria-label={swatch.label}
                title={swatch.label}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm md:text-base font-bold text-foreground">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button onClick={() => addToCart(product)}
            className="p-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
            aria-label="Add to cart">
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { formatPrice };
export default ProductCard;

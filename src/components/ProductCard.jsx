import { useState } from 'react';
import { Heart, ShoppingBag, Share2, Sparkles, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import InventoryUrgency from './InventoryUrgency';
import VirtualTryOn from './VirtualTryOn';

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
  const [showTryOn, setShowTryOn] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleWhatsAppShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hi! Check out this beautiful ${product.name} from Little Shop.\n\nPrice: ${formatPrice(product.price)}\n\nShop now: ${window.location.origin}/product/${product.id}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
    <div className="group relative bg-card border border-border rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
         onMouseEnter={() => setIsHovering(true)}
         onMouseLeave={() => setIsHovering(false)}>
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {product.badge && (
          <span className="bg-primary text-primary-foreground text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1">
            {product.badge}
          </span>
        )}
        {product.occasion && (
          <span className="bg-accent text-accent-foreground text-[10px] font-medium px-2 py-0.5 capitalize">
            {product.occasion}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className={`p-1.5 rounded-full transition-all ${wishlisted ? 'bg-accent text-accent-foreground' : 'bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-accent'}`}
          aria-label="Toggle wishlist"
        >
          <Heart className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={handleWhatsAppShare}
          className="p-1.5 rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-emerald transition-colors"
          aria-label="Share on WhatsApp"
        >
          <Share2 className="w-4 h-4" />
        </button>
        {product.isJewelry && (
          <button
            onClick={(e) => { e.preventDefault(); setShowTryOn(true); }}
            className="p-1.5 rounded-full bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-primary transition-colors"
            aria-label="Virtual Try-On"
            title="Virtual Try-On"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        )}
      </div>

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          {/* Main Image */}
          <img src={product.image} alt={product.name} loading="lazy" width={400} height={533}
            className={`w-full h-full object-cover transition-all duration-500 ${isHovering && product.videoUrl ? 'opacity-0' : 'opacity-100'}`}
            style={activeSwatch > 0 ? { filter: `hue-rotate(${activeSwatch * 40}deg)` } : undefined}
          />
          
          {/* Video Preview on Hover */}
          {product.videoUrl && isHovering && (
            <video
              src={product.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Video indicator */}
          {product.videoUrl && !isHovering && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white rounded-full p-1.5">
              <Play className="w-3 h-3 fill-current" />
            </div>
          )}
          
          {product.images[1] && product.images[1] !== product.image && !product.videoUrl && (
            <img src={product.images[1]} alt={`${product.name} alt`} loading="lazy" width={400} height={533}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>
      </Link>

      <div className="p-3 md:p-4">
        {/* Inventory Urgency */}
        {product.stock && product.stock <= 5 && (
          <div className="mb-2">
            <InventoryUrgency stock={product.stock} />
          </div>
        )}
        
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
    
    {/* Virtual Try-On Modal */}
    {product.isJewelry && (
      <VirtualTryOn
        product={product}
        isOpen={showTryOn}
        onClose={() => setShowTryOn(false)}
      />
    )}
    </>
  );
};

export { formatPrice };
export default ProductCard;

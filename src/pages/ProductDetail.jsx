import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import CartDrawer from '@/components/CartDrawer';
import ProductCard, { formatPrice } from '@/components/ProductCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import QuickBuyBar from '@/components/QuickBuyBar';
import InventoryUrgency from '@/components/InventoryUrgency';
import VirtualTryOn from '@/components/VirtualTryOn';
import StickyAddToCart from '@/components/StickyAddToCart';
import SocialProof from '@/components/SocialProof';
import { getProductById, getRelatedProducts, getLookForProduct } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Star, ChevronRight, Sparkles, Share2, Play, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTryOn, setShowTryOn] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const product = getProductById(id || '');
  const lookbookLook = product ? getLookForProduct(product.id) : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header onMenuOpen={() => setMenuOpen(true)} />
        <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="heading-serif text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary hover:underline">Browse all products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = getRelatedProducts(product);
  const wishlisted = isInWishlist(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWhatsAppShare = () => {
    const message = `Hi! Check out this beautiful ${product.name} from Little Shop.\n\nPrice: ${formatPrice(product.price)}\n\nShop now: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to your bag!`);
  };

  return (
    <div className="min-h-screen bg-background pb-bottom-nav">
      <Header onMenuOpen={() => setMenuOpen(true)} />
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/products" className="hover:text-primary">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-secondary rounded-sm overflow-hidden">
            {!isPlayingVideo || !product.videoUrl ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" width={800} height={1024} />
            ) : (
              <video
                src={product.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <span className="bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase px-3 py-1">{product.badge}</span>
              )}
              {product.occasion && (
                <span className="bg-accent text-accent-foreground text-xs font-medium px-3 py-1 flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {product.occasion}
                </span>
              )}
            </div>

            {/* Video Play Button */}
            {product.videoUrl && (
              <button
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-colors"
                aria-label={isPlayingVideo ? 'Pause video' : 'Play video'}
              >
                <Play className={`w-5 h-5 ${isPlayingVideo ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-xs text-primary font-semibold tracking-[0.3em] uppercase mb-2">{product.categoryLabel}</p>
            <h1 className="heading-serif text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" fill={i < Math.floor(product.rating) ? 'hsl(var(--primary))' : 'none'} stroke="hsl(var(--primary))" />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Inventory Urgency */}
            {product.stock && product.stock <= 5 && (
              <div className="mb-4">
                <InventoryUrgency stock={product.stock} />
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl md:text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-sm font-semibold text-accent">{discount}% off</span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.longDescription}</p>

            <div className="flex items-center gap-2 mb-6">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold ${product.inStock ? 'text-emerald-600' : 'text-destructive'}`}>
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-600' : 'bg-destructive'}`} />
                {product.inStock ? `In Stock${product.stock ? ` (${product.stock} left)` : ''}` : 'Out of Stock'}
              </span>
            </div>

            {/* Lookbook info */}
            {lookbookLook && (
              <div className="mb-4 p-3 bg-secondary/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Part of the collection:</p>
                <Link 
                  to={`/products?lookbook=${lookbookLook.id}`}
                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                >
                  {lookbookLook.name}
                </Link>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleAddToCart}
                className="flex-1 rose-gold-gradient text-primary-foreground py-3.5 text-sm font-semibold tracking-widest uppercase hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </button>
              <button onClick={() => toggleWishlist(product.id)}
                className={`px-4 border-2 transition-all ${wishlisted ? 'border-accent text-accent' : 'border-border text-muted-foreground hover:border-accent hover:text-accent'}`}
                aria-label="Toggle wishlist">
                <Heart className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
              <button 
                onClick={handleWhatsAppShare}
                className="px-4 border-2 border-border text-muted-foreground hover:border-emerald-600 hover:text-emerald-600 transition-all"
                aria-label="Share on WhatsApp">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Virtual Try-On for Jewelry */}
            {product.isJewelry && (
              <button
                onClick={() => setShowTryOn(true)}
                className="mt-4 w-full py-3 border-2 border-dashed border-primary text-primary rounded-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Try it on virtually
              </button>
            )}

            <div className="mt-6 pt-6 border-t border-border space-y-2 text-xs text-muted-foreground">
              <p>✓ Free shipping on orders above ₹10,000</p>
              <p>✓ Authentic handloom certified</p>
              <p>✓ Easy 7-day returns</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="heading-serif text-xl md:text-2xl font-bold text-foreground mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>

      <Footer />
      <WhatsAppButton product={product} bottomOffset="bottom-20" />
      <QuickBuyBar product={product} />
      <BottomNav />
      <StickyAddToCart product={product} />
      <SocialProof />
      
      {/* Virtual Try-On Modal */}
      {product.isJewelry && (
        <VirtualTryOn
          product={product}
          isOpen={showTryOn}
          onClose={() => setShowTryOn(false)}
        />
      )}
    </div>
  );
};

export default ProductDetail;

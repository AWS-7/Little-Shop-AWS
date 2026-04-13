import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { products } from '@/data/products';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { Heart, User } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlist: localWishlist } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [dbWishlist, setDbWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchWishlist = async () => {
      const { data } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id);
      setDbWishlist(data?.map(d => d.product_id) || []);
      setLoading(false);
    };
    fetchWishlist();
  }, [user]);

  // Use DB wishlist if logged in, local otherwise
  const activeWishlist = user ? dbWishlist : localWishlist;
  const wishlistProducts = products.filter(p => activeWishlist.includes(p.id));

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background pb-bottom-nav">
        <Header onMenuOpen={() => setMenuOpen(true)} />
        <div className="container mx-auto px-4 py-8">
          <ProductGridSkeleton count={4} />
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-bottom-nav">
      <Header onMenuOpen={() => setMenuOpen(true)} />
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-[11px] text-primary font-semibold tracking-[0.3em] uppercase mb-2">Your Collection</p>
          <h1 className="heading-serif text-2xl md:text-3xl font-bold text-foreground">Wishlist</h1>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-2">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mb-6">Browse our collection and save items you love</p>
            {!user && (
              <Button onClick={() => setLoginOpen(true)} variant="outline" className="border-primary text-primary">
                <User className="w-4 h-4 mr-2" /> Sign in to sync your wishlist
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {wishlistProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <Footer />
      <BottomNav />
    </div>
  );
};

export default Wishlist;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import HeroSlider from '@/components/HeroSlider';
import ProductCard from '@/components/ProductCard';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import { products } from '@/data/products';
import BottomNav from '@/components/BottomNav';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { ArrowRight } from 'lucide-react';
import CategoryStories from '@/components/CategoryStories';
import Lookbook from '@/components/Lookbook';
import SocialProof from '@/components/SocialProof';

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const productsRef = useScrollReveal();
  const bannerRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-background pb-bottom-nav">
      <Header onMenuOpen={() => setMenuOpen(true)} />
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />

      <HeroSlider />
      <CategoryStories />
      
      {/* Shop the Look - Lookbook Section */}
      <Lookbook />

      {/* Category Highlights */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[11px] text-primary font-semibold tracking-[0.3em] uppercase mb-2">Curated Collections</p>
            <h2 className="heading-serif text-2xl md:text-4xl font-bold text-foreground">Our Finest Picks</h2>
          </div>

          <div ref={productsRef} className="scroll-reveal grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-primary hover:text-primary-foreground transition-all"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section ref={bannerRef} className="scroll-reveal gold-gradient py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="heading-serif text-2xl md:text-3xl font-bold text-primary-foreground mb-3">The Art of Handloom</h2>
          <p className="text-primary-foreground/80 text-sm md:text-base max-w-xl mx-auto mb-6">
            Every thread tells a story. Our sarees are handwoven by master artisans preserving centuries-old traditions.
          </p>
          <Link to="/products?category=kanjivaram" className="inline-block border-2 border-primary-foreground text-primary-foreground px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-primary-foreground hover:text-primary transition-all">
            Explore Sarees
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <BottomNav />
      <SocialProof />
    </div>
  );
};

export default Index;

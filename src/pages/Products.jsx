import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import CartDrawer from '@/components/CartDrawer';
import ProductCard from '@/components/ProductCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import OccasionFilter from '@/components/OccasionFilter';
import SocialProof from '@/components/SocialProof';
import { getProductsByOccasionAndCategory, categories } from '@/data/products';

const Products = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeOccasion, setActiveOccasion] = useState('all');
  const activeCategory = searchParams.get('category') || 'all';
  const filtered = getProductsByOccasionAndCategory(activeOccasion, activeCategory);

  return (
    <div className="min-h-screen bg-background pb-bottom-nav">
      <Header onMenuOpen={() => setMenuOpen(true)} />
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <CartDrawer />

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8">
          <h1 className="heading-serif text-2xl md:text-4xl font-bold text-foreground mb-2">Our Collection</h1>
          <p className="text-sm text-muted-foreground">Discover handpicked pieces for every occasion</p>
        </div>

        {/* Occasion Filter */}
        <div className="mb-6">
          <OccasionFilter 
            activeOccasion={activeOccasion} 
            onOccasionChange={setActiveOccasion}
            className="justify-center"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat.id}
              onClick={() => setSearchParams(cat.id === 'all' ? {} : { category: cat.id })}
              className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase border transition-all ${activeCategory === cat.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`}>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No products found in this category.</p>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
      <BottomNav />
      <SocialProof />
    </div>
  );
};

export default Products;

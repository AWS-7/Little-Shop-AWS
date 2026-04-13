import { Menu, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import InstantSearch from '@/components/InstantSearch';

const Header = ({ onMenuOpen }) => {
  const { toggleCart, totalItems, wishlist } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b gold-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onMenuOpen} className="lg:hidden p-2 text-foreground hover:text-primary transition-colors" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="heading-serif text-xl md:text-2xl font-bold tracking-wide text-foreground">
            Little<span className="text-primary"> Shop</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {[
            { to: '/products', label: 'All Products' },
            { to: '/products?category=kanjivaram', label: 'Kanjivaram' },
            { to: '/products?category=banarasi', label: 'Banarasi' },
            { to: '/products?category=jewellery', label: 'Jewellery' },
            { to: '/products?category=bags', label: 'Bags' },
          ].map(item => (
            <Link key={item.to} to={item.to} className="body-sans text-sm font-medium text-muted-foreground hover:text-primary transition-colors tracking-wider uppercase">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <InstantSearch />
          <Link to="/wishlist" className="p-2 text-foreground hover:text-primary transition-colors relative" aria-label="Wishlist">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>
            )}
          </Link>
          <button onClick={toggleCart} className="p-2 text-foreground hover:text-primary transition-colors relative" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

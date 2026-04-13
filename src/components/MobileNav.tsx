import { X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: 'Home', to: '/' },
  { label: 'All Products', to: '/products' },
  { label: 'Kanjivaram Sarees', to: '/products?category=kanjivaram' },
  { label: 'Banarasi Sarees', to: '/products?category=banarasi' },
  { label: 'Jewellery', to: '/products?category=jewellery' },
  { label: 'Bags', to: '/products?category=bags' },
];

const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute left-0 top-0 h-full w-72 bg-card/80 backdrop-blur-xl shadow-2xl animate-slide-in-left flex flex-col border-r border-primary/10">
        <div className="flex items-center justify-between p-5 border-b gold-border">
          <span className="heading-serif text-lg font-bold text-foreground">Little<span className="text-primary"> Shop</span></span>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-4">
          {menuItems.map(item => (
            <Link key={item.to} to={item.to} onClick={onClose}
              className="flex items-center justify-between px-6 py-3.5 text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition-colors tracking-wide">
              {item.label}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t gold-border">
          <p className="text-xs text-muted-foreground text-center tracking-wider uppercase">Premium Boutique Experience</p>
        </div>
      </aside>
    </div>
  );
};

export default MobileNav;

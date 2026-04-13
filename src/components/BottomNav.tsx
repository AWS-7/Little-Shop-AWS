import { Home, ShoppingBag, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import LoginModal from '@/components/LoginModal';

const BottomNav = () => {
  const location = useLocation();
  const { wishlist } = useCart();
  const { user } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const path = location.pathname;

  const items = [
    { icon: Home, label: 'Home', to: '/', active: path === '/' },
    { icon: ShoppingBag, label: 'Shop', to: '/products', active: path === '/products' },
    { icon: Heart, label: 'Wishlist', to: '/wishlist', badge: wishlist.length, active: path === '/wishlist' },
    { icon: User, label: 'Profile', to: user ? '/profile' : '#', active: path === '/profile', requiresAuth: !user },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border/50 bg-card/70 backdrop-blur-xl">
        <div className="flex items-center justify-around h-16">
          {items.map(({ icon: Icon, label, to, badge, active, requiresAuth }) => {
            if (requiresAuth) {
              return (
                <button
                  key={label}
                  onClick={() => setLoginOpen(true)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors relative text-muted-foreground"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium tracking-wide">{label}</span>
                </button>
              );
            }
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors relative ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" fill={active ? 'currentColor' : 'none'} />
                  {badge ? (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                      {badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
                {active && (
                  <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 gold-gradient rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default BottomNav;

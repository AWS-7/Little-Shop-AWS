import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/components/ProductCard';

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={closeCart} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-card/80 backdrop-blur-xl shadow-2xl animate-slide-in-right flex flex-col border-l border-primary/10">
        <div className="flex items-center justify-between p-5 border-b gold-border">
          <h2 className="heading-serif text-lg font-bold text-foreground">Shopping Bag</h2>
          <button onClick={closeCart} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <ShoppingBag className="w-12 h-12 text-border" />
            <p className="text-sm">Your bag is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 border-b border-border pb-4">
                  <img src={product.image} alt={product.name} className="w-20 h-24 object-cover rounded-sm" />
                  <div className="flex-1 min-w-0">
                    <h3 className="heading-serif text-sm font-semibold text-foreground truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.categoryLabel}</p>
                    <p className="text-sm font-bold text-foreground mt-1">{formatPrice(product.price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-1 border border-border rounded-sm hover:bg-secondary"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-medium w-4 text-center">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-1 border border-border rounded-sm hover:bg-secondary"><Plus className="w-3 h-3" /></button>
                      <button onClick={() => removeFromCart(product.id)} className="ml-auto text-xs text-muted-foreground hover:text-destructive">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-5 border-t gold-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <button className="w-full gold-gradient text-primary-foreground py-3 text-sm font-semibold tracking-widest uppercase hover:opacity-90 transition-opacity">
                Checkout
              </button>
              <p className="text-[10px] text-center text-muted-foreground tracking-wider">SECURE CHECKOUT • FREE SHIPPING OVER ₹10,000</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;

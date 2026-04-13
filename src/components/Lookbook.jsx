import { useState } from 'react';
import { lookbookLooks, getProductById } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Lookbook = () => {
  const [selectedLook, setSelectedLook] = useState(null);
  const { addToCart } = useCart();

  const handleAddAllToCart = (look) => {
    look.products.forEach(productId => {
      const product = getProductById(productId);
      if (product) addToCart(product);
    });
    toast.success(`Complete "${look.name}" look added to your bag!`);
    setSelectedLook(null);
  };

  const handleAddSingleItem = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to your bag`);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-cream to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-[11px] text-primary font-semibold tracking-[0.3em] uppercase mb-2">Curated Collections</p>
          <h2 className="heading-serif text-3xl md:text-4xl font-semibold text-foreground mb-3">Shop the Look</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Discover complete ensembles styled by our fashion experts. Each look is thoughtfully curated for the perfect occasion.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {lookbookLooks.map((look) => (
            <div
              key={look.id}
              className="group cursor-pointer"
              onClick={() => setSelectedLook(look)}
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-secondary shadow-lg">
                <img
                  src={look.modelImage}
                  alt={look.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full">
                    <p className="text-white text-sm font-medium mb-1 flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      {look.products.length} items
                    </p>
                    <p className="text-white/80 text-xs">Click to shop this look</p>
                  </div>
                </div>

                {/* Occasion badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground capitalize">
                    {look.occasion}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <h3 className="heading-serif text-xl text-foreground">{look.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{look.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Look Detail Modal */}
      {selectedLook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-card z-10 flex items-center justify-between p-4 border-b">
              <h3 className="heading-serif text-2xl text-foreground">{selectedLook.name}</h3>
              <button
                onClick={() => setSelectedLook(null)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Model Image */}
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                  <img
                    src={selectedLook.modelImage}
                    alt={selectedLook.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Products in this look */}
                <div className="space-y-4">
                  <p className="text-muted-foreground">{selectedLook.description}</p>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Items in this look:</h4>
                    {selectedLook.products.map((productId) => {
                      const product = getProductById(productId);
                      if (!product) return null;
                      return (
                        <div key={productId} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{product.name}</p>
                            <p className="text-sm text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                          </div>
                          <button
                            onClick={() => handleAddSingleItem(product)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                          >
                            <ShoppingBag className="w-5 h-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleAddAllToCart(selectedLook)}
                    className="w-full py-3 rose-gold-gradient text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add Complete Look to Bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Lookbook;

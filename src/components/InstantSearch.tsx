import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { products } from '@/data/products';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/components/ProductCard';

const InstantSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="p-2 text-foreground hover:text-primary transition-colors" aria-label="Search">
        <Search className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-x-0 top-0 z-[70] bg-card/95 backdrop-blur-xl border-b gold-border animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sarees, jewellery, bags..."
            className="border-0 bg-transparent focus-visible:ring-0 text-sm h-8 px-0"
          />
          <button onClick={() => { setOpen(false); setQuery(''); }} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {query.length >= 2 && (
          <div className="mt-2 max-h-[60vh] overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No products found for "{query}"</p>
            ) : (
              <div className="divide-y divide-border/50">
                {results.map(product => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    onClick={() => { setOpen(false); setQuery(''); }}
                    className="flex items-center gap-3 py-3 hover:bg-secondary/50 px-2 rounded-sm transition-colors"
                  >
                    <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded-sm flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-primary font-semibold tracking-widest uppercase">{product.categoryLabel}</p>
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-sm font-bold text-foreground">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstantSearch;

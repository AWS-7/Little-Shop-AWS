import { useState } from 'react';
import { Plus, Search, Edit2, ToggleLeft, ToggleRight, X, Upload } from 'lucide-react';
import { products as mockProducts } from '@/data/products';
import { formatPrice } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminProducts = () => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [stockState, setStockState] = useState(
    Object.fromEntries(mockProducts.map(p => [p.id, p.inStock]))
  );

  const filtered = mockProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.categoryLabel.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--admin-text)]">Product Manager</h2>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-muted)]" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="pl-9 bg-[var(--admin-card)] border-[var(--admin-border)] text-[var(--admin-text)] text-sm h-9" />
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 gold-gradient text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--admin-muted)] border-b border-[var(--admin-border)]">
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-hover)] transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-12 object-cover rounded-md flex-shrink-0" />
                      <div>
                        <p className="font-medium text-[var(--admin-text)] group-hover:text-primary transition-colors">{product.name}</p>
                        <p className="text-xs text-[var(--admin-muted)] font-mono">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                      {product.categoryLabel}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-[var(--admin-text)]">
                    {formatPrice(product.price)}
                    {product.originalPrice && (
                      <span className="text-xs text-[var(--admin-muted)] line-through ml-2">{formatPrice(product.originalPrice)}</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => setStockState(prev => ({ ...prev, [product.id]: !prev[product.id] }))}>
                      {stockState[product.id] ? (
                        <span className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                          <ToggleRight className="w-5 h-5" /> In Stock
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-400 text-xs font-medium">
                          <ToggleLeft className="w-5 h-5" /> Out of Stock
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <button className="p-1.5 rounded-md text-[var(--admin-muted)] hover:text-primary hover:bg-[var(--admin-hover)] transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-[var(--admin-card)] border border-[var(--admin-border)] rounded-2xl w-full max-w-lg mx-4 shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-border)]">
              <h3 className="heading-serif text-lg font-bold text-[var(--admin-text)]">Add New Product</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-md text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-hover)] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label className="text-xs text-[var(--admin-muted)] uppercase tracking-wider">Product Title</Label>
                <Input placeholder="e.g. Royal Burgundy Kanjivaram" className="mt-1 bg-[var(--admin-bg)] border-[var(--admin-border)] text-[var(--admin-text)]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-[var(--admin-muted)] uppercase tracking-wider">Price (₹)</Label>
                  <Input type="number" placeholder="28500" className="mt-1 bg-[var(--admin-bg)] border-[var(--admin-border)] text-[var(--admin-text)]" />
                </div>
                <div>
                  <Label className="text-xs text-[var(--admin-muted)] uppercase tracking-wider">Category</Label>
                  <select className="mt-1 w-full h-10 px-3 rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] text-[var(--admin-text)] text-sm">
                    <option>Kanjivaram Silk</option>
                    <option>Banarasi Silk</option>
                    <option>Temple Jewellery</option>
                    <option>Designer Bags</option>
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-xs text-[var(--admin-muted)] uppercase tracking-wider">Description</Label>
                <textarea placeholder="Product description..." rows={3} className="mt-1 w-full px-3 py-2 rounded-md border border-[var(--admin-border)] bg-[var(--admin-bg)] text-[var(--admin-text)] text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
              <div>
                <Label className="text-xs text-[var(--admin-muted)] uppercase tracking-wider">Product Image</Label>
                <div className="mt-1 border-2 border-dashed border-[var(--admin-border)] rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer group">
                  <Upload className="w-8 h-8 text-[var(--admin-muted)] mx-auto mb-2 group-hover:text-primary transition-colors" />
                  <p className="text-sm text-[var(--admin-muted)]">Click to upload or drag & drop</p>
                  <p className="text-xs text-[var(--admin-muted)] mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
              <button className="w-full gold-gradient text-primary-foreground py-3 rounded-lg text-sm font-semibold tracking-wider uppercase hover:opacity-90 transition-opacity">
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

import { LayoutDashboard, Package, ClipboardList, Users, Settings, ChevronLeft, ChevronRight, Store } from 'lucide-react';

const menuItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ClipboardList },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = ({ view, setView, open, setOpen }) => {
  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 border-r border-[var(--admin-border)] bg-[var(--admin-sidebar)] ${open ? 'w-64' : 'w-[4.5rem]'}`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--admin-border)] flex-shrink-0">
        <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center flex-shrink-0">
          <Store className="w-4 h-4 text-primary-foreground" />
        </div>
        {open && (
          <span className="heading-serif text-base font-bold text-[var(--admin-text)] whitespace-nowrap">
            Little<span className="text-primary"> Shop</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map(item => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)]'
              }`}
              title={!open ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
              {open && <span>{item.label}</span>}
              {active && open && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-[var(--admin-border)]">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)] transition-colors"
        >
          {open ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {open && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

import { Bell, Moon, Sun, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminTopbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

const AdminTopbar = ({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }: AdminTopbarProps) => {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-[var(--admin-border)] bg-[var(--admin-card)] flex-shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-[var(--admin-text)]">Admin Dashboard</h1>
          <p className="text-xs text-[var(--admin-muted)]">Welcome back, Admin</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)] transition-colors" title="Toggle theme">
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="p-2 rounded-lg text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-text)] transition-colors relative" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-xs font-bold text-primary-foreground ml-1">
          A
        </div>
        <Link to="/" className="text-xs text-[var(--admin-muted)] hover:text-primary ml-2 hidden md:block">← Back to Store</Link>
      </div>
    </header>
  );
};

export default AdminTopbar;

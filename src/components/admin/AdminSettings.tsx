import { Moon, Sun, Globe, Bell, Lock } from 'lucide-react';

interface AdminSettingsProps {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

const AdminSettings = ({ darkMode, setDarkMode }: AdminSettingsProps) => {
  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-[var(--admin-text)]">Settings</h2>

      {/* Appearance */}
      <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
        <h3 className="text-sm font-semibold text-[var(--admin-text)] mb-4 flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
          Appearance
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => setDarkMode(false)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${!darkMode ? 'border-primary bg-primary/5' : 'border-[var(--admin-border)] hover:border-primary/30'}`}
          >
            <div className="w-full h-16 rounded-lg bg-white border border-gray-200 mb-2" />
            <p className="text-xs font-medium text-[var(--admin-text)]">Light Mode</p>
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${darkMode ? 'border-primary bg-primary/5' : 'border-[var(--admin-border)] hover:border-primary/30'}`}
          >
            <div className="w-full h-16 rounded-lg bg-gray-900 border border-gray-700 mb-2" />
            <p className="text-xs font-medium text-[var(--admin-text)]">Dark Mode</p>
          </button>
        </div>
      </div>

      {/* Store Info */}
      <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
        <h3 className="text-sm font-semibold text-[var(--admin-text)] mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" /> Store Information
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-[var(--admin-border)]">
            <span className="text-[var(--admin-muted)]">Store Name</span>
            <span className="text-[var(--admin-text)] font-medium">Little Shop</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--admin-border)]">
            <span className="text-[var(--admin-muted)]">Contact</span>
            <span className="text-[var(--admin-text)] font-medium">+91 98765 43210</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[var(--admin-border)]">
            <span className="text-[var(--admin-muted)]">Currency</span>
            <span className="text-[var(--admin-text)] font-medium">INR (₹)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[var(--admin-muted)]">Timezone</span>
            <span className="text-[var(--admin-text)] font-medium">Asia/Kolkata</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
        <h3 className="text-sm font-semibold text-[var(--admin-text)] mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" /> Notifications
        </h3>
        <div className="space-y-3">
          {['New order alerts', 'Low stock warnings', 'Customer signup emails'].map(item => (
            <label key={item} className="flex items-center justify-between py-2 cursor-pointer group">
              <span className="text-sm text-[var(--admin-text)] group-hover:text-primary transition-colors">{item}</span>
              <div className="w-10 h-6 rounded-full bg-primary/20 relative">
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary transition-all" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5">
        <h3 className="text-sm font-semibold text-[var(--admin-text)] mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" /> Security
        </h3>
        <button className="px-4 py-2 rounded-lg border border-[var(--admin-border)] text-sm text-[var(--admin-text)] hover:border-primary/30 hover:text-primary transition-colors">
          Change Admin Password
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;

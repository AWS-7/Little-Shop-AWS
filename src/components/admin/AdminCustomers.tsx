const customers = [
  { name: 'Priya Sharma', email: 'priya@gmail.com', phone: '+91 98765 43210', orders: 8, spent: '₹1,85,200', joined: 'Jan 2026' },
  { name: 'Anjali Reddy', email: 'anjali@gmail.com', phone: '+91 87654 32109', orders: 5, spent: '₹92,400', joined: 'Feb 2026' },
  { name: 'Meera Patel', email: 'meera@gmail.com', phone: '+91 76543 21098', orders: 12, spent: '₹3,42,000', joined: 'Dec 2025' },
  { name: 'Kavitha Nair', email: 'kavitha@gmail.com', phone: '+91 65432 10987', orders: 3, spent: '₹45,500', joined: 'Mar 2026' },
  { name: 'Deepa Iyer', email: 'deepa@gmail.com', phone: '+91 54321 09876', orders: 6, spent: '₹1,28,000', joined: 'Nov 2025' },
  { name: 'Lakshmi Menon', email: 'lakshmi@gmail.com', phone: '+91 43210 98765', orders: 9, spent: '₹2,15,800', joined: 'Oct 2025' },
];

const AdminCustomers = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--admin-text)]">Customer List</h2>
        <p className="text-xs text-[var(--admin-muted)]">{customers.length} registered customers</p>
      </div>

      <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--admin-muted)] border-b border-[var(--admin-border)]">
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Phone</th>
                <th className="text-left px-5 py-3 font-medium">Orders</th>
                <th className="text-left px-5 py-3 font-medium">Total Spent</th>
                <th className="text-left px-5 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.email} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-hover)] transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--admin-text)] group-hover:text-primary transition-colors">{c.name}</p>
                        <p className="text-xs text-[var(--admin-muted)]">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[var(--admin-text)] text-xs">{c.phone}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                      {c.orders}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-[var(--admin-text)]">{c.spent}</td>
                  <td className="px-5 py-3 text-[var(--admin-muted)] text-xs">{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;

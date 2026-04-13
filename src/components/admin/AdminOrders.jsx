import { Eye } from 'lucide-react';

const orders = [
  { id: '#LS-2841', customer: 'Priya Sharma', email: 'priya@gmail.com', items: 2, amount: '₹28,500', status: 'Delivered', date: '12 Apr 2026' },
  { id: '#LS-2840', customer: 'Anjali Reddy', email: 'anjali@gmail.com', items: 1, amount: '₹15,800', status: 'Shipped', date: '12 Apr 2026' },
  { id: '#LS-2839', customer: 'Meera Patel', email: 'meera@gmail.com', items: 3, amount: '₹32,000', status: 'Pending', date: '11 Apr 2026' },
  { id: '#LS-2838', customer: 'Kavitha Nair', email: 'kavitha@gmail.com', items: 1, amount: '₹8,500', status: 'Delivered', date: '11 Apr 2026' },
  { id: '#LS-2837', customer: 'Deepa Iyer', email: 'deepa@gmail.com', items: 1, amount: '₹4,500', status: 'Processing', date: '10 Apr 2026' },
  { id: '#LS-2836', customer: 'Lakshmi Menon', email: 'lakshmi@gmail.com', items: 2, amount: '₹41,000', status: 'Shipped', date: '10 Apr 2026' },
  { id: '#LS-2835', customer: 'Sunita Das', email: 'sunita@gmail.com', items: 1, amount: '₹26,500', status: 'Pending', date: '9 Apr 2026' },
];

const statusColors = {
  Delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  Shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const AdminOrders = () => {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--admin-text)]">Order Tracking</h2>
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'Shipped', 'Delivered'].map(f => (
            <button key={f} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${f === 'All' ? 'bg-primary/10 text-primary' : 'text-[var(--admin-muted)] hover:bg-[var(--admin-hover)]'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--admin-muted)] border-b border-[var(--admin-border)]">
                <th className="text-left px-5 py-3 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Items</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
                <th className="text-left px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-hover)] transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-primary">{order.id}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-[var(--admin-text)]">{order.customer}</p>
                    <p className="text-xs text-[var(--admin-muted)]">{order.email}</p>
                  </td>
                  <td className="px-5 py-3 text-[var(--admin-text)]">{order.items}</td>
                  <td className="px-5 py-3 font-semibold text-[var(--admin-text)]">{order.amount}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[var(--admin-muted)]">{order.date}</td>
                  <td className="px-5 py-3">
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                      <Eye className="w-3 h-3" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

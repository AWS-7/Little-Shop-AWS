import { IndianRupee, ShoppingCart, UserPlus, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

const stats = [
  { label: 'Total Revenue', value: '₹4,85,200', change: '+12.5%', up: true, icon: IndianRupee, color: 'from-primary/20 to-primary/5' },
  { label: "Today's Orders", value: '24', change: '+8.2%', up: true, icon: ShoppingCart, color: 'from-blue-500/20 to-blue-500/5' },
  { label: 'New Customers', value: '18', change: '+5.1%', up: true, icon: UserPlus, color: 'from-green-500/20 to-green-500/5' },
  { label: 'Low Stock Items', value: '3', change: '-2', up: false, icon: AlertTriangle, color: 'from-amber-500/20 to-amber-500/5' },
];

const recentOrders = [
  { id: '#LS-2841', customer: 'Priya Sharma', amount: '₹28,500', status: 'Delivered', date: '12 Apr 2026' },
  { id: '#LS-2840', customer: 'Anjali Reddy', amount: '₹15,800', status: 'Shipped', date: '12 Apr 2026' },
  { id: '#LS-2839', customer: 'Meera Patel', amount: '₹32,000', status: 'Pending', date: '11 Apr 2026' },
  { id: '#LS-2838', customer: 'Kavitha Nair', amount: '₹8,500', status: 'Delivered', date: '11 Apr 2026' },
  { id: '#LS-2837', customer: 'Deepa Iyer', amount: '₹4,500', status: 'Processing', date: '10 Apr 2026' },
];

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  Shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Processing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const topProducts = [
  { name: 'Royal Burgundy Kanjivaram', sold: 42, revenue: '₹11,97,000' },
  { name: 'Temple Gold Necklace Set', sold: 38, revenue: '₹6,00,400' },
  { name: 'Royal Blue Banarasi Silk', sold: 29, revenue: '₹9,28,000' },
  { name: 'Pearl Jhumka Earrings', sold: 56, revenue: '₹4,76,000' },
];

const AdminOverview = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="relative overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] p-5 group hover:border-primary/30 transition-all duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--admin-hover)] flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-green-400' : 'text-amber-400'}`}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-[var(--admin-text)] mb-1">{stat.value}</p>
              <p className="text-xs text-[var(--admin-muted)]">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--admin-border)] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--admin-text)]">Recent Orders</h3>
            <span className="text-xs text-primary cursor-pointer hover:underline">View all</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-[var(--admin-muted)] border-b border-[var(--admin-border)]">
                  <th className="text-left px-5 py-3 font-medium">Order</th>
                  <th className="text-left px-5 py-3 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 font-medium">Amount</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-left px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-hover)] transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-primary">{order.id}</td>
                    <td className="px-5 py-3 text-[var(--admin-text)]">{order.customer}</td>
                    <td className="px-5 py-3 font-semibold text-[var(--admin-text)]">{order.amount}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[var(--admin-muted)]">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-card)]">
          <div className="px-5 py-4 border-b border-[var(--admin-border)]">
            <h3 className="text-sm font-semibold text-[var(--admin-text)]">Top Products</h3>
          </div>
          <div className="p-5 space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3 group">
                <span className="w-6 h-6 rounded-full bg-[var(--admin-hover)] flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--admin-text)] truncate group-hover:text-primary transition-colors">{p.name}</p>
                  <p className="text-xs text-[var(--admin-muted)]">{p.sold} sold</p>
                </div>
                <span className="text-sm font-semibold text-[var(--admin-text)]">{p.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

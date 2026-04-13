import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminCustomers from '@/components/admin/AdminCustomers';
import AdminSettings from '@/components/admin/AdminSettings';

const Admin = () => {
  const [view, setView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const viewComponents = {
    overview: <AdminOverview />,
    products: <AdminProducts />,
    orders: <AdminOrders />,
    customers: <AdminCustomers />,
    settings: <AdminSettings darkMode={darkMode} setDarkMode={setDarkMode} />,
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'admin-dark' : 'admin-light'}`}>
      <AdminSidebar view={view} setView={setView} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300" style={{ marginLeft: sidebarOpen ? '16rem' : '4.5rem' }}>
        <AdminTopbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-[var(--admin-bg)]">
          {viewComponents[view]}
        </main>
      </div>
    </div>
  );
};

export default Admin;

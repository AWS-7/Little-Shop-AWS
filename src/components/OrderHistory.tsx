import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: OrderItem[];
}

const statusColors: Record<string, string> = {
  processing: 'bg-amber-100 text-amber-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrderHistory = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders((data as Order[]) || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleReorder = (item: OrderItem) => {
    const product = products.find(p => p.id === item.product_id);
    if (product) {
      addToCart(product);
      toast.success(`${item.product_name} added to cart`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-md" />)}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <Card key={order.id} className="p-4 border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(order.created_at), 'dd MMM yyyy')}</p>
            </div>
            <div className="text-right">
              <Badge className={statusColors[order.status] || 'bg-muted text-muted-foreground'}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <p className="text-sm font-semibold text-foreground mt-1">₹{order.total_amount.toLocaleString('en-IN')}</p>
            </div>
          </div>
          {order.order_items?.map(item => (
            <div key={item.id} className="flex items-center gap-3 py-2 border-t border-border/30">
              {item.product_image && (
                <img src={item.product_image} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => handleReorder(item)} className="text-primary hover:text-primary">
                <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reorder
              </Button>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;

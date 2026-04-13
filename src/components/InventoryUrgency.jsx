import { AlertTriangle, TrendingDown } from 'lucide-react';

const InventoryUrgency = ({ stock, showCount = true }) => {
  if (!stock || stock > 5) return null;

  const getUrgencyLevel = () => {
    if (stock <= 2) return { color: 'text-urgency-high', bg: 'bg-urgency-high', label: 'Critical' };
    if (stock <= 3) return { color: 'text-urgency-medium', bg: 'bg-urgency-medium', label: 'Low' };
    return { color: 'text-urgency-medium', bg: 'bg-urgency-medium', label: 'Running Out' };
  };

  const urgency = getUrgencyLevel();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${urgency.bg}/10 border border-${urgency.color}/20`}>
      <AlertTriangle className={`w-3.5 h-3.5 ${urgency.color}`} />
      <span className={`text-xs font-semibold ${urgency.color}`}>
        {showCount ? `Only ${stock} left!` : urgency.label}
      </span>
      {stock <= 2 && (
        <TrendingDown className={`w-3 h-3 ${urgency.color} animate-pulse`} />
      )}
    </div>
  );
};

export default InventoryUrgency;

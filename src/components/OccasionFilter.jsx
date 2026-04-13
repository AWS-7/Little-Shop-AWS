import { occasions } from '@/data/products';
import { CalendarDays } from 'lucide-react';

const OccasionFilter = ({ activeOccasion, onOccasionChange, className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mr-2">
        <CalendarDays className="w-4 h-4" />
        <span className="hidden sm:inline">Occasion:</span>
      </div>
      {occasions.map((occasion) => (
        <button
          key={occasion.id}
          onClick={() => onOccasionChange(occasion.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
            activeOccasion === occasion.id
              ? 'bg-accent text-accent-foreground shadow-sm'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
          }`}
        >
          {occasion.label}
        </button>
      ))}
    </div>
  );
};

export default OccasionFilter;

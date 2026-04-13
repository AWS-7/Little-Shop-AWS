import { Link } from 'react-router-dom';
import { categories } from '@/data/products';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const categoryImages: Record<string, { emoji: string; gradient: string }> = {
  all: { emoji: '✨', gradient: 'from-[hsl(var(--gold))] to-[hsl(var(--gold-light))]' },
  kanjivaram: { emoji: '🪷', gradient: 'from-[hsl(338,45%,30%)] to-[hsl(338,45%,45%)]' },
  banarasi: { emoji: '🌸', gradient: 'from-[hsl(260,40%,40%)] to-[hsl(260,40%,55%)]' },
  jewellery: { emoji: '💎', gradient: 'from-[hsl(var(--gold-dark))] to-[hsl(var(--gold))]' },
  bags: { emoji: '👜', gradient: 'from-[hsl(20,40%,35%)] to-[hsl(20,40%,50%)]' },
};

const CategoryStories = () => {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="scroll-reveal py-6">
      <div className="container mx-auto px-4">
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => {
            const visual = categoryImages[cat.id] || categoryImages.all;
            return (
              <Link
                key={cat.id}
                to={cat.id === 'all' ? '/products' : `/products?category=${cat.id}`}
                className="flex flex-col items-center gap-2 flex-shrink-0 group"
              >
                <div className="relative p-[2px] rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] group-hover:scale-105 transition-transform duration-300">
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${visual.gradient} flex items-center justify-center text-2xl md:text-3xl border-2 border-card`}>
                    {visual.emoji}
                  </div>
                </div>
                <span className="text-[10px] md:text-xs font-medium text-foreground tracking-wide text-center max-w-[5rem] leading-tight">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryStories;

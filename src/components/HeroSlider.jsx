import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';

const slides = [
  {
    image: hero1,
    title: 'Timeless Kanjivaram Elegance',
    subtitle: 'Handwoven pure silk sarees from the looms of Kanchipuram',
    cta: 'Explore Collection',
    link: '/products?category=kanjivaram',
  },
  {
    image: hero2,
    title: 'Exquisite Temple Jewellery',
    subtitle: 'Heritage-inspired gold collections for the modern woman',
    cta: 'Shop Jewellery',
    link: '/products?category=jewellery',
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const go = (dir) => setCurrent(prev => (prev + dir + slides.length) % slides.length);

  return (
    <section className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden bg-charcoal">
      {slides.map((slide, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" width={1920} height={800} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 md:px-12">
              <div className="max-w-lg">
                <h1 className="heading-serif text-3xl md:text-5xl lg:text-6xl font-bold text-card mb-4 leading-tight">{slide.title}</h1>
                <p className="body-sans text-card/80 text-sm md:text-base mb-6 leading-relaxed">{slide.subtitle}</p>
                <Link to={slide.link} className="inline-block gold-gradient text-primary-foreground px-8 py-3 text-sm font-semibold tracking-widest uppercase hover:opacity-90 transition-opacity">
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-card/20 backdrop-blur-sm hover:bg-card/40 transition-colors rounded-full text-card" aria-label="Previous">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => go(1)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-card/20 backdrop-blur-sm hover:bg-card/40 transition-colors rounded-full text-card" aria-label="Next">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary w-6' : 'bg-card/50'}`} aria-label={`Slide ${i+1}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;

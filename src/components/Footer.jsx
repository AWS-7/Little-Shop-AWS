import { Shield, CheckCircle, Truck, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const trustItems = [
  { icon: Shield, label: 'Secure Payment', desc: '100% secure checkout' },
  { icon: CheckCircle, label: 'Quality Checked', desc: 'Every piece inspected' },
  { icon: Truck, label: 'Free Shipping', desc: 'Orders above ₹10,000' },
];

const Footer = () => (
  <footer>
    {/* Trust bar */}
    <div className="border-t border-b gold-border bg-secondary">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {trustItems.map(({ icon: Icon, label, desc }) => (
          <div key={label} className="flex items-center gap-3 justify-center">
            <Icon className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Main footer */}
    <div className="bg-foreground text-card/80">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="heading-serif text-xl font-bold text-card mb-3">Little<span className="text-primary"> Shop</span></h3>
          <p className="text-sm leading-relaxed mb-4">Your destination for premium handwoven sarees, exquisite temple jewellery, and designer accessories.</p>
          <div className="flex gap-3">
            <a href="#" className="p-2 border border-card/20 rounded-full hover:border-primary hover:text-primary transition-colors"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-card tracking-widest uppercase mb-4">Quick Links</h4>
          <div className="space-y-2">
            {['/', '/products', '/products?category=kanjivaram', '/products?category=jewellery'].map((to, i) => (
              <Link key={to} to={to} className="block text-sm hover:text-primary transition-colors">
                {['Home', 'All Products', 'Kanjivaram Sarees', 'Jewellery'][i]}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-card tracking-widest uppercase mb-4">Contact Us</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 98765 43210</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> hello@littleshop.in</div>
            <div className="flex items-start gap-2"><MapPin className="w-4 h-4 text-primary mt-0.5" /> Chennai, Tamil Nadu, India</div>
          </div>
        </div>
      </div>
      <div className="border-t border-card/10 py-4 text-center text-xs text-card/40">
        © 2026 Little Shop. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

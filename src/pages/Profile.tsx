import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Phone, LogOut, Package, Shield } from 'lucide-react';
import OrderHistory from '@/components/OrderHistory';

const Profile = () => {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '',
    house_no: '', street: '', landmark: '', city: '', pincode: '',
    alt_contact_name: '', alt_contact_phone: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        house_no: profile.house_no || '',
        street: profile.street || '',
        landmark: profile.landmark || '',
        city: profile.city || '',
        pincode: profile.pincode || '',
        alt_contact_name: profile.alt_contact_name || '',
        alt_contact_phone: profile.alt_contact_phone || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        house_no: form.house_no,
        street: form.street,
        landmark: form.landmark,
        city: form.city,
        pincode: form.pincode,
        alt_contact_name: form.alt_contact_name,
        alt_contact_phone: form.alt_contact_phone,
      })
      .eq('user_id', user.id);
    setSaving(false);
    if (error) {
      toast.error('Failed to save profile');
    } else {
      toast.success('Profile updated successfully!');
      await refreshProfile();
    }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-bottom-nav">
        <Header onMenuOpen={() => setMenuOpen(true)} />
        <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="container mx-auto px-4 py-16 text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="heading-serif text-2xl font-bold text-foreground mb-2">Welcome to Little Shop</h2>
          <p className="text-muted-foreground mb-6">Sign in to access your profile, orders & wishlist</p>
          <Button onClick={() => setLoginOpen(true)} className="gold-gradient text-primary-foreground font-semibold px-8">
            Sign In
          </Button>
        </div>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        <Footer />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-bottom-nav">
      <Header onMenuOpen={() => setMenuOpen(true)} />
      <MobileNav isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* User ID Card */}
        <Card className="mb-6 border-primary/20 overflow-hidden">
          <div className="gold-gradient p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="heading-serif text-lg font-bold text-primary-foreground">{form.full_name || 'Complete Your Profile'}</p>
              <p className="text-primary-foreground/70 text-xs font-mono">ID: {user.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </Card>

        {/* Personal Details */}
        <Card className="mb-6 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="heading-serif text-lg flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" /> Personal Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</Label>
              <Input value={form.full_name} onChange={(e) => update('full_name', e.target.value)} placeholder="Enter your full name" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
                <Input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Email address" type="email" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</Label>
                <Input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Primary phone" type="tel" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="mb-6 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="heading-serif text-lg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">House No / Flat</Label>
                <Input value={form.house_no} onChange={(e) => update('house_no', e.target.value)} placeholder="House / Flat No" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Street</Label>
                <Input value={form.street} onChange={(e) => update('street', e.target.value)} placeholder="Street name" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Landmark</Label>
              <Input value={form.landmark} onChange={(e) => update('landmark', e.target.value)} placeholder="Nearby landmark" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">City</Label>
                <Input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="City" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Pincode</Label>
                <Input value={form.pincode} onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="Pincode" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="mb-6 border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="heading-serif text-lg flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Alternative Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">For safe delivery (Father/Mother/Husband's contact)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Contact Name</Label>
                <Input value={form.alt_contact_name} onChange={(e) => update('alt_contact_name', e.target.value)} placeholder="Name" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Contact Phone</Label>
                <Input value={form.alt_contact_phone} onChange={(e) => update('alt_contact_phone', e.target.value)} placeholder="Phone number" type="tel" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="w-full gold-gradient text-primary-foreground font-semibold h-12 mb-4">
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>

        <Separator className="my-6" />

        {/* Orders Section */}
        <div className="mb-6">
          <h3 className="heading-serif text-lg font-bold text-foreground flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-primary" /> My Orders
          </h3>
          <OrderHistory />
        </div>

        <Button onClick={signOut} variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Profile;

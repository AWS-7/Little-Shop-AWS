import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { toast } from 'sonner';
import { Smartphone } from 'lucide-react';

const LoginModal = ({ open, onClose }) => {
  const [mode, setMode] = useState('select');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth('google', {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error('Google sign-in failed');
      }
    } catch {
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      toast.error('Enter a valid phone number');
      return;
    }
    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setMode('otp');
      toast.success('OTP sent to your phone');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    const { error } = await supabase.auth.verifyOtp({ phone: formattedPhone, token: otp, type: 'sms' });
    setLoading(false);
    if (error) {
      toast.error('Invalid OTP. Please try again.');
    } else {
      toast.success('Logged in successfully!');
      onClose();
      resetState();
    }
  };

  const resetState = () => {
    setMode('select');
    setPhone('');
    setOtp('');
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onClose(); resetState(); } }}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="heading-serif text-xl text-center text-foreground">
            Welcome to Little<span className="text-primary"> Shop</span>
          </DialogTitle>
        </DialogHeader>

        {mode === 'select' && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground text-center">Sign in to access your profile, wishlist & orders</p>
            <Button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full h-12 bg-card border border-border text-foreground hover:bg-secondary gap-3"
              variant="outline"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            <Button
              onClick={() => setMode('phone')}
              className="w-full h-12 gap-3"
              variant="outline"
            >
              <Smartphone className="w-5 h-5" />
              Continue with Phone
            </Button>
          </div>
        )}

        {mode === 'phone' && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground text-center">Enter your mobile number</p>
            <div className="flex gap-2">
              <div className="flex items-center px-3 border border-input rounded-md bg-muted text-sm text-muted-foreground">+91</div>
              <Input
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1"
                type="tel"
              />
            </div>
            <Button onClick={handleSendOTP} disabled={loading || phone.length < 10} className="w-full gold-gradient text-primary-foreground font-semibold">
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
            <button onClick={() => setMode('select')} className="text-xs text-muted-foreground hover:text-primary w-full text-center">
              ← Back to options
            </button>
          </div>
        )}

        {mode === 'otp' && (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground text-center">Enter the 6-digit OTP sent to +91{phone}</p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button onClick={handleVerifyOTP} disabled={loading || otp.length < 6} className="w-full gold-gradient text-primary-foreground font-semibold">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
            <button onClick={() => setMode('phone')} className="text-xs text-muted-foreground hover:text-primary w-full text-center">
              ← Change number
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;

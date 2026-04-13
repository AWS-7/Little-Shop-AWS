import { useState, useEffect } from 'react';
import { MapPin, Clock, X } from 'lucide-react';

const socialProofData = [
  { product: 'Royal Burgundy Kanjivaram', location: 'Madurai', time: '2 minutes ago' },
  { product: 'Temple Gold Necklace Set', location: 'Chennai', time: '5 minutes ago' },
  { product: 'Emerald Green Kanjivaram', location: 'Coimbatore', time: '8 minutes ago' },
  { product: 'Pearl Jhumka Earrings', location: 'Bangalore', time: '12 minutes ago' },
  { product: 'Golden Embroidered Clutch', location: 'Hyderabad', time: '15 minutes ago' },
  { product: 'Royal Blue Banarasi Silk', location: 'Mumbai', time: '18 minutes ago' },
  { product: 'Temple Gold Necklace Set', location: 'Delhi', time: '22 minutes ago' },
  { product: 'Royal Burgundy Kanjivaram', location: 'Kolkata', time: '25 minutes ago' },
];

const SocialProof = () => {
  const [currentProof, setCurrentProof] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show first notification after 5 seconds
    const initialTimeout = setTimeout(() => {
      showRandomProof();
    }, 5000);

    return () => clearTimeout(initialTimeout);
  }, [isDismissed]);

  const showRandomProof = () => {
    if (isDismissed) return;
    
    const randomIndex = Math.floor(Math.random() * socialProofData.length);
    setCurrentProof(socialProofData[randomIndex]);
    setIsVisible(true);

    // Hide after 6 seconds
    setTimeout(() => {
      setIsVisible(false);
      
      // Show next notification after random delay (10-20 seconds)
      setTimeout(() => {
        if (!isDismissed) showRandomProof();
      }, Math.random() * 10000 + 10000);
    }, 6000);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!currentProof || !isVisible || isDismissed) return null;

  return (
    <div 
      className={`fixed bottom-24 left-4 z-40 transition-all duration-500 ease-out ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <div className="bg-card/95 backdrop-blur-md border border-border/50 shadow-lg rounded-lg p-4 max-w-xs">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0 pr-4">
            <p className="text-sm text-foreground">
              <span className="font-medium">A customer from {currentProof.location}</span> recently purchased
            </p>
            <p className="text-sm font-medium text-primary mt-0.5 truncate">
              {currentProof.product}
            </p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {currentProof.time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;

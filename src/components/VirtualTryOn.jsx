import { useState, useRef } from 'react';
import { Camera, Upload, X, Sparkles, RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const VirtualTryOn = ({ product, isOpen, onClose }) => {
  const [userPhoto, setUserPhoto] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jewelryPosition, setJewelryPosition] = useState({ x: 50, y: 50 });
  const [jewelryScale, setJewelryScale] = useState(1);
  const [isDraggingJewelry, setIsDraggingJewelry] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target.result);
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target.result);
        toast.success('Photo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJewelryMouseDown = (e) => {
    setIsDraggingJewelry(true);
    dragStartRef.current = {
      x: e.clientX - jewelryPosition.x,
      y: e.clientY - jewelryPosition.y,
    };
  };

  const handleMouseMove = (e) => {
    if (isDraggingJewelry) {
      setJewelryPosition({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingJewelry(false);
  };

  const handleReset = () => {
    setJewelryPosition({ x: 50, y: 50 });
    setJewelryScale(1);
  };

  const handleDownload = () => {
    // In a real implementation, this would use html2canvas to capture the composite image
    toast.success('Your styled photo is ready! (Demo feature)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="heading-serif text-xl text-foreground">Virtual Try-On</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!userPhoto ? (
            /* Upload Section */
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">Upload Your Photo</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Take a selfie or upload a photo to see how this jewelry looks on you
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="rose-gold-gradient text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                Drag and drop an image here, or click to browse
              </p>
            </div>
          ) : (
            /* Try-On Canvas */
            <div>
              <div
                className="relative rounded-xl overflow-hidden bg-secondary"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* User Photo */}
                <img
                  src={userPhoto}
                  alt="Your photo"
                  className="w-full aspect-square object-cover"
                  draggable={false}
                />

                {/* Overlay Jewelry */}
                <div
                  className="absolute cursor-move"
                  style={{
                    left: `${jewelryPosition.x}%`,
                    top: `${jewelryPosition.y}%`,
                    transform: `translate(-50%, -50%) scale(${jewelryScale})`,
                  }}
                  onMouseDown={handleJewelryMouseDown}
                >
                  <img
                    src={product.overlayImage || product.image}
                    alt={product.name}
                    className="w-32 h-32 object-contain drop-shadow-lg"
                    draggable={false}
                  />
                </div>

                {/* Instructions overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full inline-flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Drag to position • Use slider to resize
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Size Adjustment
                  </label>
                  <input
                    type="range"
                    min="0.3"
                    max="2"
                    step="0.1"
                    value={jewelryScale}
                    onChange={(e) => setJewelryScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Smaller</span>
                    <span>Current: {Math.round(jewelryScale * 100)}%</span>
                    <span>Larger</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setUserPhoto(null)}
                    className="flex-1"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    New Photo
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="flex-1 rose-gold-gradient text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-primary">₹{product.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualTryOn;

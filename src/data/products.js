import saree1 from '@/assets/product-saree-1.jpg';
import saree2 from '@/assets/product-saree-2.jpg';
import saree3 from '@/assets/product-saree-3.jpg';
import jewelry1 from '@/assets/product-jewelry-1.jpg';
import jewelry2 from '@/assets/product-jewelry-2.jpg';
import bag1 from '@/assets/product-bag-1.jpg';

export const occasions = [
  { id: 'all', label: 'All Occasions' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'party', label: 'Party Wear' },
  { id: 'daily', label: 'Daily Wear' },
  { id: 'office', label: 'Office Wear' },
];

export const products = [
  {
    id: 'kanj-burgundy-001',
    name: 'Royal Burgundy Kanjivaram',
    description: 'Pure silk Kanjivaram saree with rich gold zari border and traditional floral motifs.',
    longDescription: 'This exquisite pure silk Kanjivaram saree features a deep burgundy base with intricate gold zari work. The pallu showcases traditional temple designs, making it perfect for weddings and festive occasions. Each saree is handwoven by master artisans from Kanchipuram, ensuring unparalleled quality and authenticity.',
    price: 28500,
    originalPrice: 35000,
    category: 'kanjivaram',
    categoryLabel: 'Kanjivaram Silk',
    occasion: 'wedding',
    badge: 'Bestseller',
    image: saree1,
    images: [saree1, saree1],
    videoUrl: '/videos/saree-burgundy-drape.mp4',
    inStock: true,
    stock: 12,
    rating: 4.9,
    reviews: 124,
    lookbookLookId: 'look-001',
  },
  {
    id: 'ban-blue-002',
    name: 'Royal Blue Banarasi Silk',
    description: 'Handwoven Banarasi silk saree with exquisite gold brocade and medallion motifs.',
    longDescription: 'A stunning royal blue Banarasi silk saree featuring traditional medallion (buta) motifs in lustrous gold zari. The rich pallu and border showcase centuries-old weaving techniques passed down through generations of Banarasi weavers. Perfect for grand celebrations and special occasions.',
    price: 32000,
    category: 'banarasi',
    categoryLabel: 'Banarasi Silk',
    occasion: 'wedding',
    badge: 'New Arrival',
    image: saree2,
    images: [saree2, saree2],
    videoUrl: '/videos/saree-blue-drape.mp4',
    inStock: true,
    stock: 3,
    rating: 4.8,
    reviews: 89,
    lookbookLookId: 'look-002',
  },
  {
    id: 'kanj-green-003',
    name: 'Emerald Green Kanjivaram',
    description: 'Vibrant green pure silk Kanjivaram with broad gold zari border and sunflower motifs.',
    longDescription: 'This vibrant emerald green Kanjivaram saree is a celebration of colour and craftsmanship. Featuring a broad gold zari border with intricate patterns and delicate sunflower butis across the body, it embodies the timeless elegance of South Indian silk weaving.',
    price: 26500,
    originalPrice: 30000,
    category: 'kanjivaram',
    categoryLabel: 'Kanjivaram Silk',
    occasion: 'party',
    badge: 'Limited Edition',
    image: saree3,
    images: [saree3, saree3],
    videoUrl: '/videos/saree-green-drape.mp4',
    inStock: true,
    stock: 2,
    rating: 4.7,
    reviews: 67,
    lookbookLookId: 'look-003',
  },
  {
    id: 'jewel-necklace-004',
    name: 'Temple Gold Necklace Set',
    description: 'Traditional South Indian temple jewelry necklace with matching earrings in antique gold finish.',
    longDescription: 'This magnificent temple-style gold necklace set features intricate craftsmanship inspired by ancient South Indian temple architecture. The set includes a statement necklace with ruby and emerald stone accents, along with matching chandbali-style earrings. Finished in a warm antique gold tone that complements any silk saree beautifully.',
    price: 15800,
    originalPrice: 19000,
    category: 'jewellery',
    categoryLabel: 'Temple Jewellery',
    occasion: 'wedding',
    badge: 'Trending',
    image: jewelry1,
    images: [jewelry1, jewelry1],
    inStock: true,
    stock: 8,
    rating: 4.9,
    reviews: 203,
    isJewelry: true,
    overlayImage: '/images/jewelry-necklace-overlay.png',
    lookbookLookId: 'look-001',
  },
  {
    id: 'jewel-jhumka-005',
    name: 'Pearl Jhumka Earrings',
    description: 'Handcrafted gold jhumka earrings with pearl drops and multi-colored stone work.',
    longDescription: 'These stunning jhumka earrings are a masterpiece of traditional Indian jewelry making. Featuring an ornate teardrop top with delicate filigree work, adorned with multi-colored stones and finished with a cascade of lustrous freshwater pearls. Each pair is handcrafted to perfection.',
    price: 8500,
    category: 'jewellery',
    categoryLabel: 'Temple Jewellery',
    occasion: 'party',
    image: jewelry2,
    images: [jewelry2, jewelry2],
    inStock: true,
    stock: 15,
    rating: 4.8,
    reviews: 156,
    isJewelry: true,
    overlayImage: '/images/jewelry-jhumka-overlay.png',
    lookbookLookId: 'look-003',
  },
  {
    id: 'bag-clutch-006',
    name: 'Golden Embroidered Clutch',
    description: 'Premium designer clutch with gold embroidery and chain strap, perfect for festive occasions.',
    longDescription: 'This luxurious clutch bag features exquisite gold thread embroidery on a cream silk base, with a classic kiss-lock closure in polished gold. Complete with a delicate gold chain strap, it is the perfect accessory to complement your silk sarees and festive attire.',
    price: 4500,
    originalPrice: 5500,
    category: 'bags',
    categoryLabel: 'Designer Bags',
    occasion: 'party',
    badge: 'New Arrival',
    image: bag1,
    images: [bag1, bag1],
    inStock: true,
    stock: 4,
    rating: 4.6,
    reviews: 45,
    lookbookLookId: 'look-001',
  },
];

// Lookbook data - complete outfits with model photos
export const lookbookLooks = [
  {
    id: 'look-001',
    name: 'Royal Wedding Ensemble',
    description: 'Complete bridal look featuring our Royal Burgundy Kanjivaram with matching temple jewelry.',
    modelImage: '/images/lookbook/look-001-model.jpg',
    products: ['kanj-burgundy-001', 'jewel-necklace-004', 'bag-clutch-006'],
    occasion: 'wedding',
  },
  {
    id: 'look-002',
    name: 'Elegant Blue Grace',
    description: 'A sophisticated blue Banarasi saree perfect for evening receptions.',
    modelImage: '/images/lookbook/look-002-model.jpg',
    products: ['ban-blue-002'],
    occasion: 'wedding',
  },
  {
    id: 'look-003',
    name: 'Green Goddess',
    description: 'Vibrant emerald green Kanjivaram paired with pearl jhumkas for festive celebrations.',
    modelImage: '/images/lookbook/look-003-model.jpg',
    products: ['kanj-green-003', 'jewel-jhumka-005'],
    occasion: 'party',
  },
];

export const getProductById = (id) => products.find(p => p.id === id);

export const getRelatedProducts = (product) =>
  products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

export const getProductsByCategory = (category) =>
  category === 'all' ? products : products.filter(p => p.category === category);

export const getProductsByOccasion = (occasion) =>
  occasion === 'all' ? products : products.filter(p => p.occasion === occasion);

export const getProductsByOccasionAndCategory = (occasion, category) => {
  let filtered = products;
  if (occasion !== 'all') filtered = filtered.filter(p => p.occasion === occasion);
  if (category !== 'all') filtered = filtered.filter(p => p.category === category);
  return filtered;
};

export const getJewelryProducts = () => products.filter(p => p.isJewelry);

export const getLookById = (id) => lookbookLooks.find(l => l.id === id);

export const getLookForProduct = (productId) => {
  const product = getProductById(productId);
  if (!product?.lookbookLookId) return null;
  return getLookById(product.lookbookLookId);
};

export const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'kanjivaram', label: 'Kanjivaram Sarees' },
  { id: 'banarasi', label: 'Banarasi Sarees' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'bags', label: 'Bags' },
];

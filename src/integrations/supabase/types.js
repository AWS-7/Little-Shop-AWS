// Supabase Database Schema Definitions
// This file contains the database structure for Little Shop

export const Constants = {
  public: {
    Enums: {
      order_status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      occasion_type: ['wedding', 'party', 'daily', 'office'],
    },
  },
};

// Database Table Schemas
export const DatabaseSchema = {
  // Existing tables
  profiles: {
    Row: {
      id: 'string',
      user_id: 'string',
      full_name: 'string | null',
      email: 'string | null',
      phone: 'string | null',
      house_no: 'string | null',
      street: 'string | null',
      landmark: 'string | null',
      city: 'string | null',
      pincode: 'string | null',
      alt_contact_name: 'string | null',
      alt_contact_phone: 'string | null',
      created_at: 'string',
      updated_at: 'string',
    },
  },
  
  orders: {
    Row: {
      id: 'string',
      user_id: 'string',
      status: 'string',
      total_amount: 'number',
      shipping_address: 'object | null',
      created_at: 'string',
      updated_at: 'string',
    },
  },
  
  order_items: {
    Row: {
      id: 'string',
      order_id: 'string',
      product_id: 'string',
      product_name: 'string',
      product_image: 'string | null',
      price: 'number',
      quantity: 'number',
      created_at: 'string',
    },
  },
  
  wishlist: {
    Row: {
      id: 'string',
      user_id: 'string',
      product_id: 'string',
      created_at: 'string',
    },
  },
  
  // Products table with Virtual Try-On support
  products: {
    Row: {
      id: 'string',
      name: 'string',
      description: 'string',
      long_description: 'string | null',
      price: 'number',
      original_price: 'number | null',
      category: 'string',
      category_label: 'string',
      occasion: 'string | null',
      badge: 'string | null',
      image_url: 'string',
      images: 'string[]',
      video_url: 'string | null',
      in_stock: 'boolean',
      stock: 'number | null',
      rating: 'number',
      reviews: 'number',
      is_jewelry: 'boolean',
      overlay_image: 'string | null',
      // Virtual Try-On fields
      is_tryon_enabled: 'boolean',
      transparent_png_url: 'string | null',
      lookbook_look_id: 'string | null',
      created_at: 'string',
      updated_at: 'string',
    },
  },
  
  // Lookbook tables
  lookbooks: {
    Row: {
      id: 'string',
      title: 'string',
      main_image_url: 'string',
      occasion: 'string | null',
      description: 'string | null',
      created_at: 'string',
      updated_at: 'string',
    },
  },
  
  // Junction table for lookbook products with hotspot coordinates
  lookbook_products: {
    Row: {
      id: 'string',
      lookbook_id: 'string',
      product_id: 'string',
      x_coordinate: 'number', // Percentage 0-100 for hotspot positioning
      y_coordinate: 'number', // Percentage 0-100 for hotspot positioning
      created_at: 'string',
    },
  },
  
  // Payment/Orders tracking
  payments: {
    Row: {
      id: 'string',
      order_id: 'string',
      razorpay_payment_id: 'string | null',
      razorpay_order_id: 'string | null',
      razorpay_signature: 'string | null',
      amount: 'number',
      currency: 'string',
      status: 'string',
      created_at: 'string',
      updated_at: 'string',
    },
  },
};

// Helper type builders
export const buildInsert = (table) => {
  const schema = DatabaseSchema[table];
  if (!schema) return null;
  
  const insert = {};
  Object.keys(schema.Row).forEach(key => {
    if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
      insert[key] = schema.Row[key];
    }
  });
  return insert;
};

export const buildUpdate = (table) => {
  const schema = DatabaseSchema[table];
  if (!schema) return null;
  
  const update = {};
  Object.keys(schema.Row).forEach(key => {
    if (key !== 'id' && key !== 'created_at') {
      update[key] = schema.Row[key];
    }
  });
  return update;
};

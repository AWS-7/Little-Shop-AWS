import { supabase } from './client';

/**
 * Fetch all lookbooks with their linked products
 * @returns {Promise<Array>} Lookbooks with products and hotspot coordinates
 */
export const getAllLookbooks = async () => {
  try {
    // Fetch all lookbooks
    const { data: lookbooks, error: lookbooksError } = await supabase
      .from('lookbooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (lookbooksError) throw lookbooksError;
    if (!lookbooks) return [];

    // For each lookbook, fetch its linked products with coordinates
    const lookbooksWithProducts = await Promise.all(
      lookbooks.map(async (lookbook) => {
        const { data: linkedProducts, error: linkedError } = await supabase
          .from('lookbook_products')
          .select(`
            id,
            product_id,
            x_coordinate,
            y_coordinate,
            products:product_id (*)
          `)
          .eq('lookbook_id', lookbook.id);

        if (linkedError) throw linkedError;

        return {
          ...lookbook,
          linked_products: linkedProducts || [],
        };
      })
    );

    return lookbooksWithProducts;
  } catch (error) {
    console.error('Error fetching lookbooks:', error);
    return [];
  }
};

/**
 * Fetch a single lookbook by ID with its linked products
 * @param {string} lookbookId 
 * @returns {Promise<Object|null>}
 */
export const getLookbookById = async (lookbookId) => {
  try {
    // Fetch lookbook
    const { data: lookbook, error: lookbookError } = await supabase
      .from('lookbooks')
      .select('*')
      .eq('id', lookbookId)
      .single();

    if (lookbookError) throw lookbookError;
    if (!lookbook) return null;

    // Fetch linked products with coordinates
    const { data: linkedProducts, error: linkedError } = await supabase
      .from('lookbook_products')
      .select(`
        id,
        product_id,
        x_coordinate,
        y_coordinate,
        products:product_id (*)
      `)
      .eq('lookbook_id', lookbookId);

    if (linkedError) throw linkedError;

    return {
      ...lookbook,
      linked_products: linkedProducts || [],
    };
  } catch (error) {
    console.error('Error fetching lookbook:', error);
    return null;
  }
};

/**
 * Create a new lookbook
 * @param {Object} lookbookData 
 * @param {string} lookbookData.title
 * @param {string} lookbookData.main_image_url
 * @param {string} lookbookData.occasion
 * @param {string} lookbookData.description
 * @returns {Promise<Object|null>}
 */
export const createLookbook = async (lookbookData) => {
  try {
    const { data, error } = await supabase
      .from('lookbooks')
      .insert([{
        title: lookbookData.title,
        main_image_url: lookbookData.main_image_url,
        occasion: lookbookData.occasion || null,
        description: lookbookData.description || null,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating lookbook:', error);
    return null;
  }
};

/**
 * Link products to a lookbook with hotspot coordinates
 * @param {string} lookbookId 
 * @param {Array} products - Array of { product_id, x_coordinate, y_coordinate }
 * @returns {Promise<boolean>}
 */
export const linkProductsToLookbook = async (lookbookId, products) => {
  try {
    const lookbookProducts = products.map(p => ({
      lookbook_id: lookbookId,
      product_id: p.product_id,
      x_coordinate: p.x_coordinate || 50,
      y_coordinate: p.y_coordinate || 50,
    }));

    const { error } = await supabase
      .from('lookbook_products')
      .insert(lookbookProducts);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error linking products to lookbook:', error);
    return false;
  }
};

/**
 * Update product hotspot coordinates in a lookbook
 * @param {string} lookbookProductId 
 * @param {number} x_coordinate 
 * @param {number} y_coordinate 
 * @returns {Promise<boolean>}
 */
export const updateProductCoordinates = async (lookbookProductId, x_coordinate, y_coordinate) => {
  try {
    const { error } = await supabase
      .from('lookbook_products')
      .update({
        x_coordinate,
        y_coordinate,
      })
      .eq('id', lookbookProductId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating coordinates:', error);
    return false;
  }
};

/**
 * Remove a product from a lookbook
 * @param {string} lookbookProductId 
 * @returns {Promise<boolean>}
 */
export const unlinkProductFromLookbook = async (lookbookProductId) => {
  try {
    const { error } = await supabase
      .from('lookbook_products')
      .delete()
      .eq('id', lookbookProductId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error unlinking product:', error);
    return false;
  }
};

/**
 * Delete a lookbook and all its linked products
 * @param {string} lookbookId 
 * @returns {Promise<boolean>}
 */
export const deleteLookbook = async (lookbookId) => {
  try {
    // First delete all linked products
    const { error: unlinkError } = await supabase
      .from('lookbook_products')
      .delete()
      .eq('lookbook_id', lookbookId);

    if (unlinkError) throw unlinkError;

    // Then delete the lookbook
    const { error } = await supabase
      .from('lookbooks')
      .delete()
      .eq('id', lookbookId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting lookbook:', error);
    return false;
  }
};

/**
 * Get lookbooks by occasion
 * @param {string} occasion - 'wedding', 'party', 'daily', 'office'
 * @returns {Promise<Array>}
 */
export const getLookbooksByOccasion = async (occasion) => {
  try {
    const { data, error } = await supabase
      .from('lookbooks')
      .select('*')
      .eq('occasion', occasion)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching lookbooks by occasion:', error);
    return [];
  }
};

/**
 * Subscribe to lookbook changes (real-time)
 * @param {function} callback 
 * @returns {function} Unsubscribe function
 */
export const subscribeToLookbooks = (callback) => {
  const subscription = supabase
    .channel('lookbooks_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'lookbooks',
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

// Supabase Edge Function: GET /lookbooks
// Returns all lookbooks with their linked products

// @ts-types="https://esm.sh/@supabase/supabase-js@2/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Fetch all lookbooks
    const { data: lookbooks, error: lookbooksError } = await supabaseClient
      .from('lookbooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (lookbooksError) {
      throw lookbooksError;
    }

    if (!lookbooks || lookbooks.length === 0) {
      return new Response(
        JSON.stringify({ success: true, data: [] }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Fetch linked products for each lookbook
    const lookbooksWithProducts = await Promise.all(
      lookbooks.map(async (lookbook) => {
        const { data: linkedProducts, error: productsError } = await supabaseClient
          .from('lookbook_products')
          .select('*')
          .eq('lookbook_id', lookbook.id);

        if (productsError) {
          console.error(`Error fetching products for lookbook ${lookbook.id}:`, productsError);
        }

        return {
          ...lookbook,
          linked_products: linkedProducts || [],
        };
      })
    );

    return new Response(
      JSON.stringify({
        success: true,
        data: lookbooksWithProducts,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in lookbooks function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

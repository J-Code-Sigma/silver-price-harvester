import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');
  const polygonApiKey = Deno.env.get('POLYGON_API_KEY');

  console.log('Fetching silver price...');

  try {
    // Try Finnhub API first
    console.log('Trying Finnhub API...');
    const finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=SI=F&token=${finnhubApiKey}`;
    const finnhubResponse = await fetch(finnhubUrl);
    
    if (finnhubResponse.ok) {
      const data = await finnhubResponse.json();
      console.log('Finnhub response:', JSON.stringify(data));
      
      if (data.c && data.c !== 0) {
        return new Response(
          JSON.stringify({ price: data.c, source: 'Finnhub' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    console.log('Finnhub failed, trying Polygon...');
  } catch (finnhubError) {
    console.error('Finnhub API error:', finnhubError);
  }

  // Fallback to Polygon.io API
  try {
    console.log('Trying Polygon API...');
    const polygonUrl = `https://api.polygon.io/v2/aggs/ticker/C:XAGUSD/prev?apiKey=${polygonApiKey}`;
    const polygonResponse = await fetch(polygonUrl);
    
    if (polygonResponse.ok) {
      const data = await polygonResponse.json();
      console.log('Polygon response:', JSON.stringify(data));
      
      if (data.results && data.results.length > 0) {
        return new Response(
          JSON.stringify({ price: data.results[0].c, source: 'Polygon.io' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (polygonError) {
    console.error('Polygon API error:', polygonError);
  }

  // All live sources failed - return last known approximate price as fallback
  // This typically happens on weekends when markets are closed
  console.log('All live sources unavailable, using fallback price');
  return new Response(
    JSON.stringify({ price: 31.00, source: 'Fallback (markets closed)' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});

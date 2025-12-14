import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const fetchFromFinnhub = async (apiKey: string) => {
  console.log('Trying Finnhub API...');
  const url = `https://finnhub.io/api/v1/quote?symbol=SI=F&token=${apiKey}`;
  const response = await fetch(url);
  
  if (response.ok) {
    const data = await response.json();
    console.log('Finnhub response:', JSON.stringify(data));
    
    if (data.c && data.c !== 0) {
      return { price: data.c, source: 'Finnhub' };
    }
  }
  return null;
};

const fetchFromPolygon = async (apiKey: string) => {
  console.log('Trying Polygon API v3...');
  const url = `https://api.polygon.io/v3/snapshot?ticker.any_of=C:XAGUSD&apiKey=${apiKey}`;
  const response = await fetch(url);
  
  if (response.ok) {
    const data = await response.json();
    console.log('Polygon v3 response:', JSON.stringify(data));
    
    // v3 snapshot returns results array with session data
    if (data.results && data.results.length > 0 && data.results[0].session) {
      const session = data.results[0].session;
      // Use close price, or if not available use previous_close
      const price = session.close || session.previous_close;
      if (price && price > 0) {
        return { price, source: 'Polygon.io' };
      }
    }
  }
  return null;
};

const fetchFromYahoo = async () => {
  console.log('Trying Yahoo Finance API...');
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/SI=F?interval=1d&range=1d`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  
  if (response.ok) {
    const data = await response.json();
    console.log('Yahoo Finance response:', JSON.stringify(data));
    
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (price && price > 0) {
      return { price: price, source: 'Yahoo Finance' };
    }
  }
  return null;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');
  const polygonApiKey = Deno.env.get('POLYGON_API_KEY');

  // Parse the requested source from query params
  const url = new URL(req.url);
  const requestedSource = url.searchParams.get('source');

  console.log('Fetching silver price...', requestedSource ? `Requested source: ${requestedSource}` : 'Auto mode');

  try {
    let result = null;

    // If a specific source is requested, only try that source
    if (requestedSource) {
      switch (requestedSource.toLowerCase()) {
        case 'finnhub':
          result = await fetchFromFinnhub(finnhubApiKey!);
          break;
        case 'polygon':
        case 'polygon.io':
          result = await fetchFromPolygon(polygonApiKey!);
          break;
        case 'yahoo':
        case 'yahoo finance':
          result = await fetchFromYahoo();
          break;
      }

      if (result) {
        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Requested source failed
      return new Response(
        JSON.stringify({ error: `${requestedSource} is currently unavailable. Try another source.` }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Auto mode: try all sources in order
    // Try Finnhub first
    try {
      result = await fetchFromFinnhub(finnhubApiKey!);
      if (result) {
        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('Finnhub failed, trying Polygon...');
    } catch (finnhubError) {
      console.error('Finnhub API error:', finnhubError);
    }

    // Try Polygon
    try {
      result = await fetchFromPolygon(polygonApiKey!);
      if (result) {
        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('Polygon failed, trying Yahoo Finance...');
    } catch (polygonError) {
      console.error('Polygon API error:', polygonError);
    }

    // Try Yahoo Finance
    try {
      result = await fetchFromYahoo();
      if (result) {
        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (yahooError) {
      console.error('Yahoo Finance API error:', yahooError);
    }

    // All live sources failed
    console.log('All live sources unavailable');
    return new Response(
      JSON.stringify({ error: 'Unable to fetch live price. Please refresh to try again.' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

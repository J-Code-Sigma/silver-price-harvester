import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const fetchSilverPrice = async () => {
  const polygonApiKey = import.meta.env.VITE_POLYGON_API_KEY;
  const finnhubApiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  try {
    // Try Polygon.io API first
    const polygonUrl = `https://api.polygon.io/v2/aggs/ticker/C:XAGUSD/prev?apiKey=${polygonApiKey}`;
    const polygonResponse = await fetch(polygonUrl);
    if (polygonResponse.ok) {
      const data = await polygonResponse.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].c; // Closing price
      }
    }
    throw new Error('Polygon API failed');
  } catch (error) {
    console.error('Polygon API error:', error);
    
    // Fallback to Finnhub API
    try {
      const finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=SI=F&token=${finnhubApiKey}`;
      const finnhubResponse = await fetch(finnhubUrl);
      if (finnhubResponse.ok) {
        const data = await finnhubResponse.json();
        if (data.c) {
          return data.c; // Current price
        }
      }
      throw new Error('Finnhub API failed');
    } catch (finnhubError) {
      console.error('Finnhub API error:', finnhubError);
      throw new Error('Both APIs failed to fetch silver price');
    }
  }
};

const SilverPrice = () => {
  const { data: silverPrice, isLoading, error } = useQuery({
    queryKey: ['silverPrice'],
    queryFn: fetchSilverPrice,
    refetchInterval: 60000, // Refetch every minute
  });

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Current Silver Price</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Loading...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">Error: {error.message}</p>
        ) : silverPrice ? (
          <p className="text-2xl font-bold">
            ${silverPrice.toFixed(2)} USD per oz
          </p>
        ) : (
          <p className="text-red-500">Failed to load data</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SilverPrice;
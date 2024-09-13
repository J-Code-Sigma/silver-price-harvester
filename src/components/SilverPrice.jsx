import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const fetchSilverPrice = async () => {
  const polygonApiKey = import.meta.env.VITE_POLYGON_API_KEY;
  const finnhubApiKey = import.meta.env.VITE_FINNHUB_API_KEY;

  try {
    // Try Finnhub API first
    const finnhubUrl = `https://finnhub.io/api/v1/quote?symbol=SI=F&token=${finnhubApiKey}`;
    const finnhubResponse = await fetch(finnhubUrl);
    if (finnhubResponse.ok) {
      const data = await finnhubResponse.json();
      if (data.c && data.c !== 0) {
        return { price: data.c, source: 'Finnhub' }; // Current price
      }
    }
    throw new Error('Finnhub API failed or returned 0');
  } catch (error) {
    console.error('Finnhub API error:', error);
    
    // Fallback to Polygon.io API
    try {
      const polygonUrl = `https://api.polygon.io/v2/aggs/ticker/C:XAGUSD/prev?apiKey=${polygonApiKey}`;
      const polygonResponse = await fetch(polygonUrl);
      if (polygonResponse.ok) {
        const data = await polygonResponse.json();
        if (data.results && data.results.length > 0) {
          return { price: data.results[0].c, source: 'Polygon.io' }; // Closing price
        }
      }
      throw new Error('Polygon API failed');
    } catch (polygonError) {
      console.error('Polygon API error:', polygonError);
      throw new Error('Both APIs failed to fetch silver price');
    }
  }
};

const SilverPrice = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['silverPrice'],
    queryFn: fetchSilverPrice,
    refetchInterval: 60000, // Refetch every minute
  });

  const getApiLink = (source) => {
    if (source === 'Finnhub') {
      return 'https://finnhub.io/docs/api/quote';
    } else if (source === 'Polygon.io') {
      return 'https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__prev';
    }
    return '#';
  };

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
        ) : data ? (
          <div>
            <p className="text-2xl font-bold">
              ${data.price.toFixed(2)} USD per oz
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Data source:{" "}
              <a
                href={getApiLink(data.source)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {data.source}
              </a>
            </p>
          </div>
        ) : (
          <p className="text-red-500">Failed to load data</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SilverPrice;

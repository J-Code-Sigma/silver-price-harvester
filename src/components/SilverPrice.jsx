import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const fetchSilverPrice = async () => {
  const { data, error } = await supabase.functions.invoke('get-silver-price');
  
  if (error) {
    console.error('Edge function error:', error);
    throw new Error('Failed to fetch silver price');
  }
  
  if (data.error) {
    throw new Error(data.error);
  }
  
  return { price: data.price, source: data.source };
};

const getApiLink = (source) => {
  switch (source) {
    case 'Finnhub':
      return 'https://finnhub.io/docs/api/quote';
    case 'Polygon.io':
      return 'https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__prev';
    default:
      return '#';
  }
};

const SilverPrice = () => {
  const { data, isLoading, error } = useQuery({
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

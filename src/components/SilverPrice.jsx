import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const fetchSilverPrice = async () => {
  const apiKey = import.meta.env.VITE_POLYGON_API_KEY;
  const url = `https://api.polygon.io/v2/aggs/ticker/C:XAGUSD/prev?apiKey=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch silver price');
  }
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('No silver price data available');
  }
  return data.results[0].c; // Closing price
};

const SilverPrice = () => {
  const { data: silverPrice, isLoading, error } = useQuery({
    queryKey: ['silverPrice'],
    queryFn: fetchSilverPrice,
  });

  if (error) {
    return <div className="text-red-500">Error fetching silver price: {error.message}</div>;
  }

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
        ) : silverPrice === undefined ? (
          <p className="text-red-500">Failed to load data</p>
        ) : (
          <p className="text-2xl font-bold">
            ${silverPrice.toFixed(2)} USD per oz
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SilverPrice;
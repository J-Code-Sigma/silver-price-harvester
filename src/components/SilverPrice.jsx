import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const fetchSilverPrice = async () => {
  const response = await fetch('https://finnhub.io/api/v1/quote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': import.meta.env.VITE_FINNHUB_API_KEY
    },
    body: JSON.stringify({
      symbol: 'SI=F'
    })
  });
  if (!response.ok) {
    throw new Error('Failed to fetch silver price');
  }
  return response.json();
};

const SilverPrice = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['silverPrice'],
    queryFn: fetchSilverPrice,
    refetchInterval: 60000, // Refetch every minute
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
        ) : !data ? (
          <p className="text-red-500">Failed to load data</p>
        ) : (
          <p className="text-2xl font-bold">
            ${data.c ? data.c.toFixed(2) : 'N/A'} USD
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SilverPrice;

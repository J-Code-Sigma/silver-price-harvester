import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchSilverPrice = async () => {
  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=SI=F&token=${import.meta.env.VITE_FINNHUB_API_KEY}`
  );
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
        {isLoading || !data ? (
          <Skeleton className="h-8 w-24" />
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

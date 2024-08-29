import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fetchSilverPrice = async () => {
  const response = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=SILVER&token=${import.meta.env.VITE_FINNHUB_API_KEY}`
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Current Silver Price</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-3xl font-bold">${data.c.toFixed(2)} USD</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SilverPrice;
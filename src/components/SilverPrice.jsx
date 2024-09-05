import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const fetchSilverPrice = async () => {
  const apiKey = import.meta.env.VITE_METALS_API_KEY;
  const url = `https://metals-api.com/api/latest?access_key=${apiKey}&base=USD&symbols=XAG`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch silver price');
  }
  return response.json();
};

const SilverPrice = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['silverPrice'],
    queryFn: fetchSilverPrice,
  });

  if (error) {
    return <div className="text-red-500">Error fetching silver price: {error.message}</div>;
  }

  const silverPrice = data?.rates?.XAG ? (1 / data.rates.XAG).toFixed(2) : 'N/A';

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
            ${silverPrice} USD per oz
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SilverPrice;
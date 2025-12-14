import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import silverDivisible2025 from "@/assets/silver-divisible-2025.jpg";

const fetchSilverPrice = async () => {
  const response = await fetch(
    "https://ijmytxjcivenbqficxbx.supabase.co/functions/v1/get-silver-price"
  );

  if (!response.ok) {
    console.error("Edge function error:", response.status, response.statusText);
    throw new Error("Failed to fetch silver price");
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return { price: data.price, source: data.source };
};

const getApiLink = (source) => {
  switch (source) {
    case "Finnhub":
      return "https://finnhub.io/docs/api/quote";
    case "Polygon.io":
      return "https://polygon.io/docs/stocks/get_v2_aggs_ticker__stocksticker__prev";
    default:
      return "#";
  }
};

const PriceChange = ({ currentPrice, purchasePrice, label, description, image, images }) => {
  const change = currentPrice - purchasePrice;
  const changePercent = ((change / purchasePrice) * 100).toFixed(1);
  const isPositive = change >= 0;

  // Support both single image and multiple images
  const displayImages = images || (image ? [image] : []);

  return (
    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
      {displayImages.length > 0 && (
        <div className="flex gap-1 flex-shrink-0">
          {displayImages.map((img, idx) => (
            <img 
              key={idx}
              src={img} 
              alt={`${label} ${idx + 1}`} 
              className="w-12 h-12 object-cover rounded-md"
            />
          ))}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <div className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-semibold text-sm">
              {isPositive ? "+" : ""}${change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent}%)
            </span>
          </div>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        <p className="text-xs text-muted-foreground">Purchased at ${purchasePrice.toFixed(2)}/oz</p>
      </div>
    </div>
  );
};

const SilverPrice = ({ purchases = [] }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["silverPrice"],
    queryFn: fetchSilverPrice,
    refetchInterval: 60000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Current Silver Price per 1 oz</CardTitle>
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
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold">
                ${data.price.toFixed(2)} USD
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Source:{" "}
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
            
            {purchases.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium text-gray-700">Change from purchases:</p>
                {purchases.map((purchase, idx) => (
                  <PriceChange
                    key={idx}
                    currentPrice={data.price}
                    purchasePrice={purchase.purchasePrice}
                    label={purchase.date}
                    description={purchase.description}
                    image={purchase.image}
                    images={purchase.images}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-red-500">Failed to load data</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SilverPrice;

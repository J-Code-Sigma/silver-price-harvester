import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import silverDivisible2025 from "@/assets/silver-divisible-2025.jpg";

const SOURCES = [
  { value: "auto", label: "Auto (Best Available)" },
  { value: "polygon", label: "Polygon.io" },
  { value: "yahoo", label: "Yahoo Finance" },
];

const fetchSilverPrice = async (source) => {
  const url = source === "auto" 
    ? "https://ijmytxjcivenbqficxbx.supabase.co/functions/v1/get-silver-price"
    : `https://ijmytxjcivenbqficxbx.supabase.co/functions/v1/get-silver-price?source=${source}`;
  
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Edge function error:", response.status, response.statusText);
    throw new Error(errorData.error || "Failed to fetch silver price");
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
    case "Yahoo Finance":
      return "https://finance.yahoo.com/quote/SI=F/";
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
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 p-3 bg-muted/50 rounded-lg">
      <div className="flex items-start justify-between sm:justify-start gap-2 sm:flex-1 min-w-0">
        <div className="flex-shrink-0">
          <span className="text-sm font-medium text-foreground block mb-1">{label}</span>
          {displayImages.length > 0 && (
            <div className="flex gap-1">
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
        </div>
        <div className={`flex items-center gap-1 sm:hidden ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? <TrendingUp className="h-4 w-4 flex-shrink-0" /> : <TrendingDown className="h-4 w-4 flex-shrink-0" />}
          <span className="font-semibold text-sm whitespace-nowrap">
            {isPositive ? "+" : ""}${change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent}%)
          </span>
        </div>
      </div>
      <div className="flex-shrink-0">
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        <p className="text-xs text-muted-foreground">${purchasePrice.toFixed(2)}/oz</p>
      </div>
      <div className={`hidden sm:flex items-center gap-1 flex-shrink-0 ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span className="font-semibold text-sm whitespace-nowrap">
          {isPositive ? "+" : ""}${change.toFixed(2)} ({isPositive ? "+" : ""}{changePercent}%)
        </span>
      </div>
    </div>
  );
};

const SilverPrice = ({ purchases = [] }) => {
  const [selectedSource, setSelectedSource] = useState("auto");
  
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["silverPrice", selectedSource],
    queryFn: () => fetchSilverPrice(selectedSource),
    refetchInterval: 60000,
    retry: 1,
    retryDelay: 1000,
    keepPreviousData: true,
  });

  const showLoader = isLoading || (isFetching && !data);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">Current Silver Price per 1 oz</CardTitle>
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {SOURCES.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="relative">
        {showLoader && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Fetching price...</p>
            </div>
          </div>
        )}
        {error && !data ? (
          <div className="flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Source unavailable</p>
              <p className="text-sm">{error.message}</p>
              <p className="text-sm mt-1">Try selecting a different source above.</p>
            </div>
          </div>
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

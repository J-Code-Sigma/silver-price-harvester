import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Loader2 } from "lucide-react";

const SilverHistoricalChart = ({ purchases = [] }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/silver-prices.csv");
        const text = await response.text();
        
        const lines = text.split("\n").slice(1); // Skip header
        const parsed = lines
          .filter(line => line.trim())
          .map(line => {
            const [dateStr, value] = line.replace(/"/g, "").split(",");
            const [month, day, year] = dateStr.split("/");
            return {
              date: dateStr,
              year: parseInt(year),
              value: parseFloat(value),
            };
          })
          .filter(item => !isNaN(item.value));

        // Sample data to reduce points for performance (one per year)
        const yearlyData = [];
        let lastYear = null;
        for (const item of parsed) {
          if (item.year !== lastYear) {
            yearlyData.push(item);
            lastYear = item.year;
          }
        }

        setData(yearlyData);
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formatTooltip = (value) => [`$${value.toFixed(2)}`, "Silver Price"];
  
  const formatXAxis = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    return parts[2] || dateStr;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Historical Silver Prices (1915-2025)</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Data up to date as of 12/14/2025.{" "}
          <a 
            href="https://www.macrotrends.net/1470/historical-silver-prices-100-year-chart"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </a>
        </p>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="silverGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fontSize: 10 }}
                  width={45}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                {purchases.map((purchase, idx) => (
                  <ReferenceLine 
                    key={idx}
                    y={purchase.purchasePrice} 
                    stroke="#ef4444" 
                    strokeDasharray="3 3"
                    label={{ 
                      value: `${purchase.date.split('/')[2]}`, 
                      position: 'right',
                      fontSize: 10,
                      fill: '#ef4444'
                    }}
                  />
                ))}
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#64748b" 
                  strokeWidth={2}
                  fill="url(#silverGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SilverHistoricalChart;

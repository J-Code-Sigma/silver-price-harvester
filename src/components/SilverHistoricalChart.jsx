import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
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

        // Sample data to reduce points for performance (take last entry per year to get year-end values)
        const yearlyData = {};
        for (const item of parsed) {
          // Always overwrite so we keep the latest (last) entry for each year
          yearlyData[item.year] = item;
        }

        // Convert to array, filter from 1950 onward, and sort by year
        const sortedData = Object.values(yearlyData)
          .filter(item => item.year >= 1950)
          .sort((a, b) => a.year - b.year);

        setData(sortedData);
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
        <CardTitle className="text-lg">1 oz Silver Price Tracker</CardTitle>
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
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                {purchases.map((purchase, idx) => {
                  const year = purchase.date.includes('/') 
                    ? purchase.date.split('/')[2] 
                    : purchase.date.split('-')[0];
                  return (
                    <ReferenceLine 
                      key={idx}
                      y={purchase.purchasePrice} 
                      stroke="#ef4444" 
                      strokeDasharray="3 3"
                      label={{ 
                        value: `${year} Buy: $${purchase.purchasePrice.toFixed(2)}`, 
                        position: 'insideTopRight',
                        fontSize: 10,
                        fill: '#ef4444'
                      }}
                    />
                  );
                })}
                <Line 
                  type="linear" 
                  dataKey="value" 
                  stroke="#64748b" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SilverHistoricalChart;

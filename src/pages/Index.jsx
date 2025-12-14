import SilverPrice from "../components/SilverPrice";
import chart from '../../assets/xagusd_cur.png';
import silverDivisible2025 from "@/assets/silver-divisible-2025.jpg";
import silver2024Coins from "@/assets/silver-2024-coins.jpg";
import silver2024Bar from "@/assets/silver-2024-bar.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const purchases = [
  {
    date: "08/08/2024",
    description: "2024 Christmas Present - 1 oz Silver",
    purchasePrice: 29.6775,
    images: [silver2024Coins, silver2024Bar],
  },
  {
    date: "10/14/2025",
    description: "2025 Christmas Present - 1 oz Silver (splittable into 1/4 pieces)",
    purchasePrice: 58.5,
    image: silverDivisible2025,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center md:text-left">Silver Price Tracker</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Current price */}
          <SilverPrice purchases={purchases} />
          
          {/* Right column: Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Historical Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">
                Note: image up to date as of 08/29/2024.{" "}
                <a 
                  href="https://www.macrotrends.net/1470/historical-silver-prices-100-year-chart"
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View complete chart
                </a>
              </p>
              <img src={chart} alt="Silver Price Chart" className="w-full h-auto rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

import SilverPrice from "../components/SilverPrice";
import SilverHistoricalChart from "../components/SilverHistoricalChart";
import silverDivisible2025 from "@/assets/silver-divisible-2025.jpg";
import silver2024Coins from "@/assets/silver-2024-coins.jpg";
import silver2024Bar from "@/assets/silver-2024-bar.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

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
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-center md:text-left">Silver Price Tracker</h1>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/J-Code-Sigma/silver-price-harvester"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-6 w-6" />
              <span className="hidden sm:inline text-sm font-medium">View on GitHub</span>
            </a>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: Current price */}
          <SilverPrice purchases={purchases} />
          
          {/* Right column: Chart */}
          <SilverHistoricalChart purchases={purchases} />
        </div>
      </div>
    </div>
  );
};

export default Index;

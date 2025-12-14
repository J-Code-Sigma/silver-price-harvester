# Silver Price Tracker Module

A reusable React module for displaying live silver prices with historical charts and purchase tracking.

## Overview

This module provides:
- **Live silver price fetching** from multiple API sources (Finnhub, Polygon.io, Yahoo Finance)
- **Auto-fallback** between sources when one is unavailable
- **Historical price chart** with purchase markers
- **Purchase tracking** with gain/loss calculations
- **Rate limiting** and **caching** to prevent API abuse

---

## Files to Copy

### Frontend Components

| File | Description |
|------|-------------|
| `src/components/SilverPrice.jsx` | Main component showing live price + purchase comparisons |
| `src/components/SilverHistoricalChart.jsx` | Historical line chart (1950-present) |

### Edge Function (Backend)

| File | Description |
|------|-------------|
| `supabase/functions/get-silver-price/index.ts` | Serverless function that fetches prices from multiple APIs |

### Static Assets

| File | Description |
|------|-------------|
| `public/data/silver-prices.csv` | Historical silver price data (CSV format) |
| `src/assets/silver-*.jpg` | Optional: Purchase images |

---

## Required Dependencies

```json
{
  "@tanstack/react-query": "^5.48.0",
  "recharts": "^2.12.7",
  "lucide-react": "^0.417.0"
}
```

Also requires shadcn/ui components:
- `Card`, `CardContent`, `CardHeader`, `CardTitle`
- `Select`, `SelectContent`, `SelectItem`, `SelectTrigger`, `SelectValue`

---

## Required Secrets (Edge Function)

Add these secrets in your Supabase/Lovable Cloud project:

| Secret Name | Source | Free Tier |
|-------------|--------|-----------|
| `FINNHUB_API_KEY` | [finnhub.io](https://finnhub.io/) | Yes |
| `POLYGON_API_KEY` | [polygon.io](https://polygon.io/) | Yes |

> **Note:** Yahoo Finance requires no API key but has stricter rate limits.

---

## Setup Instructions

### 1. Copy Files

Copy these files to your new project:

```
src/
  components/
    SilverPrice.jsx
    SilverHistoricalChart.jsx
  assets/
    (any purchase images)
    
public/
  data/
    silver-prices.csv

supabase/
  functions/
    get-silver-price/
      index.ts
```

### 2. Update Edge Function URL

In `SilverPrice.jsx`, update the Supabase project URL:

```javascript
// Line 15-17 - Replace with your project ID
const fetchSilverPrice = async (source) => {
  const url = source === "auto" 
    ? "https://YOUR_PROJECT_ID.supabase.co/functions/v1/get-silver-price"
    : `https://YOUR_PROJECT_ID.supabase.co/functions/v1/get-silver-price?source=${source}`;
```

### 3. Configure Edge Function

Add to your `supabase/config.toml`:

```toml
[functions.get-silver-price]
verify_jwt = false
```

### 4. Add API Keys

Add your API keys as secrets in Lovable Cloud:
- `FINNHUB_API_KEY`
- `POLYGON_API_KEY`

---

## Usage

### Basic Usage

```jsx
import SilverPrice from "@/components/SilverPrice";

const App = () => {
  return <SilverPrice />;
};
```

### With Purchase Tracking

```jsx
import SilverPrice from "@/components/SilverPrice";
import SilverHistoricalChart from "@/components/SilverHistoricalChart";

const purchases = [
  {
    date: "08/08/2024",
    description: "1 oz Silver Coin",
    purchasePrice: 29.68,
    image: "/path/to/image.jpg",  // Optional: single image
  },
  {
    date: "10/14/2025",
    description: "1 oz Silver Bar",
    purchasePrice: 58.50,
    images: ["/img1.jpg", "/img2.jpg"],  // Optional: multiple images
  },
];

const App = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SilverPrice purchases={purchases} />
      <SilverHistoricalChart purchases={purchases} />
    </div>
  );
};
```

---

## Props Reference

### `<SilverPrice />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `purchases` | `Purchase[]` | `[]` | Array of purchase records to compare against current price |

### `<SilverHistoricalChart />`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `purchases` | `Purchase[]` | `[]` | Array of purchases to show as reference lines on chart |

### `Purchase` Object

```typescript
interface Purchase {
  date: string;           // Format: "MM/DD/YYYY" or "YYYY-MM-DD"
  purchasePrice: number;  // Price in USD per oz
  description?: string;   // Optional description
  image?: string;         // Optional single image path
  images?: string[];      // Optional array of image paths
}
```

---

## Edge Function API

### Endpoint

```
GET /functions/v1/get-silver-price
```

### Query Parameters

| Param | Values | Description |
|-------|--------|-------------|
| `source` | `polygon`, `yahoo`, `finnhub` | Specific source (optional). Omit for auto-fallback. |

### Response

```json
{
  "price": 30.45,
  "source": "Polygon.io",
  "cached": false
}
```

### Rate Limiting

- **30 requests per minute** per IP address
- **1 minute cache** for auto-mode responses
- Returns `429 Too Many Requests` when exceeded

---

## Customization

### Change Refresh Interval

In `SilverPrice.jsx`, modify the query options:

```javascript
const { data } = useQuery({
  // ...
  refetchInterval: 60000, // Change to desired ms (default: 1 minute)
});
```

### Add/Remove Data Sources

In the edge function `index.ts`, modify the `SOURCES` array and add/remove fetch functions as needed.

### Update Historical Data

Replace `public/data/silver-prices.csv` with updated data. Format:

```csv
"Date","Value"
"01/01/1950",0.74
"01/02/1950",0.74
...
```

---

## License

MIT - Use freely in your projects.

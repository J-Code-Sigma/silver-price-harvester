import SilverPrice from "../components/SilverPrice";


import chart from'../../assets/xagusd_cur.png';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-8">Silver Price Tracker</h1>
          <SilverPrice />
        </div>
        <div className="w-full md:w-1/2 h-96 bg-white rounded-lg shadow-md overflow-hidden p-4">
          <h3>Note: image up to date as of 08/29/2024</h3>
          <a href="https://www.macrotrends.net/1470/historical-silver-prices-100-year-chart">Click here</a> to see complete historical chart.
          <img src={chart}></img>
        </div>
      </div>
    </div>
  );
};

export default Index;

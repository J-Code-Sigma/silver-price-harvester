import SilverPrice from "../components/SilverPrice";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-8">Silver Price Tracker</h1>
          <SilverPrice />
        </div>
        <div className="w-full md:w-1/2 h-96 bg-white rounded-lg shadow-md overflow-hidden">
          <iframe
            src="https://tradingeconomics.com/embed/?s=xag&v=202304192300v20&h=300&w=600&ref=/commodity/silver"
            className="w-full h-full border-0"
            title="Silver Price Chart"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Index;

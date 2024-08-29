import SilverPrice from "../components/SilverPrice";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Silver Price Tracker</h1>
        <SilverPrice />
      </div>
    </div>
  );
};

export default Index;

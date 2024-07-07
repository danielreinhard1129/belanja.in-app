import CardMonthlyIncome from "./components/CardMonthlyIncome";
import CardTotalIncome from "./components/CardTotalIncome";
import CardTotalTransaction from "./components/CardTotalTransaction";

const Dashboard = () => {
  return (
    <div className="container flex h-fit md:h-screen justify-center pb-20 flex-col gap-4 px-4 py-4 md:py-16">
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <CardTotalIncome />
        <CardTotalTransaction />
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row">
        <CardMonthlyIncome />
      </div>
    </div>
  );
};

export default Dashboard;

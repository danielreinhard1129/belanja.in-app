const Dashboard = () => {
  return (
    <div className="container grid h-screen grid-flow-row gap-4 bg-blue-200 px-4 py-4">
      <div className="grid w-full grid-flow-row gap-4 bg-blue-300 md:grid-flow-col">
        <div className="rounded-xl bg-blue-400"></div>
        <div className="rounded-xl bg-blue-400"></div>
        <div className="rounded-xl bg-blue-400"></div>
        <div className="rounded-xl bg-blue-400"></div>
      </div>
      <div className="grid w-full grid-flow-row gap-4 bg-blue-300 md:grid-flow-col">
        <div className="rounded-xl bg-blue-400"></div>
        <div className="rounded-xl bg-blue-400"></div>
      </div>
      <div className="grid w-full grid-flow-row gap-4 bg-blue-300 md:grid-flow-col">
        <div className="rounded-xl bg-blue-400"></div>
        <div className="rounded-xl bg-blue-400"></div>
      </div>
    </div>
  );
};

export default Dashboard;

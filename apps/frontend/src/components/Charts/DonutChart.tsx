import React from "react";
import ReactApexChart from "react-apexcharts";

interface DonutChartProps {
  series: number[];
  labels: string[];
}

const DonutChart: React.FC<DonutChartProps> = ({ series, labels }) => {
  return (
    <div className="max-w-lg w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">
        Completion status
      </h5>
      <div className="py-6" id="donut-chart">
        <ReactApexChart
          options={{ labels, chart: { type: "donut" } }}
          series={series}
          type="donut"
          height={400}
        />
      </div>
    </div>
  );
};

export { DonutChart };

import React from "react";
import ReactApexChart from "react-apexcharts";

interface StackedHorizontalBarChartProps {
  data: {
    name: string;
    data: number[];
  }[];
  categories: string[];
}

const StackedHorizontalBarChart: React.FC<StackedHorizontalBarChartProps> = ({
  data,
  categories,
}) => {
  return (
    <div className="max-w-3xl w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1 mb-4">
        Request types completion status
      </h5>
      <ReactApexChart
        options={{
          chart: {
            type: "bar",
            height: 350,
            stacked: true,
            stackType: "100%",
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          stroke: {
            width: 1,
            colors: ["#fff"],
          },
          xaxis: {
            categories: categories,
          },
          tooltip: {
            y: {
              formatter: function (val: number) {
                return val.toString();
              },
            },
          },
          fill: {
            opacity: 1,
          },
          legend: {
            position: "top",
            horizontalAlign: "left",
            offsetX: 40,
          },
        }}
        series={data}
        type="bar"
        height={400}
      />
    </div>
  );
};

export { StackedHorizontalBarChart };

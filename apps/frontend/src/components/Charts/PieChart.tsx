import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

interface PieChartProps {
  series: number[];
  labels: string[];
  onChangeEmployeeType: (employeeType: string | null) => void;
}

const PieChart: React.FC<PieChartProps> = ({
  series,
  labels,
  onChangeEmployeeType,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleEmployeeTypeChange = (employeeType: string) => {
    onChangeEmployeeType(employeeType);
    setIsDropdownOpen(false);
  };
  const renderDropdown = () => (
    <div
      id="empTypeDropdown"
      className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
    >
      <ul
        className="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownDefaultButton"
      >
        <li>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => handleEmployeeTypeChange("")}
          >
            All
          </button>
        </li>
        <li>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => handleEmployeeTypeChange("ADMIN")}
          >
            Admin
          </button>
        </li>
        <li>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            onClick={() => handleEmployeeTypeChange("REGULAR")}
          >
            Regular
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="max-w-lg w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
      <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">
        Requests statistics
      </h5>

      <div className="py-6" id="pie-chart">
        <ReactApexChart
          options={{ labels }}
          series={series}
          type="pie"
          height={400}
        />
      </div>

      <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
        <div className="flex justify-between items-center pt-5">
          <button
            id="dropdownDefaultButton"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            data-dropdown-toggle="empTypeDropdown"
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
            type="button"
          >
            Employee role assigned
            <svg
              className="w-2.5 m-2.5 ms-1.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {renderDropdown()}
        </div>
      </div>
    </div>
  );
};

export { PieChart };

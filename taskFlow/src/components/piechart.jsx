import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const PieChartComponent = ({ data }) => {
  return (
    <PieChart
      series={[
        {
          data: data,
        },
      ]}
      width={200}
      height={200}
    />
  );
};

export default PieChartComponent;

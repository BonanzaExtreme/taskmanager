import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const PieChartComponent = ({ data }) => {
  const chartData = (data || []).map((item) => ({
    ...item,
    color: item.color,
  }));

  return (
    <PieChart
      series={[
        {
          data: chartData,
        },
      ]}
    />
  );
};

export default PieChartComponent;

import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const PieChartComponent = ({ data }) => {
  const chartData = (data || []).map((item) => ({
    ...item,
    color: item.color,
  }));

  const visibleChartData = chartData.filter((item) => Number(item.value) > 0);

  if (visibleChartData.length === 0) {
    return (
      <div
        style={{
          width: "200px",
          height: "200px",
          minWidth: "200px",
          minHeight: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontSize: "0.9rem",
          fontWeight: 600,
        }}
      >
        No task data
      </div>
    );
  }

  return (
    <div
      style={{
        width: "200px",
        height: "200px",
        minWidth: "200px",
        minHeight: "200px",
      }}
    >
      <PieChart
        hideLegend
        series={[
          {
            data: visibleChartData,
          },
        ]}
        width={200}
        height={200}
      />
    </div>
  );
};

export default PieChartComponent;

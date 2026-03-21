import React from "react";

const StatText = ({ text, count }) => {
  const colorMap = {
    "Open Tasks": "#FF5733",
    "In Progress": "#FFC300",
    Completed: "#28B463",
    Cancelled: "#C70039",
    "Active Tasks": "#3498DB",
    "Closed Tasks": "#7D3C98",
  };

  const countColor = colorMap[text] || "black"; // fallback

  return (
    <div
      style={{
        display: "flex",
        padding: "15px 16px",
        borderTop: "1px solid #ddd",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span style={{ fontWeight: "bold" }}>{text}</span>

      <span style={{ fontWeight: "bold", color: countColor }}>{count}</span>
    </div>
  );
};

export default StatText;

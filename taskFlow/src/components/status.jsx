import React from "react";

const Status = ({ status }) => {
  const statusColorMap = {
    "In progress": "#FF5733",
    Completed: "#28a745",
    Cancelled: "#C70039",
  };

  return (
    <span
      className="status"
      style={{
        backgroundColor: statusColorMap[status] || "#ccc",
        color: "#fff",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: "500",
      }}
    >
      {status}
    </span>
  );
};

export default Status;

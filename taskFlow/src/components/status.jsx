import React from "react";

const Status = ({ status }) => {
  const normalized = String(status || "").toLowerCase();
  const statusColorMap = {
    "to do": "#64748b",
    todo: "#64748b",
    "in progress": "#f97316",
    completed: "#16a34a",
    cancelled: "#dc2626",
  };

  return (
    <span
      className="status"
      style={{
        backgroundColor: statusColorMap[normalized] || "#64748b",
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

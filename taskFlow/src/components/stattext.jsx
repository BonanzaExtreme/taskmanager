import React from "react";

const StatText = ({ text, count, color = "#111827" }) => {

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
      <span style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          aria-hidden="true"
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "999px",
            backgroundColor: color,
            display: "inline-block",
          }}
        />
        {text}
      </span>

      <span style={{ fontWeight: "bold", color }}>{count}</span>
    </div>
  );
};

export default StatText;

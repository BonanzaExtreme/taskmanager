import React from "react";
import "./taskList.css";

const TaskRowCard = ({ children, dashed, onClick }) => {
  return (
    <div className={`task-card ${dashed ? "dashed" : ""}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default TaskRowCard;

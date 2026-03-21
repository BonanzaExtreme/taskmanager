import React from "react";
import "./taskList.css";
import TaskRowCard from "./TaskRowCard";
import Status from "../../components/status";
import { FaFilter } from "react-icons/fa";

const TaskList = () => {
  return (
    <div className="tasklist-container">
      <div className="toplist-container">
        <div className="title-container">
          <h1>Task List</h1>
          <div className="button-group">
            <button className="add-task-btn">Show: ALL</button>
            <button className="add-task-btn">
              <FaFilter />
            </button>
          </div>
        </div>

        <div className="table-header">
          <span>Task Name</span>
          <span>Description</span>
          <span>End Date</span>
          <span>Status</span>
          <span>Priority</span>
        </div>

        {/* ✅ Add New Task Row */}
        <TaskRowCard dashed onClick={() => console.log("Add new task")}>
          <span style={{ gridColumn: "1 / -1", textAlign: "center" }}>
            + Add New Task
          </span>
        </TaskRowCard>
      </div>

      <div className="bottom-container">
        {/* Sample Task Row */}
        <TaskRowCard>
          <span>Sample Task</span>
          <span>Sample Descriptions</span>
          <span>2023-12-31</span>
          <Status status="Completed" />
          <span>High</span>
        </TaskRowCard>
        <TaskRowCard>
          <span>Sample Task</span>
          <span>Sample Descriptions</span>
          <span>2023-12-31</span>
          <Status status="Completed" />
          <span>High</span>
        </TaskRowCard>
        <TaskRowCard>
          <span>Sample Task</span>
          <span>Sample Descriptions</span>
          <span>2023-12-31</span>
          <Status status="Completed" />
          <span>High</span>
        </TaskRowCard>
      </div>
    </div>
  );
};

export default TaskList;

import React, { useEffect, useState } from "react";
import "./taskList.css";
import TaskRowCard from "./TaskRowCard";
import Status from "../../components/status";
import { FaFilter } from "react-icons/fa";
import { listTasks } from "../../api";

const normalizeStatus = (status) => {
  if (status === "in_progress") return "In progress";
  if (status === "done") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return "To do";
};

const formatDueDate = (dateValue) => {
  if (!dateValue) return "-";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString();
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const data = await listTasks();
        setTasks(data);
      } catch (error) {
        setErrorMessage(error.message);
      }

      setLoading(false);
    };

    fetchTasks();
  }, []);

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
        {loading && <p>Loading tasks...</p>}

        {!loading && errorMessage && (
          <p className="task-error">Failed to load tasks: {errorMessage}</p>
        )}

        {!loading && !errorMessage && tasks.length === 0 && (
          <p>No tasks found yet.</p>
        )}

        {!loading &&
          !errorMessage &&
          tasks.length > 0 &&
          tasks.map((task) => (
            <TaskRowCard key={task.id}>
              <span>{task.title}</span>
              <span>{task.description || "-"}</span>
              <span>{formatDueDate(task.due_date)}</span>
              <Status status={normalizeStatus(task.status)} />
              <span>{task.priority || "-"}</span>
            </TaskRowCard>
          ))}
      </div>
    </div>
  );
};

export default TaskList;

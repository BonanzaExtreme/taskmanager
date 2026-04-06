import React, { useCallback, useEffect, useState } from "react";
import "./taskList.css";
import TaskRowCard from "./TaskRowCard";
import TaskScreen from "./taskScreen";
import Status from "../../components/status";
import { FaFilter } from "react-icons/fa";
import { listTasks, deleteTask } from "../../api";

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
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
  });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const data = await listTasks();
      setTasks(data);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, [fetchTasks]);

  const openCreateTaskOverlay = () => {
    setIsCreateTaskOpen(true);
  };

  const closeCreateTaskOverlay = () => {
    setIsCreateTaskOpen(false);
  };

  const handleTaskCreated = async () => {
    closeCreateTaskOverlay();
    setEditingTaskId(null);
    await fetchTasks();
  };

  const handleEditTask = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
        await fetchTasks();
      } catch (error) {
        setErrorMessage(error.message || "Failed to delete task");
      }
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filters.status === "all" || task.status === filters.status;
    const priorityMatch =
      filters.priority === "all" || task.priority === filters.priority;
    return statusMatch && priorityMatch;
  });

  const getFilterButtonText = () => {
    const statusLabel =
      filters.status === "all"
        ? "ALL"
        : filters.status.charAt(0).toUpperCase() + filters.status.slice(1);
    const priorityLabel =
      filters.priority === "all"
        ? ""
        : ` + ${filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1)}`;
    return `Show: ${statusLabel}${priorityLabel}`;
  };

  return (
    <div className="tasklist-container">
      <div className="toplist-container">
        <div className="title-container">
          <h1>Task List</h1>
          <div className="button-group">
            <button
              className="add-task-btn"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              {getFilterButtonText()}
            </button>
            <button
              className="add-task-btn"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <FaFilter />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="filter-panel">
            <div className="filter-group">
              <label>Status</label>
              <div className="filter-options">
                {["all", "todo", "in_progress", "done", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      className={`filter-option ${filters.status === status ? "active" : ""}`}
                      onClick={() => handleFilterChange("status", status)}
                    >
                      {status === "all"
                        ? "All"
                        : status === "in_progress"
                          ? "In Progress"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className="filter-group">
              <label>Priority</label>
              <div className="filter-options">
                {["all", "low", "medium", "high"].map((priority) => (
                  <button
                    key={priority}
                    className={`filter-option ${filters.priority === priority ? "active" : ""}`}
                    onClick={() => handleFilterChange("priority", priority)}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="table-header">
          <span>Task Name</span>
          <span>Description</span>
          <span>End Date</span>
          <span>Status</span>
          <span>Priority</span>
        </div>

        {/* ✅ Add New Task Row */}
        <TaskRowCard dashed onClick={openCreateTaskOverlay}>
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
          filteredTasks.length === 0 &&
          tasks.length > 0 && <p>No tasks match the selected filters.</p>}

        {!loading &&
          !errorMessage &&
          filteredTasks.length > 0 &&
          filteredTasks.map((task) => (
            <TaskRowCard
              key={task.id}
              taskId={task.id}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            >
              <span>{task.title}</span>
              <span>{task.description || "-"}</span>
              <span>{formatDueDate(task.end_date)}</span>
              <Status status={normalizeStatus(task.status)} />
              <span>{task.priority || "-"}</span>
            </TaskRowCard>
          ))}
      </div>

      {isCreateTaskOpen && (
        <TaskScreen
          onClose={closeCreateTaskOverlay}
          onCreated={handleTaskCreated}
        />
      )}

      {editingTaskId && (
        <TaskScreen
          taskId={editingTaskId}
          onClose={() => setEditingTaskId(null)}
          onCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default TaskList;

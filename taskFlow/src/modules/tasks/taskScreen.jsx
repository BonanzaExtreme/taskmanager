import React, { useEffect, useState } from "react";
import { createTask, updateTask, getTaskById } from "../../api";
import "./taskScreen.css";

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const TaskScreen = ({ onClose, onCreated, taskId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEditing = !!taskId;
  const minDueDate = getTodayDateString();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    end_date: "",
    priority: "medium",
    status: "todo",
  });

  useEffect(() => {
    const loadTask = async () => {
      setLoading(true);
      try {
        const task = await getTaskById(taskId);
        setFormData({
          title: task.title,
          description: task.description || "",
          end_date: task.end_date ? String(task.end_date).slice(0, 10) : "",
          priority: task.priority || "medium",
          status: task.status || "todo",
        });
      } catch (err) {
        setError(err.message || "Failed to load task");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!formData.title.trim()) {
        setError("Task title is required");
        setLoading(false);
        return;
      }

      if (formData.end_date && formData.end_date < minDueDate) {
        setError("Due date cannot be in the past");
        setLoading(false);
        return;
      }

      const taskPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        end_date: formData.end_date || null,
        priority: formData.priority,
        status: formData.status,
      };

      if (isEditing) {
        await updateTask(taskId, taskPayload);
      } else {
        await createTask(taskPayload);
      }

      if (onCreated) {
        await onCreated();
      }
    } catch (err) {
      setError(
        err.message || `Failed to ${isEditing ? "update" : "create"} task`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div className="task-screen-overlay" onClick={handleOverlayClick}>
      <div className="task-form-card">
        <h1>{isEditing ? "Edit Task" : "Create New Task"}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description (optional)"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="end_date">Due Date</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                min={minDueDate}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskScreen;

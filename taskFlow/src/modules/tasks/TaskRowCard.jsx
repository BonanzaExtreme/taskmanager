import React, { useState } from "react";
import "./taskList.css";
import { FaEllipsisV } from "react-icons/fa";

const TaskRowCard = ({
  children,
  dashed,
  onClick,
  taskId,
  onEdit,
  onDelete,
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleActionClick = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowActions(false);
    if (onEdit) onEdit(taskId);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowActions(false);
    if (onDelete) onDelete(taskId);
  };

  return (
    <div className={`task-card ${dashed ? "dashed" : ""}`} onClick={onClick}>
      {children}
      {!dashed && (
        <div className="task-actions">
          <button
            className="action-button"
            onClick={handleActionClick}
            title="More options"
          >
            <FaEllipsisV />
          </button>
          {showActions && (
            <div className="action-menu">
              <button className="action-menu-item" onClick={handleEdit}>
                Edit
              </button>
              <button className="action-menu-item" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskRowCard;

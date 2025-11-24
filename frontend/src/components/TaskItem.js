import React from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const handleStatusChange = async (newStatus) => {
    await onUpdate(task.id, { status: newStatus });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  return (
    <div className={`task-item ${getPriorityClass(task.priority)} ${isOverdue() ? 'overdue' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-actions">
            <button 
              onClick={() => onEdit(task)} 
              className="btn-edit"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(task.id)} 
              className="btn-delete"
            >
              Delete
            </button>
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          <span className={`status-badge status-${task.status}`}>
            {task.status}
          </span>
          <span className="priority-badge">
            {task.priority} priority
          </span>
          <span className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
            Due: {formatDate(task.dueDate)}
          </span>
          {task.completedAt && (
            <span className="completed-date">
              Completed: {formatDate(task.completedAt)}
            </span>
          )}
        </div>

        <div className="status-actions">
          <button 
            onClick={() => handleStatusChange('pending')}
            className={`btn-status ${task.status === 'pending' ? 'active' : ''}`}
          >
            Pending
          </button>
          <button 
            onClick={() => handleStatusChange('in-progress')}
            className={`btn-status ${task.status === 'in-progress' ? 'active' : ''}`}
          >
            In Progress
          </button>
          <button 
            onClick={() => handleStatusChange('completed')}
            className={`btn-status ${task.status === 'completed' ? 'active' : ''}`}
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import './TaskManager.css';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async (taskData) => {
    try {
      await axios.post('http://localhost:5000/api/tasks', taskData);
      fetchTasks();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, taskData);
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="task-manager">
      <header className="task-header">
        <div>
          <h1>Task Manager</h1>
          <p>Welcome, {user?.username}!</p>
        </div>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      <div className="task-controls">
        <button 
          onClick={() => setShowForm(true)} 
          className="btn-primary"
        >
          Add New Task
        </button>
        
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {showForm && (
        <TaskForm
          onSubmit={createTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={(data) => updateTask(editingTask.id, data)}
          onCancel={() => setEditingTask(null)}
        />
      )}

      <TaskList
        tasks={filteredTasks}
        onEdit={setEditingTask}
        onDelete={deleteTask}
        onUpdate={updateTask}
      />
    </div>
  );
};

export default TaskManager;
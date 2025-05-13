
import axios from 'axios';
import React, { useState, useEffect } from 'react';


import './Dashboard.css'; // Local CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome

function Dashboard() {
    const [tasks, setTasks] = useState([]);
const createTask = async (taskDetails, file) => {
  const apiUrl = 'https://njkdm06i0e.execute-api.us-east-1.amazonaws.com/dev/create-task';
  
  // Assuming the token is stored in localStorage or cookies
  const token = localStorage.getItem('authToken');  

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 string
      reader.onerror = reject;
    });

  try {
    // Convert the file to base64
    const base64File = await toBase64(file);

    const payload = {
      task: taskDetails,
      filename: file.name,  // Get the file name
      file: base64File      // Send base64-encoded file
    };

    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Task created:', response.data);
  } catch (error) {
    console.error('Error creating task:', error);
  }
};


const getTasks = async () => {
  const apiUrl = 'https://njkdm06i0e.execute-api.us-east-1.amazonaws.com/dev/get-task';
  const token = localStorage.getItem('authToken');

  try {
    console.log('tokenn', token);
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        // Only add Authorization if token exists
        // ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        
      },
      // Optional: To be safe with CORS preflight
      withCredentials: false
    });

    console.log('Tasks fetched:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error fetching tasks:', error.response?.data || error.message);
    return [];
  }
};


  useEffect(() => {
    const fetchTasks = async () => {
      const fetchedTasks = await getTasks();
      console.log('Fetched Tasks:', fetchedTasks); // Debugging: Check the full fetched data
      // Parse the 'body' as it is returned as a JSON string
      const parsedTasks = JSON.parse(fetchedTasks.body); // Parse the string to an array
      setTasks(parsedTasks); // Set the parsed array to state
    };

    fetchTasks(); // Actually fetch the tasks

  }, []); // Empty dependency array to only fetch tasks once on component mount

  useEffect(() => {
    console.log('Updated tasks:', tasks); // This logs when tasks state changes
    console.log('Is tasks an array?', Array.isArray(tasks)); // Check if it's an array
  }, [tasks]); // This effect runs when tasks are updated


  

 
  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <h1>TaskManager</h1>
        </div>
        <div className="nav-links">
          <div className="notification">
            <i className="fa-solid fa-bell"></i>
            <span className="notification-badge">3</span>
          </div>
          <div className="profile">
            <img src="" alt="Profile" />
            <div className="profile-dropdown">
              <div className="profile-info">
                <img src="" alt="Profile" />
                <div>
                  <h3>John Doe</h3>
                  <p>john.doe@example.com</p>
                </div>
              </div>
              <ul>
                <li><a href="#"><i className="fa-solid fa-user"></i> My Profile</a></li>
                <li><a href="#"><i className="fa-solid fa-gear"></i> Settings</a></li>
                <li><a href="#"><i className="fa-solid fa-sign-out-alt"></i> Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container">
        <div className="header">
          <h1>My Tasks</h1>
          <a href="#add-task-modal" className="btn add-task-btn">
            <i className="fa-solid fa-plus"></i> Add New Task
          </a>
        </div>

        {/* Replace this with dynamic mapping later */}
<div className="task-list">
  {Array.isArray(tasks) && tasks.map((task, index) => {
    const details = JSON.parse(task.taskDetails);  // 👈 Parse the string

    return ( // ✅ Return JSX
      <div className="task-card" key={task.taskId || index}>
        <div className="task-header">
          <h3>{details.title || details.name}</h3>
          <div className="task-actions">
            <a href="#edit-task-modal" className="edit-btn">
              <i className="fa-solid fa-pen-to-square"></i>
            </a>
            <button className="delete-btn">
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
        <div className="task-details">
          <p className="due-date">
            <i className="fa-solid fa-calendar"></i> Due: {details.dueDate || 'No due date'}
          </p>
          {task.fileUrl && (
            <div className="attachments">
              <p>
                <i className="fa-solid fa-paperclip"></i> Attachment:
              </p>
              <div className="attachment-list">
                <a
                  href={task.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="attachment-item"
                >
                  View File
                </a>
              </div>
            </div>
          )}
        </div>
        <div className="task-footer">
          <label className="checkbox-container">
            <input type="checkbox" defaultChecked={details.isDone} />
            <span className="checkmark"></span>
            Mark as complete
          </label>
        </div>
      </div>
    );
  })}
</div>


      </main>

      {/* Add Task Modal */}
      <div id="add-task-modal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Add New Task</h2>
            <a href="#" className="close-modal">&times;</a>
          </div>
          <div className="modal-body">
            <form onSubmit={(e) => {
              e.preventDefault();
              const taskDetails = {
                title: e.target['task-title'].value,
                dueDate: e.target['task-due-date'].value,
              };
              const file = e.target['task-attachments'].files[0];
              createTask(taskDetails, file);
            }}>
              <div className="form-group">
                <label htmlFor="task-title">Title</label>
                <input type="text" id="task-title" placeholder="Enter task title" required />
              </div>
              <div className="form-group">
                <label htmlFor="task-due-date">Due Date</label>
                <input type="date" id="task-due-date" required />
              </div>
              <div className="form-group">
                <label htmlFor="task-attachments">Attachments</label>
                <div className="file-upload">
                  <input type="file" id="task-attachments" />
                  <label htmlFor="task-attachments" className="file-upload-label">
                    <i className="fa-solid fa-paperclip"></i> Choose file
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <a href="#" className="btn btn-secondary">Cancel</a>
                <button type="submit" className="btn btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Edit Task Modal Placeholder */}
      <div id="edit-task-modal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Edit Task</h2>
            <a href="#" className="close-modal">&times;</a>
          </div>
          <div className="modal-body">
            <p>Edit functionality to be implemented...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

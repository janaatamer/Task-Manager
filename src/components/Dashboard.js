
import axios from 'axios';
import React, { useState, useEffect } from 'react';


import './Dashboard.css'; // Local CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome

function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [taskToEdit, setTaskToEdit] = useState(null); // stores the selected task
    const [editFormData, setEditFormData] = useState({
  title: '',
  dueDate: ''
});
  const [token,setToken] = useState('');

const createTask = async (taskDetails, file) => {
  const apiUrl = 'https://scfwc7ifpa.execute-api.us-east-1.amazonaws.com/dev/tasks';

  
  
  // Assuming the token is stored in localStorage or cookies
  const token = localStorage.getItem('authToken');  
  

  


  console.log('🔑 Token:', token); // Debugging: Check the token value
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
    console.log("PAYLOAD create:", payload);
    const response = await axios.post(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const fetchedTasks = await getTasks();
    setTasks(fetchedTasks)
   

    console.log('Task created:', response.data);
  } catch (error) {
    console.error('Error creating task:', error);
  }
};


const getTasks = async () => {
  const apiUrl = 'https://scfwc7ifpa.execute-api.us-east-1.amazonaws.com/dev/tasks';
  //const token = localStorage.getItem('authToken');
   
  try {
    const token = localStorage.getItem('userEmail');
    const token2= localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found in localStorage');
      return [];
    }
    console.log("Token",token)
    console.log("Token",token2)
    const response = await axios.get(`${apiUrl}?token=${token}`, {
  headers: {
    'Authorization': `Bearer ${token2}`,
    'Content-Type': 'application/json',
    
  }
}
// const response = await axios.get(apiUrl, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//       },
//     }
 );



    console.log('Tasks fetched:', response.data);
    return response.data || [];

  } catch (error) {
    console.error('Error fetching tasks:', error.response?.data || error.message);
    return [];
  }
};

const editTask = async (taskId, updatedTaskDetails) => {
  // ✅ Define the API URL for updating the task
  const apiUrl = 'https://scfwc7ifpa.execute-api.us-east-1.amazonaws.com/dev/tasks';
  
  // ✅ Fetch the token from localStorage
  const token = localStorage.getItem('userEmail');
  const token2 = localStorage.getItem('authToken'); 
  console.log('🔑 Token:', token); // Debugging: Check the token value

  try {
    // ✅ Prepare the update fields (e.g., title, dueDate, etc.)
    const updateFields = {};

    if (updatedTaskDetails.title) {
      updateFields.title = updatedTaskDetails.title;
      console.log("📝 Title updated:", updatedTaskDetails.title);
    }
    if (updatedTaskDetails.dueDate) {
      updateFields.dueDate = updatedTaskDetails.dueDate;
      console.log("🗓️ Due Date updated:", updatedTaskDetails.dueDate);
    }

    // ✅ Prepare the file if it exists
    const file = updatedTaskDetails.file || null;
    const filename = updatedTaskDetails.filename || null;

    // ✅ If there is a file, convert it to base64
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 string
        reader.onerror = reject;
      });

    let base64File = null;
    if (file) {
      console.log("📂 File detected, converting to base64...");
      base64File = await toBase64(file);
      console.log("✅ File converted to base64 successfully.");
    }

    // ✅ Create the payload for the request
    const payload = {
      taskId: taskId,
      updateFields: updateFields,
      file: base64File,
      filename: filename,
      Token: token, // 🔥 Include the token in the body payload as expected by Lambda
    };
    console.log("file",file)
    console.log("📦 Payload for update:", payload);

    // ✅ Send the request to the API with headers and payload
    const response = await axios.put(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token2}`, // 🔥 Include the token in the headers
      },
    });

    // ✅ Log the successful response
    console.log('✅ Task updated successfully:', response.data);

  } catch (error) {
    // ✅ Log the error response if it occurs
    console.error('❌ Error editing task:', error.response?.data || error.message);
  }
};



  useEffect(() => {
    const fetchTasks = async () => {
      // const token = localStorage.getItem('authToken');
      // setToken(token);
      // console.log('Token:', token); // Debugging: Check the token value
      const fetchedTasks = await getTasks();
      console.log('Fetched Tasks1:', fetchedTasks); // Debugging: Check the full fetched data
      // Parse the 'body' as it is returned as a JSON string
      // const parsedTasks = JSON.parse(fetchedTasks.body); // Parse the string to an array
      const parsedTasks = fetchedTasks;
      console.log("parsed",parsedTasks)
      setTasks(parsedTasks); // Set the parsed array to state
    };

    fetchTasks(); // Actually fetch the tasks

  }, []); // Empty dependency array to only fetch tasks once on component mount

  const updateTaskStatus = async (taskId, newStatus) => {
  const apiUrl = 'https://scfwc7ifpa.execute-api.us-east-1.amazonaws.com/dev/tasks';
  const token = localStorage.getItem('userEmail');
  const token2 = localStorage.getItem('authToken'); 
  console.log('🔑 Token:', token); // Debugging: Check the token value

  try {
    console.log(token);
    const payload = {
      taskId: taskId,
      Token: token,
      updateFields: {
        
        isDone: newStatus,  // Update isDone to the new status
      },
    };

    const response = await axios.put(apiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token2}`,
      },
    });

    console.log('Task status updated:', response.data);
    
    // After updating the task status, fetch the updated tasks
    const updatedTasks = await getTasks();  // This is the function to get all tasks
    setTasks((updatedTasks));  // Update tasks state with the new data
    console.log((updatedTasks));

  } catch (error) {
    console.error('Error updating task status:', error);
  }
};

 const deleteTask = async (taskId) => {
  const apiUrl = 'https://scfwc7ifpa.execute-api.us-east-1.amazonaws.com/dev/tasks';

  // Fetch the token from localStorage
  const token = localStorage.getItem('userEmail');
  const token2 = localStorage.getItem('authToken');
  console.log('Token:', token); // Debugging: Check the token value
  if (!token) {
    console.error('No authorization token found.');
    return;
  }

  try {
    // Prepare the request payload
    const payload = {
      taskId: taskId,
      Token: token
    };
    console.log("PAYLOAD:", payload);
    // Send the DELETE request with headers and payload
    const response = await axios.delete(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token2}`,
      },
      data: payload,  // 👈 Send taskId in the `data` field instead of query params
    });

    console.log('Task deleted:', response.data);
  
  } catch (error) {
    console.error('Error deleting task:', error.response?.data || error.message);
  }
};

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

      {/* ✅ Task List */}
      <div className="task-list">
        {Array.isArray(tasks) && tasks.map((task, index) => {
          const details = (task.taskDetails);
          return (
            <div className="task-card" key={task.taskId || index}>
              <div className="task-header">
                <h3>{details.title || details.name}</h3>
                <div className="task-actions">
                  <a
                    href="#edit-task-modal"
                    className="edit-btn"
                    onClick={() => {
                      setTaskToEdit(task);
                      setEditFormData({
                        title: details.title || '',
                        dueDate: details.dueDate || '',
                        file: null, // reset file input
                        oldFilename: task.filename // store old filename if available
                      });
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </a>
                  <button
                    className="delete-btn"
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this task?")) {
                        await deleteTask(task.taskId);
                        setTasks(prevTasks => prevTasks.filter(t => t.taskId !== task.taskId));
                      }
                    }}
                  >
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
                    <p><i className="fa-solid fa-paperclip"></i> Attachment:</p>
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
                  <input
                    type="checkbox"
                    checked={details.isDone}
                    onChange={async () => {
                      await updateTaskStatus(task.taskId, !details.isDone);
                    }}
                  />
                  <span className="checkmark"></span>
                  {details.isDone ? "Completed" : "Mark as complete"}
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
              <input type="text" id="task-title" required />
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

    {/* Edit Task Modal */}
    <div id="edit-task-modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Task</h2>
          <a href="#" className="close-modal">&times;</a>
        </div>
        <div className="modal-body">
          {taskToEdit ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const updatedTask = {
                  title: editFormData.title,
                  dueDate: editFormData.dueDate,
                  file: editFormData.file, // include file in update
                  filename: editFormData.file ? editFormData.file.name : editFormData.oldFilename
                };
                await editTask(taskToEdit.taskId, updatedTask);
                const updatedTasks = await getTasks();
                setTasks((updatedTasks));
                setTaskToEdit(null);
              }}
            >
              <div className="form-group">
                <label htmlFor="edit-title">Title</label>
                <input
                  id="edit-title"
                  value={editFormData.title}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-due-date">Due Date</label>
                <input
                  id="edit-due-date"
                  type="date"
                  value={editFormData.dueDate}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, dueDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-file">Attach File</label>
                <input
                  id="edit-file"
                  type="file"
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, file: e.target.files[0] })
                  }
                />
                {/* Show old file name if exists and no new file selected
                {!editFormData.file && (
                  <div className="old-filename">
                    <small>Current file: {taskToEdit.filename}</small>
                  </div>
                )} */}

              </div>
              <div className="form-actions">
                <a href="#" className="btn btn-secondary" onClick={() => setTaskToEdit(null)}>Cancel</a>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          ) : (
            <p>No task selected</p>
          )}
        </div>
      </div>
    </div>
  </div>
);}


export default Dashboard;

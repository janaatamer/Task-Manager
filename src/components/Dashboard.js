import React from 'react';
import './Dashboard.css'; // Local CSS
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome if installed via npm

function Dashboard() {
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
        <div class="task-list">

            <div class="task-card">
                <div class="task-header">
                    <h3>Complete project proposal</h3>
                    <div class="task-actions">
                        <a href="#edit-task-modal" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></a>
                        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="task-details">
                    <p class="due-date"><i class="fa-solid fa-calendar"></i> Due: May 15, 2023</p>
                    <div class="attachments">
                        <p><i class="fa-solid fa-paperclip"></i> Attachments (2):</p>
                        <div class="attachment-list">
                            <span class="attachment-item">proposal-draft.docx</span>
                            <span class="attachment-item">requirements.pdf</span>
                        </div>
                    </div>
                </div>
                <div class="task-footer">
                    <label class="checkbox-container">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                        Mark as complete
                    </label>
                </div>
            </div>


            <div class="task-card">
                <div class="task-header">
                    <h3>Design team meeting</h3>
                    <div class="task-actions">
                        <a href="#edit-task-modal" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></a>
                        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="task-details">
                    <p class="due-date"><i class="fa-solid fa-calendar"></i> Due: May 10, 2023</p>
                    <div class="attachments">
                        <p><i class="fa-solid fa-paperclip"></i> Attachments (1):</p>
                        <div class="attachment-list">
                            <span class="attachment-item">meeting-agenda.pdf</span>
                        </div>
                    </div>
                </div>
                <div class="task-footer">
                    <label class="checkbox-container">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                        Mark as complete
                    </label>
                </div>
            </div>

            <div class="task-card">
                <div class="task-header">
                    <h3>Update client documentation</h3>
                    <div class="task-actions">
                        <a href="#edit-task-modal" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></a>
                        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="task-details">
                    <p class="due-date"><i class="fa-solid fa-calendar"></i> Due: May 20, 2023</p>
                    <div class="attachments">
                        <p><i class="fa-solid fa-paperclip"></i> Attachments (3):</p>
                        <div class="attachment-list">
                            <span class="attachment-item">user-guide.docx</span>
                            <span class="attachment-item">api-docs.pdf</span>
                            <span class="attachment-item">changelog.txt</span>
                        </div>
                    </div>
                </div>
                <div class="task-footer">
                    <label class="checkbox-container">
                        <input type="checkbox"/>
                        <span class="checkmark"></span>
                        Mark as complete
                    </label>
                </div>
            </div>

       
            <div class="task-card">
                <div class="task-header">
                    <h3>Prepare quarterly report</h3>
                    <div class="task-actions">
                        <a href="#edit-task-modal" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></a>
                        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="task-details">
                    <p class="due-date"><i class="fa-solid fa-calendar"></i> Due: June 5, 2023</p>
                    <div class="attachments">
                        <p><i class="fa-solid fa-paperclip"></i> Attachments (0)</p>
                    </div>
                </div>
                <div class="task-footer">
                    <label class="checkbox-container">
                        <input type="checkbox"/>
                        <span class="checkmark"></span>
                        Mark as complete
                    </label>
                </div>
            </div>

  
            <div class="task-card">
                <div class="task-header">
                    <h3>Review code pull requests</h3>
                    <div class="task-actions">
                        <a href="#edit-task-modal" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></a>
                        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="task-details">
                    <p class="due-date"><i class="fa-solid fa-calendar"></i> Due: May 12, 2023</p>
                    <div class="attachments">
                        <p><i class="fa-solid fa-paperclip"></i> Attachments (1):</p>
                        <div class="attachment-list">
                            <span class="attachment-item">code-review-checklist.pdf</span>
                        </div>
                    </div>
                </div>
                <div class="task-footer">
                    <label class="checkbox-container">
                        <input type="checkbox" checked/>
                        <span class="checkmark"></span>
                        Mark as complete
                    </label>
                </div>
            </div>

            <div class="task-card">
                <div class="task-header">
                    <h3>Update website content</h3>
                    <div class="task-actions">
                        <a href="#edit-task-modal" class="edit-btn"><i class="fa-solid fa-pen-to-square"></i></a>
                        <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="task-details">
                    <p class="due-date"><i class="fa-solid fa-calendar"></i> Due: May 18, 2023</p>
                    <div class="attachments">
                        <p><i class="fa-solid fa-paperclip"></i> Attachments (2):</p>
                        <div class="attachment-list">
                            <span class="attachment-item">new-content.docx</span>
                            <span class="attachment-item">images.zip</span>
                        </div>
                    </div>
                </div>
                <div class="task-footer">
                    <label class="checkbox-container">
                        <input type="checkbox"/>
                        <span class="checkmark"></span>
                        Mark as complete
                    </label>
                </div>
            </div>
        </div>
    </main>

  
    <div id="add-task-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Task</h2>
                <a href="#" class="close-modal">&times;</a>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="task-title">Title</label>
                        <input type="text" id="task-title" placeholder="Enter task title" required/>
                    </div>
                    <div class="form-group">
                        <label for="task-due-date">Due Date</label>
                        <input type="date" id="task-due-date" required/>
                    </div>
                    <div class="form-group">
                        <label for="task-attachments">Attachments</label>
                        <div class="file-upload">
                            <input type="file" id="task-attachments" multiple/>
                            <label for="task-attachments" class="file-upload-label">
                                <i class="fa-solid fa-paperclip"></i> Choose files
                            </label>
                        </div>
                        <div class="selected-files">
                            <p>No files selected</p>
                        </div>
                    </div>
                    <div class="form-actions">
                        <a href="#" class="btn btn-secondary">Cancel</a>
                        <button type="submit" class="btn btn-primary">Add Task</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div id="edit-task-modal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Edit Task</h2>
                <a href="#" class="close-modal">&times;</a>
            </div>
            <div class="modal-body">
                <form>
                    <div class="form-group">
                        <label for="edit-task-title">Title</label>
                        <input type="text" id="edit-task-title" value="Complete project proposal" required/>
                    </div>
                    <div class="form-group">
                        <label for="edit-task-due-date">Due Date</label>
                        <input type="date" id="edit-task-due-date" value="2023-05-15" required/>
                    </div>
                    <div class="form-group">
                        <label>Current Attachments</label>
                        <div class="current-attachments">
                            <div class="attachment-item">
                                <span>proposal-draft.docx</span>
                                <button type="button" class="remove-attachment"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                            <div class="attachment-item">
                                <span>requirements.pdf</span>
                                <button type="button" class="remove-attachment"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit-task-attachments">Add Attachments</label>
                        <div class="file-upload">
                            <input type="file" id="edit-task-attachments" multiple/>
                            <label for="edit-task-attachments" class="file-upload-label">
                                <i class="fa-solid fa-paperclip"></i> Choose files
                            </label>
                        </div>
                        <div class="selected-files">
                            <p>No files selected</p>
                        </div>
                    </div>
                    <div class="form-actions">
                        <a href="#" class="btn btn-secondary">Cancel</a>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
  </div>
    </div>
  );
}

export default Dashboard;

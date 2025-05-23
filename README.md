# 🚀 Task Management System – Frontend Deployment Guide (AWS EC2)

This guide provides full deployment instructions for hosting the frontend of the Task Management System on AWS EC2 using Amazon Linux 2 and Apache HTTP Server.

---

## ✅ Prerequisites

Before deploying the application, the following AWS services must be configured:

### 1. 🔐 Authentication
- **Amazon Cognito** handles user sign-up/sign-in and issues tokens for authorization.
- Cognito is integrated with **API Gateway** for secured access.

### 2. 🛠️ Backend Infrastructure & Databases
- **API Gateway** exposes secure RESTful endpoints.
- **AWS Lambda** handles backend logic and interacts with:
  - **Amazon RDS (PostgreSQL)** — stores user profiles & task relations (inside a private subnet).
  - **Amazon DynamoDB** — stores task metadata for fast retrieval.

### 3. 🔔 Notifications
- **Amazon SQS** queues events.
- **AWS Lambda (SQSNotifier)** processes queued messages and forwards them to:
- **Amazon SNS**, which delivers user-specific notifications.

### 4. 📁 File Storage
- **Amazon S3** stores user-uploaded attachments.
- IAM roles control secure access to these files.

---

## 🧱 Deployment: Frontend Application on AWS EC2 (Amazon Linux 2 + Apache)

### 1. 🧩 AWS Infrastructure Setup

- **VPC**:
  - **Public Subnet**: Hosts the EC2 instance for frontend.
  - **Private Subnet**: Hosts the RDS database (no direct internet access).

- **Route Tables**:
  - Public Subnet → Internet Gateway (IGW)
  - Private Subnet → No internet route (more secure)

- **Security Groups**:
  - RDS allows access from EC2 Security Group on port `5432` (PostgreSQL)

---

### 2. 🖥️ EC2 Instance Setup

#### Launch EC2 Instance:
- AMI: Amazon Linux 2
- Subnet: Public
- Enable auto-assigned Public IP
- Security Group:
  - Allow inbound **HTTP (80)** from anywhere `0.0.0.0/0`
  - Allow **SSH (22)** from your local IP only

#### Connect to EC2 Instance:
```bash
ssh -i my-new-key.pem ec2-user@<EC2-Public-IP>
```

---

### 3. 🔧 Install Apache HTTP Server
```bash
sudo yum update -y
sudo yum install httpd -y
sudo systemctl start httpd
sudo systemctl enable httpd
```

---

### 4. ⚙️ Prepare Frontend App for Deployment

On your local machine:
```bash
npm run build
```
This creates a `build/` folder with static production-ready frontend files.

---

### 5. 📤 Upload Frontend Build to EC2

Using `scp`, transfer build files to EC2:
```bash
scp -i my-new-key.pem -r build/* ec2-user@<EC2-Public-IP>:/home/ec2-user/
```

On EC2, run:
```bash
sudo rm -rf /var/www/html/*
sudo cp -r /home/ec2-user/* /var/www/html/
sudo chown -R apache:apache /var/www/html
sudo chmod -R 755 /var/www/html
```

#### Purpose of Each Command:

1.  `rm -rf /var/www/html/*`  
    → Clears any old files.

2.  `cp -r /home/ec2-user/* /var/www/html/`  
    → Copies new frontend build to Apache's root.

3.  `chown -R apache:apache /var/www/html`  
    → Sets Apache as the owner.

4.  `chmod -R 755 /var/www/html`  
    → Makes files executable and readable as needed.

---

### 6. 🔁 Restart Apache to Apply Changes
```bash
sudo systemctl restart httpd
```

---

### 7. 🌐 Access the Application

Open your browser and visit:
```
http://3.238.42.7/login
```

The frontend app should load successfully 🎉

---

## ✅ Summary

- ✔️ Fully deployed and running frontend  
- 🔐 Secured infrastructure with subnet isolation  
- 📦 Clean file delivery using Apache  
- 🔁 Easily restartable and maintainable system  

# User Manual for Task Management Applica on 
## Introducion
Welcome to the Cloud Task Management Applica on. This system is designed to help users 
efficiently manage, track, and organize their tasks. The pla orm offers intui ve task crea on, 
edi ng, and monitoring features, along with real-me email no fica ons for all cri cal ac ons.

---

## 1. Getting Started
### 1.1 User Authentication
Upon accessing the applica on, users are presented with two primary op ons: 
-Login: If the user has previously registered, they can enter their creden als (email and 
password) to log in. 
-Sign Up: New users must navigate to the sign-up page, fill in the required informa on, 
and create an account. A er successful registra on, the user is redirected to the login 
page to authen cate and access the applica on.

---
## 2. Dashboard Overview
A er successful login, users are directed to the Dashboard Page. The dashboard displays all 
tasks associated with the user in a card-based format. 
Each task card includes: 
-Task Title 
-Due Date 
-View File Bu on – Allows users to open the file a ached to the task (if any). 
Addi onal interac ve op ons are also available on each task card.

---
## 3. Task Management Features
### 3.1 view Attached File
-Clicking the "View File" bu on will open or download the file that was a ached during 
task crea on or edi ng.
### 3.2 Edit Task
Each task card contains an "Edit" icon. When clicked: 
-A form appears, allowing users to: 
 --Update the Task Title 
 --Modify the Due Date 
 --Change or replace the A ached File 
-Afer updadng the task, an email notifications is automatcally sent to the user’s 
registered email address to confirm that changes were successfully made.
### 3.3 Delete Task
Each task card includes a "Delete" icon. When selected: 
-The task is permanently removed from the dashboard. 
-An email confirma on is immediately sent to the user to acknowledge that the task has 
been deleted.
### 3.4 Mark as Completed
A checkbox labeled "Mark as Complete" is present on each task card. 
-When checked: 
--The task is marked as completed. 
--This helps users visually dis nguish between completed and pending tasks on the 
dashboard.

---

## 4. Creatinf a new Task
At the top-right corner of the dashboard, users will find a "Create Task" bu on. Clicking this 
bu on triggers a pop-up form where the user can: 
-Enter the Task Title 
-Select the Due Date 
-Optonally attach a File 
A er submi ng the form: 
-The task is added to the dashboard. 
-An email no fica on is sent to the user confirming that the task has been successfully 
created.
## Conclusion
This applica on is built to streamline task management through a user-friendly interface, 
comprehensive control features, and instant email feedback. Whether you're editng, dele ng, 
crea ng, or simply reviewing tasks, the Cloud Task Management Application ensures a 
responsive and efficient workflow for all your productivity needs.
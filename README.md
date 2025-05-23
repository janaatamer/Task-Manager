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



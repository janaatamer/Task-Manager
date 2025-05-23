# 📘 Task Management System – Architecture and Design Report

This document summarizes the design decisions, technical challenges, and key takeaways for the AWS-based Task Management System.

---

## 1. 🧠 Design Decisions

### 1.1 🔐 Authentication
We used **Amazon Cognito** to handle secure user sign-up and login.

- Token-based access control via **JWT**, integrates with API Gateway & Lambda.
- Scalable and managed user pools, avoiding the need for custom auth logic.
- JWT tokens allow extracting user context (e.g., email) for personalized features like notifications.

---

### 1.2 🔔 Notifications
Notifications for task events (create, update, delete) are handled using:

- **Amazon SNS** for broadcasting messages, with filter policies ensuring users only receive their own messages.
- **Amazon SQS** acts as a buffer to decouple task logic from notification delivery.
- A single `SQSNotifier` Lambda processes all notification types, reducing code duplication and improving formatting consistency.
- Result: scalable, reliable, and real-time user-specific notifications.

---

### 1.3 🧩 Microservices Architecture
We adopted a microservices approach for modularity and scalability:

- Each function (authentication, tasks, files, notifications) is an independent **AWS Lambda**.
- Communication is done via **API Gateway**, **SQS**, and **SNS**.
- This setup enables easy testing, monitoring, deployment, and scaling.
- Security is enhanced using least-privilege IAM roles per Lambda.
- Better observability and fault isolation.

---

## 2. 🛠️ Challenges Encountered

### 2.1 VPC Connection Issues
- Lambda → RDS in private subnet initially timed out.
- Resolved by configuring subnets, security groups, and providing NAT access for external calls.

### 2.2 SNS Notification Targeting
- Initially sent to all subscribers.
- Fixed using **filter policies by user email** to ensure correct targeting.

### 2.3 Duplicate Notifications
- Multiple Lambdas triggered multiple emails.
- Solved by consolidating into a single notification handler Lambda.

### 2.4 Routing & SQS Timing
- Event sequencing and duplication issues.
- Resolved with message attributes and deduplication logic in SQS.

### 2.5 Email Extraction from Token
- Avoided storing email in DynamoDB.
- JWT from Cognito was decoded inside Lambda to fetch user email directly.

---

## 3. ✅ Key Takeaways

### 🔄 Separation of Concerns
- Services are logically separated by function (compute, storage, notifications).

### ☁️ Serverless Architecture
- Leveraging **Lambda**, **API Gateway**, **DynamoDB**, and **S3** improves scalability and lowers operational overhead.

### 📬 Real-Time, Targeted Notifications
- **SNS + SQS** allows near real-time, user-specific alerts.

### 🔐 Secure User Management
- **Cognito** provides a robust, standards-based authentication system.

### 📊 Monitoring & Debugging
- **CloudWatch** logs and metrics were invaluable for VPC debugging and Lambda performance monitoring.

---

This architecture ensures a resilient, modular, and secure task management solution with scalable backend operations and real-time user feedback.

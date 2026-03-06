Task Management System – Frontend Deployment Guide (AWS EC2)

This guide provides instructions for hosting the frontend of the Task Management System on AWS EC2 using Amazon Linux 2 and Apache HTTP Server.

• Prerequisites

Before deploying the frontend, ensure the following AWS services are configured:

1. Authentication

Amazon Cognito handles user sign-up/sign-in and issues tokens for authorization.

Cognito is integrated with API Gateway for secured access.

2. Backend Infrastructure & Databases

API Gateway exposes secure RESTful endpoints.

AWS Lambda handles backend logic and interacts with:

Amazon RDS (PostgreSQL) — stores user profiles and task relations (in a private subnet).

Amazon DynamoDB — stores task metadata for fast retrieval.

3. Notifications

Amazon SQS queues events.

AWS Lambda processes queued messages and forwards them to Amazon SNS for user notifications.

4. File Storage

Amazon S3 stores user-uploaded attachments.

IAM roles control secure access to these files.

• Deployment: Frontend Application on AWS EC2
1. AWS Infrastructure Setup

- VPC & Subnets

Public Subnet: Hosts the EC2 instance for the frontend.

Private Subnet: Hosts the RDS database (no direct internet access).

- Route Tables

Public Subnet → Internet Gateway (IGW)

Private Subnet → No internet route

- Security Groups

RDS allows access from EC2 Security Group on port 5432.

EC2 Security Group allows inbound HTTP (80) from anywhere and SSH (22) from your local IP only.

2. EC2 Instance Setup

1. Launch an EC2 instance:

AMI: Amazon Linux 2

Subnet: Public

Enable auto-assigned public IP

2. Connect to the EC2 instance:

ssh -i my-new-key.pem ec2-user@<EC2-Public-IP>

3. Install Apache HTTP Server
sudo yum update -y
sudo yum install httpd -y
sudo systemctl start httpd
sudo systemctl enable httpd
4. Prepare Frontend App for Deployment

On your local machine:

npm run build

This creates a build/ folder containing static production-ready frontend files.

5. Upload Frontend Build to EC2

Using scp, transfer files:

scp -i my-new-key.pem -r build/* ec2-user@<EC2-Public-IP>:/home/ec2-user/

On the EC2 instance:

sudo rm -rf /var/www/html/*
sudo cp -r /home/ec2-user/* /var/www/html/
sudo chown -R apache:apache /var/www/html
sudo chmod -R 755 /var/www/html

Command Purpose

rm -rf /var/www/html/* → Clears old files

cp -r /home/ec2-user/* /var/www/html/ → Copies new frontend build

chown -R apache:apache /var/www/html → Sets Apache as owner

chmod -R 755 /var/www/html → Sets proper read/execute permissions

6. Restart Apache
sudo systemctl restart httpd
7. Access the Application

Open your browser:

http://<EC2-Public-IP>/login

The frontend should load successfully.

• Summary

Frontend is fully deployed and running

Infrastructure is secured with subnet isolation

File delivery managed via Apache HTTP Server

System is easy to restart and maintain

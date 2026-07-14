# Seasonal Styles Hub ☁️👗
**A Secure, 100% Serverless Multi-Page E-Commerce Platform built on AWS**

Prepared as part of the Summer Internship Program on AWS at **NAIPUNYAM (APSSDC)**.

## 👥 Team Members (VVIT GUNTUR, Batch-1)
* **Pothina Pavan Kalyan** (kalyanpothinapavan@gmail.com)
* **Puli Zeneswari** (zeneswaripuli@gmail.com)
* **Palaparthi Ramya** (pramya1409@gmail.com)
* **Pulipaka Srinivasa Rao** (srinivaspulipaka309@gmail.com)
* **Oturi Lakshmi Haneela** (lakshmihaneelaoturi@gmail.com)

---

## 🚀 Project Overview
Seasonal Styles Hub is a cloud-native, serverless e-commerce web application. The platform allows global users to browse a dynamic seasonal clothing catalogue (Spring, Summer, Autumn, Winter), create secure accounts, sign in, and manage a persistent shopping cart—all running on a fully managed, high-availability architecture with **zero server maintenance overhead** and **zero idle infrastructure costs**.

## 🛠️ Technology Stack & AWS Infrastructure
* **Frontend Hosting:** Amazon S3 (`seasonal-styles-hub-v2`) serving responsive HTML5, CSS3, and JavaScript pages directly over secure HTTPS.
* **Identity & Access Management:** Amazon Cognito User Pool handling secure user registration, automated email verification code delivery, and token-based session validation (JWT).
* **API Routing Gateway:** Amazon API Gateway (`SeasonalShoppingAPI`) exposing versioned REST endpoints (`/products` and `/cart`) with built-in CORS management and Cognito Authorizer integration.
* **Serverless Compute:** AWS Lambda (`ManageShoppingCart`) executing event-driven backend logic using Python/Node.js to process user payloads safely.
* **NoSQL Persistence Layer:** Amazon DynamoDB (`ShoppingCarts` and `SeasonalProducts` tables) providing single-digit millisecond latency for user cart isolation and fast lookup entries.
* **Infrastructure as Code (IaC):** AWS CloudFormation templates defining the entire infrastructure stack for repeatable, drift-free cloud deployments.

---

## 🗺️ System Architecture Diagram
The application utilizes a fully decoupled event-driven data pipeline inside the `us-east-1` region:

1. User requests static web pages from the **Amazon S3 Website Endpoint**.
2. User authenticates against **Amazon Cognito** to receive a secure authorization token.
3. Protected shopping interactions target **Amazon API Gateway**, passing the security token.
4. **AWS Lambda** computes the backend request under strict **AWS IAM Least-Privilege Roles**.
5. Dynamic state configurations read/write records instantly into the **Amazon DynamoDB** database layer.

---

## 📈 Key Review Highlights For Evaluators
* **Pay-per-Request Billing:** Operating costs drop to exactly zero dollars when the storefront is idle.
* **Enhanced Modern UI:** Includes a smooth single-card login/signup toggle layout to eliminate page clutter.
* **CORS Preflight Solution:** Configured explicitly to support `POST`, `GET`, and preflight `OPTIONS` requests to securely bypass browser domain blocking.
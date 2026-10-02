# NovaBank - Full Stack Banking Application

NovaBank is a full-stack banking application built using React, Spring Boot, and MySQL.

The project has a separate React frontend and Spring Boot backend. The application supports user authentication, banking operations, transaction history, and an admin dashboard.

## Live Application

🌐 **NovaBank:**  
https://nova-bank-8hcblmkg1-manoj-jampana.vercel.app

## Backend

The Spring Boot backend is deployed on Render.

🔗 **Backend:**  
https://nova-bank-backend-6kj6.onrender.com

## Features

### User Features

- User login
- Create bank accounts
- Automatically generated 10-digit account numbers
- Deposit money
- Withdraw money
- Transfer money between accounts
- View account details
- View transaction history
- Close an account when the balance is zero

### Admin Features

- Admin login
- Admin dashboard
- View users
- View accounts
- View transactions

### Backend Features

- REST APIs
- Spring Data JPA
- Hibernate
- MySQL
- Request validation
- Global exception handling
- Transaction management

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Maven

### Database

- MySQL
- Aiven MySQL

### Deployment

- Vercel - Frontend
- Render - Backend
- Aiven - Database

## Project Structure

```text
nova-bank/
│
├── backend/
│   ├── .mvn/
│   ├── src/
│   ├── Dockerfile
│   ├── mvnw
│   ├── mvnw.cmd
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── README.md
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── .gitattributes
├── .gitignore
├── README.md
└── login-test.http
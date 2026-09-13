# Student Management System

A full-stack **Student Management System** built using **Java Spring Boot, React, and PostgreSQL**.

The system helps colleges manage students, teachers, departments, courses, attendance, marks, and reports through role-based access.

## 🚀 Features

* 🔐 JWT Authentication
* 👤 Role-based access control
* 🎓 Student Management
* 👨‍🏫 Teacher Management
* 🏢 Department Management
* 📚 Course Management
* 📅 Attendance Tracking
* 📝 Marks & Grade Management
* 📊 Dashboard & Reports
* 📈 Attendance and Grade Analytics
* 🔎 Search, Filtering & Pagination
* 🔒 Password hashing with BCrypt
* 🛡️ API validation and exception handling

## 🛠️ Tech Stack

### Backend

* Java 17+
* Spring Boot
* Spring Security
* Spring Data JPA
* JWT
* Maven
* Swagger / OpenAPI

### Frontend

* React 19
* Vite
* React Router
* Axios
* Bootstrap 5
* Recharts

### Database

* PostgreSQL

## 📁 Project Structure

```text
student-management-system/
│
├── backend/
│   └── Spring Boot application
│
├── frontend/
│   └── React application
│
├── database/
│   └── schema.sql
│
└── README.md
```

## ⚙️ Prerequisites

Make sure you have installed:

* Java 17 or later
* Maven
* Node.js 18 or later
* PostgreSQL

## 🗄️ Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE sms_db;

CREATE USER sms_user WITH PASSWORD 'sms_password';

GRANT ALL PRIVILEGES ON DATABASE sms_db TO sms_user;
```

Then run the database schema:

```bash
psql -U sms_user -d sms_db -f database/schema.sql
```

## ▶️ Run Backend

Open a terminal and run:

```bash
cd backend
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

## ▶️ Run Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## 🔐 First Admin Setup

After starting the application, open:

```text
http://localhost:5173/setup
```

Create the first administrator account.

After the first admin is created, the setup is locked and additional accounts can be created through the admin user-management section.

## 👥 User Roles

### Admin

* Manage students
* Manage teachers
* Manage departments
* Manage courses
* Manage attendance
* Manage marks
* Manage users
* View reports and dashboard

### Teacher

* View assigned students
* Manage attendance
* Enter marks
* View courses

### Student

* View profile
* View courses
* View attendance
* View marks
* View grades

## 🔗 Main API Modules

```text
/api/auth
/api/students
/api/teachers
/api/departments
/api/courses
/api/attendance
/api/marks
/api/dashboard
/api/reports
```

## 🔒 Security

The application uses:

* JWT authentication
* Spring Security
* BCrypt password hashing
* Role-based authorization
* Method-level `@PreAuthorize`
* Bean validation
* Global exception handling
* JPA/Hibernate parameter binding

## 📊 Dashboard & Reports

The dashboard provides information such as:

* Total students
* Total teachers
* Total courses
* Total departments
* Today's attendance
* Overall attendance percentage
* Average marks

Reports include:

* Students by department
* Students by semester
* Attendance reports
* Grade distribution

## 📸 Project

This project is designed as a **college-level management application** and can be extended with additional modules.

### Future Enhancements

* Parent Portal
* Fee Management
* Notifications
* PDF Report Export
* AI-based Student Insights
* Email Notifications

## 👨‍💻 Author

**Sonu Kumar**

Java Developer | Spring Boot | Microservices | React | PostgreSQL

## 📄 License

This project is created for **educational and learning purposes**.
#  HealCare Portal — MERN Hospital Appointment System

A complete **Hospital Appointment Management System** built using the **MERN Stack** (MongoDB, Express, React, Node.js) with modern UI powered by **Tailwind CSS**.

Patients can create accounts, browse doctors, view real-time availability, and book appointments.  
Doctors can log in, manage availability, confirm appointments, complete them, or cancel if needed.

This project demonstrates **full-stack development**, **real-time data updates**, **role-based dashboards**, and **clean, modern UI**.

---

##  Developer  
**Himanshu Namdeo**

---

---

#  Table of Contents

- [ Features](#-features)
- [ Tech Stack](#-tech-stack)
- [ Screenshots](#-screenshots)
- [ Folder Structure](#️-folder-structure)
- [ Installation & Setup](#️-installation--setup)
- [ Usage Guide](#-usage-guide)
- [ API Endpoints](#️-api-endpoints)
- [Future Enhancements](#-future-enhancements-suggestions-are-welcome)
- [ License](#-license)

---

#  Features

##  Authentication
- Register & Login with **JWT**  
- Two roles:
  - **Patient**
  - **Doctor**
- Automatic role-based redirects  
- Password hashing with bcrypt  
- Secure login flow  

---

##  Doctor Features
- Add availability slots (date + start/end time)
- View all added availability
- See booked slots (marked “Booked”)
- View all appointments (with patient details)
- Update appointment status:
  - Pending → Confirmed  
  - Confirmed → Completed  
  - Cancel any appointment  
- Dashboard stats:
  - Total appointments
  - Pending
  - Confirmed
  - Completed

---

##  Patient Features
- Browse list of all doctors
- Select doctor to view availability
- View time slots (free/booked)
- Book appointment
- View all personal appointments
- Cancel appointment (slot becomes free again)
- Dashboard stats:
  - Total appointments
  - Upcoming
  - Completed
  - Cancelled

---

##  UI / UX Features
- Beautiful Landing Page (role-based CTA)
- Modern Login & Register pages
- Clean Sidebar Dashboards
- Fully responsive layouts
- Tailwind CSS v4

---

#  Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- bcryptjs

---

#  Screenshots
coming soon...


📍 Landing Page  
📍 Login Page  
📍 Register Page  
📍 Doctor Dashboard  
📍 Patient Dashboard  
📍 Availability & Booking Flow  

---

#  Folder Structure


hospital-portal/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── server.js
│ ├── .env (ignored)
│ └── package.json
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── doctor/
│ │ │ └── patient/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── vite.config.js
│ └── package.json
│
└── README.md



---

#  Installation & Setup

##  Clone the repository

# Backend Setup
bash:

git clone https://github.com/yourusername/hospital-portal.git
cd hospital-portal

Create a .env file:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

Start the server:
run in terminal:
npm run dev

once running: something like... Backend runs on: http://localhost:5000

# Frontend Setup
run in terminal:

cd frontend
npm install
npm run dev


then : Frontend runs on: http://localhost:5173




Usage Guide

This explains how anyone can use the system.

# Step 1 — Create accounts
➤ Patient

Fill:

Name

Email

Password

➤ Doctor

Fill:

Name

Email

Password

Specialization

Experience (years)

After registration → redirect to login.


# Step 2 — Login

Use your email and password.

System auto-detects your role:

Role	Redirect
Patient	/patient/dashboard
Doctor	/doctor/dashboard



# Step 3 — Doctor Dashboard Usage
➤ Add Availability

Doctor selects:

Date

Start time

End time

Patients immediately see these slots.

➤ Manage Appointments

Status flow:
Pending → Confirmed → Completed
or Cancelled (slot becomes free)

# Step 4 — Patient Dashboard Usage
➤ Browse Doctors

Choose doctor → see availability.

➤ Book Appointment

Click on any free slot.

Status becomes Pending.

➤ Manage Appointments

Patients can:

View all appointments

Cancel appointment
(slot becomes available again)


# API Endpoints

##  AUTH
| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| POST   | /auth/register   | Register patient/doctor   |
| POST   | /auth/login      | Login user                |

---

##  DOCTORS
| Method | Endpoint   | Description        |
|--------|------------|--------------------|
| GET    | /doctors   | Get all doctors    |

---

##  AVAILABILITY
| Method | Endpoint                   | Description            |
|--------|----------------------------|------------------------|
| POST   | /availability/add          | Add availability       |
| GET    | /availability/:doctorId    | Get availability       |

---

##  APPOINTMENTS
| Method | Endpoint                        | Description                |
|--------|----------------------------------|----------------------------|
| POST   | /appointments/book               | Book a slot                |
| GET    | /appointments/doctor/:id         | Doctor’s appointments      |
| GET    | /appointments/patient/:id        | Patient’s appointments     |
| PATCH  | /appointments/:id/status         | Update appointment status  |






Future Enhancements

JWT auth middleware

Forgot password

Email/SMS notifications

Doctor profile pages

Admin dashboard

Export appointment history

Filtering & pagination



##  Developer  
**Himanshu Namdeo**
💙 Credits

Developed with love by
Himanshu Namdeo
Full Stack MERN Developer
India 🇮🇳
---

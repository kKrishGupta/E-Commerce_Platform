# 🛒 ShopNest — Full-Stack E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v24.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v19.x-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

A modern, scalable, full-stack E-Commerce platform built with **Node.js, Express, MongoDB, React (Vite)**, featuring secure **Razorpay** payment gateway integration, **Cloudinary** media storage, OTP-based authentication, and a full-featured **Admin Dashboard**.

---

## 🔗 Live Links

- 🌐 **Frontend Application (Vercel):** [https://e-commerce-platform-7ur3.vercel.app](https://e-commerce-platform-7ur3.vercel.app)
- ⚙️ **Backend REST API (Render):** [https://e-commerce-platform-pcoq.onrender.com](https://e-commerce-platform-pcoq.onrender.com)

---

## ✨ Features

### 👤 Customer Features
- **User Authentication & Security:** JWT-based authentication, password hashing with `bcryptjs`, email OTP verification, and password recovery.
- **Product Catalog & Search:** Browse products with real-time search, multi-field filtering (category, stock, price range), and sorting.
- **Interactive Product Pages:** Multi-angle image views, detailed specs, user reviews, and star ratings.
- **Shopping Cart & Wishlist:** Redux Toolkit-powered persistent cart state, quantity controls, and total calculations.
- **Secure Checkout & Razorpay Integration:** Seamless Razorpay payment gateway modal integration with backend signature verification.
- **Order Tracking & Profile:** Personal user dashboard to view active and past order histories and order status updates.

### 🛡️ Admin Management Dashboard
- **Analytics Overview:** Real-time dashboards displaying total revenue, active orders, customer count, and sales trends.
- **Product Management:** Full CRUD operations for product catalog including image upload directly to Cloudinary via Multer.
- **Order Processing:** Update order fulfillment states (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **User Management:** View registered user accounts and manage customer access privileges.
- **Bulk Operations:** Restock inventory and perform batch deletions.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Frontend Framework** | React 19, Vite, React Router v7 |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`), React Context API |
| **Styling & UI** | Tailwind CSS v4, React Icons |
| **Backend Runtime** | Node.js (v24+), Express v5 |
| **Database & ORM** | MongoDB Atlas, Mongoose v9 |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Nodemailer (OTP) |
| **Media Storage** | Cloudinary API, Multer |
| **Payment Gateway** | Razorpay Node.js SDK & Web Checkout |
| **Hosting & Deployment** | Render (Backend API), Vercel (Frontend SPA) |

---

## 📁 Project Structure

```text
E-Commerce_Platform/
├── Backend/
│   ├── src/
│   │   ├── config/          # MongoDB database connection & DNS fallback
│   │   ├── controllers/     # Auth, Product, Order, Payment & Analytics controllers
│   │   ├── middleware/      # Auth verification, Admin guard, Multer file upload
│   │   ├── models/          # Mongoose Schemas (User, Product, Order, Review)
│   │   ├── routes/          # RESTful Express route definitions
│   │   ├── utils/           # Nodemailer OTP helper & Cloudinary uploader
│   │   └── app.js           # Express app setup, CORS, and API middleware
│   ├── service.js           # Main server entrypoint (0.0.0.0 binding for Render)
│   ├── package.json
│   └── .env.example
│
├── Frontend/
│   ├── src/
│   │   ├── admin/           # Admin Dashboard components & APIs
│   │   ├── assets/          # Static assets & icons
│   │   ├── components/      # Reusable UI components (Navbar, Footer, Modals)
│   │   ├── context/         # AuthContext state manager
│   │   ├── pages/           # Application pages (Home, Shop, ProductDetails, Checkout)
│   │   ├── redux/           # Redux Toolkit slices (cartSlice, productSlice)
│   │   └── main.jsx         # App root entry point
│   ├── index.html
│   ├── vite.config.js       # Vite build setup & dev proxy
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 🔑 Environment Variables Setup

### 1. Backend (`Backend/.env`)
Create a `.env` file in the `Backend/` directory:

```env
# Server Port
PORT=5000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.pd8ao91.mongodb.net/ecommerce?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Email SMTP (Nodemailer for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cloudinary (Media Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Optional Allowed Frontend URL for CORS
CLIENT_URL=https://e-commerce-platform-7ur3.vercel.app
```

### 2. Frontend (`Frontend/.env`)
Create a `.env` file in the `Frontend/` directory:

```env
# Razorpay Key ID
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# Backend API Endpoint
# Local Development:
VITE_API_URL=http://localhost:5000

# Production Deployment:
# VITE_API_URL=https://e-commerce-platform-pcoq.onrender.com
```

---

## ⚡ Quick Start & Local Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB instance
- [Razorpay Test Account](https://razorpay.com/)
- [Cloudinary Free Account](https://cloudinary.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/kKrishGupta/E-Commerce_Platform.git
cd E-Commerce_Platform
```

### 2. Setup & Run Backend
```bash
cd Backend
npm install
npm run dev
```
> The backend server will start at `http://localhost:5000`.

### 3. Setup & Run Frontend
In a new terminal window:
```bash
cd Frontend
npm install
npm run dev
```
> The frontend app will launch at `http://localhost:5173`.

---

## 📡 API Reference Overview

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register a new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | ❌ |
| `POST` | `/api/auth/verify-otp` | Verify email OTP for account activation | ❌ |
| `POST` | `/api/auth/forgot-password` | Send password reset OTP | ❌ |
| `POST` | `/api/auth/reset-password` | Reset password using OTP token | ❌ |
| `GET`  | `/api/auth/profile` | Get logged-in user profile details | 🔒 |

### 🛍️ Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET`  | `/api/products` | Get list of products with filters | ❌ |
| `GET`  | `/api/products/:id` | Get details for single product | ❌ |
| `POST` | `/api/products` | Create product with image upload | 🔒 Admin |
| `PUT`  | `/api/products/:id` | Update product details or stock | 🔒 Admin |
| `DELETE`| `/api/products/:id` | Remove product from inventory | 🔒 Admin |

### 💳 Payments & Orders (`/api/payments` & `/api/orders`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/payments/create-order` | Create Razorpay payment order | 🔒 User |
| `POST` | `/api/payments/verify-payment` | Verify Razorpay payment signature | 🔒 User |
| `POST` | `/api/orders` | Place new order upon payment verification | 🔒 User |
| `GET`  | `/api/orders/my-orders` | Fetch user's order history | 🔒 User |
| `GET`  | `/api/orders/admin` | Fetch all customer orders | 🔒 Admin |
| `PUT`  | `/api/orders/:id/status` | Update fulfillment status | 🔒 Admin |

### 📊 Analytics (`/api/analytics`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET`  | `/api/analytics` | Get total sales, revenue & counts | 🔒 Admin |

---

## 🚀 Deployment Guide

### Deploying Backend on Render
1. Create a new **Web Service** on [Render](https://dashboard.render.com).
2. Connect your GitHub repository `E-Commerce_Platform`.
3. Set **Root Directory** to `Backend`.
4. Set **Build Command** to `yarn` or `npm install`.
5. Set **Start Command** to `node service.js`.
6. Add your production environment variables in the **Environment** tab (`MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `RAZORPAY_*`).
7. Ensure MongoDB Atlas **Network Access** includes `0.0.0.0/0` (Allow Access from Anywhere).

### Deploying Frontend on Vercel
1. Import your project into [Vercel](https://vercel.com).
2. Set **Framework Preset** to `Vite`.
3. Set **Root Directory** to `Frontend`.
4. Add Environment Variable:
   - `VITE_API_URL` = `https://e-commerce-platform-pcoq.onrender.com`
5. Deploy!

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

<p center align="center">
  Crafted with ❤️ by <a href="https://github.com/kKrishGupta">Krish Gupta</a>
</p>
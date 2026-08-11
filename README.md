# Premium MERN Stack E-commerce Application

A professional, modern, full-stack e-commerce website built with React, Node.js, Express, and MongoDB. The application features user authentication, a dynamic product catalog with advanced search and filters, cart management, checkout with Cash on Delivery (COD), order history, and an administrative control panel.

---

## Technical Stack

- **Frontend**: React.js (Vite), React Router v6, Axios, React Icons, Vanilla CSS3 (Custom Glassmorphic Layouts, custom animations, responsive grid styles).
- **Backend**: Node.js, Express.js (RESTful API), JWT-based session auth, BcryptJS password hashing.
- **Database**: MongoDB (Mongoose schemas for Users, Products, Carts, and Orders).

---

## Main Features

1. **Home Page**: Premium layout with a hero banner, popular categories grid, featured products section, marketing promotion, and verified buyer testimonials.
2. **Product Catalog**: Paginated grid of products supporting:
   - Live query keyword searches.
   - Sidebar filters by category and maximum price range.
   - Sort dropdowns (newest arrivals, price low-high, price high-low, rating).
3. **Product Detail View**: Large image panel, specs list, quantity limit control, related products grid, and mock customer reviews.
4. **Persistent Cart**: Syncs guest selections with localStorage and automatically merges items to the backend MongoDB cart upon login.
5. **Session Management**: Login/Register screens with secure passwords and validation rules.
6. **Checkout**: Contact capture, shipping addresses inputs, and Cash on Delivery (COD) review fields.
7. **Order Records**: Invoice receipts detailing purchased products, prices, totals, shipping logs, and tracking status.
8. **Admin Control Panel**:
   - Dashboard: Counter statistics (revenue, users, products, orders), low stock alerts, and top-selling items.
   - Products: CRUD catalog table (adding, editing, and deleting items).
   - Orders: List of all store orders with status updates (Pending, Processing, Shipped, Delivered, Cancelled).
   - Users: List of accounts supporting role adjustment (admin/user) and account deletion.

---

## Installation & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org) (v18+ recommended)
- [MongoDB](https://www.mongodb.com) running locally on port `27017`

### Step 1: Install Dependencies
In the root directory, run the following command to install dependencies for the root, frontend, and backend:
```bash
npm run install-all
```
*Alternatively, you can manually run `npm install` in the root, `client/`, and `server/` directories.*

### Step 2: Configure Environment
The server environment variables are already configured in `server/.env`. If you need to make changes, configure `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=supersecuresecretkey12345!
NODE_ENV=development
```

### Step 3: Seed Database
Populate MongoDB with sample categories, 10 realistic products, and default accounts:
```bash
npm run seed
```

### Step 4: Run Application
Start the frontend and backend servers concurrently:
```bash
npm run dev
```
The React frontend will start on [http://localhost:5173](http://localhost:5173) and the backend API server will run on [http://localhost:5000](http://localhost:5000).

---

## Default Accounts

Use the following credentials to log in:

### 1. Administrative Account
- **Email**: `admin@example.com`
- **Password**: `admin12345`

### 2. Regular Customer Account
- **Email**: `user@example.com`
- **Password**: `user12345`

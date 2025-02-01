# Full-Stack Food Delivery System

## Project Description
This is a full-stack food delivery system built using **Node.js** for the backend and **React.js** for the frontend. The system allows users to register, log in, browse a menu, add items to a cart, and place orders. Admins can manage menu items and track orders.

## Features
### Backend (Node.js & Express)
- User Authentication (Register & Login with JWT)
- Menu Management (CRUD operations)
- Order Processing (Place orders, track order status)
- MongoDB database with Mongoose models
- Validation & Error Handling

### Frontend (React.js & TailwindCSS)
- User Login & Authentication
- Display Menu Items in a Grid Layout
- Cart Functionality (Add/remove items, calculate total price)
- Order History Page
- Responsive Design (Mobile & Desktop support)

## Tech Stack
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT for authentication
- **Frontend**: React.js, Vite, TypeScript, TailwindCSS
- **State Management**: Redux Toolkit
- **API Calls**: Axios

## Installation & Setup

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and set up environment variables:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /register` - Register a new user
- `POST /login` - Authenticate user and return JWT token

### Menu Management
- `GET /menu` - Fetch all menu items
- `POST /menu` - Add a new menu item
- `PUT /menu/:id` - Update a menu item
- `DELETE /menu/:id` - Delete a menu item

### Order Management
- `POST /order` - Place an order
- `GET /orders` - Fetch all orders of a logged-in user

## Deployment (If applicable)
- **Frontend**: To be Updated
- **Backend**: To be Updated

## Challenges & Assumptions
- Used JWT for authentication, assuming stateless session management.
- MongoDB Atlas was used for cloud database storage.
- Assumed users can only modify their own orders.
- Implemented simple role-based access for menu management.
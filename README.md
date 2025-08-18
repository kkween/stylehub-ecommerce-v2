# Clothing Store MERN Application

A full-stack e-commerce application built with MongoDB, Express.js, React, and Node.js.

## Features

- 🛍️ Product catalog with categories
- 🛒 Shopping cart functionality
- 👤 User authentication (sign up/sign in)
- 📦 Order management with delivery tracking
- 👨‍💼 Admin dashboard for managing orders and customers
- 📱 Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React, React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB Atlas
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MongoDB Atlas account (connection string provided)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

The backend is already configured with your MongoDB connection string in `backend/.env`:
```
MONGODB_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
```

> **Note:** For security, your real `.env` file is not included in the repository. Use `.env.example` to share required environment variable names and formats, but never commit secrets.

### 3. Start the Application

#### Option 1: Start both servers concurrently (recommended)
```bash
# From the root directory
npm run dev
```

#### Option 2: Start servers separately
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000


## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin only)

### Orders
- `GET /api/orders` - Get user orders (or all orders if admin)
- `POST /api/orders` - Create new order

### Users (Admin only)
- `GET /api/users` - Get all users

## Application Structure

```
clothing-store-mern/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── App.css       # Styles
│   │   └── main.jsx      # React entry point
│   ├── index.html        # HTML template
│   └── package.json      # Frontend dependencies
└── package.json          # Root package.json for scripts
```

## Usage Guide

### For Customers:
1. **Browse Products**: Visit the home page to see featured products
2. **Shop**: Navigate to the shop page to view all products
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Create Account**: Sign up with your email and password
5. **Checkout**: Review your cart and complete the purchase
6. **Track Orders**: View order history in your profile

### For Admins:
1. **Sign In**: Use admin@example.com / admin123
2. **Dashboard**: Access the admin dashboard to view all orders and customers
3. **Manage**: Monitor customer activity and order status

## Features in Detail

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes for authenticated users
- Role-based access control (admin/user)

### Shopping Cart
- Add/remove items
- Quantity management
- Real-time total calculation
- Persistent cart state

### Order Management
- Automatic order ID generation
- Delivery date calculation (7 days from order)
- Order history tracking
- Admin order overview

### Database Schema
- **Users**: name, email, password, role
- **Products**: name, price, category, description
- **Orders**: customer info, items, total, dates, status

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure backend is running on port 5000
2. **Database Connection**: Check MongoDB Atlas connection string
3. **Authentication Issues**: Clear localStorage and try again
4. **Port Conflicts**: Change ports in package.json if needed

### Backend Not Starting:
```bash
cd backend
npm install
npm run dev
```

### Frontend Not Loading:
```bash
cd frontend
npm install
npm run dev
```

### Database Issues:
- Verify MongoDB Atlas credentials
- Check network connectivity
- Ensure database name is correct

## Development Notes

- The app automatically seeds sample products on first run
- Admin user is created automatically
- All API calls include error handling
- Frontend includes loading states and error messages
- Cart state is managed locally (persists in component state)

## Production Deployment

Before deploying to production:

1. **Change JWT Secret**: Update `JWT_SECRET` in `.env`
2. **Environment Variables**: Set proper production URLs
3. **Database**: Ensure MongoDB Atlas is configured for production
4. **Build Frontend**: Run `npm run build` in frontend directory
5. **Security**: Add rate limiting, input validation, and HTTPS

## License

This project is for educational purposes.

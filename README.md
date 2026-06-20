# SpendSmart - Full Stack Expenses Tracker

A beautiful, full-stack expense tracking application with authentication, income/expense management, analytics, and budget tracking.

## Features

- **Authentication**: User registration and login with JWT authentication
- **Dashboard**: Overview of financial activity with summary cards
- **Income Tracking**: Add, view, and manage income sources
- **Expense Tracking**: Add, view, and manage expenses with categories
- **Analytics**: Visual charts and spending patterns
- **Budgets**: Set and track spending limits per category
- **Settings**: Profile management, notifications, security, and preferences

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18 with Vite
- React Router for navigation
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

## Project Structure

```
ExpensesTracker/
├── backend/
│   ├── config/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   ├── incomeController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── Income.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── expenses.js
│   │   ├── income.js
│   │   └── user.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (installed and running locally)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
The `.env` file is already created with default values. Update if needed:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spendsmart
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=30d
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Expenses
- `GET /api/expenses` - Get all expenses (protected)
- `POST /api/expenses` - Create expense (protected)
- `GET /api/expenses/:id` - Get single expense (protected)
- `PUT /api/expenses/:id` - Update expense (protected)
- `DELETE /api/expenses/:id` - Delete expense (protected)
- `GET /api/expenses/summary` - Get expense summary (protected)

### Income
- `GET /api/income` - Get all income (protected)
- `POST /api/income` - Create income (protected)
- `GET /api/income/:id` - Get single income (protected)
- `PUT /api/income/:id` - Update income (protected)
- `DELETE /api/income/:id` - Delete income (protected)
- `GET /api/income/summary` - Get income summary (protected)

### User
- `PUT /api/user/profile` - Update profile (protected)
- `PUT /api/user/preferences` - Update preferences (protected)
- `PUT /api/user/currency` - Update currency (protected)

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click "Get Started" to create an account
3. Fill in your details and register
4. Login with your credentials
5. Start tracking your income and expenses!

## Pages

- **Landing Page**: Hero section with features and statistics
- **Signup Page**: User registration with form validation
- **Login Page**: User authentication with remember me option
- **Dashboard**: Financial overview with recent transactions
- **Income**: Track and manage income sources with category breakdown
- **Expenses**: Track and manage expenses with category breakdown
- **Analytics**: Visual charts and spending trends
- **Budgets**: Set and monitor budget limits per category
- **Settings**: Manage profile, notifications, security, and preferences

## Security Notes

- Change the `JWT_SECRET` in the backend `.env` file before production
- Use environment variables for sensitive configuration
- Implement rate limiting for API endpoints in production
- Add HTTPS in production
- Implement proper input validation and sanitization

## Future Enhancements

- Add real-time notifications
- Implement data export functionality
- Add more chart types in analytics
- Implement recurring transactions
- Add multi-currency support
- Implement receipt upload feature
- Add mobile app support

## License

ISC

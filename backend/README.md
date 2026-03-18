# Exotic Fruits Admin - Backend API

Phase 3 backend infrastructure built with Express.js, MySQL, Sequelize ORM, JWT authentication, Razorpay payment integration, and Cloudinary image uploads.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: MySQL 8 with Sequelize ORM
- **Authentication**: JWT (access + refresh tokens)
- **Payments**: Razorpay
- **Image Uploads**: Cloudinary + Multer
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate limiting

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| POST | /api/auth/refresh-token | Refresh access token |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/products | — | List products (paginated) |
| GET | /api/products/:id | — | Get single product |
| GET | /api/products/search?q= | — | Search products |
| GET | /api/products/category/:id | — | Filter by category |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/categories | — | List categories |
| GET | /api/categories/:id | — | Get category |
| POST | /api/categories | Admin | Create category |
| PUT | /api/categories/:id | Admin | Update category |
| DELETE | /api/categories/:id | Admin | Delete category |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/users/profile | User | Get profile |
| PUT | /api/users/profile | User | Update profile |
| PUT | /api/users/password | User | Change password |
| GET | /api/users | Admin | List all users |

### Cart
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/cart | User | Get cart |
| POST | /api/cart/add | User | Add item |
| PUT | /api/cart/:id | User | Update quantity |
| DELETE | /api/cart/:id | User | Remove item |
| DELETE | /api/cart/clear | User | Clear cart |

### Wishlist
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/wishlist | User | Get wishlist |
| POST | /api/wishlist/add | User | Add item |
| DELETE | /api/wishlist/:id | User | Remove item |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/orders | User | Get user orders |
| GET | /api/orders/:id | User | Get order details |
| POST | /api/orders | User | Create order from cart |
| PUT | /api/orders/:id | Admin | Update order status |
| GET | /api/orders/admin/all | Admin | Get all orders |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/payments/create-order | User | Create Razorpay order |
| POST | /api/payments/verify-payment | User | Verify payment |
| GET | /api/payments/:id | User | Get payment details |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/admin/dashboard | Admin | Dashboard stats |
| GET | /api/admin/products | Admin | Manage products |
| GET | /api/admin/orders | Admin | View all orders |
| GET | /api/admin/users | Admin | View all users |
| GET | /api/admin/analytics | Admin | Sales analytics |

## Response Format

### Success
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": []
  }
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database, JWT, Cloudinary, Razorpay config
│   ├── middleware/     # Auth, CORS, error handler, upload, validation
│   ├── routes/         # Express routers
│   ├── controllers/    # Request handlers
│   ├── models/         # Sequelize models + associations
│   ├── utils/          # Helpers, validators, error classes, responses
│   └── app.js          # Express app setup
├── .env.example
├── .gitignore
├── package.json
├── server.js           # Entry point
└── README.md
```

# 🚗 Vehicle Rental Platform

A full-stack vehicle rental platform built using the **MERN stack**, where customers can browse and rent vehicles, while vehicle owners can add, manage, update, and remove their vehicles.

The application implements **JWT-based authentication, role-based access control, vehicle management, booking management, booking cancellation, date validation, and prevention of overlapping bookings**.

---

## 📌 Features

### Customer Features

* Customer registration and login
* Browse available vehicles
* Search vehicles by name/model
* Filter vehicles by:

  * Vehicle type
  * Location
  * Maximum daily price
* View vehicle details
* Select rental start and end dates
* Check vehicle availability
* Rent a vehicle
* View personal bookings
* Automatic rental-day calculation
* Automatic total-cost calculation

### Owner Features

* Owner registration and login
* Add vehicles
* View own vehicles
* Update vehicle details
* Change vehicle availability
* Delete vehicles
* Vehicle ownership validation

### Authentication & Security

* JWT-based authentication
* JWT stored in HTTP-only cookies
* Bearer-token support in authentication middleware
* Password hashing using bcrypt
* Role-based access control
* Protected routes
* Owner/customer authorization
* Environment variables for secrets
* CORS configuration

### Booking Features

* Date validation
* Vehicle availability checking
* Prevention of overlapping bookings
* Automatic rental duration calculation
* Automatic rental cost calculation
* Booking cancellation using booking status
* Cancelled bookings do not block future bookings

---

# 🏗️ Project Architecture

The application follows a client-server architecture:

```text
                    React Frontend
                         │
                         │ REST API
                         ▼
                  Express.js Server
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
          Routes      Middleware   Controllers
                         │
                         ▼
                    Mongoose ODM
                         │
                         ▼
                    MongoDB Database
```

### Request Flow

For a protected owner API:

```text
POST /api/vehicles
       ↓
     protect
       ↓
authorizeRoles("owner")
       ↓
 createVehicle
       ↓
    Mongoose
       ↓
    MongoDB
```

---

# 🛠️ Technology Stack

## Frontend

| Technology       | Version | Purpose                |
| ---------------- | ------: | ---------------------- |
| React            |    19.x | Frontend UI            |
| Vite             |     7.x | Development/build tool |
| JavaScript       |    ES6+ | Application logic      |
| React Router DOM |     7.x | Client-side routing    |
| CSS              |    CSS3 | Styling                |

## Backend

| Technology |         Version | Purpose             |
| ---------- | --------------: | ------------------- |
| Node.js    |            22.x | JavaScript runtime  |
| Express.js |             5.x | Backend framework   |
| JavaScript | ES6+ / CommonJS | Backend development |
| Mongoose   |             8.x | MongoDB ODM         |

## Database

| Technology |             Version | Purpose  |
| ---------- | ------------------: | -------- |
| MongoDB    | 8.x / MongoDB Atlas | Database |

## Major Dependencies

| Dependency         | Purpose                      |
| ------------------ | ---------------------------- |
| `express`          | REST API and server          |
| `mongoose`         | MongoDB database interaction |
| `bcryptjs`         | Password hashing             |
| `jsonwebtoken`     | JWT authentication           |
| `cookie-parser`    | Reading cookies              |
| `cors`             | Cross-origin requests        |
| `dotenv`           | Environment variables        |
| `react-router-dom` | Frontend routing             |
| `react-hot-toast`  | User notifications           |

> **Note:** Exact installed versions should be verified from `package.json` and `package-lock.json` before submission.

---

# 📁 Project Structure

```text
Vehicle-Rental-Platform/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── VehicleDetails.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   │   ├── vehicleController.js
│   │   └── bookingController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   └── Booking.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   └── bookingRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── .env
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 💻 Environment Requirements

Before running the project, install:

* Node.js 22.x or compatible LTS version
* npm
* MongoDB 8.x or MongoDB Atlas
* Git
* Modern web browser
* VS Code or another code editor

Check installed versions:

```bash
node --version
npm --version
```

---

# ⚙️ Installation and Setup

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd Vehicle-Rental-Platform
```

---

# 🔵 Backend Setup

Open the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

---

## 2. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_strong_jwt_secret

NODE_ENV=development
```

### Environment Variables

| Variable     | Description                         |
| ------------ | ----------------------------------- |
| `PORT`       | Port used by Express server         |
| `MONGO_URI`  | MongoDB connection string           |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `NODE_ENV`   | Application environment             |

### Example

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/VehicleRentalDB
JWT_SECRET=vehicle_rental_secret_123
NODE_ENV=development
```

> Do not commit the real `.env` file to GitHub.

Add it to `.gitignore`:

```gitignore
.env
node_modules
```

---

# 🗄️ Database Setup

The application uses **MongoDB** with Mongoose.

Create a MongoDB Atlas cluster or run MongoDB locally.

The database connection is configured using:

```env
MONGO_URI=your_connection_string
```

The application contains three main collections:

```text
users
vehicles
bookings
```

---

## User Collection

A user contains:

```text
name
email
password
role
createdAt
updatedAt
```

The role can be:

```text
customer
owner
```

---

## Vehicle Collection

A vehicle contains:

```text
owner
name
description
images
type
registrationNumber
dailyPrice
location
isAvailable
features
createdAt
updatedAt
```

Vehicle types:

```text
Car
SUV
Bike
Van
```

---

## Booking Collection

A booking contains:

```text
customer
vehicle
startDate
endDate
totalDays
dailyPrice
totalCost
status
createdAt
updatedAt
```

Booking status:

```text
pending
confirmed
cancelled
```

---

# 🌱 Seed Sample Vehicles

The project includes a `seed.js` file for inserting sample vehicles.

First, make sure at least one user with the `owner` role exists.

Then run:

```bash
node seed.js
```

The seed script:

1. Connects to MongoDB
2. Finds an existing owner
3. Deletes existing vehicle records
4. Inserts sample vehicles

> **Important:** `deleteMany({})` removes all existing vehicles before inserting the seed data. Do not run the seed script if you need to preserve existing vehicle records.

---

# ▶️ Running the Backend

From the `server` directory:

```bash
node server.js
```

The server should start at:

```text
http://localhost:5000
```

The root endpoint can be tested at:

```text
http://localhost:5000/
```

Expected response:

```text
Backend is running
```

---

# 🟢 Frontend Setup

Open another terminal.

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will normally start the frontend at:

```text
http://localhost:5173
```

---

# 🔐 Authentication

The application uses **JWT authentication**.

## Registration Flow

```text
User
 ↓
Registration form
 ↓
POST /api/auth/register
 ↓
Validate input
 ↓
Check existing email
 ↓
Hash password using bcrypt
 ↓
Create user
 ↓
MongoDB
```

Passwords are never stored as plain text.

The password is hashed using:

```js
bcrypt.hash(password, 12)
```

---

# 🔑 Login Flow

```text
User enters email/password
          ↓
POST /api/auth/login
          ↓
Find user
          ↓
Compare password using bcrypt
          ↓
Generate JWT
          ↓
Store JWT in HTTP-only cookie
```

JWT contains:

```js
{
  userId: user._id,
  role: user.role
}
```

The token expires after the configured period.

---

# 🛡️ Authentication Middleware

Protected requests pass through the `protect` middleware.

The middleware supports:

### HTTP-only Cookie

```text
Cookie: token=<JWT>
```

### Bearer Token

```text
Authorization: Bearer <JWT>
```

The middleware:

1. Gets the token
2. Verifies the JWT
3. Extracts the user ID and role
4. Stores them in `req.user`
5. Calls `next()`

Example:

```js
req.user = {
  userId: decoded.userId,
  role: decoded.role
};
```

---

# 👥 Role-Based Access Control

The application has two roles:

```text
customer
owner
```

Authentication answers:

> Who are you?

Authorization answers:

> Are you allowed to perform this operation?

For example:

```js
router.post(
  "/",
  protect,
  authorizeRoles("owner"),
  createVehicle
);
```

The request passes through:

```text
protect
   ↓
Is user authenticated?
   ↓
authorizeRoles("owner")
   ↓
Is user an owner?
   ↓
createVehicle()
```

A customer trying to add a vehicle receives:

```text
403 Access denied
```

---

# 📡 API Documentation

Base URL:

```text
http://localhost:5000/api
```

---

## Authentication APIs

### Register

```http
POST /auth/register
```

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

Allowed roles:

```text
customer
owner
```

---

### Login

```http
POST /auth/login
```

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

On successful login, the server creates an HTTP-only JWT cookie.

---

### Logout

```http
POST /auth/logout
```

Clears the authentication cookie.

---

# 🚙 Vehicle APIs

## Get Available Vehicles

```http
GET /vehicles
```

Authentication:

```text
Not required
```

Returns available vehicles.

---

## Add Vehicle

```http
POST /vehicles
```

Authentication:

```text
Required
```

Role:

```text
owner
```

Example:

```json
{
  "name": "Honda City",
  "description": "Comfortable sedan",
  "type": "Car",
  "registrationNumber": "UP70AB1234",
  "dailyPrice": 2200,
  "location": "Prayagraj",
  "features": {
    "automatic": true,
    "airConditioning": true,
    "gps": true,
    "seats": 5,
    "bluetooth": true
  }
}
```

The owner ID is taken from the authenticated JWT:

```js
owner: req.user.userId
```

The frontend does not decide who owns the vehicle.

---

## Get Owner's Vehicles

```http
GET /vehicles/my
```

Authentication:

```text
Required
```

Role:

```text
owner
```

Returns vehicles belonging to the logged-in owner.

---

## Get Vehicle Details

```http
GET /vehicles/:id
```

Authentication:

```text
Required
```

Returns details of a specific vehicle.

---

## Update Vehicle

```http
PUT /vehicles/:id
```

Authentication:

```text
Required
```

Role:

```text
owner
```

Only the vehicle owner can update the vehicle.

---

## Change Vehicle Availability

```http
PATCH /vehicles/:id/availability
```

Authentication:

```text
Required
```

Role:

```text
owner
```

---

## Delete Vehicle

```http
DELETE /vehicles/:id
```

Authentication:

```text
Required
```

Role:

```text
owner
```

The application checks vehicle ownership before deletion.

---

# 📅 Booking APIs

## Check Availability

```http
POST /bookings/availability
```

Authentication:

```text
Required
```

Role:

```text
customer
```

Request:

```json
{
  "vehicleId": "VEHICLE_ID",
  "startDate": "2026-10-10",
  "endDate": "2026-10-13"
}
```

---

## Create Booking

```http
POST /bookings
```

Authentication:

```text
Required
```

Role:

```text
customer
```

Request:

```json
{
  "vehicleId": "VEHICLE_ID",
  "startDate": "2026-10-10",
  "endDate": "2026-10-13"
}
```

The server calculates:

```text
totalDays
totalCost
```

The client does not control these final values.

---

## Get My Bookings

```http
GET /bookings/my
```

Authentication:

```text
Required
```

Role:

```text
customer
```

Returns bookings belonging to the logged-in customer.

---

## Cancel Booking

```http
PATCH /bookings/:id/cancel
```

Authentication:

```text
Required
```

Role:

```text
customer
```

Instead of deleting the booking, the status is changed:

```text
confirmed
     ↓
cancelled
```

This preserves booking history.

---

# 📐 Booking Calculation

Rental duration is calculated using the difference between the selected dates.

```js
const millisecondsPerDay =
  1000 * 60 * 60 * 24;

const totalDays = Math.ceil(
  (end - start) / millisecondsPerDay
);
```

For example:

```text
Start: 10 October
End:   13 October

Difference = 3 days

totalDays = 3
```

Total cost:

```js
const totalCost =
  totalDays * vehicle.dailyPrice;
```

If:

```text
totalDays = 3
dailyPrice = ₹2200
```

Then:

```text
totalCost = 3 × 2200
          = ₹6600
```

---

# 🚫 Preventing Double Booking

The application prevents overlapping active bookings.

The query checks:

```js
const overlappingBooking = await Booking.findOne({
  vehicle: vehicleId,

  status: {
    $in: ["pending", "confirmed"]
  },

  startDate: {
    $lte: end
  },

  endDate: {
    $gte: start
  }
});
```

The conditions mean:

```text
Existing booking starts before/equal to
the requested booking's end date

AND

Existing booking ends after/equal to
the requested booking's start date
```

If a matching booking exists:

```text
Vehicle is already booked
```

and the new booking is rejected.

Cancelled bookings are not included because:

```js
$in: ["pending", "confirmed"]
```

does not include:

```text
cancelled
```

---

# 🔎 MongoDB/Mongoose Operations Used

The project uses several common Mongoose operations.

| Operation             | Usage                                 |
| --------------------- | ------------------------------------- |
| `findOne()`           | Find one user/booking                 |
| `findById()`          | Find vehicle by ID                    |
| `find()`              | Retrieve vehicles/bookings            |
| `create()`            | Create users, vehicles and bookings   |
| `findByIdAndUpdate()` | Update vehicle                        |
| `findByIdAndDelete()` | Delete vehicle                        |
| `deleteMany()`        | Reset seed vehicles                   |
| `insertMany()`        | Insert sample vehicles                |
| `populate()`          | Retrieve referenced user/vehicle data |
| `sort()`              | Sort records                          |
| `countDocuments()`    | Count records for pagination          |
| `skip()`              | Pagination                            |
| `limit()`             | Pagination                            |

MongoDB operators used/important to the application include:

```text
$in
$lte
$gte
$or
$regex
$set
```

---

# 🔗 Database Relationships

The application uses MongoDB references.

A vehicle stores the owner ID:

```js
owner: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}
```

A booking stores:

```js
customer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},

vehicle: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Vehicle"
}
```

This creates relationships:

```text
User
 │
 ├──────────────► Vehicle
 │                  │
 │                  └──────────► Booking
 │
 └────────────────────────────► Booking
```

`populate()` is used to retrieve related documents.

Example:

```js
.populate("owner", "name email")
```

---

# 🌐 CORS Configuration

The backend allows requests from the React development server:

```text
http://localhost:5173
```

Credentials are enabled because authentication uses cookies.

Example:

```js
cors({
  origin: "http://localhost:5173",
  credentials: true
})
```

Frontend requests to protected APIs use:

```js
credentials: "include"
```

This allows the browser to send the authentication cookie.

---

# 🔐 Sample Credentials

For testing, create users through the registration page.

### Customer

```text
Name: Test Customer
Email: customer@example.com
Password: Customer@123
Role: customer
```

### Owner

```text
Name: Test Owner
Email: owner@example.com
Password: Owner@123
Role: owner
```

> These are sample development credentials only. They must not be used for production.

---

# 🧪 Testing Flow

A basic testing sequence is:

### 1. Register an owner

```text
Register → owner
```

### 2. Login as owner

```text
Login → Owner Dashboard
```

### 3. Add a vehicle

```text
Owner Dashboard
      ↓
Add Vehicle
```

### 4. Logout

```text
Logout
```

### 5. Register/login as customer

```text
Login → Customer Home
```

### 6. Browse vehicles

```text
Home
 ↓
Vehicle Details
```

### 7. Select dates

```text
10 Oct → 13 Oct
```

### 8. Check availability

```text
Available
 ↓
Confirm rental
```

### 9. View booking

```text
My Bookings
```

### 10. Cancel booking

```text
Cancel Booking
 ↓
status = cancelled
```

---

# 🧩 Assumptions Made During Development

The following assumptions were made for this version of the application:

1. The application is intended as a vehicle-rental MVP and does not implement real online payments.
2. Booking confirmation is performed immediately after successful availability checking.
3. Rental duration is calculated using the difference between the selected start and end dates.
4. The end date must be after the start date.
5. A vehicle cannot have overlapping `pending` or `confirmed` bookings.
6. Cancelled bookings remain in the database for booking history.
7. Cancelled bookings do not prevent another customer from booking the vehicle.
8. Each vehicle belongs to one owner.
9. Each booking belongs to one customer and one vehicle.
10. Only authenticated customers can create and cancel bookings.
11. Only authenticated owners can add, update, change availability, or delete vehicles.
12. The backend determines the authenticated user's ID from the verified JWT rather than trusting a user ID sent by the frontend.
13. Images are represented as URLs in the current MVP.
14. Frontend filtering is performed on the fetched vehicle list. Backend filtering and pagination can be added for larger datasets.
15. The application is currently configured for local development using `localhost`.
16. Production deployment requires updating CORS, cookie settings, environment variables, and frontend/backend URLs.
17. No payment gateway, email notification system, admin panel, or advanced availability calendar is included in the current version.

---

# 🚀 Future Improvements

Possible future enhancements include:

* Online payment integration
* Admin dashboard
* Email/SMS booking notifications
* Advanced search and filtering
* Backend pagination
* Vehicle image upload using Cloudinary
* Reviews and ratings
* Owner booking management
* Booking history
* Password reset
* Refresh-token authentication
* Deployment using production infrastructure
* Automated testing
* Rate limiting
* API documentation using Swagger/OpenAPI

---

# 🛡️ Security Considerations

The project implements several security practices:

* Passwords are hashed using bcrypt.
* JWT is stored in an HTTP-only cookie.
* Protected APIs verify JWTs.
* Role-based authorization prevents unauthorized operations.
* Vehicle ownership is checked before modification/deletion.
* Sensitive configuration is stored in environment variables.
* Frontend-provided owner IDs are not trusted.
* Invalid/expired JWTs return HTTP 401.
* Unauthorized roles return HTTP 403.

---

# 📊 HTTP Status Codes Used

| Status | Meaning      | Example                               |
| -----: | ------------ | ------------------------------------- |
|  `200` | Success      | Vehicle retrieved                     |
|  `201` | Created      | Registration/booking/vehicle creation |
|  `400` | Bad Request  | Invalid input/date                    |
|  `401` | Unauthorized | Missing/invalid JWT                   |
|  `403` | Forbidden    | Wrong role                            |
|  `404` | Not Found    | Vehicle/booking not found             |
|  `500` | Server Error | Unexpected backend error              |

---

# 📝 Development Notes

The backend follows a modular structure:

```text
Routes
  ↓
Middleware
  ↓
Controllers
  ↓
Models
  ↓
MongoDB
```

This separation makes the application easier to:

* Maintain
* Debug
* Test
* Extend
* Explain during technical interviews

---

# 👩‍💻 Author

**Alka Tripathi**

B.Tech – Computer Science and Engineering
United Institute of Technology, Prayagraj

---

# 📄 License

This project was developed for educational, portfolio, and demonstration purposes.

# HelpMe.ba

**HelpMe.ba** is a web application that connects users who need help with users who can provide services. Users can create jobs, send and receive offers, manage their jobs, and communicate with other users. The application also includes an administrator panel for managing users, jobs, categories, and reports.

The application supports two main user roles: **User** and **Administrator**, each with specific functionalities and access permissions.

## Features

### User

Users can:

* Register and manage their profile
* Create and manage jobs
* Browse jobs by category
* Send offers for available jobs
* Receive offers for their jobs
* Accept or reject received offers
* View sent offers
* Track the status of their offers
* View job details
* Receive notifications
* Report other users

### Administrator

Administrators can:

* View and manage users
* Block and unblock users
* Delete users
* Create, update, and delete job categories
* View and manage jobs
* Review user reports
* Block users based on reports
* Delete inappropriate jobs

## Technologies

* **Backend:** Node.js, Express
* **Frontend:** React, Bootstrap
* **Database:** PostgreSQL
* **Authentication:** JWT, HTTP-only Cookies
* **Password Security:** bcrypt
* **API Communication:** Axios
* **Validation:** Joi
* **Development Tools:** Git, GitHub, Postman
* **Architecture:** Controllers, Services, Repositories and Middleware

## Project Structure

```text
HELP-ME.BA/
│
├── backend/                              # Backend Node.js application
│   ├── src/
│   │   ├── config/                       # Configuration files
│   │   │   └── database.js              # PostgreSQL database connection
│   │   │
│   │   ├── controllers/                  # Request handlers
│   │   │   ├── admin/                    # Administrator controllers
│   │   │   ├── user/                     # User controllers
│   │   │   └── auth/                     # Authentication controllers
│   │   │
│   │   ├── middlewares/                  # Authentication and validation
│   │   │
│   │   ├── repositories/                 # Database query layer
│   │   │   ├── admin/                    # Administrator queries
│   │   │   ├── user/                     # User queries
│   │   │   └── auth/                     # Authentication queries
│   │   │
│   │   ├── routes/                       # API route definitions
│   │   │   ├── admin/                    # Administrator endpoints
│   │   │   ├── user/                     # User endpoints
│   │   │   └── auth/                     # Authentication endpoints
│   │   │
│   │   ├── services/                     # Business logic
│   │   │   ├── admin/                    # Administrator services
│   │   │   ├── user/                     # User services
│   │   │   └── auth/                     # Authentication services
│   │   │
│   │   ├── utils/                        # Shared helper functions
│   │   └── app.js                        # Express application setup
│   │
│   ├── .env                              # Environment variables
│   ├── .gitignore                        # Git ignore rules
│   ├── eslint.config.mjs                 # ESLint configuration
│   ├── package.json                      # Backend dependencies
│   └── package-lock.json
│
├── frontend/                             # React frontend application
│   ├── src/
│   │   ├── assets/                       # Static assets
│   │   │
│   │   ├── components/
│   │   │   └── common/                   # Shared components
│   │   │       ├── Footer.jsx
│   │   │       └── Navbar.jsx
│   │   │
│   │   ├── context/                      # React context
│   │   │   └── AuthContext.jsx            # Authentication state
│   │   │
│   │   ├── hooks/                        # Custom React hooks
│   │   │   └── useAuth.js                # Authentication hook
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/                    # Administrator pages
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminCategory.jsx
│   │   │   │   ├── AdminJobs.jsx
│   │   │   │   ├── AdminReports.jsx
│   │   │   │   └── AdminUsers.jsx
│   │   │   │
│   │   │   ├── home/                     # Homepage
│   │   │   │   └── Home.jsx
│   │   │   │
│   │   │   ├── notifications/            # Notifications
│   │   │   │   └── NotificationsModal.jsx
│   │   │   │
│   │   │   └── user/                     # User pages
│   │   │       ├── jobs/
│   │   │       │   └── MyJobs.jsx
│   │   │       │
│   │   │       └── offers/
│   │   │           ├── AcceptOfferModal.jsx
│   │   │           ├── MyOffers.jsx
│   │   │           ├── OffersModal.jsx
│   │   │           └── RejectOfferModal.jsx
│   │   │
│   │   ├── routes/                       # React routes
│   │   ├── services/                     # API service functions
│   │   ├── utils/                        # Frontend helper functions
│   │   ├── App.jsx                       # Main application component
│   │   ├── index.css                     # Global styles
│   │   └── main.jsx                      # React entry point
│   │
│   ├── package.json                      # Frontend dependencies
│   └── package-lock.json
│
└── README.md
```

## API Endpoints

### Authentication

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| POST   | `/helpme.ba/signup` | Registers a new user      |
| POST   | `/helpme.ba/login`  | Authenticates a user      |
| POST   | `/helpme.ba/logout` | Logs out the current user |

---

### User Endpoints

| Method | Endpoint                               | Description                               |
| ------ | -------------------------------------- | ----------------------------------------- |
| GET    | `/helpme.ba/user/jobs`                 | Retrieves the current user's jobs         |
| POST   | `/helpme.ba/user/jobs`                 | Creates a new job                         |
| PUT    | `/helpme.ba/user/jobs/:id`             | Updates a user's job                      |
| DELETE | `/helpme.ba/user/jobs/:id`             | Deletes a user's job                      |
| GET    | `/helpme.ba/user/offers`               | Retrieves offers sent by the current user |
| GET    | `/helpme.ba/user/jobs/:id/offers`      | Retrieves offers received for a job       |
| PATCH  | `/helpme.ba/user/offers/:id/accept`    | Accepts an offer                          |
| PATCH  | `/helpme.ba/user/offers/:id/reject`    | Rejects an offer                          |
| DELETE | `/helpme.ba/user/offers/:id`           | Deletes an offer                          |
| GET    | `/helpme.ba/categories`                | Retrieves available job categories        |
| GET    | `/helpme.ba/jobs/category/:categoryId` | Retrieves jobs by category                |

---

### Administrator Endpoints

| Method | Endpoint                             | Description              |
| ------ | ------------------------------------ | ------------------------ |
| GET    | `/helpme.ba/admin/users`             | Retrieves all users      |
| PATCH  | `/helpme.ba/admin/users/block/:id`   | Blocks a user            |
| PATCH  | `/helpme.ba/admin/users/unblock/:id` | Unblocks a user          |
| DELETE | `/helpme.ba/admin/users/:id`         | Deletes a user           |
| GET    | `/helpme.ba/admin/jobs`              | Retrieves all jobs       |
| DELETE | `/helpme.ba/admin/jobs/:id`          | Deletes a job            |
| GET    | `/helpme.ba/admin/categories`        | Retrieves all categories |
| POST   | `/helpme.ba/admin/categories`        | Creates a category       |
| PUT    | `/helpme.ba/admin/categories/:id`    | Updates a category       |
| DELETE | `/helpme.ba/admin/categories/:id`    | Deletes a category       |
| GET    | `/helpme.ba/admin/reports`           | Retrieves user reports   |

## Database

The application uses **PostgreSQL** as its primary database.

Main tables include:

* `users_db` - Stores user accounts and profile information
* `categories` - Stores job categories
* `jobs` - Stores user-created jobs
* `offers` - Stores offers submitted for jobs
* `report_reasons` - Stores available report reasons
* `reports_helpme` - Stores user reports
* `blocked_users` - Stores information about blocked users

## Authentication and Security

The application uses JWT-based authentication with HTTP-only cookies.

After successful login, the server stores the JWT token in an HTTP-only cookie named `token`. Protected routes use JWT middleware to verify the authenticated user.

Passwords are securely hashed using **bcrypt** before being stored in the database.

Role-based access control is used to restrict administrator functionality to users with the `ADMIN` role.

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Create a `.env` file in the backend directory and add the required environment variables:

```env
PORT=3001
DATABASE_URL=postgres://username:password@localhost:5432/helpme
TOKEN_CODE=your_secret_key
```

4. Install frontend dependencies:

```bash
cd frontend
npm install
```

5. Start the backend server:

```bash
npm start
```

6. Start the frontend development server:

```bash
npm run dev
```

7. Open the application in your browser.

## Application Usage

* Register a new account or log in with an existing account.
* Create jobs by providing information such as category, description, budget, deadline, and location.
* Browse available jobs and send offers to job owners.
* Review received offers for your jobs.
* Accept or reject received offers.
* Manage your own jobs and sent offers.
* Administrators can manage users, categories, jobs, and reports through the administrator panel.
* Report users when necessary.

## Future Improvements

* Real-time messaging between users
* User profile pages
* User ratings and reviews
* Improved notification system
* Job status tracking
* Advanced job search and filtering
* Service listings on user profiles
* Improved administrator statistics
* Image uploads for user profiles and jobs

## Author

Emir Babačić

## Licence

This project was developed as a web application project and can be used and modified according to the user's needs.

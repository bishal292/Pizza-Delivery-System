# Pizza Delivery System 🍕

# Api Documentation

## Project Directory Structure
```
Pizza-Delivery-System/Server/
├── Controllers/
│   ├── Admin/
│   │   └── AdminAuthController.js
│   │   └── AdminMiscController.js
│   ├── User/
│   │   └── userAuthController.js
├── Middlewares/
│   └── AuthMiddleware.js
├── Routes/
│   ├── Admin/
│   │   └── AdminRoutes.js
│   │   └── adminAuthRouteHandler.js
│   ├── User/
│   │   └── UserRoutes.js
│   │   └── userAuthRoutesHandler.js
├── db/
│   └── models/
│       └── AdminModel.js
│       └── UserModel.js
├── utils/
│   └── util-functions.js
└── README.md
```

## API Endpoints

### User Authentication

#### Sign Up
- **URL:** `/api/v1/user/auth/signup`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "User Account Created Successfully",
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "user"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "Please provide all fields"
    }
    ```
    ```json
    {
      "message": "Entered Email is not valid, Please provide a valid email"
    }
    ```
    ```json
    {
      "message": "User already exists with this email, Please login, or use another email for signup."
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

#### Log In
- **URL:** `/api/v1/user/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Logged in as User successfully",
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "user"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "Please provide email and password"
    }
    ```
    ```json
    {
      "message": "Please provide a valid email"
    }
    ```
  - **401 Unauthorized:**
    ```json
    {
      "message": "No User Exists with this email"
    }
    ```
    ```json
    {
      "message": "Invalid Credentials"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

#### Log Out (Protected)
- **URL:** `/api/v1/user/auth/logout`
- **Method:** `GET`
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Logged Out Successfully"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "You are not logged in"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

#### Change Password (Protected)
- **URL:** `/api/v1/user/auth/changepassword`
- **Method:** `PATCH`
- **Request Body:**
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Password Changed Successfully"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "You are not logged in"
    }
    ```
    ```json
    {
      "message": "Please provide old and new password"
    }
    ```
    ```json
    {
      "message": "Old and New Passwords Cannot be same."
    }
    ```
  - **401 Unauthorized:**
    ```json
    {
      "message": "Old Password did not match"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

#### Forgot Password
- **URL:** `/api/v1/user/auth/forgotpassword`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Reset Password Link Sent to your email, please check your email"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "Please provide email"
    }
    ```
    ```json
    {
      "message": "Entered Email is not valid, Please provide a valid email"
    }
    ```
    ```json
    {
      "message": "User not found with this email please provide a valid email"
    }
    ```
    ```json
    {
      "message": "Password Reset OTP is already sent to your email , Please check your email"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```
    ```json
    {
      "message": "Error in sending email, Please try again later"
    }
    ```

#### Reset Password
- **URL:** `/api/v1/user/auth/resetpassword`
- **Method:** `PATCH`
- **Request Body:**
  ```json
  {
    "email": "string",
    "otp": "string",
    "password": "string",
    "confirmPassword": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Password Reset Successful! You are logged in.",
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "user"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "Please provide email, OTP, password and confirm password"
    }
    ```
    ```json
    {
      "message": "Entered Email is not valid, Please provide a valid email"
    }
    ```
    ```json
    {
      "message": "User not found with this email please provide a valid email"
    }
    ```
    ```json
    {
      "message": "Invalid or Expired OTP, Please try again"
    }
    ```
    ```json
    {
      "message": "Invalid OTP, Please try again"
    }
    ```
    ```json
    {
      "message": "Password and Confirm Password must be same."
    }
    ```
    ```json
    {
      "message": "New Password cannot be same as old password"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

#### Get User Info (Protected)
- **URL:** `/api/v1/user/auth/user-info`
- **Method:** `GET`
- **Responses:**
  - **200 OK:**
    ```json
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "user"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "You are not Authenticated, Try logging in or signing up"
    }
    ```
    ```json
    {
      "message": "User not found"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

### Admin Authentication

#### Sign Up
- **URL:** `/api/v1/admin/auth/signup`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "secretKey": "string"
  }
  ```
- **Responses:**
  - **201 Created:**
    ```json
    {
      "message": "Admin Created Successfully",
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "admin"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "Please provide all fields"
    }
    ```
    ```json
    {
      "message": "Entered Email is not valid, Please provide a valid email"
    }
    ```
    ```json
    {
      "message": "User already exists with this email, Please login, or use another email for signup."
    }
    ```
  - **401 Unauthorized:**
    ```json
    {
      "message": "Invalid Secret Key"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

#### Log In
- **URL:** `/api/v1/admin/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Logged In as Admin",
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "admin"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "Please provide email and password"
    }
    ```
    ```json
    {
      "message": "Please provide a valid email"
    }
    ```
  - **401 Unauthorized:**
    ```json
    {
      "message": "No User Exists with this email"
    }
    ```
    ```json
    {
      "message": "Invalid Credentials"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

#### Log Out (Protected)
- **URL:** `/api/v1/admin/auth/logout`
- **Method:** `GET`
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Logged Out Successfully"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "You are not logged in"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

#### Change Password (Protected)
- **URL:** `/api/v1/admin/auth/changepassword`
- **Method:** `PATCH`
- **Request Body:**
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Password Changed Successfully"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "You are not logged in"
    }
    ```
    ```json
    {
      "message": "Please provide old and new password"
    }
    ```
    ```json
    {
      "message": "Old and New Passwords Cannot be same."
    }
    ```
  - **401 Unauthorized:**
    ```json
    {
      "message": "Old Password did not match"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

#### Forgot Password
- **URL:** `/api/v1/admin/auth/forgotpassword`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Reset Password OTP Sent to your email, please check your email"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "Please provide email"
    }
    ```
    ```json
    {
      "message": "Entered Email is not valid, Please provide a valid email"
    }
    ```
    ```json
    {
      "message": "User not found with this email please provide a valid email"
    }
    ```
    ```json
    {
      "message": "Password Reset OTP is already sent to your email , Please check your email"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```
    ```json
    {
      "message": "Error in sending email, Please try again later"
    }
    ```

#### Reset Password
- **URL:** `/api/v1/admin/auth/resetpassword`
- **Method:** `PATCH`
- **Request Body:**
  ```json
  {
    "email": "string",
    "otp": "string",
    "password": "string",
    "confirmPassword": "string"
  }
  ```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "message": "Password Reset Successfully!, And logged in as Admin",
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "admin"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "Invalid or Expired OTP, Please try again"
    }
    ```
    ```json
    {
      "message": "Please provide email, OTP, password and confirm password"
    }
    ```
    ```json
    {
      "message": "Entered Email is not valid, Please provide a valid email"
    }
    ```
    ```json
    {
      "message": "User not found with this email please provide a valid email"
    }
    ```
    ```json
    {
      "message": "Invalid OTP, Please try again"
    }
    ```
    ```json
    {
      "message": "Password and Confirm Password must be same."
    }
    ```
    ```json
    {
      "message": "New Password cannot be same as old password"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```

#### Get Admin Info (Protected)
- **URL:** `/api/v1/admin/auth/admin-info`
- **Method:** `GET`
- **Responses:**
  - **200 OK:**
    ```json
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": "admin"
    }
    ```
  - **400 Bad Request:**
    ```json
    {
      "message": "You are not Authenticated, Try logging in or signing up"
    }
    ```
    ```json
    {
      "message": "User not found"
    }
    ```
  - **500 Internal Server Error:**
    ```json
    {
      "message": "Internal Server Error"
    }
    ```


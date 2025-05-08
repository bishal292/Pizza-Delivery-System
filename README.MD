# 🍕 Pizza Ordering & Inventory Management System (MERN Stack)

This is a full-stack pizza delivery application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It allows users to customize and order pizzas while providing an admin panel to manage inventory, users, pizzas, and orders.

---

## 🔗 Live Demo

> 🚀 Deployed at: [yet to be deployed]()

---
## 📸 Snapshots

### 🔐 AUTH

- ![User Login](snapshots/userAuth.png) — User login screen
- ![User Signup](snapshots/userAuthSignup.png) — User registration/signup form
- ![Forgot Password](snapshots/userauthforgot.png) — Forgot password page with OTP request
- ![Reset Password](snapshots/userauthreset.png) — Reset password using OTP screen
- ![User Password Reset](snapshots/UserResetPass.png) — Password reset confirmation screen
- ![Admin Signup](snapshots/adminSighnup.png) — Admin signup screen(Requires Admin Secret Key To signup)
- ![OTP Mail Received](snapshots/MailTrapReceivedOtp.png) — OTP received in email inbox (MailTrap)

### 🧑‍💼 ADMIN

- ![Admin Dashboard Overview](snapshots/AdminDashboard1.png) — Admin dashboard with KPIs and charts
- ![Admin Revenue Chart](snapshots/AdminDashboard2.png) — Revenue and order analytics graph
- ![Add New Pizza](snapshots/AdminAddnewPizz.png) — Form to create new pizza option
- ![Update Existing Pizza](snapshots/AdminUpdatePizza.png) — Form to update existing pizza
- ![Pizza List](snapshots/AdminPizzaList.png) — List of all available pizzas
- ![Delete Pizza Confirmation](snapshots/AdminDeletePizzaConfirm.png) — Confirm pizza delete modal
- ![Add New Inventory Item](snapshots/AdminAdd_new_Inv_item.png) — Add new inventory item to stock
- ![User List](snapshots/AdminUsersList.png) — View all registered users
- ![Edit User](snapshots/AdminEditUser.png) — Admin can edit user details
- ![Search User](snapshots/AdminSearchUser.png) — Search user by name or email
- ![View Orders](snapshots/Admin_Viewing_Orders.png) — All user orders for review
- ![Order Details By ID](snapshots/AdminOrderdetailsWithId.png) — View detailed order with specific ID
- ![User Cart View](snapshots/AdminUserCart.png) — View specific user’s cart
- ![User Orders Overview](snapshots/AdminUserOrdersList.png) — View list of orders placed by a user

### 🧑 USER

- ![User Landing Page](snapshots/UserLandingPage.png) — Public landing page for users
- ![Home Page Listing](snapshots/UserHomePageListingPizzas.png) — Displaying all available pizzas
- ![Customize Pizza](snapshots/UserCustomizingPizza.png) — User customizing pizza ingredients
- ![User Cart](snapshots/UserViewingCart.png) — User’s cart with pizzas and quantities
- ![Confirm Order](snapshots/UserConfirmOrder.png) — Final confirmation before placing order
- ![Cancel Order With Payment](snapshots/UserCancelOrderWithPayment.png) — Order cancelled after payment
- ![Cancel Order Without Payment](snapshots/userCancelOrderWithoutPayment.png) — Cancelled before payment
- ![Order Payment Page](snapshots/OrderPaymentScreen.png) — Razorpay payment integration
- ![Payment Verified](snapshots/OrderPaymentVerified.png) — Razorpay payment success confirmation
- ![User Orders List](snapshots/UserViewingOrders.png) — Past orders with status and details


## ⚒️ Tech Stack

### **Frontend**

* React.js (with Tailwind CSS / Material UI)
* Axios
* React Router
* Zustand (for cart & user session)
* Razorpay (Payment Gateway)

### **Backend**

* Node.js
* Express.js
* MongoDB with Mongoose
* Nodemailer (for OTP-based password reset & email verification)
* JWT + Cookies for authentication/session

---

## 📂 Project Structure

```

/Admin           # React frontend for Admin Pages
/Client          # React frontend for Client(Users)
/Server          # Express backend
```

---

## ⚙️ Features

### 👨‍🍳 Admin Panel

* 🔧 Manage ingredients, baseType And Size  (create, update, delete, stock, threshold)
* 🍕 Manage pizzas (create,delete,update including customizing with size, crust, sauce, cheese, toppings,availability)
* 🛒 View & manage orders (update status: placed → Preparing → prepared → Completed | Cancelled)

* 📊 Analytics dashboard with:

  * Today's orders & revenue
  * Total orders, users, pizzas
  * Order status distribution pie chart
  * Revenue over time (line chart)
  * 🔔Low Stock Item Alert

### 👨‍🍽️ User Panel

* 🔐 Register/Login (reset with OTP verification)
* 🫐 Customize your pizza
* 🛍️ Add to cart & checkout
* 💳 Pay securely via Razorpay
* 📬 Track order status live

---

## 🍕 Some Demo Pizza Customization Options

* **Size**: Regular, Medium, Large, Extra Large, Monster
* **Base**: Thin crust, Hand-tossed, Cheese burst, 100% wheat, New York-style
* **Sauce**: Tomato, Alfredo, Pesto, BBQ, Spicy Arrabbiata
* **Cheese**: Mozzarella, Cheddar, Parmesan, Goat Cheese, Blue Cheese
* **Toppings**:

  * **Veg**: Paneer, Mushroom, Onion, Olive, Jalapeño, Tomato, Capsicum
  * **Non-Veg**: Chicken Tikka, Sausage, Pepperoni, Chicken Keema, BBQ Chicken

Pricing is dynamically calculated based on selected options(Effective on public page only).

---

## 🔐 Authentication

* Users register andusing thier email.
* Admin can register using thier email along with the admin secret key.
* Forgot password flow uses OTP verification to reset Password.
* Sessions are cookie-based with 3-day expiry.

---

## 📦 Inventory Management

* Stock decreases automatically upon order status update(Decreases on placed and increases on cancellation.)
* Threshold alerts trigger email to admin when stock is low

---

## 📊 Admin Analytics

* Total orders, users, pizzas
* Today's revenue & orders
* Pie chart for order status Distributions.
* Line chart for revenue trend over the time period.
* List of most valuable users by most order count.

---

## 🧪 How to Run Locally

### Clone the Repo

```bash
git clone https://github.com/bishal292/Pizza-Delivery-System.git
cd pizza-delivery-system
```

### Setup Backend

```bash
cd Server
npm install
cp .env.example .env     # Fill in Mongo URI, JWT secret, email credentials and other required details as guided in the .env.example
npm run dev
```

### Setup Frontend
#### Client

```bash
cd Client
npm install
cp .env.example .env    # Fill in required environment Variables as guided in the .env.example
npm run dev
```
#### Admin

```bash
cd Admin
npm install
cp .env.example .env     # Fill in required environment Variables as guided in the .env.example
npm run dev
```

---

## 👨‍💻 Author

**Bishal Singh**
[LinkedIn](https://linkedin.com/in/bishal-singh292/) | [GitHub](https://github.com/bishal292)

---

## 📍 License

[MIT License](./LICENCE)

---

## 💬 Feedback

Have suggestions or feature requests? Feel free to open issues or reach out!

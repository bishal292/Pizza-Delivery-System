# Pizza Delivery System 🍕

## Front - End
## Directory Structure

```
client/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── button.jsx
│   │       ├── input.jsx
│   │       ├── tabs.jsx
│   │       └── ...
│   ├── pages/
│   │   ├── AdminPages/
│   │   │   ├── AdminAuth.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminInventory.jsx
│   │   │   └── AdminProfile.jsx
│   │   ├── UserPages/
│   │   │   ├── UserAuth.jsx
│   │   │   ├── UserCart.jsx
│   │   │   ├── UserHome.jsx
│   │   │   └── UserProfile.jsx
│   │   ├── AdminLayout.jsx
│   │   └── UserLayout.jsx
│   ├── Store/
│   │   └── store.js
│   ├── utils/
│   │   ├── api-client.js
│   │   └── constant.js
│   ├── App.jsx
│   ├── index.jsx
│   └── ...
└── ...
```

## Routing Details

### User Routes

- `/user/home` - UserHome component
- `/user/profile` - UserProfile component
- `/user/cart` - UserCart component
- `/user/auth/login` - UserAuth component with login action
- `/user/auth/signup` - UserAuth component with signup action
- `/user/auth/forgot` - UserAuth component with forgot password action
- `/user/auth/resetPassword` - UserAuth component with reset password action

### Admin Routes

- `/admin/dashboard` - AdminDashboard component
- `/admin/profile` - AdminProfile component
- `/admin/inventory` - AdminInventory component
- `/admin/auth/login` - AdminAuth component with login action
- `/admin/auth/signup` - AdminAuth component with signup action

### Layouts

- `UserLayout` - Layout for user pages
- `AdminLayout` - Layout for admin pages

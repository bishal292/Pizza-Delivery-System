export const HOST = import.meta.env.VITE_HOST
const baseRoute = `${HOST}/api/v1`

export const GET_LOGGED_USER_INFO = `${baseRoute}/auth/get-user-info`

// ADMIN ROUTES
// ADMIN AUTH - ROUTES
const AdminAuth = `${baseRoute}/admin/auth`
export const ADMIN_AUTH_LOGIN = `${AdminAuth}/login`
export const ADMIN_AUTH_SIGNUP = `${AdminAuth}/signup`
export const ADMIN_AUTH_LOGOUT = `${AdminAuth}/logout`
export const ADMIN_AUTH_FORGOT_PASS = `${AdminAuth}/forgotpassword`
export const ADMIN_AUTH_RESET_PASS = `${AdminAuth}/resetpassword`
export const ADMIN_AUTH_CHANGE_PASS = `${AdminAuth}/changepassword`

// ADMIN OTHER ROUTES
export const ADMIN_DASHBOARD = `${baseRoute}/admin/dashboard`
// Admin - Inventory Routes
export const ADMIN_INVENTORY = `${baseRoute}/admin/inventory`
export const ADMIN_ADD_PRODUCT = `${baseRoute}/admin/addproduct`
export const ADMIN_UPDATE_PRODUCT = `${baseRoute}/admin/updateproduct`  // PATCH -> PRODUCT ID
export const ADMIN_DELETE_PRODUCT = `${baseRoute}/admin/deleteproduct`  // DELETE -> PRODUCT ID

// Admin - Order Routes
export const ADMIN_LIVE_ORDERS = `${baseRoute}/admin/orders`
export const ADMIN_UPDATE_ORDER_STATUS = `${baseRoute}/admin/updateorder`  // PATCH -> ORDER ID
export const ADMIN_COMPLETED_ORDERS = `${baseRoute}/admin/completedorders`

// Admin - Pizza Routes
export const ADMIN_GET_PIZZAS = `${baseRoute}/admin/get-pizzas`
export const ADMIN_UPLOAD_PIZZA_IMAGE = `${baseRoute}/admin/pizza/upload`
export const ADMIN_ADD_PIZZA = `${baseRoute}/admin/addpizza`
export const ADMIN_UPDATE_PIZZA = `${baseRoute}/admin/updatepizza`  // PATCH -> PIZZA ID
export const ADMIN_DELETE_PIZZA = `${baseRoute}/admin/deletepizza`  // DELETE -> PIZZA ID
export const ADMIN_GET_PIZZA_DETAILS = `${baseRoute}/admin/pizza/get-pizza-details`  // GET -> PIZZA ID

// USER ROUTES
const UserAuth = `${baseRoute}/user/auth`
export const USER_AUTH_LOGIN = `${UserAuth}/login`
export const USER_AUTH_SIGNUP = `${UserAuth}/signup`
export const USER_AUTH_LOGOUT = `${UserAuth}/logout`
export const USER_AUTH_FORGOT_PASS = `${UserAuth}/forgotpassword`
export const USER_AUTH_RESET_PASS = `${UserAuth}/resetpassword`
export const USER_AUTH_CHANGE_PASS = `${UserAuth}/changepassword`

const User = `${baseRoute}/user`
export const USER_GET_PIZZAS = `${User}/pizzas`
export const USER_ADD_TO_CART = `${User}/cart`
export const USER_GET_CART = `${User}/cart`
export const USER_REMOVE_FROM_CART = `${User}/cart`
export const USER_CLEAR_CART = `${User}/cart/clear`
export const OPTIONS_ENDPOINT = `${User}/options`

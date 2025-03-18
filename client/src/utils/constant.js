export const HOST = import.meta.env.VITE_HOST
const baseRoute = `${HOST}/api/v1`

export const GET_LOGGED_USER_INFO = `${baseRoute}/auth/get-user-info`

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

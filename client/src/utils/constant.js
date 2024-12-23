

export const HOST = import.meta.env.VITE_HOST
const baseRoute = `${HOST}/api/v1`

export const GET_LOGGED_USER_INFO = `${baseRoute}/auth/get-user-info`


const AdminAuth = `${baseRoute}/admin/auth`
export const ADMIN_AUTH_LOGIN = `${AdminAuth}/login`
export const ADMIN_AUTH_SIGNUP = `${AdminAuth}/signup`
export const ADMIN_AUTH_LOGOUT = `${AdminAuth}/logout`
export const ADMIN_AUTH_FORGOT_PASS = `${AdminAuth}/forgotpassword`
export const ADMIN_AUTH_RESET_PASS = `${AdminAuth}/resetpassword`
export const ADMIN_AUTH_CHANGE_PASS = `${AdminAuth}/changepassword`

const UserAuth = `${baseRoute}/user/auth`
export const USER_AUTH_LOGIN = `${UserAuth}/login`
export const USER_AUTH_SIGNUP = `${UserAuth}/signup`
export const USER_AUTH_LOGOUT = `${UserAuth}/logout`
export const USER_AUTH_FORGOT_PASS = `${UserAuth}/forgotpassword`
export const USER_AUTH_RESET_PASS = `${UserAuth}/resetpassword`
export const USER_AUTH_CHANGE_PASS = `${UserAuth}/changepassword`

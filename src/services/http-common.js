import axios from 'axios'

// export const BASEURL = process.env.NEXT_PUBLIC_API_ENDPOINT
export const BASEURL = 'https://winstar-admin-backend.onrender.com'

import { Cookies } from 'react-cookie'

const cookie = new Cookies()

// const AuthToken = cookie.get('accessToken')
// console.log('AuthToken::', AuthToken)

const Headers = {
  'Access-Control-Allow-Origin': 'https://winstar-admin.vercel.app/',
  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
}

// if (AuthToken) {
// Headers.token = AuthToken
// }
export default axios.create({
  baseURL: `${BASEURL}/api/admin`,
  headers: Headers
})

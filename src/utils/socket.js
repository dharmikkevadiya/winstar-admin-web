import { io } from 'socket.io-client'

// export const BASEURL = process.env.NEXT_PUBLIC_API_ENDPOINT
export const BASEURL = 'https://winstar-admin-backend.onrender.com'

console.log('BASEURL::', BASEURL)

export const socket = io(BASEURL)

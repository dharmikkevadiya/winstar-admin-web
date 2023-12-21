import { io } from 'socket.io-client'

export const BASEURL = process.env.NEXT_PUBLIC_API_ENDPOINT

console.log('BASE_URL::', BASE_URL)

export const socket = io(BASEURL)

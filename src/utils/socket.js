import { io } from 'socket.io-client'

export const BASEURL = process.env.NEXT_PUBLIC_API_ENDPOINT

export const socket = io(BASEURL)

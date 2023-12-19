// ** React Imports
import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import authConfig from 'src/configs/auth'
import DataServices from 'src/services/requestApi'

const defaultProvider = {
  user: null,
  permission: null,
  accessToken: null,
  loading: true,
  setUser: () => null,
  setPermission: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultProvider.user)
  const [permission, setPermission] = useState(null)
  const [accessToken, setAccessToken] = useState(defaultProvider.accessToken)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = window.localStorage.getItem('accessToken')
        if (token) {
          setLoading(true)

          const res = await DataServices.getMe(token)
          const adminData = res?.data?.data

          if (res?.data?.statusCode === 200) {
            setLoading(false)
            setUser({ ...adminData })
            setPermission(adminData?.permission)
            setAccessToken(token)
          }
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.log('err::', err)

        // Handle errors
        window.localStorage.removeItem('accessToken')
        window.localStorage.removeItem('userId')
        setUser(null)
        setAccessToken(null)
        setLoading(false)

        if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
          router.replace('/login')
        }
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (params, errorCallback) => {
    try {
      const res = await DataServices.Login(params)

      if (res?.data?.statusCode === 200) {
        const adminData = res.data?.data

        window.localStorage.setItem('accessToken', adminData.token)
        window.localStorage.setItem('userId', adminData._id)

        // state
        setAccessToken(adminData.token)
        setUser({ ...adminData })
        setPermission(adminData?.permission)

        // return url
        const returnUrl = router.query.returnUrl
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      }
    } catch (err) {
      // Call errorCallback if provided
      if (errorCallback) errorCallback(err)
    }
  }

  const handleSignup = async (params, errorCallback) => {
    try {
      const res = await DataServices.Signup(params)

      if (res?.data?.statusCode === 200) {
        router.replace('/login')
      }
    } catch (err) {
      // Call errorCallback if provided
      if (errorCallback) errorCallback(err)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setAccessToken(null)
    setPermission(null)
    window.localStorage.removeItem('accessToken')
    window.localStorage.removeItem('userId')
    setLoading(false)
    router.push('/login')
  }

  const values = {
    user,
    accessToken,
    loading,
    setUser,
    setPermission,
    permission,
    setLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

// hooks/usePermission.js
import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

const usePermission = (category, subCategory, action) => {
  const auth = useAuth()
  const permissions = auth.permission
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    // Use a separate function to avoid the infinite loop
    const checkPermissions = () => {
      if (
        permissions &&
        permissions[category] &&
        permissions[category][subCategory] &&
        permissions[category][subCategory].includes(action)
      ) {
        setHasPermission(true)
      } else {
        setHasPermission(false)
      }
    }

    checkPermissions()
  }, [permissions, category, subCategory, action])

  return hasPermission
}

export default usePermission

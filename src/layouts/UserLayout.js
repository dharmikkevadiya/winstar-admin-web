import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { socket } from '../utils/socket'

const UserLayout = ({ children, contentHeightFixed }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const [permission, setPermission] = useState({})
  const [isConnected, setIsConnected] = useState(socket.connected)

  const auth = useAuth()

  // ** Vars for server side navigation
  // const { menuItems: verticalMenuItems } = ServerSideVerticalNavItems()
  // const { menuItems: horizontalMenuItems } = ServerSideHorizontalNavItems()
  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  if (hidden && settings.layout === 'horizontal') {
    settings.layout = 'vertical'
  }

  useEffect(() => {
    const getPermission = async () => {
      try {
        setPermission(auth?.user.permission)
      } catch (error) {
        console.log('err::', err)
        toast.error('Something wrent wrong!')
      }
    }

    getPermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.permission])

  // const access = {
  //   Dashboard: {
  //     'Dashboard Count': ['View']
  //   },
  //   Admin: {
  //     'Admin List': ['View']
  //   },
  //   Player: {
  //     'Player List': ['View'],
  //     'Player Banned': ['Download']
  //   },
  //   Game: {
  //     'Game List': ['Delete']
  //   },
  //   Controls: {},
  //   Payment: {},
  //   Income: {},
  //   'Game Setting': {},
  //   'Contact Details': {}
  // }

  const filterNavigation = (navigation, permission) => {
    return navigation.filter(item => {
      const itemTitle = item.title
      if (permission[itemTitle]) {
        if (item.children) {
          // If the item has children, recursively filter them
          item.children = filterNavigation(item.children, permission[item.title])

          return item.children.length > 0
        } else {
          // If the item has no children, check if there are allowed actions for it
          const permissionsForItem = permission[item.title]

          // Check if any permission is present
          return Object.values(permissionsForItem).flat().length > 0
        }
      }

      return false
    })
  }

  // Usage
  const filteredNavigation = filterNavigation(VerticalNavItems(), permission)

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
    }
    function onSomeEndpoint(data) {
      console.log('Test socket emit listen connect done', data)
    }

    // socket.emit('someEndpoint', {})

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('someEndpoint', onSomeEndpoint)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('someEndpoint', onSomeEndpoint)
    }
  }, [])

  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      contentHeightFixed={contentHeightFixed}
      verticalLayoutProps={{
        navMenu: {
          navItems: filteredNavigation

          // Uncomment the below line when using server-side menu in vertical layout and comment the above line
          // navItems: verticalMenuItems
        },
        appBar: {
          content: props => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          )
        }
      }}
      {...(settings.layout === 'horizontal' && {
        horizontalLayoutProps: {
          navMenu: {
            navItems: HorizontalNavItems()

            // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
            // navItems: horizontalMenuItems
          },
          appBar: {
            content: () => <HorizontalAppBarContent settings={settings} saveSettings={saveSettings} />
          }
        }
      })}
    >
      {children}
    </Layout>
  )
}

export default UserLayout

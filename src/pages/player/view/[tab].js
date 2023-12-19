// ** Third Party Imports
import axios from 'axios'
import UserViewPage from './UserViewPage'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import DataServices from 'src/services/requestApi'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const UserView = () => {
  const auth = useAuth()
  const [data, setData] = useState({})
  const token = auth.accessToken
  const playerId = localStorage.getItem('pid')
  const { query } = useRouter()

  const getPlayerData = async () => {
    try {
      if (token && playerId) {
        const res = await DataServices.callGetPlayerById(playerId, token)
        if (res?.data?.statusCode === 200) {
          setData(res?.data?.data)
        } else toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }
  useEffect(() => {
    getPlayerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{(data?.email || data?.phone) && <UserViewPage tab={query.tab} playerData={data} />}</>
}

// export const getStaticPaths = () => {
//   return {
//     paths: [
//       { params: { tab: 'account' } },
//       { params: { tab: 'kyc' } },
//       { params: { tab: 'history' } },
//       { params: { tab: 'referrals' } },
//       { params: { tab: 'test' } }
//     ],
//     fallback: false
//   }
// }

// export const getStaticProps = async ({ params }) => {
//   return {
//     props: {
//       tab: params?.tab
//     }
//   }
// }

export default UserView

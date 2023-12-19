import Grid from '@mui/material/Grid'
import Stastics from './Stastics'
import RevenueChart from './RevenueChart'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import LivePlayerChart from './LivePlayerChart'
import CountryStateCityCard from './CountryStateCityCard'

const Home = () => {
  const auth = useAuth()
  const token = auth.accessToken

  const [data, setData] = useState({
    totalPlayers: 0,
    totalDeposits: 0,
    pendingDeposit: 0,
    totalWithdraws: 0,
    pendingWithdraw: 0,
    totalKycPending: 0
  })

  const getStatistics = async () => {
    try {
      if (token) {
        const res = await DataServices.callGetStatistics(token)

        if (res?.data?.status === true) {
          setData({ ...res?.data?.data })
        } else {
          toast.error(res?.data?.message)
        }
      }
    } catch (err) {
      console.log('err::', err)

      // setLoading(false)
      toast.error(err.message)
    }
  }
  useEffect(() => {
    getStatistics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Stastics data={data} />
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={4}>
          <RevenueChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <LivePlayerChart />
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: '190px' }}>
          <CountryStateCityCard />
        </Grid>
      </Grid>
    </>
  )
}

export default Home

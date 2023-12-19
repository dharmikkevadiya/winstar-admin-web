// ** React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import MuiTabList from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import UserViewAccount from './UserViewAccount'
import PlayerKYC from './PlayerKYC'
import PlayerBanks from './PlayerBanks'
import PlayerCurrency from './PlayerCurrency'
import History from './History'
import ReferralHistory from './ReferralHistory'
import Test from './Test'

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5)
  }
}))

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    }
  }
}))

const UserViewRight = ({ tab }) => {
  // ** State
  const [activeTab, setActiveTab] = useState(tab)
  const [isLoading, setIsLoading] = useState(false)

  // ** Hooks
  const router = useRouter()

  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/player/view/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='account' label='Account' icon={<Icon fontSize='1.125rem' icon='tabler:user-check' />} />
        <Tab value='kyc' label='KYC' icon={<Icon fontSize='1.125rem' icon='tabler:lock' />} />
        <Tab value='banks' label='Banks' icon={<Icon fontSize='1.125rem' icon='ic:outline-account-balance' />} />
        <Tab value='currency' label='Balance' icon={<Icon fontSize='1.125rem' icon='mingcute:wallet-4-fill' />} />
        <Tab value='history' label='History' icon={<Icon fontSize='1.125rem' icon='tabler:history' />} />
        <Tab value='referrals' label='Referral' icon={<Icon fontSize='1.125rem' icon='clarity:group-solid' />} />
        <Tab value='test' label='Test' icon={<Icon fontSize='1.125rem' icon='grommet-icons:transaction' />} />
      </TabList>
      <Box sx={{ mt: 4 }}>
        <TabPanel sx={{ p: 0 }} value='account'>
          <UserViewAccount />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='kyc'>
          <PlayerKYC />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='banks'>
          <PlayerBanks />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='currency'>
          <PlayerCurrency />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='history'>
          <History />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='referrals'>
          <ReferralHistory />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='test'>
          <Test />
        </TabPanel>
      </Box>
    </TabContext>
  )
}

export default UserViewRight

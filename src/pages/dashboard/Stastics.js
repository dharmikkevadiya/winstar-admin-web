// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Icon from 'src/@core/components/icon'
import CustomAvatar from 'src/@core/components/mui/avatar'

const formatNumberToK = number => (number >= 1000 ? `${Math.floor(number / 1000)}k` : number.toString())

const renderStats = statistics => {
  const data = [
    {
      stats: statistics.totalPlayers,
      title: 'Player',
      color: 'primary',
      icon: 'clarity:users-solid'
    },
    {
      stats: statistics.totalDeposit,
      title: 'Deposit',
      color: 'success',
      icon: 'solar:card-send-bold-duotone'
    },
    {
      stats: statistics.totalWithdraws,
      title: 'Withdraw',
      color: 'error',
      icon: 'solar:card-recive-bold-duotone'
    },
    {
      stats: statistics.pendingDeposit,
      title: 'Pending Deposit',
      color: 'success',
      icon: 'solar:card-send-bold-duotone'
    },
    {
      stats: statistics.pendingWithdraw,
      title: 'Pending Withdraw',
      color: 'error',
      icon: 'solar:card-recive-bold-duotone'
    },
    {
      stats: statistics.totalKycPending,
      title: 'Kyc pending',
      color: 'info',
      icon: 'uiw:verification'
    }
  ]

  return data.map((sale, index) => (
    <Grid item xs={6} sx={{ pb: { xs: 8, md: 0, lg: 0 } }} md={2} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin='light' color={sale.color} sx={{ mr: 4, width: 42, height: 42 }}>
          <Icon icon={sale.icon} fontSize='1.5rem' />
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h5'>{sale.stats}</Typography>
          <Typography variant='body2'>{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const EcommerceStatistics = ({ data }) => {
  return (
    <Card>
      <CardHeader title='Statistics' sx={{ '& .MuiCardHeader-action': { m: 0, alignSelf: 'center' } }} />
      <CardContent sx={{ pb: theme => `${theme.spacing(7.5)} !important` }}>
        <Grid container justifyContent={'space-between'}>
          {renderStats(data)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceStatistics

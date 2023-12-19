// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import UserViewLeft from './UserViewLeft'
import UserViewRight from './UserViewRight'

const UserView = ({ tab, playerData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft playerData={playerData} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={tab} />
      </Grid>
    </Grid>
  )
}

export default UserView

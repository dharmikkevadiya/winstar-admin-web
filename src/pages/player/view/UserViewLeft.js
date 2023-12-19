// ** React Imports
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import PlayerEditForm from 'src/components/PlayerEditForm'
import toast from 'react-hot-toast'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'

const statusColors = {
  active: 'success',
  banned: 'warning',
  inactive: 'secondary'
}

const rankingObj = {
  0: { text: '-' },
  1: { text: 'Bronz', color: 'primary' },
  2: { text: 'Silver', color: 'secondary' },
  3: { text: 'Gold', color: 'warning' },
  4: { text: 'Platinum', color: 'info' }
}

const UserViewLeft = ({ playerData }) => {
  const auth = useAuth()
  const token = auth.accessToken
  const id = playerData?._id
  const [data, setData] = useState(playerData)
  const [openEdit, setOpenEdit] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleEditClickOpen = () => {
    setOpenEdit(true)
  }
  const handleEditClose = () => setOpenEdit(false)

  const getPlayerData = async () => {
    try {
      if (token) {
        const res = await DataServices.callGetPlayerById(id, token)
        if (res?.data?.status === true) {
          setData(res?.data?.data)
        } else {
          toast.error(res?.data?.message)
        }
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

  const onSubmit = async data => {
    try {
      setLoading(true)
      const res = await DataServices.callEditPlayer(id, data, token)

      if (res?.data?.status === true) {
        setLoading(false)
        handleEditClose()
        getPlayerData()
        toast.success('Form Submitted')
      } else {
        setLoading(false)
        toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      setLoading(false)
      toast.error('Something wrent wrong!')
    }
  }

  const formFields = [
    { name: 'username', type: 'text', label: 'Name', placeholder: 'Name', disabled: true },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'Email', disabled: true },
    { name: 'phone', type: 'text', label: 'Phone', placeholder: 'Phone', disabled: true },
    {
      name: 'playerStatus',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'banned', label: 'Banned' }
      ]
    },
    { name: 'ranking', type: 'text', label: 'Ranking', placeholder: 'Ranking' },
    { name: 'country', type: 'text', label: 'Country', placeholder: 'Country' },
    { name: 'state', type: 'text', label: 'State', placeholder: 'State' },
    { name: 'city', type: 'text', label: 'CIty', placeholder: 'Ctty' }
  ]

  if (data) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ pt: 13.5, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
              {data?.image ? (
                <CustomAvatar
                  src={data?.imageUrl}
                  variant='rounded'
                  alt={data?.username}
                  sx={{ width: 100, height: 100, mb: 4 }}
                />
              ) : (
                <CustomAvatar
                  skin='light'
                  variant='rounded'
                  color={data.avatarColor}
                  sx={{ width: 100, height: 100, mb: 4, fontSize: '3rem' }}
                >
                  {getInitials(data?.username)}
                </CustomAvatar>
              )}
              <Typography variant='h4' sx={{ mb: 3 }}>
                {data?.username}
              </Typography>
            </CardContent>

            <Divider sx={{ my: '0 !important', mx: 6 }} />

            <CardContent sx={{ pb: 4 }}>
              <Typography variant='body2' sx={{ color: 'text.disabled', textTransform: 'uppercase' }}>
                Details
              </Typography>
              <Box sx={{ pt: 4 }}>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Name:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data.username}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Email:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Status:</Typography>
                  <CustomChip
                    rounded
                    skin='light'
                    size='small'
                    label={data.playerStatus}
                    color={statusColors[data.playerStatus]}
                    sx={{
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Ranking:</Typography>
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    label={rankingObj[data?.ranking]?.text || 'Unknown'}
                    color={rankingObj[data?.ranking]?.color || 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Contact:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.phone ? `+${data?.phone}` : '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>Country:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.country || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 3 }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>State:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.state || '-'}</Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Typography sx={{ mr: 2, fontWeight: 500, color: 'text.secondary' }}>City:</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{data?.city || '-'}</Typography>
                </Box>
              </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' sx={{ mr: 2 }} onClick={handleEditClickOpen}>
                Edit
              </Button>
            </CardActions>

            <Dialog
              open={openEdit}
              onClose={handleEditClose}
              aria-labelledby='user-view-edit'
              aria-describedby='user-view-edit-description'
              sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
            >
              <DialogTitle
                id='user-view-edit'
                sx={{
                  textAlign: 'center',
                  fontSize: '1.5rem !important',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
                Edit User Information
              </DialogTitle>
              <DialogContent
                sx={{
                  pb: theme => `${theme.spacing(8)} !important`,
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`]
                }}
              >
                <DialogContentText variant='body2' id='user-view-edit-description' sx={{ textAlign: 'center', mb: 7 }}>
                  Updating user details will receive a privacy audit.
                </DialogContentText>
                <PlayerEditForm
                  data={data}
                  onSubmit={onSubmit}
                  fields={formFields}
                  onClose={handleEditClose}
                  loading={loading}
                />
              </DialogContent>
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default UserViewLeft

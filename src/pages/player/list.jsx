import DataGrid from 'src/components/DataGrid'
import { Box } from '@mui/system'
import CustomTextField from 'src/@core/components/mui/text-field'
import IconifyIcon from 'src/@core/components/icon'
import { Card, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import CustomChip from 'src/@core/components/mui/chip'
import usePermission from 'src/hooks/usePermission'

export default function List() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const router = useRouter()

  // access
  const isEditAccess = usePermission('Player', 'Player List', 'Edit')
  const isDeleteAccess = usePermission('Player', 'Player List', 'Delete')

  const getPlayerList = async () => {
    try {
      if (token) {
        const res = await DataServices.callGetPlayersList(token)
        if (res?.data?.status === true) {
          const modifiedData = res?.data?.data.map((item, index) => ({
            ...item,
            srno: index + 1
          }))
          setData(modifiedData)
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
    getPlayerList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onEditClick = data => {
    localStorage.setItem('pid', data?._id)
    router.push('/player/view/account/')
  }

  const handleDelete = async id => {
    try {
      const res = await DataServices.callRemovePlayer(id, token)
      if (res?.data?.status === true) {
        getPlayerList()
      } else {
        toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error(err.message)
    }
  }

  const statusObj = {
    active: { text: 'Active', color: 'success' },
    banned: { text: 'Banned', color: 'error' },
    pending: { text: 'Pending', color: 'secondary' },
    'on-hold': { text: 'On hold', color: 'warning' }
  }

  const rankingObj = {
    0: { text: '-' },
    1: { text: 'Bronz', color: 'primary' },
    2: { text: 'Silver', color: 'secondary' },
    3: { text: 'Gold', color: 'warning' },
    4: { text: 'Platinum', color: 'info' }
  }

  return (
    <>
      <Card>
        <DataGrid
          showAction
          data={data}
          handleDelete={isDeleteAccess ? handleDelete : null}
          handleEdit={isEditAccess ? onEditClick : null}
          headerComponet={ServerSideToolbar}
          serachBy={['username', 'email']}
          title={'Player List'}
          header={[
            {
              field: 'srno',
              headerName: 'SNo'
            },
            {
              field: 'createdAt',
              label: 'Join Date',
              headerName: 'Join Date',
              renderCell: ({ value }) => value.split('T')[0]
            },
            {
              field: 'username',
              label: 'Name',
              headerName: 'Name',
              flex: 0
            },
            {
              field: 'email',
              label: 'Email',
              headerName: 'Email',
              renderCell: ({ value }) => value || '-'
            },
            {
              field: 'phone',
              label: 'Phone No',
              headerName: 'Phone No',
              flex: 1,
              renderCell: ({ value }) => value || '-'
            },

            // {
            //   field: 'loginType',
            //   label: 'Login Type',
            //   headerName: 'Login Type',
            //   renderCell: ({ value }) => ({ 0: 'Email', 1: 'Phone', 2: 'Google', 3: 'Facebook' }[value] || '-')
            // },
            {
              field: 'ranking',
              headerName: 'Ranking',
              renderCell: ({ value }) => (
                <CustomChip
                  rounded
                  size='small'
                  skin='light'
                  label={rankingObj[value]?.text || 'Unknown'}
                  color={rankingObj[value]?.color || 'default'}
                />
              )
            },

            // {
            //   field: 'total_balance',
            //   label: 'Balance',
            //   headerName: 'Balance',
            //   renderCell: ({ value }) => value || 0
            // },
            {
              field: 'playerStatus',
              label: 'Status',
              headerName: 'Status',
              renderCell: ({ value }) => (
                <CustomChip
                  rounded
                  size='small'
                  skin='light'
                  label={statusObj[value]?.text || 'Unknown'}
                  color={statusObj[value]?.color || 'default'}
                />
              )
            }
          ]}
        />
      </Card>
    </>
  )
}

const ServerSideToolbar = props => {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      <CustomTextField
        value={props.value}
        placeholder='Search…'
        onChange={props.onChange}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 2, display: 'flex' }}>
              <IconifyIcon fontSize='1.25rem' icon='tabler:search' />
            </Box>
          ),
          endAdornment: (
            <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
              <IconifyIcon fontSize='1.25rem' icon='tabler:x' />
            </IconButton>
          )
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto'
          },
          '& .MuiInputBase-root > svg': {
            mr: 2
          }
        }}
      />
    </Box>
  )
}

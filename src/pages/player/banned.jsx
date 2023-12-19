import { CardHeader, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import Datagrid from 'src/components/DataGrid'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import CustomChip from 'src/@core/components/mui/chip'

export default function Playerbanned() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])

  const getPlayerList = async () => {
    try {
      if (token) {
        const query = 'status=banned'
        const res = await DataServices.callGetPlayersListByQuery(query, token)
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

  const statusObj = {
    banned: { text: 'Banned', color: 'error' }
  }

  return (
    <Datagrid
      data={data}
      headerComponet={ServerSideToolbar}
      serachBy={['username', 'email']}
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
        {
          field: 'loginType',
          label: 'Login Type',
          headerName: 'Login Type',
          renderCell: ({ value }) => ({ 0: 'Email', 1: 'Phone', 2: 'Google', 3: 'Facebook' }[value] || '-')
        },
        {
          field: 'total_balance',
          label: 'Balance',
          headerName: 'Balance',
          renderCell: ({ value }) => value || 0
        },
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
      <CardHeader title={'Player banned'} sx={{ pb: 0 }} />

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

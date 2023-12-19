import { Card, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { GridToolbarExport } from '@mui/x-data-grid'
import toast from 'react-hot-toast'
import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import Datagrid from 'src/components/DataGrid'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import usePermission from 'src/hooks/usePermission'
import CustomChip from 'src/@core/components/mui/chip'
import { renderAmount, renderWinAmount } from 'src/utils'

export default function Win() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [dataLoading, setDataLoading] = useState(false)

  const getHistory = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetHistory('win', '', token)

        if (res?.data?.status === true) {
          const modifiedData = res?.data?.data.map((item, index) => ({
            ...item,
            srno: index + 1
          }))
          setData(modifiedData)
          setDataLoading(false)
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
    getHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const statusObj = {
    0: { text: 'Success', color: 'success' },
    1: { text: 'Pending', color: 'secondary' },
    2: { text: 'Failed', color: 'error' },
    3: { text: 'Cancelled', color: 'warning' }
  }

  return (
    <>
      {!dataLoading && (
        <Card id='download-PDF'>
          <Datagrid
            data={data}
            headerComponet={ServerSideToolbar}
            title={'Player Win History'}
            serachBy={['gameIdDev', 'email']}
            header={[
              {
                field: 'srno',
                headerName: 'SNo'
              },
              {
                field: 'createdAt',
                headerName: 'Date',
                renderCell: ({ value }) => value.split('T')[0]
              },
              {
                field: 'gameIdDev',
                headerName: 'Game Id'
              },
              {
                field: 'email',
                headerName: 'Email'
              },
              {
                field: 'currency',
                headerName: 'Currency'
              },
              {
                field: 'amount',
                headerName: 'Amount',
                renderCell: renderAmount
              },
              {
                field: 'winAmount',
                headerName: 'Win Amount',
                renderCell: renderWinAmount
              },
              {
                field: 'status',
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
      )}
    </>
  )
}

const ServerSideToolbar = props => {
  const isDownloadAccess = usePermission('Payment', 'Win', 'Download')

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
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isDownloadAccess && <GridToolbarExport printOptions={{ disableToolbarButton: true }} />}
      </Box>
    </Box>
  )
}

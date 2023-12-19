import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import DataServices from 'src/services/requestApi'
import { useEffect, useState } from 'react'
import { Card } from '@mui/material'
import Datagrid from 'src/components/DataGrid'
import CustomChip from 'src/@core/components/mui/chip'

const ReferralHistory = () => {
  const auth = useAuth()
  const token = auth.accessToken
  const playerId = localStorage.getItem('pid')
  const [data, setData] = useState({})
  const [dataLoading, setDataLoading] = useState(false)

  const getPlayerData = async () => {
    try {
      if (token && playerId) {
        setDataLoading(true)
        const res = await DataServices.callGetReferralHistory(playerId, token)
        if (res?.data?.status === true) {
          const modifiedData = res?.data?.data.map((item, index) => ({
            ...item.playerId,
            srno: index + 1,
            joinDate: item.createdAt.split('T')[0]
          }))
          setData(modifiedData)
          setDataLoading(false)
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

  const statusObj = {
    active: { text: 'Active', color: 'success' },
    banned: { text: 'Banned', color: 'error' },
    pending: { text: 'Pending', color: 'secondary' },
    'on-hold': { text: 'On hold', color: 'warning' }
  }

  return (
    <>
      {!dataLoading && (
        <Card>
          <Datagrid
            data={data}
            dataLoading={dataLoading}
            header={[
              {
                field: 'srno',
                headerName: 'SNo'
              },
              {
                field: 'joinDate',
                headerName: 'Join Date'
              },
              {
                field: 'username',
                headerName: 'Name'
              },
              {
                field: 'email',
                headerName: 'Email'
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
                    label={statusObj[value]?.text || '-'}
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

export default ReferralHistory

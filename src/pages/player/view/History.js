import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import DataServices from 'src/services/requestApi'
import { useEffect, useState } from 'react'
import { Card } from '@mui/material'
import Datagrid from 'src/components/DataGrid'
import CustomChip from 'src/@core/components/mui/chip'
import { renderAmount, renderWinAmount } from 'src/utils'

const PlayerHistory = () => {
  const auth = useAuth()
  const token = auth.accessToken
  const playerId = localStorage.getItem('pid')
  const [data, setData] = useState({})
  const [dataLoading, setDataLoading] = useState(false)

  const getPlayerData = async () => {
    try {
      if (token && playerId) {
        setDataLoading(true)
        const res = await DataServices.callGetHistory('', playerId, token)
        if (res?.data?.status === true) {
          const modifiedData = res?.data?.data.map((item, index) => ({
            ...item,
            srno: index + 1
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
    0: { text: 'Success', color: 'success' },
    1: { text: 'Pending', color: 'secondary' },
    2: { text: 'Failed', color: 'error' },
    3: { text: 'Cancelled', color: 'warning' }
  }

  return (
    <>
      {!dataLoading && (
        <Card>
          <Datagrid
            data={data}
            serachBy={['name', 'email']}
            dataLoading={dataLoading}
            header={[
              {
                field: 'srno',
                headerName: 'SNo'
              },
              {
                field: 'historyId',
                headerName: 'Id',
                renderCell: ({ value }) => `#${value}`
              },
              {
                field: 'createdAt',
                headerName: 'Date',
                renderCell: ({ value }) => value.split('T')[0]
              },
              {
                field: 'note',
                headerName: 'Note',
                renderCell: ({ value }) =>
                  ({ 0: 'Add Money', 1: 'Withdraw', 2: 'Join', 3: 'Win', 4: 'Refund', 5: 'Reward' }[value] || '-')
              },
              {
                field: 'rewardType',
                headerName: 'Reward Type',
                renderCell: ({ value }) =>
                  ({
                    0: 'Spin',
                    1: 'Refer',
                    2: 'commission',
                    3: 'Daily',
                    4: 'Weekly',
                    5: 'Monthly',
                    6: 'Levelup',
                    7: 'Rakeback',
                    8: 'Other'
                  }[value] || '-')
              },
              {
                field: 'transactionType',
                headerName: 'Type',
                renderCell: ({ value }) => ({ 0: 'Debit', 1: 'Credit' }[value] || '-')
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

export default PlayerHistory

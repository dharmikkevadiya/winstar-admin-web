import Grid from '@mui/material/Grid'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import DataServices from 'src/services/requestApi'
import { useEffect, useState } from 'react'
import { Card, CardContent, Chip } from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'

const PlayerCurrency = () => {
  const auth = useAuth()
  const token = auth.accessToken
  const playerId = localStorage.getItem('pid')
  const [data, setData] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)

  const getPlayerData = async () => {
    try {
      if (token && playerId) {
        setDataLoading(true)
        const res = await DataServices.callGetPlayerById(playerId, token)

        if (res?.data?.status === true) {
          setData(res?.data?.data?.currency)
          setDataLoading(false)
        } else toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something went wrong!')
    }
  }

  useEffect(() => {
    getPlayerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='main-container container-fluid' style={{ overflow: 'hidden' }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item container alignItems='center' xs={12} spacing={3}>
          <Grid item xs={6}>
            <h2>Currency Balance</h2>
          </Grid>
        </Grid>

        {/* Currency Cards */}
        {data &&
          data.map((item, index) => (
            <Grid item key={index}>
              <Card style={{ width: '380px', position: 'relative' }}>
                <CardContent style={{ position: 'relative' }}>
                  <div>
                    {/* You can add more details as needed */}

                    <p style={{ margin: '0 0 14px 0', fontSize: '14px' }}>Name: {item.currencyName} </p>
                    <p style={{ margin: '0 0 14px 0', fontSize: '14px' }}>Currency: {item.currencyShortName}</p>
                    {/* Move the label to the top right */}
                    {item?.isPrimary ? (
                      <div style={{ position: 'absolute', top: 5, right: 5 }}>
                        <CustomChip
                          sx={{ fontSize: '10px' }}
                          rounded
                          size='small'
                          label={'Primary'}
                          skin='light'
                          color='secondary'
                        />
                      </div>
                    ) : (
                      ''
                    )}

                    <p style={{ margin: '0 0 6px 0', fontSize: '14px' }}>
                      Amount: <CustomChip size='small' label={(item?.amount).toFixed(2)} skin='light' color='success' />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  )
}

export default PlayerCurrency

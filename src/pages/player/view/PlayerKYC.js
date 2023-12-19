import Grid from '@mui/material/Grid'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import DataServices from 'src/services/requestApi'
import { useEffect, useState } from 'react'
import PlayerEditForm from 'src/components/PlayerEditForm'

const PlayerKYC = () => {
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const token = auth.accessToken
  const playerId = localStorage.getItem('pid')
  const [data, setData] = useState({})
  const [dataLoading, setDataLoading] = useState(false)

  const getPlayerData = async () => {
    try {
      if (token && playerId) {
        setDataLoading(true)
        const res = await DataServices.callGetPlayerById(playerId, token)
        if (res?.data?.status === true) {
          setData(res?.data?.data)
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

  const onSubmit = async data => {
    try {
      setLoading(true)
      const res = await DataServices.callEditPlayer(playerId, data, token)

      if (res?.data?.status === true) {
        setLoading(false)
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

  const fields = [
    {
      name: 'kyc',
      label: 'KYC Status',
      type: 'select',
      options: [
        { value: true, label: 'Verified' },
        { value: false, label: 'Not Verified' }
      ]
    },
    {
      name: 'kycFailedReason',
      label: 'KYC Failed Reason',
      placeholder: 'Write reason here',
      type: 'text'
    },
    { name: 'adharNo', type: 'text', label: 'Adhar No.', placeholder: 'Adhar No.', disabled: true },
    { name: 'pancarNo', type: 'text', label: 'Pancard No.', placeholder: 'Pancard No.', disabled: true },
    { name: 'idProofFrontUrl', type: 'image', url: 'idProofFrontUrl', label: 'ID Proof Front' },
    { name: 'idProofBackUrl', type: 'image', url: 'idProofBackUrl', label: 'ID Proof Back' },
    { name: 'addressProofUrl', type: 'image', url: 'addressProofUrl', label: 'Address Proof' },
    { name: 'sourceOfFundsUrl', type: 'image', url: 'sourceOfFundsUrl', label: 'Source Of Funds' }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <>
          {!dataLoading && (
            <PlayerEditForm title='Player KYC' data={data} loading={loading} fields={fields} onSubmit={onSubmit} />
          )}
        </>
      </Grid>
    </Grid>
  )
}

export default PlayerKYC

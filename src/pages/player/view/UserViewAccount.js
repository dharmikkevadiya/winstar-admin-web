import Grid from '@mui/material/Grid'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import DataServices from 'src/services/requestApi'
import { useEffect, useState } from 'react'
import PlayerEditForm from 'src/components/PlayerEditForm'

const UserViewAccount = () => {
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
    { name: 'username', type: 'text', label: 'Name', placeholder: 'Name', disabled: true },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'Email', disabled: true },
    { name: 'totalWin', type: 'number', label: 'Total Win', placeholder: 'Total Win', disabled: true },
    { name: 'totalPlayed', type: 'number', label: 'Total Played', placeholder: 'Total Played', disabled: true },
    { name: 'isEmailVerified', type: 'text', label: 'Email Verified', placeholder: 'Email Verified', disabled: true },
    { name: 'isPhoneVerified', type: 'text', label: 'Phone Verified', placeholder: 'Phone Verified', disabled: true },
    {
      name: 'loginType',
      label: 'Login Type',
      type: 'select',
      options: [
        { value: 0, label: 'Email' },
        { value: 1, label: 'Phone no' },
        { value: 2, label: 'Google' },
        { value: 3, label: 'Facebook' }
      ],
      disabled: true
    },
    { name: 'dob', type: 'text', label: 'Date of Birth', placeholder: 'Date of Birth', disabled: true },
    { name: 'refercode', type: 'text', label: 'Refercode', placeholder: 'Refercode', disabled: true },
    {
      name: 'twoFactorSecertKey',
      type: 'password',
      label: 'TwoFactor Secert Key',
      placeholder: 'TwoFactor Secert Key',
      disabled: true
    },
    {
      name: 'twoFactorPassword',
      type: 'password',
      label: 'TwoFactor Password',
      placeholder: 'TwoFactor Password',
      disabled: true
    },
    {
      name: 'termsAndCondition',
      type: 'text',
      label: 'Terms and Condition',
      placeholder: 'Terms and Condition',
      disabled: true
    },
    { name: 'deviceOs', type: 'text', label: 'Device Os', placeholder: 'Device Os', disabled: true },
    { name: 'deviceId', type: 'text', label: 'Device Id', placeholder: 'Device Id', disabled: true },
    { name: 'deviceName', type: 'text', label: 'Device Name', placeholder: 'Device Name', disabled: true },
    { name: 'deviceModel', type: 'text', label: 'Device Model', placeholder: 'Device Model', disabled: true },
    {
      name: 'verifyLevel',
      type: 'text',
      label: 'Verification Level',
      placeholder: 'Verification Level',
      disabled: true
    },
    {
      name: 'notificationMode',
      label: 'Notification Mode',
      type: 'select',
      options: [
        { value: true, label: 'On' },
        { value: false, label: 'Off' }
      ]
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <>
          {!dataLoading && (
            <PlayerEditForm
              title='Player Information'
              data={data}
              loading={loading}
              fields={fields}
              onSubmit={onSubmit}
            />
          )}
        </>
      </Grid>
    </Grid>
  )
}

export default UserViewAccount

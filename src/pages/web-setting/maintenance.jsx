import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import CustomInputForm from 'src/components/CustomInputForm'
import _ from 'lodash'
import usePermission from 'src/hooks/usePermission'

const Social = () => {
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState({})
  const [dataLoading, setDataLoading] = useState(false)

  // access
  const isEditAccess = usePermission('Web Setting', 'Maintenance', 'Edit')

  const getSocialData = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetSettings(token)
        if (res?.data?.status === true) {
          setDataLoading(false)
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
    getSocialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async data => {
    try {
      setLoading(true)

      let res = await DataServices.callUpdateSettings(data, token)

      if (res?.data?.status === true) {
        setLoading(false)
        getSocialData()
        toast.success('Update successfully')
      } else {
        setLoading(false)
        toast.error(res?.data?.message)
      }
    } catch (err) {
      setLoading(false)
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const inputList = [
    {
      name: 'maintenanceData',
      label: 'Maintenance Text',
      type: 'String',
      placeholder: "We're sorry , the server are currently under maintenance. Please try again later.",
      icon: 'pajamas:issue-type-maintenance',
      fullWidth: true
    },
    { name: 'maintenance', label: 'Maintenance', type: 'switch', icon: 'pajamas:issue-type-maintenance' },
    {
      name: 'paymentMethod',
      label: 'Payment',
      type: 'select',
      options: [
        { value: 'stripe', label: 'Stripe' },
        { value: 'paypal', label: 'Paypal' }
      ],
      required: false
    }
  ]

  return (
    <>
      {!dataLoading && (
        <CustomInputForm
          title='Maintenance'
          data={data}
          loading={loading}
          fields={inputList}
          onSubmit={isEditAccess ? onSubmit : null}
        />
      )}
    </>
  )
}

export default Social

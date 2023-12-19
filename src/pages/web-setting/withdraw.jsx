import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import CustomInputForm from 'src/components/CustomInputForm'
import _ from 'lodash'
import usePermission from 'src/hooks/usePermission'

const Withdraw = () => {
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState({})
  const [dataLoading, setDataLoading] = useState(false)

  // access
  const isEditAccess = usePermission('Web Setting', 'Withdraw', 'Edit')

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
      name: 'minWithdrawAmount',
      label: 'Min Withdraw',
      type: 'String',
      placeholder: 'Please enter min withdraw amount',
      icon: 'la:rupee-sign'
    },
    {
      name: 'maxWithdrawAmount',
      label: 'Max Withdraw',
      type: 'String',
      placeholder: 'Please enter max withdraw amount',
      icon: 'la:rupee-sign'
    }
  ]

  return (
    <>
      {!dataLoading && (
        <CustomInputForm
          title='Withdraw Money Setting'
          data={data}
          loading={loading}
          fields={inputList}
          onSubmit={isEditAccess ? onSubmit : null}
        />
      )}
    </>
  )
}

export default Withdraw

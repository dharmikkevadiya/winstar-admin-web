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
  const isEditAccess = usePermission('Controls', 'Version', 'Edit')

  const getVersionData = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetVersions(token)
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
    getVersionData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async data => {
    try {
      setLoading(true)
      let res = await DataServices.callUpdatVersion(data, token)

      if (res?.data?.status === true) {
        setLoading(false)
        getVersionData()
        toast.success('Form Submitted')
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
      name: 'playStoreVersion',
      label: 'Version Controle',
      type: 'String',
      icon: 'covid:transmission-virus-mobile-application'
    },
    { name: 'playStoreLink', label: 'App Link', type: 'String', icon: 'solar:link-bold-duotone' }
  ]

  return (
    <>
      {!dataLoading && (
        <CustomInputForm
          title='Versions'
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

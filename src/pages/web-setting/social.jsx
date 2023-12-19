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
  const isEditAccess = usePermission('Web Setting', 'Social', 'Edit')

  const getSocialData = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetSocialLinks(token)
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
      let res = await DataServices.callUpdatSocialLinks(data, token)

      if (res?.data?.status === true) {
        setLoading(false)
        getSocialData()
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
    { name: 'facebook', label: 'Facebook', type: 'String', icon: 'ic:baseline-facebook' },
    { name: 'telegram', label: 'Telegram', type: 'String', icon: 'ic:baseline-telegram' },
    { name: 'instagram', label: 'Instagram', type: 'String', icon: 'mdi:instagram' },
    { name: 'twitter', label: 'Twitter', type: 'String', icon: 'mdi:twitter' },
    { name: 'whatsapp', label: 'Whatsapp', type: 'String', icon: 'ic:baseline-whatsapp' },
    { name: 'youtube', label: 'YouTube', type: 'String', icon: 'mdi:youtube' },
    { name: 'discord', label: 'Discord', type: 'String', icon: 'mdi:discord' },
    { name: 'privacyPolicy', label: 'Privacy Policy', type: 'String', icon: 'ic:outline-privacy-tip' },
    { name: 'termsCondition', label: 'Terms & Condition', type: 'String', icon: 'solar:document-broken' },
    { name: 'helpUrl', label: 'Help URL', type: 'String', icon: 'ic:baseline-live-help' },
    { name: 'supportEmail', label: 'Support Email', type: 'String', icon: 'ic:baseline-email' },
    { name: 'partnerEmail', label: 'Partner Email', type: 'String', icon: 'ic:baseline-email' },
    { name: 'pressEmail', label: 'Press Email', type: 'String', icon: 'ic:baseline-email' },
    { name: 'contactNo', label: 'Contact No', type: 'String', icon: 'ic:baseline-call' }
  ]

  return (
    <>
      {!dataLoading && (
        <CustomInputForm
          title='Social Links'
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

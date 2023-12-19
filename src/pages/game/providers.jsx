// import DataGrid from "@/components/DataGrid";
import AddEditForm from 'src/components/AddEditForm'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import Datagrid from 'src/components/DataGrid'
import React, { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import CopyModel from 'src/components/CopyDialog'
import usePermission from 'src/hooks/usePermission'

export default function GameProviders() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [adminId, setAdminId] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [secretFields, setSecretFields] = useState([])

  // access
  const isAddAccess = usePermission('Game', 'Game Providers', 'Add')
  const isEditAccess = usePermission('Game', 'Game Providers', 'Edit')
  const isDeleteAccess = usePermission('Game', 'Game Providers', 'Delete')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    data: {},
    isEdit: false
  })

  const getProviderList = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetAllGameProvider(token)
        if (res?.data?.status === true) {
          const modifiedData = res?.data?.data.map((item, index) => ({
            ...item,
            srno: index + 1,
            adminName: item?.admin?.name,
            email: item?.admin?.email,
            password: item?.admin?.pwd,
            profile: item?.admin?.profile,
            profileUrl: item?.admin?.profileUrl,
            admin: item?.admin?._id
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
    getProviderList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // handle state
  const onAddClick = () => setshowAddEditForm({ isVisible: true, data: {}, isEdit: false })

  const onEditClick = data => {
    setId(data?._id)
    setAdminId(data?.admin)
    setshowAddEditForm({
      isVisible: true,
      isEdit: true,
      data
    })
  }
  const onCloseClick = () => setshowAddEditForm({ isVisible: false, data: {}, isEdit: false })

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const create = async (data, bannerFormData, iconFormData, profileFormData) => {
    setLoading(true)
    const res = await DataServices.callAddGameProvider(data, token)
    const providerData = res?.data?.data

    setSecretFields([
      { name: 'getInitVector', label: 'getInitVector', value: providerData?.getInitVector },
      { name: 'getSecurityKey', label: 'getSecurityKey', value: providerData?.getSecurityKey },
      { name: 'sendInitVector', label: 'sendInitVector', value: providerData?.sendInitVector },
      { name: 'sendSecurityKey', label: 'sendSecurityKey', value: providerData?.sendSecurityKey }
    ])
    const id = providerData?._id

    if (res?.data?.statusCode === 200) {
      // upload

      if (typeof data?.bannerImage === 'object' || typeof data?.iconImage === 'object') {
        const [bannerRes, iconRes, profileRes] = await Promise.all([
          typeof data?.bannerImage === 'object'
            ? DataServices.callUploadGameProviderBannerImage(id, bannerFormData, token)
            : null,
          typeof data?.iconImage === 'object'
            ? DataServices.callUploadGameProviderIconImage(id, iconFormData, token)
            : null,
          typeof data?.profile === 'object' ? DataServices.callUploadAdminPhoto(adminId, profileFormData, token) : null
        ])

        if (bannerRes || iconRes || profileRes) {
          if (
            bannerRes?.data?.statusCode !== 200 ||
            iconRes?.data?.statusCode !== 200 ||
            profile?.data?.statusCode !== 200
          ) {
            setLoading(false)
            toast.error(res?.data?.message)
          }
        }
      }

      setLoading(false)
      onCloseClick()
      setModalOpen(true)
      getProviderList()
      toast.success('Form Submitted')
    } else {
      toast.error(res?.data?.message)
      setLoading(false)
    }
  }

  const edit = async (data, bannerFormData, iconFormData, profileFormData) => {
    setLoading(true)

    const [res, uploadRes] = await Promise.all([
      DataServices.callEditGameProvider(id, data, token),
      typeof data?.bannerImage === 'object'
        ? DataServices.callUploadGameProviderBannerImage(id, bannerFormData, token)
        : null,
      typeof data?.iconImage === 'object'
        ? DataServices.callUploadGameProviderIconImage(id, iconFormData, token)
        : null,
      typeof data?.profile === 'object' ? DataServices.callUploadAdminPhoto(adminId, profileFormData, token) : null
    ])

    if (res?.data?.status === true || uploadRes?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      getProviderList()
      toast.success('Form Submitted')
    } else {
      setLoading(false)
      toast.error(res?.data?.message)
    }
  }

  const handleDelete = async id => {
    try {
      const res = await DataServices.callRemoveGameProvider(id, token)
      if (res?.data?.status === true) {
        getProviderList()
      } else {
        toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const onSubmit = async data => {
    try {
      // form data
      const bannerFormData = new FormData()
      const iconFormData = new FormData()
      const profileFormData = new FormData()
      if (data?.bannerImage) bannerFormData.append('bannerImage', data?.bannerImage)
      if (data?.iconImage) iconFormData.append('iconImage', data?.iconImage)
      if (data?.profile) profileFormData.append('profile', data?.profile)

      if (showAddEditForm.isEdit) {
        await edit(data, bannerFormData, iconFormData, profileFormData)
      } else {
        await create(data, bannerFormData, iconFormData, profileFormData)
      }
    } catch (err) {
      setLoading(false)
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const formFields = [
    { name: 'name', type: 'text', label: 'Provide Name', placeholder: 'Provider name', required: true },
    { name: 'description', type: 'text', label: 'Description', placeholder: 'description', rows: 6, required: true },
    {
      name: 'iconImage',
      label: 'Provider Icon',
      url: 'iconUrl',
      type: 'file',
      required: false,
      width: 2500,
      height: 2500
    },
    { name: 'bannerImage', label: 'Banner Image', url: 'bannerUrl', type: 'file', required: false },
    { name: 'providerId', type: 'copytext', label: 'Provide ID', placeholder: 'Provider ID', disabled: true },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 0, label: 'Active' },
        { value: 1, label: 'Inactive' }
      ],
      required: false
    },
    { name: 'getInitVector', type: 'copytext', label: 'GetInitVector', placeholder: 'Get Init Vector', disabled: true },
    {
      name: 'getSecurityKey',
      type: 'copytext',
      label: 'GetSecurityKey',
      placeholder: 'Get Security Key',
      disabled: true
    },
    {
      name: 'sendInitVector',
      type: 'copytext',
      label: 'SendInitVector',
      placeholder: 'Send Init Vector',
      disabled: true
    },
    {
      name: 'sendSecurityKey',
      type: 'copytext',
      label: 'SendSecurityKey',
      placeholder: 'Send Security Key',
      disabled: true
    },
    { name: 'adminCommission', type: 'text', label: 'Admin Commission', placeholder: 'Commission' },
    { name: 'Admin Provider', type: 'hr', label: 'Admin Provider', isFullWidth: true },

    { name: 'adminName', type: 'text', label: 'Name', placeholder: 'Name', required: true },
    {
      name: 'email',
      type: 'text-input-edit-disabled',
      label: 'Email',
      placeholder: 'Email',
      required: true,
      disabled: true
    },
    {
      name: 'providerIdDev',
      type: 'text',
      label: 'Provide ID Dev',
      placeholder: 'Provider ID Dev',
      required: true
    },
    { name: 'password', type: 'password', label: 'Password', placeholder: 'Password', required: true },
    { name: 'profile', type: 'file', label: 'Profile Image', url: 'profileUrl', required: false }
  ]

  const renderBannerImage = params => {
    const imageUrl = params.row.bannerUrl // Extracting the image URL from the field value

    if (imageUrl)
      return (
        <Box sx={{ display: 'flex', margin: '10px', alignItems: 'center', width: '70px', height: '60px' }}>
          <img src={imageUrl} width='100%' height='100%' style={{ objectFit: 'contain' }} alt='Image' />
        </Box>
      )
    else return '-'
  }

  const renderIconImage = params => {
    const imageUrl = params.row.iconUrl // Extracting the image URL from the field value

    if (imageUrl)
      return (
        <Box sx={{ display: 'flex', margin: '10px', alignItems: 'center', width: '70px', height: '50px' }}>
          <img src={imageUrl} width='100%' height='100%' style={{ objectFit: 'contain' }} alt='Image' />
        </Box>
      )
    else return '-'
  }

  return (
    <div className='main-container container-fluid' style={{ overflow: 'hidden' }}>
      <div className='mt-3'>
        {showAddEditForm.isVisible ? (
          <AddEditForm
            data={showAddEditForm.data}
            isEdit={showAddEditForm.isEdit}
            onSubmit={onSubmit}
            fields={formFields}
            onClose={onCloseClick}
            loading={loading}
            title={showAddEditForm.isEdit ? 'Edit Provider' : 'Add Game Provider'}
          />
        ) : (
          <Datagrid
            data={data}
            header={[
              {
                field: 'srno',
                headerName: 'SNo',
                label: 'SNO'
              },
              {
                headerName: 'Name',
                field: 'name',
                label: 'Name'
              },
              {
                headerName: 'Icon Image',
                field: 'icon',
                renderCell: renderIconImage,
                label: 'ICON'
              },
              {
                headerName: 'Banner',
                field: 'banner',
                renderCell: renderBannerImage
              }
            ]}
            serachBy={['name']}
            headerComponet={ServerSideToolbar}
            showAction
            handleDelete={isDeleteAccess ? handleDelete : null}
            handleEdit={isEditAccess ? onEditClick : null}
            handleAdd={isAddAccess ? onAddClick : null}
            dataLoading={dataLoading}
          />
        )}
      </div>

      {/* Use the CopyDialog component */}
      <CopyModel open={modalOpen} onClose={handleCloseModal} fields={secretFields} />
    </div>
  )
}

const ServerSideToolbar = props => {
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
      <h3>Game Providers</h3>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {props.handleAdd && (
          <Button variant='contained' onClick={props.handleAdd}>
            Add
          </Button>
        )}
      </Box>
    </Box>
  )
}

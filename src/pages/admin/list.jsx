import { Button, Card, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import { GridToolbarExport } from '@mui/x-data-grid'

// import html2pdf from 'html2pdf.js'
import toast from 'react-hot-toast'
import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import Datagrid from 'src/components/DataGrid'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import usePermission from 'src/hooks/usePermission'
import AddEditForm from 'src/components/AddEditForm'
import CustomChip from 'src/@core/components/mui/chip'

export default function List() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [accessData, setAccessData] = useState(null)

  // access
  const isAddAccess = usePermission('Admin', 'Admin List', 'Add')
  const isEditAccess = usePermission('Admin', 'Admin List', 'Edit')
  const isDeleteAccess = usePermission('Admin', 'Admin List', 'Delete')
  const isDownloadAccess = usePermission('Admin', 'Admin List', 'Download')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    isEdit: false,
    data: {}
  })

  const getAdminsList = async () => {
    try {
      const permissionArrRes = await DataServices.callGetPermissionArr()
      if (token) {
        const res = await DataServices.callGetAllAdmins(token)
        if (res?.data?.status === true) {
          const modifiedData = res?.data?.data.map((item, index) => ({
            ...item,
            srno: index + 1
          }))
          setData(modifiedData)
          setAccessData(permissionArrRes?.data)
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
    getAdminsList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // state handle
  const onAddClick = () => setshowAddEditForm({ isVisible: true, isEdit: false, data: {} })

  const onEditClick = data => {
    setId(data?._id)
    const accessArr = data?.permission?.access
    setAccessData(accessArr)

    setshowAddEditForm({
      isVisible: true,
      isEdit: true,
      data: {
        name: data?.name,
        email: data?.email,
        profile: data?.profile,
        profileUrl: data?.profileUrl,
        access: accessArr,
        password: data?.pwd
      }
    })
  }
  const onCloseClick = () => setshowAddEditForm({ isVisible: false, data: {}, isEdit: false })

  const handleDelete = async id => {
    try {
      const res = await DataServices.callRemoveAdmin(id, token)
      if (res?.data?.status === true) {
        getAdminsList()
      } else {
        toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const create = async (data, formData) => {
    setLoading(true)
    const res = await DataServices.Signup(data, token)

    if (res?.data?.status === true) {
      // upload
      if (typeof data?.profile === 'object') {
        const id = res?.data?.data?._id
        const uploadRes = await DataServices.callUploadAdminPhoto(id, formData, token)

        if (uploadRes?.data?.status === true) {
          setLoading(false)
          onCloseClick()
          getAdminsList()
          toast.success('Form Submitted')
        } else {
          setLoading(false)
          toast.error(res?.data?.message)
        }
      }
    } else {
      toast.error(res?.data?.message)
      setLoading(false)
    }
  }

  const edit = async (data, formData) => {
    setLoading(true)

    const [res, uploadRes] = await Promise.all([
      DataServices.callEditAdmin(id, data, token),
      typeof data?.profile === 'object' ? DataServices.callUploadAdminPhoto(id, formData, token) : null
    ])

    if (res?.data?.status === true || uploadRes?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      getAdminsList()
      toast.success('Form Submitted')
    } else {
      setLoading(false)
      toast.error(res?.data?.message)
    }
  }

  const onSubmit = async data => {
    try {
      // form data
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })

      const requestData = {
        ...data,
        access: JSON.stringify(accessData)
      }

      if (showAddEditForm.isEdit) {
        await edit(requestData, formData)
      } else {
        await create(requestData, formData)
      }
    } catch (err) {
      setLoading(false)
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const formFields = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Name', required: true },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'Email', required: true },
    { name: 'profile', type: 'file', label: 'Profile Image', url: 'profileUrl', required: true },
    { name: 'password', type: 'password', label: 'Password', placeholder: 'Password', required: true },
    { name: 'access', type: 'roleAccess', label: 'Role Permissions', placeholder: 'Role Permissions', required: true }
  ]

  // ticket status
  const roleObj = {
    Admin: { text: 'Admin', color: 'success' },
    Provider: { text: 'Provider', color: 'secondary' }
  }

  return (
    <>
      <Card id='download-PDF'>
        {showAddEditForm.isVisible ? (
          <AddEditForm
            data={showAddEditForm.data}
            isEdit={showAddEditForm.isEdit}
            onSubmit={onSubmit}
            fields={formFields}
            onClose={onCloseClick}
            loading={loading}
            title={showAddEditForm.isEdit ? 'Edit Details' : 'Add Admin'}
            accessData={accessData}
            setAccessData={setAccessData}
          />
        ) : (
          <Datagrid
            showAction
            data={data}
            handleDelete={isDeleteAccess ? handleDelete : null}
            handleEdit={isEditAccess ? onEditClick : null}
            handleAdd={isAddAccess ? onAddClick : null}
            isDownloadAccess={isDownloadAccess}
            headerComponet={ServerSideToolbar}
            title={'Admin list'}
            serachBy={['name', 'email']}
            header={[
              {
                field: 'srno',
                headerName: 'SNo'
              },
              {
                field: 'createdAt',
                label: 'Join Date',
                headerName: 'Date',
                renderCell: ({ value }) => value.split('T')[0]
              },
              {
                field: 'name',
                flex: 1,
                headerName: 'Name'
              },
              {
                field: 'email',
                flex: 1,
                headerName: 'Email'
              },
              {
                field: 'role',
                flex: 1,
                headerName: 'Role',
                renderCell: ({ value }) => (
                  <CustomChip
                    rounded
                    size='small'
                    skin='light'
                    label={roleObj[value]?.text || 'Unknown'}
                    color={roleObj[value]?.color || 'default'}
                  />
                )
              }
            ]}
          />
        )}
      </Card>
    </>
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
      <CustomTextField
        value={props.value}
        placeholder='Search…'
        onChange={props.onChange}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 2, display: 'flex' }}>
              <IconifyIcon fontSize='1.25rem' icon='tabler:search' />
            </Box>
          ),
          endAdornment: (
            <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
              <IconifyIcon fontSize='1.25rem' icon='tabler:x' />
            </IconButton>
          )
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto'
          },
          '& .MuiInputBase-root > svg': {
            mr: 2
          }
        }}
      />
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
            Add Admin
          </Button>
        )}

        {props.isDownloadAccess && <GridToolbarExport printOptions={{ disableToolbarButton: true }} />}
      </Box>
    </Box>
  )
}

// import DataGrid from "@/components/DataGrid";
import AddEditForm from 'src/components/AddEditForm'
import { Button } from '@mui/material'
import { Box } from '@mui/system'
import Datagrid from 'src/components/DataGrid'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import usePermission from 'src/hooks/usePermission'
import CustomChip from 'src/@core/components/mui/chip'

export default function Blog() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)

  // access
  const isAddAccess = usePermission('Controls', 'Blog', 'Add')
  const isEditAccess = usePermission('Controls', 'Blog', 'Edit')
  const isDeleteAccess = usePermission('Controls', 'Blog', 'Delete')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    data: {},
    isEdit: false
  })

  const getBlogList = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetAllBlog(token)
        if (res?.data?.status === true) {
          const modifiedData = res?.data?.data.map((item, index) => ({
            ...item,
            srno: index + 1
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
    getBlogList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // handle state
  const onAddClick = () => setshowAddEditForm({ isVisible: true, data: {}, isEdit: false })

  const onEditClick = data => {
    setId(data?._id)
    setshowAddEditForm({
      isVisible: true,
      isEdit: true,
      data
    })
  }
  const onCloseClick = () => setshowAddEditForm({ isVisible: false, data: {}, isEdit: false })

  const handleDelete = async id => {
    try {
      const res = await DataServices.callRemoveBlog(id, token)
      if (res?.data?.status === true) {
        getBlogList()
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
    const res = await DataServices.callAddBlog(data, token)

    if (res?.data?.status === true) {
      // upload
      if (typeof data?.blogImage === 'object') {
        const id = res?.data?.data?._id
        const uploadRes = await DataServices.callUploadBlogImage(id, formData, token)

        if (uploadRes?.data?.status === true) {
          setLoading(false)
          onCloseClick()
          getBlogList()
          toast.success('Form Submitted')
        } else {
          setLoading(false)
          toast.error(res?.data?.message)
        }
      }
    } else {
      toast.error('Something wrent wrong!')
      setLoading(false)
    }
  }

  const edit = async (data, formData) => {
    setLoading(true)

    const [res, uploadRes] = await Promise.all([
      DataServices.callEditBlog(id, data, token),
      typeof data?.blogImage === 'object' ? DataServices.callUploadBlogImage(id, formData, token) : null
    ])

    if (res?.data?.status === true || uploadRes?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      getBlogList()
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

      if (showAddEditForm.isEdit) {
        await edit(data, formData)
      } else {
        await create(data, formData)
      }
    } catch (err) {
      setLoading(false)
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const formFields = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Blog name', required: true },
    { name: 'title', type: 'text', label: 'Title', placeholder: 'Blog Title', required: true },
    { name: 'subTitle', type: 'editor', label: 'Subtitle', placeholder: 'Blog Subtitle', required: true },
    { name: 'description', type: 'editor', label: 'Description', placeholder: 'Description', rows: 6 },

    { name: 'facebook', type: 'text', label: 'Facebook URL', placeholder: 'URL' },
    { name: 'twitter', type: 'text', label: 'Twitter URL', placeholder: 'URL' },
    { name: 'whatsapp', type: 'text', label: 'Whatsapp URL', placeholder: 'URL' },
    { name: 'instagram', type: 'text', label: 'Instagram URL', placeholder: 'URL' },
    { name: 'youtube', type: 'text', label: 'Youtube URL', placeholder: 'URL' },
    { name: 'telegram', type: 'text', label: 'Telegram URL', placeholder: 'URL' },
    { name: 'discord', type: 'text', label: 'Discord URL', placeholder: 'URL' },
    { name: 'date', type: 'text', label: 'Date', placeholder: 'Date' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 0, label: 'Active' },
        { value: 1, label: 'Inactive' }
      ]
    },
    { name: 'blogImage', label: 'Blog Image', url: 'imageUrl', type: 'file', required: true }
  ]

  const renderImageLink = params => {
    const imageUrl = params.row.imageUrl // Extracting the image URL from the field value

    return (
      <Box sx={{ display: 'flex', margin: '10px', alignItems: 'center', width: '70px', height: '60px' }}>
        <img src={imageUrl} width='100%' height='100%' style={{ objectFit: 'contain' }} alt='Image' />
      </Box>
    )
  }

  const statusObj = {
    0: { text: 'Active', color: 'success' },
    1: { text: 'Inactive', color: 'secondary' }
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
            title={showAddEditForm.isEdit ? 'Edit Blog' : 'Add Blog'}
          />
        ) : (
          <Datagrid
            data={data}
            header={[
              {
                field: 'srno',
                headerName: 'SNo'
              },
              {
                headerName: 'Name',
                field: 'name',
                label: 'Name'
              },
              {
                headerName: 'Image',
                field: 'image',
                label: 'URL',
                renderCell: renderImageLink
              },
              {
                field: 'date',
                label: 'Date',
                headerName: 'Date',
                renderCell: ({ value }) => value.split('T')[0]
              },
              {
                headerName: 'Status',
                field: 'status',
                label: 'Status',
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
      <h3>Blog List</h3>
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

import DataGrid from 'src/components/DataGrid'
import { Box } from '@mui/system'
import CustomTextField from 'src/@core/components/mui/text-field'
import IconifyIcon from 'src/@core/components/icon'
import { Card, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import AddEditForm from 'src/components/AddEditForm'
import usePermission from 'src/hooks/usePermission'

export default function List() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)

  // access
  const isEditAccess = usePermission('Contact Details', 'Contact', 'Edit')
  const isDeleteAccess = usePermission('Contact Details', 'Contact', 'Delete')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    isEdit: false,
    data: {}
  })

  const GetSubmissions = async () => {
    try {
      if (token) {
        const res = await DataServices.callGetSubmissions(token)
        if (res?.data?.status === true) {
          const modifiedData = res?.data?.data.map((item, index) => ({
            ...item,
            srno: index + 1
          }))
          setData(modifiedData)
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
    GetSubmissions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // state handle
  const onEditClick = data => {
    setId(data?._id)
    setshowAddEditForm({
      isVisible: true,
      isEdit: true,
      data: data
    })
  }
  const onCloseClick = () => setshowAddEditForm({ isVisible: false, data: {}, isEdit: false })

  const edit = async data => {
    setLoading(true)
    const res = await DataServices.callUpdateSubmissions(id, data, token)

    if (res?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      GetSubmissions()
      toast.success('Form Submitted')
    } else {
      setLoading(false)
      toast.error(res?.data?.message)
    }
  }

  const handleDelete = async id => {
    try {
      const res = await DataServices.callRemoveSubmissions(id, token)
      if (res?.data?.status === true) {
        GetSubmissions()
      } else {
        toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error(err.message)
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
      }
    } catch (err) {
      console.log('err::', err)
      setLoading(false)
      toast.error(err.message)
    }
  }

  const formFields = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Name', required: true, disabled: true },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'Email', required: true, disabled: true },
    { name: 'phone', type: 'text', label: 'Phone', placeholder: 'Phone', required: true, disabled: true },
    { name: 'description', type: 'text', label: 'Message', placeholder: 'description', required: true, disabled: true },
    { name: 'feedback', type: 'text', label: 'Feedback', placeholder: 'write feedback here' }
  ]

  return (
    <>
      <Card>
        {showAddEditForm.isVisible ? (
          <AddEditForm
            data={showAddEditForm.data}
            isEdit={showAddEditForm.isEdit}
            onSubmit={onSubmit}
            fields={formFields}
            onClose={onCloseClick}
            loading={loading}
            title={'Contact us'}
          />
        ) : (
          <DataGrid
            showAction
            data={data}
            handleDelete={isDeleteAccess ? handleDelete : null}
            handleEdit={isEditAccess ? onEditClick : null}
            headerComponet={ServerSideToolbar}
            serachBy={['username', 'email']}
            title={'Contact us'}
            header={[
              {
                field: 'srno',
                headerName: 'SNo'
              },
              {
                field: 'createdAt',
                headerName: 'Date',
                renderCell: ({ value }) => value.split('T')[0]
              },
              {
                field: 'name',
                label: 'Name',
                headerName: 'Name',
                flex: 0
              },
              {
                field: 'email',
                label: 'Email',
                headerName: 'Email',
                renderCell: ({ value }) => value || '-'
              },
              {
                field: 'phoneNo',
                label: 'Phone No',
                headerName: 'Phone No',
                flex: 1,
                renderCell: ({ value }) => value || '-'
              },
              {
                field: 'description',
                label: 'Phone No',
                headerName: 'Description',
                flex: 1
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
    </Box>
  )
}

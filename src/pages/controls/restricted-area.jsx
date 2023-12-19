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

export default function RestrictedAreaList() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)

  // access
  const isAddAccess = usePermission('Controls', 'Restricted Area', 'Add')
  const isEditAccess = usePermission('Controls', 'Restricted Area', 'Edit')
  const isDeleteAccess = usePermission('Controls', 'Restricted Area', 'Delete')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    data: {},
    isEdit: false
  })

  const getList = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetAllRestrictedArea(token)
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
    getList()
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
      const res = await DataServices.callRemoveRestrictedArea(id, token)
      if (res?.data?.status === true) {
        getList()
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
      setLoading(true)
      let res
      if (showAddEditForm.isEdit) {
        res = await DataServices.callEditRestrictedArea(id, data, token)
      } else {
        res = await DataServices.callAddRestrictedArea(data, token)
      }

      if (res?.data?.status === true) {
        setLoading(false)
        onCloseClick()
        getList()
        toast.success('Form Submitted')
      } else {
        setLoading(false)
        toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      setLoading(false)
      toast.error(err.message)
    }
  }

  const formFields = [
    { name: 'country', type: 'text', label: 'Country', placeholder: 'Country name', required: true },
    { name: 'state', type: 'text', label: 'State', placeholder: 'State name', required: false },
    { name: 'city', type: 'text', label: 'City', placeholder: 'City name', required: false },
    { name: 'note', type: 'text', label: 'Note', placeholder: 'write note here', required: false }
  ]

  // spin wheel status
  const statusObj = {
    active: { text: 'Active', color: 'success' },
    inactive: { text: 'Inactive', color: 'secondary' }
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
            title={showAddEditForm.isEdit ? 'Edit Restricted Area' : 'Add Restricted Area'}
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
                field: 'country',
                headerName: 'Country'
              },
              {
                field: 'state',
                headerName: 'State'
              },
              {
                field: 'city',
                headerName: 'CIty'
              },
              {
                field: 'note',
                headerName: 'Note',
                renderCell: ({ value }) => value || '-'
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
      <h3>Restricted Area List</h3>
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

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

export default function SpinWheelList() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)

  // access
  const isAddAccess = usePermission('Controls', 'Spin Wheel', 'Add')
  const isEditAccess = usePermission('Controls', 'Spin Wheel', 'Edit')
  const isDeleteAccess = usePermission('Controls', 'Spin Wheel', 'Delete')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    data: {},
    isEdit: false
  })

  const getSpinWheelList = async () => {
    try {
      if (token) {
        const res = await DataServices.callGetAllSpinWheel(token)
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
    getSpinWheelList()
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
      const res = await DataServices.callRemoveSpinWheel(id, token)
      if (res?.data?.status === true) {
        getSpinWheelList()
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
        res = await DataServices.callEditSpinWheel(id, data, token)
      } else {
        res = await DataServices.callAddSpinWheel(data, token)
      }

      if (res?.data?.status === true) {
        setLoading(false)
        onCloseClick()
        getSpinWheelList()
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
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Name', required: true },
    { name: 'chance', type: 'number', label: 'Chance', placeholder: 'Chance', required: true },
    { name: 'amount', type: 'number', label: 'Amount', placeholder: 'Amount' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      options: [
        { value: 0, label: 'Free' },
        { value: 1, label: 'Price' }
      ]
    }
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
            title={showAddEditForm.isEdit ? 'Edit Spin Wheel' : 'Add Spin Wheel'}
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
                field: 'name'
              },
              {
                field: 'type',
                headerName: 'Type',
                renderCell: ({ value }) => ({ 0: 'Free', 1: 'Price' }[value] || '-')
              },
              {
                field: 'amount',
                headerName: 'Amount'
              },
              {
                field: 'status',
                headerName: 'Status',
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
      <h3>Spin Wheel List</h3>
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

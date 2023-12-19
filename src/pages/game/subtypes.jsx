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

export default function GameTypes() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)

  // access
  const isAddAccess = usePermission('Game', 'Game subtypes', 'Add')
  const isEditAccess = usePermission('Game', 'Game subtypes', 'Edit')
  const isDeleteAccess = usePermission('Game', 'Game subtypes', 'Delete')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    data: {},
    isEdit: false
  })

  const getTypeList = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetAllGameSubtype(token)
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
    getTypeList()
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
      const res = await DataServices.callRemoveSubtype(id, token)
      if (res?.data?.status === true) {
        getTypeList()
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
        res = await DataServices.callEditSubtype(id, data, token)
      } else {
        res = await DataServices.callAddSubtype(data, token)
      }

      if (res?.data?.status === true) {
        setLoading(false)
        onCloseClick()
        getTypeList()
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

  const formFields = [{ name: 'name', type: 'text', label: 'Name', placeholder: 'Name', required: true }]

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
            title={showAddEditForm.isEdit ? 'Edit Subtype' : 'Add New Subtype'}
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
                field: 'createdAt',
                label: 'Date',
                headerName: 'Date',
                renderCell: ({ value }) => value.split('T')[0]
              },
              {
                headerName: 'Name',
                field: 'name',
                label: 'Name'
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
      <h3>Game Types</h3>
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

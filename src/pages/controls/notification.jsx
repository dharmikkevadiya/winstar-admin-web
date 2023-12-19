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
import { socket } from 'src/utils/socket'

export default function Notification() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [playerList, setPlayerList] = useState(null)
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  // access
  const isAddAccess = usePermission('Controls', 'Notification', 'Add')
  const isEditAccess = usePermission('Controls', 'Notification', 'Edit')
  const isDeleteAccess = usePermission('Controls', 'Notification', 'Delete')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    data: {},
    isEdit: false
  })

  const getNotificationList = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetAllNotification(token)
        const playerListRes = await DataServices.callGetPlayersListForNotification(token)
        if (res?.data?.status === true) {
          const modifiedData = res?.data?.data.map((item, index) => ({
            ...item,
            srno: index + 1
          }))
          handleResponse(playerListRes)
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
    getNotificationList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleResponse = res => {
    if (res?.data?.statusCode === 200) {
      const list = res?.data?.data

      const options = list.map(elem => ({
        value: elem._id,
        label: `${elem.username} - ${elem.email}`
      }))
      setPlayerList(options)
    }
  }

  const handleResponseForEdit = res => {
    if (res?.data?.statusCode === 200) {
      const item = res?.data?.data

      const options = item?.selectedPerson?.map(elem => ({
        value: elem?.playerId?._id,
        label: `${elem.playerId?.username} - ${elem.playerId?.email}`,
        seen: elem?.seen
      }))

      setPlayerList(options)

      return { item, options }
    }
  }

  // handle state
  const onAddClick = async () => {
    await getNotificationList()
    setshowAddEditForm({ isVisible: true, data: {}, isEdit: false })
  }

  const onEditClick = async data => {
    const res = await DataServices.callGetNotificationById(data?._id, token)
    const { item, options } = handleResponseForEdit(res)
    setId(data?._id)
    setshowAddEditForm({
      isVisible: true,
      isEdit: true,
      data: {
        ...item,
        selectedPerson: options
      }
    })
  }

  const onCloseClick = () => {
    setshowAddEditForm({ isVisible: false, data: {}, isEdit: false })
    setPlayerList(null)
  }

  const handleDelete = async id => {
    try {
      const res = await DataServices.callRemoveNotification(id, token)
      if (res?.data?.status === true) {
        getNotificationList()
      } else {
        toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const create = async formData => {
    setLoading(true)
    const res = await DataServices.callSendNotification(formData, token)

    if (res?.data?.status === true) {
      socket.emit('admin_Send_notification', {
        notification: true,
        playerIds: selectedIds
      })

      // upload
      setLoading(false)
      onCloseClick()
      getNotificationList()
      toast.success('Notification send successfully')
    } else {
      toast.error(res?.data?.message)
      setLoading(false)
    }
  }

  //   const edit = async (data, formData) => {
  //     setLoading(true)

  //     const res = await DataServices.callSendNotification(formData, token)

  //     if (res?.data?.status === true) {
  //       setLoading(false)
  //       onCloseClick()
  //       getNotificationList()
  //       toast.success('Update Submitted')
  //     } else {
  //       setLoading(false)
  //       toast.error(res?.data?.message)
  //     }
  //   }

  const onSubmit = async data => {
    try {
      // form data
      setSelectedIds(data?.selectedPerson)
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })

      if (showAddEditForm.isEdit) {
        await edit(formData)
      } else {
        await create(formData)
      }
    } catch (err) {
      setLoading(false)
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const formFieldsForSend = [
    {
      name: 'title',
      type: 'textarea',
      label: 'Title',
      placeholder: 'Notification title',
      required: true
    },
    { name: 'body', type: 'textarea', label: 'Body', placeholder: 'Notification body' },
    {
      name: 'selectedPerson',
      label: 'Select Player',
      type: 'multiSelect',
      options: playerList
    },
    { name: 'image', label: 'Notification Image', url: 'imageUrl', type: 'file', required: false }
  ]

  const formFields = [
    {
      name: 'title',
      type: 'textarea',
      label: 'Title',
      placeholder: 'Notification title',
      required: true,
      disabled: true
    },
    { name: 'body', type: 'textarea', label: 'Body', placeholder: 'Notification body', disabled: true },
    {
      name: 'selectedPerson',
      label: 'Selectd Player',
      type: 'chips',
      options: playerList
    },
    { name: 'imageUrl', type: 'image', url: 'imageUrl', label: 'Notification Image', objectFit: 'cover' }
  ]

  const renderImageLink = params => {
    const imageUrl = params.row.imageUrl // Extracting the image URL from the field value

    if (imageUrl)
      return (
        <Box sx={{ display: 'flex', margin: '10px', alignItems: 'center', width: '70px', height: '60px' }}>
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
            fields={showAddEditForm.isEdit ? formFields : formFieldsForSend}
            onClose={onCloseClick}
            loading={loading}
            title={showAddEditForm.isEdit ? 'Edit Notification' : 'Send Notification'}
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
                field: 'title',
                headerName: 'Title'
              },
              {
                field: 'body',
                headerName: 'Body'
              },
              {
                headerName: 'Image',
                field: 'image',
                renderCell: renderImageLink
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
      <h3>Notification List</h3>
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
            Send
          </Button>
        )}
      </Box>
    </Box>
  )
}

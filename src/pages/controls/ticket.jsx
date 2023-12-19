import DataGrid from 'src/components/DataGrid'
import { Box } from '@mui/system'
import CustomTextField from 'src/@core/components/mui/text-field'
import IconifyIcon from 'src/@core/components/icon'
import { Button, Card, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import usePermission from 'src/hooks/usePermission'
import TicketAddEditForm from 'src/components/TicketAddEditForm'
import CustomChip from 'src/@core/components/mui/chip'

export default function List() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [playerList, setPlayerList] = useState([])
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)

  // access
  const isAddAccess = usePermission('Controls', 'Ticket', 'Add')
  const isEditAccess = usePermission('Controls', 'Ticket', 'Edit')
  const isDeleteAccess = usePermission('Controls', 'Ticket', 'Delete')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    isEdit: false,
    data: {}
  })

  const GetSubmissions = async () => {
    try {
      if (token) {
        const res = await DataServices.callGetTickets(token)
        const playerRes = await DataServices.callGetPlayersEmailList(token)

        if (res?.data?.status === true) {
          const modifiedData = res?.data?.data.map((item, index) => ({
            ...item,
            srno: index + 1
          }))
          setData(modifiedData)
        } else {
          toast.error(res?.data?.message)
        }

        if (playerRes?.data?.status === true) {
          setPlayerList(playerRes?.data?.data)
        } else {
          toast.error(playerRes?.data?.message)
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

  const getTicketById = async id => {
    try {
      const res = await DataServices.callGetTicketById(id, token)

      if (res?.data?.status === true) {
        return res?.data?.data
      } else {
        toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  // state handle
  const onAddClick = () => setshowAddEditForm({ isVisible: true, data: selectedPlayer, isEdit: false })

  const onEditClick = async data => {
    setId(data?._id)

    const idData = await getTicketById(data?._id)
    if (idData) {
      setshowAddEditForm({
        isVisible: true,
        isEdit: true,
        data: idData
      })
    }
  }

  const handleSelectPlayer = id => {
    const result = playerList.find(player => player._id === id)
    setshowAddEditForm({ isVisible: true, data: result, isEdit: false })
    setSelectedPlayer(result)
  }

  const onCloseClick = () => {
    setSelectedPlayer(null)
    setshowAddEditForm({ isVisible: false, data: {}, isEdit: false })
  }

  const edit = async data => {
    setLoading(true)
    const res = await DataServices.callUpdateTicket(id, data, token)

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

  const create = async (data, formData) => {
    if (!selectedPlayer) return toast.error('Please select email!')

    const payload = {
      ...data,
      playerId: selectedPlayer?._id
    }
    setLoading(true)
    const res = await DataServices.callCreateTicket(payload, token)

    if (res?.data?.status === true) {
      // upload
      if (typeof data?.issueImage === 'object') {
        const id = res?.data?.data?._id
        await DataServices.callUploadTicketImage(id, formData, token)
      }

      setLoading(false)
      onCloseClick()
      GetSubmissions()
      toast.success('Form Submitted')
    } else {
      toast.error(res?.data?.message)
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      const res = await DataServices.callRemoveTicket(id, token)
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
      } else {
        await create(data, formData)
      }
    } catch (err) {
      console.log('err::', err)
      setLoading(false)
      toast.error(err.message)
    }
  }

  // ticket status
  const statusObj = {
    pending: { text: 'Pending', color: 'secondary' },
    inReview: { text: 'InReview', color: 'success' },
    closed: { text: 'Closed', color: 'warning' }
  }

  const formFields = [
    {
      name: 'issueTitle',
      type: 'text',
      label: 'Issue Title',
      placeholder: 'Issue Title',
      disabled: true
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Description',
      disabled: true
    },
    { name: 'playerName', type: 'text', label: 'Player Name', placeholder: 'Player Name', disabled: true },
    { name: 'playerEmail', type: 'email', label: 'Player Email', placeholder: 'Player Email', disabled: true },
    { name: 'playerPhone', type: 'text', label: 'Player Phone', placeholder: 'Player Phone', disabled: true },
    {
      name: 'ticketStatus',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'closed', label: 'Closed' },
        { value: 'inReview', label: 'InReview' }
      ],
      required: true
    },
    { name: 'issueImageUrl', type: 'image', url: 'issueImageUrl', label: 'Issue Image' },
    { name: 'issueImageUrl2', type: 'image', url: 'issueImageUrl2', label: 'Issue Image' },
    {
      name: 'ticketMessages',
      type: 'chats',
      label: 'Ticket Messages',
      placeholder: 'Ticket Messages',
      fullWidth: true
    },
    { name: 'feedback', type: 'text', label: 'Feedback', placeholder: 'Type a message', fullWidth: true }
  ]

  const formFieldsForCreate = [
    {
      name: 'issueTitle',
      type: 'text',
      label: 'Issue Title',
      placeholder: 'Issue Title',
      required: true
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Description',
      required: true
    },
    { name: 'playerName', type: 'text', label: 'Player Name', placeholder: 'Player Name', disabled: true },
    { name: 'playerEmail', type: 'email', label: 'Player Email', placeholder: 'Player Email', disabled: true },
    { name: 'playerPhone', type: 'text', label: 'Player Phone', placeholder: 'Player Phone', disabled: true },
    {
      name: 'ticketStatus',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'closed', label: 'Closed' },
        { value: 'inReview', label: 'InReview' }
      ],
      required: true
    },
    { name: 'issueImage', type: 'file', label: 'Issue Image', url: 'issueImageUrl', required: false },
    {
      name: 'ticketMessages',
      type: 'chats',
      label: 'Ticket Messages',
      placeholder: 'Ticket Messages',
      fullWidth: true
    },
    { name: 'feedback', type: 'text', label: 'Feedback', placeholder: 'write feedback here...', fullWidth: true }
  ]

  return (
    <>
      <Card>
        {showAddEditForm.isVisible ? (
          <TicketAddEditForm
            data={showAddEditForm.data}
            isEdit={showAddEditForm.isEdit}
            onSubmit={onSubmit}
            fields={showAddEditForm.isEdit ? formFields : formFieldsForCreate}
            onClose={onCloseClick}
            loading={loading}
            title={showAddEditForm.isEdit ? 'Edit Ticket' : 'Add Ticket'}
            isDropdownShow={showAddEditForm.isEdit ? false : true}
            playerList={playerList}
            handleSelectPlayer={handleSelectPlayer}
            selectedPlayer={selectedPlayer}
          />
        ) : (
          <DataGrid
            showAction
            data={data}
            handleDelete={isDeleteAccess ? handleDelete : null}
            handleEdit={isEditAccess ? onEditClick : null}
            handleAdd={isAddAccess ? onAddClick : null}
            headerComponet={ServerSideToolbar}
            serachBy={['username', 'email']}
            title={'Ticket List'}
            header={[
              {
                field: 'srno',
                headerName: 'SNo'
              },
              {
                field: 'createdAt',
                label: 'Date',
                headerName: 'Date',
                renderCell: ({ value }) => value.split('T')[0]
              },
              {
                field: 'playerName',
                headerName: 'Name',
                renderCell: ({ value }) => value || '-'
              },
              {
                field: 'playerEmail',
                headerName: 'Email',
                renderCell: ({ value }) => value || '-'
              },
              {
                field: 'issueTitle',
                headerName: 'Issue Title',
                flex: 0
              },
              {
                field: 'description',
                headerName: 'Description',
                flex: 0
              },
              {
                field: 'ticketStatus',
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
            Create Ticket
          </Button>
        )}
      </Box>
    </Box>
  )
}

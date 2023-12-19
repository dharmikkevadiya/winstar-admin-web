import { Grid, Paper, Typography, Tooltip, Card, CardContent, Fab } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import DeleteModal from 'src/components/DeleteModal'
import toast from 'react-hot-toast'
import AddEditForm from 'src/components/AddEditForm'
import Head from 'src/components/Head'
import GameGridSkeleton from 'src/components/GameGridSkeleton'
import usePermission from 'src/hooks/usePermission'

export default function List() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [providers, setProviders] = useState([])
  const [types, setTypes] = useState([])
  const [subtypes, setSubtypes] = useState([])
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)

  // access
  const isAddAccess = usePermission('Game', 'Game List', 'Add')
  const isEditAccess = usePermission('Game', 'Game List', 'Edit')
  const isDeleteAccess = usePermission('Game', 'Game List', 'Delete')

  const [deleteModal, setdeleteModal] = useState({
    id: '',
    isOpen: false
  })

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    data: {},
    isEdit: false
  })

  const handleResponse = (res, set, iconShow) => {
    if (res?.data?.statusCode === 200) {
      const list = res?.data?.data

      const options = list.map(elem => ({
        value: elem._id,
        label: elem.name,
        icon: iconShow ? elem?.iconUrl : ''
      }))
      set(options)
    }
  }

  const getGameList = async () => {
    try {
      if (token) {
        const [res, providerRes, typeRes, subtypeRes] = await Promise.all([
          DataServices.callGetAllGames(token),
          DataServices.callGetAllGameProvider(token),
          DataServices.callGetAllGameType(token),
          DataServices.callGetAllGameSubtype(token)
        ])

        if (res?.data?.status === true) {
          setData(res?.data?.data)

          handleResponse(providerRes, setProviders, true)
          handleResponse(typeRes, setTypes)
          handleResponse(subtypeRes, setSubtypes)
        } else toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }
  useEffect(() => {
    getGameList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // state handle
  const onEditClick = data => {
    setId(data?._id)
    setshowAddEditForm({
      isVisible: true,
      isEdit: true,
      data
    })
  }
  const onAddClick = () => setshowAddEditForm({ isVisible: true, data: {}, isEdit: false })

  const onCloseClick = () => {
    setId(null)
    setshowAddEditForm({ isVisible: false, data: {}, isEdit: false })
  }

  const handleDeleteOpen = id => {
    setdeleteModal({ id, isOpen: true })
  }
  const handleDeleteClose = () => setdeleteModal({ id: '', isOpen: false })

  const handleDeleteYes = () => {
    handleDelete(deleteModal?.id)
    handleDeleteClose()
  }

  const create = async (data, formData) => {
    setLoading(true)
    const res = await DataServices.callAddGame(data, token)

    if (res?.data?.status === true) {
      // upload
      if (typeof data?.image === 'object') {
        const id = res?.data?.data?._id
        const uploadRes = await DataServices.callUploadGameImage(id, formData, token)

        if (uploadRes?.data?.status === true) {
          setLoading(false)
          onCloseClick()
          getGameList()
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
      DataServices.callEditGame(id, data, token),
      typeof data?.image === 'object' ? DataServices.callUploadGameImage(id, formData, token) : null
    ])

    if (res?.data?.status === true || uploadRes?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      getGameList()
      toast.success('Form Submitted')
    } else {
      setLoading(false)
      toast.error(res?.data?.message)
    }
  }

  const handleDelete = async id => {
    try {
      const res = await DataServices.callRemoveGame(id, token)
      if (res?.data?.status === true) {
        getGameList()
      } else toast.error(res?.data?.message)
    } catch (err) {
      console.log('e::', e)
      toast.error('Something wrent wrong!')
    }
  }

  const onSubmit = async data => {
    try {
      //
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

  const formFields = [
    { name: 'title', type: 'text', label: 'Game Name', placeholder: 'Game Name', required: true },
    { name: 'companyName', type: 'text', label: 'Company Name', placeholder: 'Company Name', required: true },
    { name: 'subtitle', type: 'editor', label: 'Subtitle', placeholder: 'Subtitle', rows: 6 },
    { name: 'description', type: 'editor', label: 'Description', placeholder: 'description', rows: 6 },
    {
      name: 'type',
      label: 'Select Type',
      type: 'select',
      options: types
    },
    {
      name: 'subtype',
      label: 'Select Subtype',
      type: 'select',
      options: subtypes
    },

    {
      name: 'funMode',
      label: 'Fun Mode',
      type: 'select',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ],
      required: false
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: true, label: 'Active' },
        { value: false, label: 'Inactive' }
      ],
      required: false
    },
    {
      name: 'image',
      type: 'file',
      url: 'imageUrl',
      label: 'Select Game Image',
      required: true,
      width: 2500,
      height: 2500
    },
    {
      name: 'provider',
      label: 'Select Provider',
      type: 'select',
      options: providers
    },
    { name: 'gameIdDev', type: 'text', label: 'Game ID Dev', placeholder: 'Game ID Dev', required: true },
    { name: 'gameId', type: 'copytext', label: 'Game ID', placeholder: 'Game ID', disabled: true },
    { name: 'url', type: 'text', label: 'Game URL', placeholder: 'Game URL', required: true }
  ]

  return (
    <>
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
              title={showAddEditForm.isEdit ? 'Edit Game' : 'Add New Game'}
            />
          ) : data?.length ? (
            <>
              <Card>
                <Head title='Game List' name='Add Game' handleAdd={isAddAccess ? onAddClick : null} />
                <CardContent>
                  <Grid container spacing={3}>
                    {data.map((game, index) => (
                      <Grid item key={index}>
                        <Paper className='GameListPaper' elevation={3}>
                          <img
                            src={game.imageUrl || '/images/empty-game.png'}
                            alt={game.title}
                            height='250px'
                            className='GameListImage'
                          />
                          <div className='GameListOverlay'>
                            <div className='GameListIcons'>
                              {isEditAccess && (
                                <Tooltip title='Edit'>
                                  <Fab size='small' color='primary' aria-label='edit' onClick={() => onEditClick(game)}>
                                    <IconifyIcon icon='tabler:pencil' />
                                  </Fab>
                                </Tooltip>
                              )}

                              {isDeleteAccess && (
                                <Tooltip title='Delete'>
                                  <Fab
                                    size='small'
                                    color='error'
                                    aria-label='edit'
                                    onClick={() => handleDeleteOpen(game._id)}
                                  >
                                    <IconifyIcon icon='tabler:trash' />
                                  </Fab>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                          <div className='GameListContent'>
                            <Typography variant='bod1'>{game.title}</Typography>
                            <Typography variant='body2'>{game.companyName}</Typography>
                          </div>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <GameGridSkeleton />
            </>
          )}
        </div>
      </div>
      <DeleteModal isOpen={deleteModal.isOpen} onClose={handleDeleteClose} onYesClick={handleDeleteYes} />
    </>
  )
}

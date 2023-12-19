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

export default function CurrencyList() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [loading, setLoading] = useState('')
  const [dataLoading, setDataLoading] = useState(false)

  // access
  const isAddAccess = usePermission('Web Setting', 'Currency', 'Add')
  const isEditAccess = usePermission('Web Setting', 'Currency', 'Edit')
  const isDeleteAccess = usePermission('Web Setting', 'Currency', 'Delete')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    data: {},
    isEdit: false
  })

  const getCurrencyList = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetCurrency(token)
        if (res?.data?.status === true) {
          const siteCurrency = res?.data?.data

          const modifiedData = siteCurrency?.map((item, index) => ({
            ...item,
            srno: index + 1
          }))
          setData(modifiedData)
          setDataLoading(false)
        } else toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }
  useEffect(() => {
    getCurrencyList()
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

  const create = async (data, formData) => {
    setLoading(true)
    const res = await DataServices.callAddCurrency(data, token)
    if (res?.data?.status === true) {
      // upload
      if (typeof data?.image === 'object') {
        const id = res?.data?.data?._id
        await DataServices.callUploadCurrencyIcon(id, formData, token)
      }

      setLoading(false)
      onCloseClick()
      getCurrencyList()
      toast.success('Form Submitted')
    } else {
      toast.error(res?.data?.message)
      setLoading(false)
    }
  }

  const edit = async (data, formData) => {
    setLoading(true)

    const [res, uploadRes] = await Promise.all([
      DataServices.callEditCurrency({ id, ...data }, token),
      typeof data?.image === 'object' ? DataServices.callUploadCurrencyIcon(id, formData, token) : null
    ])

    setLoading(false)

    if (res?.data?.status === true) {
      if (data?.image === 'object' && uploadRes?.data?.status !== true) {
        toast.error(uploadRes?.data?.message)
      } else {
        onCloseClick()
        getCurrencyList()
        toast.success('Form Submitted')
      }
    } else {
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

  const handleDelete = async id => {
    try {
      setLoading(true)
      const res = await DataServices.callRemoveCurrency({ id }, token)
      if (res?.data?.status === true) {
        setLoading(false)
        getCurrencyList()
        toast.success('Remove successfully')
      } else toast.error(res?.data?.message)
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const formFields = [
    { name: 'currencyName', label: 'Name', placeholder: 'Currency name', required: true },
    { name: 'currencyShortName', label: 'Short Name', placeholder: 'Currency short name', required: true },
    { name: 'image', label: 'Currency Icon', url: 'iconUrl', type: 'file', required: false },
    { name: 'currencyValue', type: 'number', label: 'Currency Value', placeholder: 'Currency Value', required: true }
  ]

  const renderIconImage = params => {
    const imageUrl = params.row.iconUrl // Extracting the image URL from the field value

    if (imageUrl)
      return (
        <Box sx={{ display: 'flex', margin: '10px', alignItems: 'center', width: '25px', height: '25px' }}>
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
            title={showAddEditForm.isEdit ? 'Edit Currency' : 'Add New Currency'}
          />
        ) : (
          <Datagrid
            data={data}
            dataLoading={dataLoading}
            header={[
              {
                field: 'srno',
                headerName: 'SNo'
              },
              {
                headerName: 'Name',
                field: 'currencyName'
              },
              {
                headerName: 'Short Name',
                field: 'currencyShortName'
              },
              {
                headerName: 'Icon',
                field: 'icon',
                renderCell: renderIconImage,
                label: 'ICON'
              },
              {
                headerName: 'Currency Value',
                field: 'currencyValue'
              }
            ]}
            serachBy={['currencyName', 'currencyShortName']}
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
      <h3>Site Currency</h3>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Button variant='contained' onClick={props.handleAdd}>
          Add
        </Button>
      </Box>
    </Box>
  )
}

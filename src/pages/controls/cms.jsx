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

export default function CMS() {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState([])
  const [id, setId] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)

  // access
  const isAddAccess = usePermission('Controls', 'CMS', 'Add')
  const isEditAccess = usePermission('Controls', 'CMS', 'Edit')
  const isDeleteAccess = usePermission('Controls', 'CMS', 'Delete')

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    data: {},
    isEdit: false
  })

  const getCMSList = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetAllCMS(token)
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
    getCMSList()
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
      const res = await DataServices.callRemoveCMS(id, token)
      if (res?.data?.status === true) {
        getCMSList()
      } else {
        toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const create = async data => {
    setLoading(true)
    const res = await DataServices.callAddCMS(data, token)

    if (res?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      getCMSList()
      toast.success('Form Submitted')
    } else {
      setLoading(false)
      toast.error(res?.data?.message)
    }
  }

  const edit = async data => {
    setLoading(true)

    const res = await DataServices.callEditCMS(id, data, token)

    if (res?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      getCMSList()
      toast.success('Form Submitted')
    } else {
      setLoading(false)
      toast.error(res?.data?.message)
    }
  }

  const onSubmit = async data => {
    try {
      // form data
      if (showAddEditForm.isEdit) {
        await edit(data)
      } else {
        await create(data)
      }
    } catch (err) {
      setLoading(false)
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const formFields = [
    {
      name: 'cmsType',
      label: 'CMS Type',
      type: 'select',
      options: [
        { value: 0, label: 'Terms And Condition' },
        { value: 1, label: 'Privacy Policy' },
        { value: 2, label: 'BottomBox' },
        { value: 3, label: 'Token Creation' },
        { value: 4, label: 'Token Activation' },
        { value: 5, label: 'Jackpot Safe' },
        { value: 6, label: 'Self Exclusion' },
        { value: 7, label: 'Gambling Limit' },
        { value: 8, label: 'Affiliate' },
        { value: 9, label: 'Affiliate Retention Program' },
        { value: 10, label: 'Affiliate Commission' }
      ],
      required: true
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 0, label: 'Active' },
        { value: 1, label: 'Inactive' }
      ],
      required: false
    },
    { name: 'title', type: 'editor', label: 'Title', placeholder: 'Title', rows: 6 },
    { name: 'subTitle', type: 'editor', label: 'Subtitle', placeholder: 'description', rows: 6 },
    {
      name: 'commissionText',
      type: 'text',
      label: 'Commission Text',
      placeholder: 'Commission formula'
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link',
      placeholder: 'Link'
    },
    {
      name: 'extra',
      type: 'textarea',
      label: 'Extra',
      placeholder: 'Extra1',
      rows: 5
    }
  ]

  // ticket status
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
            title={showAddEditForm.isEdit ? 'Edit Details' : 'Add New'}
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
                headerName: 'CMS Type',
                field: 'cmsType',
                label: 'Type',
                renderCell: ({ value }) =>
                  ({
                    0: 'Terms And Condition',
                    1: 'Privacy Policy',
                    2: 'BottomBox',
                    3: 'Token Creation',
                    4: 'Token Activation',
                    5: 'Jackpot Safe',
                    6: 'Self Exclusion',
                    7: 'Gambling Limit',
                    8: 'Affiliate',
                    9: 'Affiliate Retention Program',
                    10: 'Affiliate Commission'
                  }[value] || '-')
              },
              {
                field: 'link',
                headerName: 'Link',
                renderCell: ({ value }) => value || '-'
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
      <h3>CMS List</h3>
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

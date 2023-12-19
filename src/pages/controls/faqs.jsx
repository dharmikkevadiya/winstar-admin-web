import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import Faqs from '../../components/Faqs'
import usePermission from 'src/hooks/usePermission'
import toast from 'react-hot-toast'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import Button from '@mui/material/Button'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import AddEditForm from 'src/components/AddEditForm'

const FAQ = () => {
  // ** States
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState() // Use the actual ID of the default tab

  const [showAddEditForm, setshowAddEditForm] = useState({
    faqId: '',
    id: '',
    isFAQ: false,
    isVisible: false,
    data: {},
    isEdit: false
  })

  // access
  const isAddAccess = usePermission('Controls', 'FAQs', 'Add')
  const isEditAccess = usePermission('Controls', 'FAQs', 'Edit')
  const isDeleteAccess = usePermission('Controls', 'FAQs', 'Delete')

  const getFaqsList = async () => {
    try {
      if (token) {
        const res = await DataServices.callGetFAQList(token)
        if (res?.data?.status === true) {
          const faqData = res?.data?.data
          setData(faqData)
          setActiveTab(faqData[0]._id)
        } else {
          toast.error(res?.data?.message)
        }
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something went wrong!')
    }
  }

  // state
  const onAddClick = faqId => setshowAddEditForm({ faqId, isFAQ: false, isVisible: true, data: {}, isEdit: false })

  const onFAQCreateClick = () =>
    setshowAddEditForm({ faqId: '', id: '', isFAQ: true, isVisible: true, data: {}, isEdit: false })

  const onEditCategoryClick = (faqId, data) =>
    setshowAddEditForm({ faqId: faqId, id: '', isFAQ: true, isVisible: true, data: data, isEdit: true })

  const onEditClick = (faqId, data) => {
    setshowAddEditForm({
      faqId,
      id: data._id,
      isVisible: true,
      isEdit: true,
      isFAQ: false,
      data
    })
  }

  const onCloseClick = () =>
    setshowAddEditForm({ faqId: '', id: '', isFAQ: false, isVisible: false, data: {}, isEdit: false })

  const create = async data => {
    setLoading(true)
    const res = await DataServices.callAddQAndA(showAddEditForm?.faqId, data, token)

    if (res?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      getFaqsList()
      toast.success('FAQ added successfully!')
    } else {
      toast.error(res?.data?.message)
      setLoading(false)
    }
  }

  const edit = async data => {
    setLoading(true)

    const res = await DataServices.callEditQAndA(showAddEditForm?.faqId, { ...data, id: showAddEditForm?.id }, token)

    if (res?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      getFaqsList()
      toast.success('FAQ updated successfully!')
    } else {
      setLoading(false)
      toast.error(res?.data?.message)
    }
  }

  const createFAQCategory = async data => {
    setLoading(true)
    const res = await DataServices.callCreateFAQ(data, token)

    if (res?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      getFaqsList()
      toast.success('FAQ create successfully!')
    } else {
      toast.error(res?.data?.message)
      setLoading(false)
    }
  }

  const editFAQCategory = async data => {
    setLoading(true)
    const res = await DataServices.callEditFAQ(showAddEditForm?.faqId, data, token)

    if (res?.data?.status === true) {
      setLoading(false)
      onCloseClick()
      getFaqsList()
      toast.success('FAQ update successfully!')
    } else {
      toast.error(res?.data?.message)
      setLoading(false)
    }
  }

  const handleDelete = async (faqId, id) => {
    try {
      if (token) {
        // Call your API to delete FAQ using faqId
        const res = await DataServices.callRemoveQAndA(faqId, { id }, token)
        if (res?.data?.status === true) {
          getFaqsList()
          toast.success('FAQ deleted successfully!')
        } else {
          toast.error(res?.data?.message)
        }
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      toast.error('Failed to delete FAQ.')
    }
  }

  const handleDeleteCategory = async faqId => {
    try {
      if (token) {
        // Call your API to delete FAQ using faqId
        const res = await DataServices.callRemoveFAQ(faqId, token)
        if (res?.data?.status === true) {
          getFaqsList()
          toast.success('FAQ category successfully!')
        } else {
          toast.error(res?.data?.message)
        }
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error)
      toast.error('Something wrent wrong!')
    }
  }

  useEffect(() => {
    getFaqsList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const onSubmit = async data => {
    try {
      if (showAddEditForm.isFAQ === true && showAddEditForm?.isEdit === true) {
        await editFAQCategory(data)
      } else if (showAddEditForm.isFAQ === true && showAddEditForm?.isEdit === false) {
        await createFAQCategory(data)
      } else if (showAddEditForm.isFAQ === false && showAddEditForm?.isEdit === true) {
        await edit(data)
      } else if (showAddEditForm.isFAQ === false && showAddEditForm?.isEdit === false) {
        await create(data)
      } else {
        toast.error('Something wrent wrong!')
        setLoading(false)
      }

      // if (showAddEditForm.isEdit) {
      // } else {
      //
      // }
    } catch (err) {
      setLoading(false)
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const renderNoResult = (
    <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', '& svg': { mr: 2 } }}>
      <Icon fontSize='1.5rem' icon='tabler:alert-circle' />
      <Typography variant='h5'>No Results Found!!</Typography>
    </Box>
  )

  const formFields = [
    { name: 'question', type: 'text', label: 'Question', placeholder: 'Write Question...', isFullWidth: true },
    { name: 'answer', type: 'textarea', label: 'Answer', placeholder: 'Write Answer...', isFullWidth: true }
  ]

  const formFieldsForCreate = [
    { name: 'title', type: 'text', label: 'Title', placeholder: 'Title', isFullWidth: true },
    { name: 'icon', type: 'text', label: 'Icon', placeholder: 'Icon', isFullWidth: true },
    { name: 'subtitle', type: 'text', label: 'Subtitle', placeholder: 'Subtitle', isFullWidth: true }
  ]

  return (
    <>
      {data ? (
        <Box>
          <Faqs
            data={data}
            activeTab={activeTab}
            handleChange={handleChange}
            handleEditCategory={isEditAccess ? onEditCategoryClick : null}
            handleDeleteCategory={isDeleteAccess ? handleDeleteCategory : null}
            handleEdit={isEditAccess ? onEditClick : null}
            handleAdd={isAddAccess ? onAddClick : null}
            handleDelete={isDeleteAccess ? handleDelete : null}
          />
          {isAddAccess && (
            <Button variant='contained' color='primary' onClick={() => onFAQCreateClick()} sx={{ mt: 2 }}>
              Create FAQ
            </Button>
          )}

          <Dialog
            open={showAddEditForm?.isVisible}
            onClose={onCloseClick}
            aria-labelledby='user-view-edit'
            aria-describedby='user-view-edit-description'
            sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 650 } }}
          >
            <DialogTitle
              id='user-view-edit'
              sx={{
                textAlign: 'center',
                fontSize: '1.2rem !important'
              }}
            >
              {(() => {
                if (showAddEditForm.isFAQ === true && showAddEditForm?.isEdit === true) {
                  return 'Edit FAQ Category'
                } else if (showAddEditForm.isFAQ === true && showAddEditForm?.isEdit === false) {
                  return 'Create FAQ Category'
                } else if (showAddEditForm.isFAQ === false && showAddEditForm?.isEdit === true) {
                  return 'Edit Question'
                } else if (showAddEditForm.isFAQ === false && showAddEditForm?.isEdit === false) {
                  return 'Add Question'
                } else {
                  return 'FAQs'
                }
              })()}
              {/* {showAddEditForm.isEdit ? 'Edit FAQs' : 'Add FAQs'} */}
            </DialogTitle>
            <DialogContent
              sx={{
                pb: theme => `${theme.spacing(8)} !important`
              }}
            >
              <AddEditForm
                data={showAddEditForm?.data}
                onSubmit={onSubmit}
                fields={showAddEditForm?.isFAQ ? formFieldsForCreate : formFields}
                onClose={onCloseClick}
                loading={loading}
                isEdit={showAddEditForm?.isEdit}
              />
            </DialogContent>
          </Dialog>
        </Box>
      ) : (
        renderNoResult
      )}
    </>
  )
}

export default FAQ

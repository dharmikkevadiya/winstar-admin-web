import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import Button from '@mui/material/Button'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { styled } from '@mui/material/styles'
import MuiTabList from '@mui/lab/TabList'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { Fab, IconButton, Tooltip } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import DeleteModal from './DeleteModal'

// Styled TabList component
const MuiBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column'
  }
}))

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderRight: 0,
  '&, & .MuiTabs-scroller': {
    boxSizing: 'content-box',
    padding: theme.spacing(1.25, 1.25, 2),
    margin: `${theme.spacing(-1.25, -1.25, -2)} !important`
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 280,
    lineHeight: 1,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      color: theme.palette.primary.main
    },
    '& svg': {
      marginBottom: 0,
      marginRight: theme.spacing(2)
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%'
    }
  }
}))

const Faqs = ({
  data,
  activeTab,
  handleChange,
  handleAdd,
  handleEdit,
  handleDelete,
  handleEditCategory,
  handleDeleteCategory
}) => {
  const [deleteModal, setdeleteModal] = useState({
    faqId: '',
    id: '',
    isOpen: false
  })

  const handleDeleteOpen = (faqId, id) => {
    setdeleteModal({ faqId, id, isOpen: true })
  }

  const handleDeleteClose = () => {
    setdeleteModal(prev => ({ faqId: '', id: '', isOpen: false }))
  }

  const handleDeleteYes = () => {
    if (deleteModal?.id) handleDelete(deleteModal?.faqId, deleteModal?.id)
    else handleDeleteCategory(deleteModal?.faqId)
    handleDeleteClose()
  }

  const renderTabContent = () => {
    return data.map(category => {
      return (
        <TabPanel key={category._id} value={category._id} sx={{ p: 6.5, pt: 0, width: '100%' }}>
          <Box key={category._id}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar skin='light' variant='rounded' sx={{ height: 48, width: 48 }}>
                <Icon icon={category.icon} fontSize='2.25rem' />
              </CustomAvatar>
              <Box
                sx={{
                  ml: 4,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Typography variant='h4'>
                    {category.title}

                    {handleEditCategory && (
                      <Tooltip title='Edit'>
                        <IconButton size='small' onClick={() => handleEditCategory(category._id, category)}>
                          <IconifyIcon icon='mynaui:edit-one' />
                        </IconButton>
                      </Tooltip>
                    )}
                    {handleDeleteCategory && (
                      <Tooltip title='Delete'>
                        <IconButton
                          size='small'
                          sx={{ color: 'text.secondary' }}
                          onClick={() => handleDeleteOpen(category._id)}
                        >
                          <IconifyIcon icon='tabler:trash' />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>{category.subtitle}</Typography>
                </Box>
              </Box>
              <Box ml='auto'>
                {handleAdd && (
                  <Tooltip title='Add'>
                    <Fab size='small' color='primary' aria-label='add' onClick={() => handleAdd(category._id)}>
                      <IconifyIcon icon='tabler:plus' />
                    </Fab>
                  </Tooltip>
                )}
              </Box>
            </Box>
            <Box sx={{ mt: 6 }}>
              {category.qandA.map(item => {
                return (
                  <Accordion key={item._id}>
                    <AccordionSummary expandIcon={<Icon fontSize='1.25rem' icon='tabler:chevron-down' />}>
                      <Typography sx={{ fontWeight: '500' }}>{item.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ color: 'text.secondary' }}>{item.answer}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        {handleEdit && (
                          <Tooltip title='Edit'>
                            <IconButton size='small' onClick={() => handleEdit(category._id, item)}>
                              <IconifyIcon icon='tabler:edit' />
                            </IconButton>
                          </Tooltip>
                        )}
                        {handleDelete && (
                          <Tooltip title='Delete'>
                            <IconButton
                              size='small'
                              sx={{ color: 'text.secondary' }}
                              onClick={() => handleDeleteOpen(category._id, item._id)}
                            >
                              <IconifyIcon icon='tabler:trash' />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </Box>
          </Box>
          <DeleteModal isOpen={deleteModal.isOpen} onClose={handleDeleteClose} onYesClick={handleDeleteYes} />
        </TabPanel>
      )
    })
  }

  const renderTabs = () => {
    if (data !== null) {
      return data.map(category => {
        if (category) {
          return (
            <Tab key={category._id} value={category._id} label={category.title} icon={<Icon icon={category.icon} />} />
          )
        } else {
          return null
        }
      })
    } else {
      return null
    }
  }

  return (
    <MuiBox>
      <TabContext value={activeTab}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <TabList orientation='vertical' onChange={handleChange}>
            {renderTabs()}
          </TabList>
          <Box
            sx={{
              mt: 5.5,
              display: 'flex',
              justifyContent: 'center',
              '& img': { maxWidth: '100%', display: { xs: 'none', md: 'block' } }
            }}
          >
            <img src='/images/pages/faq-illustration.png' alt='illustration' width='230' />
          </Box>
        </Box>
        {renderTabContent()}
      </TabContext>
    </MuiBox>
  )
}

export default Faqs

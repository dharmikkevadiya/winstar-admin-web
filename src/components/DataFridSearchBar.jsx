import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip
} from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid, GridToolbarExport } from '@mui/x-data-grid'
import Link from 'next/link'
import React, { Fragment, useMemo, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

const intialData = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'securepassword1'
  },
  {
    id: 2,
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    password: 'strongpassword2'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    password: 'safepassword3'
  },
  {
    id: 4,
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    password: 'secret1234'
  },
  {
    id: 5,
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    password: 'mypassword5'
  },
  {
    id: 6,
    name: 'Olivia Davis',
    email: 'olivia.davis@example.com',
    password: 'passw0rd6'
  },
  {
    id: 7,
    name: 'David Lee',
    email: 'david.lee@example.com',
    password: 'myp@ss7'
  },
  {
    id: 8,
    name: 'Sophia Johnson',
    email: 'sophia.johnson@example.com',
    password: 'secure4568'
  },
  {
    id: 9,
    name: 'James Miller',
    email: 'james.miller@example.com',
    password: 'password1239'
  },
  {
    id: 10,
    name: 'Emma White',
    email: 'emma.white@example.com',
    password: 'thep@ss10'
  }
]

export default function DataFridSearchBar({ data }) {
  const [searchValue, setSearchValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  const filteredData = useMemo(
    () => data.filter(item => item?.['name'].toLowerCase().indexOf(searchValue.toLowerCase()) !== -1),
    [searchValue, data]
  )

  const [deltePopUpopen, setDeltePopUpOpen] = useState(false)
  const handleClickdeltePopUpOpen = () => setDeltePopUpOpen(true)
  const handleClose = () => setDeltePopUpOpen(false)

  return (
    <>
      <Card id='download-PDF'>
        <DataGrid
          autoHeight
          getRowId={({ id }) => `${id}`}
          rows={filteredData}
          disableRowSelectionOnClick
          rowCount={filteredData.length}
          columns={[
            {
              field: 'id',
              width: 100,
              headerName: 'No.'
            },
            {
              field: 'name',
              flex: 1
            },
            {
              field: 'email',
              flex: 1
            },
            {
              flex: 0.1,
              minWidth: 140,
              sortable: false,
              field: 'actions',
              headerName: 'Actions',
              renderCell: ({ row }) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title='Edit'>
                    <IconButton size='small' onClick={() => console.log('here edit')}>
                      <IconifyIcon icon='tabler:edit' />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title='Delete'>
                    <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={handleClickdeltePopUpOpen}>
                      <IconifyIcon icon='tabler:trash' />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            }
          ]}
          pagination
          pageSizeOptions={[7, 10, 25, 50]}
          paginationModel={paginationModel}
          slots={{ toolbar: ServerSideToolbar }}
          onPaginationModelChange={setPaginationModel}
          slotProps={{
            baseButton: {
              size: 'medium',
              variant: 'tonal'
            },
            toolbar: {
              value: searchValue,
              clearSearch: () => setSearchValue(''),
              onChange: event => setSearchValue(event.target.value)
            }
          }}
        />
      </Card>
      <Dialog
        open={deltePopUpopen}
        onClose={setDeltePopUpOpen}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure want to delete this ? This process can not be undone
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button color='error' onClick={handleClose}>
            Yes
          </Button>
          <Button color='secondary' onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const ServerSideToolbar = props => {
  return (
    <>
      <CardHeader title='Admin List' />
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: theme => theme.spacing(2, 5, 4, 5),
          pt: 0
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
          <Button variant='contained' component={Link} href='add'>
            Add Admin
          </Button>
          <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
        </Box>
      </Box>
    </>
  )
}

const DialogAlert = () => {
  // ** State
  const [open, setOpen] = useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Use Google's location service?</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Let Google help apps determine location. This means sending anonymous location data to Google, even when no
            apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button color='error' onClick={handleClose}>
            Yes
          </Button>
          <Button color='secondary' onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

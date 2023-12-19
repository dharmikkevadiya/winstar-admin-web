import { Card, CardHeader, IconButton, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import { DataGrid } from '@mui/x-data-grid'

// import html2pdf from 'html2pdf.js'
import React, { useMemo, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import DeleteModal from './DeleteModal'
import ListSkeleton from './ListSkeleton'

export default function Datagrid({
  data,
  header,
  showAction,
  handleDelete,
  handleEdit,
  handleAdd,
  headerComponet,
  title,
  serachBy,
  dataLoading
}) {
  const [searchValue, setSearchValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })

  const [deleteModal, setdeleteModal] = useState({
    id: '',
    isOpen: false
  })

  // Inside Datagrid component
  const filteredData = useMemo(() => {
    if (!searchValue || !serachBy?.length) {
      return data || []
    }

    return (
      data?.filter(item =>
        serachBy?.some(field => {
          const fieldValue = item[field]

          return fieldValue?.toLowerCase().includes(searchValue.toLowerCase())
        })
      ) || []
    )
  }, [searchValue, data, serachBy])

  const handleDeleteOpen = id => {
    setdeleteModal({ id, isOpen: true })
  }
  const handleDeleteClose = () => setdeleteModal(id => ({ id: '', isOpen: false }))

  const handleDeleteYes = () => {
    handleDelete(deleteModal?.id)
    handleDeleteClose()
  }

  const renderCell = ({ row, field }) => {
    const value = row[field]

    return value || '-' // Display "-" if the value is falsy or empty
  }

  const headerWithStyle = useMemo(
    () =>
      header.map(item => ({
        flex: 1,
        minWidth: 150,
        ...item
      })),
    [header]
  )

  return (
    <>
      <Card id='download-PDF'>
        {title && <CardHeader title={title} />}
        {data?.length || dataLoading === false ? (
          <DataGrid
            autoHeight
            getRowId={({ _id }) => `${_id}`}
            rows={filteredData}
            disableRowSelectionOnClick
            rowCount={filteredData.length}
            columns={
              showAction && (handleEdit || handleDelete)
                ? headerWithStyle.concat({
                    flex: 0.1,
                    minWidth: 140,
                    sortable: false,
                    field: 'actions',
                    headerName: 'Actions',
                    renderCell: ({ row }) => (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {handleEdit && (
                          <Tooltip title='Edit'>
                            <IconButton size='small' onClick={() => handleEdit(row)}>
                              <IconifyIcon icon='tabler:edit' />
                            </IconButton>
                          </Tooltip>
                        )}
                        {handleDelete && (
                          <Tooltip title='Delete'>
                            <IconButton
                              size='small'
                              sx={{ color: 'text.secondary' }}
                              onClick={() => handleDeleteOpen(row._id)}
                            >
                              <IconifyIcon icon='tabler:trash' />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    )
                  })
                : headerWithStyle
            }
            pagination
            pageSizeOptions={[7, 10, 25, 50]}
            paginationModel={paginationModel}
            slots={{ toolbar: headerComponet }}
            onPaginationModelChange={setPaginationModel}
            slotProps={{
              baseButton: {
                size: 'medium',
                variant: 'tonal'
              },
              toolbar: {
                value: searchValue,
                clearSearch: () => setSearchValue(''),
                onChange: event => setSearchValue(event.target.value),
                handleAdd: handleAdd
              }
            }}
          />
        ) : (
          <ListSkeleton />
        )}
      </Card>
      <DeleteModal isOpen={deleteModal.isOpen} onClose={handleDeleteClose} onYesClick={handleDeleteYes} />
    </>
  )
}

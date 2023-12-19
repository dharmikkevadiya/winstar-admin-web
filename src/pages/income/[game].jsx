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

// import html2pdf from 'html2pdf.js'
import React, { Fragment, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import IconifyIcon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import Datagrid from 'src/components/DataGrid'

// import DataGrid from 'src/components/DataGrid'

// import DataGrid from 'src/components/DataGrid'

// import DataGrid from "@/components/DataGrid";
// import { BiPlus } from "react-icons/bi";

const intialData = [
  {
    srno: '1',
    date: '17/09/2023',
    roundname: 'Aviator_812380_57',
    amount: '50.00',
    action: ''
  },
  {
    srno: '2',
    date: '17/09/2023',
    roundname: 'Aviator_812380_56',
    amount: '100.00',
    action: ''
  },
  {
    srno: '3',
    date: '11/09/2023',
    roundname: 'ColorPredition_652043_228',
    amount: '100.00',
    action: ''
  },
  {
    srno: '4',
    date: '11/09/2023',
    roundname: 'CarRoulette_753626_202',
    amount: '140.00',
    action: ''
  },
  {
    srno: '5',
    date: '11/09/2023',
    roundname: 'SevenUpDown_382910_101',
    amount: '20.00',
    action: ''
  },
  {
    srno: '6',
    date: '11/09/2023',
    roundname: 'AndarBahar_903625_215',
    amount: '50.00',
    action: ''
  },
  {
    srno: '7',
    date: '11/09/2023',
    roundname: 'DragonTiger_453620_91',
    amount: '-1260.00',
    action: ''
  },
  {
    srno: '8',
    date: '17/09/2023',
    roundname: 'Aviator_812380_55',
    amount: '-21.00',
    action: ''
  },
  {
    srno: '9',
    date: '11/09/2023',
    roundname: 'Aviator_812380_53',
    amount: '-4.48',
    action: ''
  },
  {
    srno: '10',
    date: '11/09/2023',
    roundname: 'ColorPredition_652043_227',
    amount: '20.00',
    action: ''
  }
]

export default function GameIncome() {
  return (
    <>
      <Card id='download-PDF'>
        <Datagrid
          showAction
          data={intialData}
          headerComponet={ServerSideToolbar}
          header={[
            {
              field: 'srno',
              headerName: 'No.'
            },
            {
              field: 'date',
              headerName: 'Date'
            },
            {
              field: 'roundname',
              headerName: 'Round name'
            },
            {
              field: 'amount',
              headerName: 'Amount'
            }
          ]}
        />
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
      <h3>Income detailes</h3>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center'
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
      </Box>
    </Box>
  )
}

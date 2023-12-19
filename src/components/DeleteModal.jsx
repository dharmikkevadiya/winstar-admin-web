import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

export default function DeleteModal({ isOpen, onClose, onYesClick }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
        <Button color='error' onClick={onYesClick}>
          Yes
        </Button>
        <Button color='secondary' onClick={onClose}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

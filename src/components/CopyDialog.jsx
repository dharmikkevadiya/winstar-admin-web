import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { FormLabel, Grid, Icon, InputLabel } from '@mui/material'
import CustomTextField from 'src/@core/components/mui/text-field'
import IconifyIcon from 'src/@core/components/icon'

const SecretKeysModal = ({ open, onClose, fields }) => {
  const [copied, setCopied] = useState(Array(fields.length).fill(false))

  const handleCopyClick = (key, index) => {
    navigator.clipboard.writeText(key).then(() => {
      const newCopied = [...copied]
      newCopied[index] = true
      setCopied(newCopied)
      setTimeout(() => {
        newCopied[index] = false
        setCopied([...newCopied])
      }, 1500)
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <DialogTitle>Secret Keys</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {fields.map((field, index) => (
            <Grid key={field.name} item xs={12}>
              <InputLabel htmlFor={field.name}>{field.label}</InputLabel>
              <CustomTextField
                fullWidth
                value={field.value}
                disabled={true}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Tooltip title={copied[index] ? 'Copied' : 'Copy'} placement='top'>
                        <IconButton
                          edge='end'
                          onClick={() => handleCopyClick(field.value, index)}
                          aria-label='copy text'
                        >
                          {copied[index] ? (
                            <IconifyIcon icon='heroicons-solid:check-circle' />
                          ) : (
                            <IconifyIcon icon='heroicons-outline:clipboard-copy' />
                          )}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SecretKeysModal

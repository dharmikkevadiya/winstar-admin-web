import React from 'react'
import { Button, Card, CardContent, Fab, Grid, Icon, IconButton, Tooltip } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

const BankCards = ({ data, handleEdit }) => {
  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item container alignItems='center' xs={12} spacing={3}>
        <Grid item xs={6}>
          <h2>Bank Accounts</h2>
        </Grid>
      </Grid>

      {/* Bank Account Cards */}
      {data &&
        data?.map((account, index) => (
          <Grid item key={index}>
            <Card style={{ width: '380px', position: 'relative' }}>
              <CardContent style={{ position: 'relative' }}>
                <div>
                  <IconButton
                    style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}
                    onClick={() => handleEdit(account)}
                  >
                    <IconifyIcon fontSize='1.25rem' icon='tabler:edit' />
                  </IconButton>
                  <p style={{ margin: '0', fontSize: '10px' }}>Bank Name</p>
                  <p style={{ margin: '0 0 25px 0', textTransform: 'uppercase' }}>{account.bankName}</p>
                  <p style={{ margin: '0', fontSize: '10px' }}>Account Number</p>
                  <p style={{ margin: '0' }}> {account.bankAccountNo.replace(/(\d{4})/g, '$1 ')}</p>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
    </Grid>
  )
}

export default BankCards

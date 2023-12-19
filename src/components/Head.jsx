import { Button, Fab, Grid, Icon, MenuItem } from '@mui/material'
import { Box } from '@mui/system'
import CustomTextField from 'src/@core/components/mui/text-field'

const Head = ({ name, title, handleAdd, isDropdownShow, playerList, selectedPlayer, handleSelectPlayer }) => {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(0, 0, 0, 1),
        position: 'relative' // Set position relative for proper dropdown positioning
      }}
    >
      <h3>{title}</h3>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {handleAdd && (
          <Button variant='contained' onClick={() => handleAdd()}>
            {name}
          </Button>
        )}
      </Box>

      {isDropdownShow && (
        <Grid item sm={12} xs={12} width={'300px'} padding={'10px'}>
          <CustomTextField
            select
            fullWidth
            label='Select Email'
            value={selectedPlayer?._id}
            SelectProps={{
              displayEmpty: true,
              MenuProps: {
                // Set max height and width for the dropdown
                style: { maxHeight: '415px', width: '100%' },
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left'
                },
                getContentAnchorEl: null // Fix the position of the dropdown
              },
              onChange: e => handleSelectPlayer(e.target.value)
            }}
          >
            {playerList.map(elem => (
              <MenuItem key={elem._id} value={elem._id}>
                {elem.playerEmail}
              </MenuItem>
            ))}
          </CustomTextField>
        </Grid>
      )}
    </Box>
  )
}

export default Head

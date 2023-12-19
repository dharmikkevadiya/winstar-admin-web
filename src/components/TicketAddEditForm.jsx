import { useEffect } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import FormLabel from '@mui/material/FormLabel'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useForm, Controller } from 'react-hook-form'
import { CardContent, CircularProgress, FormHelperText } from '@mui/material'
import { Box } from '@mui/system'
import Head from './Head'
import ChatMessages from './TicketMessages'

const TicketAddEditForm = ({
  onSubmit,
  data,
  fields,
  isEdit,
  onClose,
  loading,
  title,
  isDropdownShow,
  playerList,
  handleSelectPlayer,
  selectedPlayer
}) => {
  const defaultValues = {}

  fields.forEach(field => {
    if (field.type === 'select') {
      // Define valid options for the select field
      const validOptions = field.options.map(option => option.value)

      // Check if the value exists in data and is a valid option, otherwise, provide a default value
      defaultValues[field.name] =
        data && data.hasOwnProperty(field.name) && validOptions.includes(data[field.name])
          ? data[field.name]
          : validOptions[0] // Use the first option as the default
    } else {
      // For other field types, use an empty string as the default value if the value exists in data
      defaultValues[field.name] = data && data.hasOwnProperty(field.name) ? data[field.name] : ''
    }
  })

  const updateDefaults = data => {
    if (selectedPlayer)
      fields.forEach(field => {
        if (field.type === 'select') {
          // Define valid options for the select field
          const validOptions = field.options.map(option => option.value)

          // Check if the value exists in data and is a valid option, otherwise, provide a default value
          defaultValues[field.name] =
            data && data.hasOwnProperty(field.name) && validOptions.includes(data[field.name])
              ? data[field.name]
              : validOptions[0] // Use the first option as the default
        } else {
          // For other field types, use an empty string as the default value if the value exists in data
          defaultValues[field.name] = data && data.hasOwnProperty(field.name) ? data[field.name] : ''
        }
      })
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      ...defaultValues
    }
  })

  useEffect(() => {
    updateDefaults(selectedPlayer)
    reset({
      ...defaultValues
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlayer, reset])

  const renderField = field => {
    switch (field.type) {
      case 'email':
        return (
          <CustomTextField
            fullWidth
            type='email'
            value={field.value}
            label={field.label}
            disabled={field?.disabled}
            onChange={field.onChange}
            error={Boolean(errors[field.name])}
            placeholder={field?.placeholder || ''}
            {...(errors[field.name] && { helperText: `${field.label} is required` })}
          />
        )

      case 'chats':
        return (
          <>
            <FormControl component='fieldset'>
              <FormLabel component='legend'>{field.label}</FormLabel>
            </FormControl>
            <ChatMessages data={field.value} />
          </>
        )

      case 'file':
        const fileName = field.value ? field.value.name : ''
        const imageUrl = data ? data[field?.url] : null

        return (
          <FormControl fullWidth error={Boolean(errors[field.name])}>
            <FormLabel>{field.label}</FormLabel>
            <input
              accept='image/*' // Specify the file types allowed
              style={{ display: 'none' }}
              id={field.name}
              disabled={field?.disabled}
              type='file'
              onChange={e => {
                field.onChange(e.target.files[0])
              }}
            />
            <label htmlFor={field.name}>
              <Button variant='outlined' component='span'>
                Upload File
              </Button>
            </label>
            <span>{fileName}</span> {/* Display the file name */}
            {imageUrl && (
              <Box
                sx={{
                  display: 'flex',
                  margin: '10px 0',
                  width: '120px',
                  height: '120px',
                  outline: '1px solid gray',
                  borderRadius: '2px'
                }}
              >
                <img src={imageUrl} width='100%' height='100%' style={{ objectFit: 'contain' }} alt='Image' />
              </Box>
            )}
            {errors[field.name] && <FormHelperText>{`${field.label} is required`}</FormHelperText>}
          </FormControl>
        )

      case 'image':
        const url = field.value || (data ? data['url'] : null)

        return (
          <FormControl fullWidth error={Boolean(errors[field.name])}>
            <FormLabel>{field.label}</FormLabel>
            {url ? (
              <Box sx={{ display: 'flex', margin: '10px', alignItems: 'center' }}>
                <img src={url} height={200} width={350} style={{ objectFit: 'cover' }} alt='Image Preview' />
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  margin: '10px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  width: '350px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                No Image
              </Box>
            )}
            {errors[field.name] && <FormHelperText>{`${field.label} is required`}</FormHelperText>}
          </FormControl>
        )

      case 'select':
        return (
          <CustomTextField
            fullWidth
            select
            value={field.value}
            disabled={field?.disabled}
            label={field.label}
            onChange={field.onChange}
            error={Boolean(errors[field.name])}
            {...(errors[field.name] && { helperText: `${field.label} is required` })}
          >
            {field.options.map(option => (
              <MenuItem key={option.value} value={option.value} style={{ display: 'flex', alignItems: 'center' }}>
                {option.icon && (
                  <img src={option.icon} alt={option.label} style={{ height: '12px', marginRight: '12px' }} />
                )}
                <span> {option.label}</span>
              </MenuItem>
            ))}
          </CustomTextField>
        )

      case 'text-input-edit-disabled':
        return (
          <CustomTextField
            fullWidth
            type={'email'}
            value={field.value}
            label={field.label}
            disabled={isEdit ? true : false}
            onChange={field.onChange}
            placeholder={field?.placeholder || ''}
            error={Boolean(errors[field.name])}
            {...(errors[field.name] && { helperText: `${field.label} is required` })}
          />
        )

      default:
        return (
          <CustomTextField
            fullWidth
            value={field.value}
            label={field.label}
            disabled={field?.disabled}
            onChange={field.onChange}
            placeholder={field?.placeholder || ''}
            error={Boolean(errors[field.name])}
            {...(errors[field.name] && { helperText: `${field.label} is required` })}
          />
        )
    }
  }

  return (
    <Card>
      <Head
        title={title}
        isDropdownShow={isDropdownShow}
        playerList={playerList}
        handleSelectPlayer={handleSelectPlayer}
        selectedPlayer={selectedPlayer}
      />

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {fields.map(field => (
              <Grid key={field.name} item xs={12} sm={field?.fullWidth ? 12 : 6}>
                <Controller
                  name={field.name}
                  control={control}
                  rules={{ required: isEdit ? false : field?.required }}
                  render={({ field: { value, onChange } }) => renderField({ ...field, value, onChange })}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                disabled={loading === true ? true : false}
                type='submit'
                variant='contained'
                endIcon={loading && <CircularProgress color='secondary' size={12} />}
              >
                {isEdit ? 'Update Ticket' : 'Create Ticket'}
              </Button>
              <Button style={{ margin: '10px' }} variant='tonal' color='secondary' onClick={onClose}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TicketAddEditForm

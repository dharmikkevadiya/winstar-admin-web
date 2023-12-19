import { useState } from 'react'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useForm, Controller } from 'react-hook-form'
import { CircularProgress, FormControlLabel, FormHelperText, RadioGroup } from '@mui/material'
import { Box } from '@mui/system'

const PlayerEditForm = ({ onSubmit, data, fields, onClose, loading }) => {
  const [state, setState] = useState({
    password: '',
    showPassword: false
  })
  const [isFileModified, setIsFileModified] = useState(false)
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

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues
  })

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }

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
      case 'password':
        return (
          <CustomTextField
            fullWidth
            value={field.value}
            label={field.label}
            disabled={field?.disabled}
            onChange={field.onChange}
            id={`validation-basic-${field.name}`}
            error={Boolean(errors[field.name])}
            type={state.showPassword ? 'text' : 'password'}
            {...(errors[field.name] && { helperText: `${field.label} is required` })}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    edge='end'
                    onClick={handleClickShowPassword}
                    onMouseDown={e => e.preventDefault()}
                    aria-label='toggle password visibility'
                  >
                    <Icon fontSize='1.25rem' icon={state.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        )
      case 'radio':
        return (
          <FormControl component='fieldset'>
            <FormLabel component='legend'>{field.label}</FormLabel>
            <RadioGroup row value={field.value} onChange={e => field.onChange(e.target.value)}>
              {field.options.map(option => (
                <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
              ))}
            </RadioGroup>
          </FormControl>
        )

      case 'file':
        const fileName = field.value ? field.value.name : ''
        const imageUrl = data ? data['imageUrl'] : null

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
                setIsFileModified(true) // Set the flag to true when the file is modified
              }}
            />
            <label htmlFor={field.name}>
              <Button variant='outlined' component='span'>
                Upload File
              </Button>
            </label>
            <span>{fileName}</span> {/* Display the file name */}
            {imageUrl && !isFileModified && (
              <Box sx={{ display: 'flex', margin: '10px', alignItems: 'center' }}>
                <img src={imageUrl} height={95} width={95} style={{ objectFit: 'cover' }} alt='Banner Image' />
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
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomTextField>
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        {fields.map(field => (
          <Grid key={field.name} item xs={12} sm={6}>
            <Controller
              name={field.name}
              control={control}
              rules={{ required: field.required }}
              render={({ field: { value, onChange } }) => renderField({ ...field, value, onChange })}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            disabled={loading}
            type='submit'
            variant='contained'
            endIcon={loading && <CircularProgress color='secondary' size={12} />}
            sx={{ mr: 5 }}
          >
            Update
          </Button>
          {onClose && (
            <Button variant='tonal' color='secondary' onClick={onClose}>
              Cancel
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  )
}

export default PlayerEditForm

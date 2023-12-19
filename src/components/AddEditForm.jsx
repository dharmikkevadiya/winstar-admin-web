import { useState } from 'react'
import Card from '@mui/material/Card'
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
import {
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
  ListItemText,
  RadioGroup,
  Tooltip
} from '@mui/material'
import { Box } from '@mui/system'
import RichTextEditor from './RichTextEditor'
import UserAccess from './UserAccess'
import Head from './Head'
import ChatMessages from './TicketMessages'
import IconifyIcon from 'src/@core/components/icon'

const AddEditForm = ({ onSubmit, data, fields, isEdit, onClose, loading, title, accessData, setAccessData }) => {
  const [state, setState] = useState({
    password: '',
    showPassword: false
  })
  const [copiedField, setCopiedField] = useState(null)
  const [imageErrors, setImageErrors] = useState({})
  const [formIsValid, setFormIsValid] = useState(true)

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
    defaultValues: {
      ...defaultValues,
      access: accessData
    }

    // resolver: yupResolver(yup.object())
  })

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }

  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8

  const MenuProps = {
    PaperProps: {
      style: {
        width: 250,
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  }
  console.log('imageErrors::', imageErrors)

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
        const expectedWidth = field?.width
        const expectedHeight = field?.height
        let lebelText
        if (expectedWidth && expectedHeight) lebelText = `(${expectedWidth} * ${expectedHeight})`

        return (
          <FormControl fullWidth error={Boolean(errors[field.name] || imageErrors[field.name])}>
            <FormLabel>
              {field.label} <span style={{ fontSize: '10px' }}>{lebelText}</span>
            </FormLabel>
            <input
              accept='image/*' // Specify the file types allowed
              style={{ display: 'none' }}
              id={field.name}
              disabled={field?.disabled}
              type='file'
              onChange={e => {
                const selectedFile = e.target.files[0]
                console.log('selectedFile::', selectedFile)
                if (selectedFile && expectedWidth && expectedHeight) {
                  const img = new Image()

                  img.onload = function () {
                    console.log('this.width::', this.width)
                    console.log('this.height::', this.height)
                    if (this.width !== Number(expectedWidth) || this.height !== Number(expectedHeight)) {
                      // Handle error for invalid dimensions
                      setImageErrors(prevErrors => ({
                        ...prevErrors,
                        [field.name]: `Invalid dimensions for the image!`
                      }))
                      setFormIsValid(false)
                    } else {
                      setImageErrors(prevErrors => ({
                        ...prevErrors,
                        [field.name]: ''
                      }))

                      setFormIsValid(true)
                    }
                  }

                  img.src = URL.createObjectURL(selectedFile)
                }

                field.onChange(selectedFile)
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
            {(!formIsValid || errors[field.name]) && (
              <FormHelperText sx={{ marginLeft: 0 }}>
                {formIsValid ? `${field.label} is required` : imageErrors[field.name]}
              </FormHelperText>
            )}
          </FormControl>
        )

      case 'image':
        const url = field.value || (data ? data['url'] : null)

        return (
          <FormControl fullWidth error={Boolean(errors[field.name])}>
            <FormLabel>{field.label} </FormLabel>
            {url ? (
              <Box sx={{ display: 'flex', margin: '10px', alignItems: 'center' }}>
                <img
                  src={url}
                  height={200}
                  width={350}
                  style={{ objectFit: 'contain', border: '1px solid', borderRadius: '5px' }}
                  alt='Image Preview'
                />
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

      case 'chips':
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
              <MenuItem
                key={option.value}
                value={option.value}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {option.seen ? (
                      <IconButton size='small'>
                        <IconifyIcon icon='material-symbols:check-circle-outline' color='green' />
                      </IconButton>
                    ) : (
                      <IconButton size='small'>
                        <IconifyIcon icon='material-symbols:check-circle-outline' color='gray' />
                      </IconButton>
                    )}
                    {option.label}
                  </span>
                </div>
              </MenuItem>
            ))}
          </CustomTextField>
        )

      case 'multiSelect':
        const selectedValues = Array.isArray(field.value) ? field.value : []

        return (
          <CustomTextField
            select
            fullWidth
            label={field.label}
            value={selectedValues}
            onChange={e => field.onChange(e.target.value)}
            SelectProps={{
              MenuProps,
              multiple: true,
              renderValue: selected => selected.join(', ')
            }}
            error={Boolean(errors[field.name])}
            {...(errors[field.name] && { helperText: `${field.label} is required` })}
          >
            {field.options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                <Checkbox checked={selectedValues.indexOf(option.value) > -1} />
                <ListItemText primary={option.label} />
              </MenuItem>
            ))}
          </CustomTextField>
        )

      case 'copytext':
        const handleCopyClick = () => {
          navigator.clipboard.writeText(field.value)

          // Update the copied field state
          setCopiedField(field.name)

          // Reset the copied field state after a delay
          setTimeout(() => {
            setCopiedField(null)
          }, 1500)
        }

        return (
          <div>
            <CustomTextField
              fullWidth
              value={field.value}
              label={field.label}
              disabled={field?.disabled}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <Tooltip title={copiedField === field.name ? 'Copied' : 'Copy'} placement='top'>
                      <IconButton edge='end' onClick={handleCopyClick} aria-label='copy text'>
                        {copiedField === field.name ? (
                          <Icon icon='heroicons-solid:check-circle' />
                        ) : (
                          <Icon icon='heroicons-outline:clipboard-copy' />
                        )}
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
          </div>
        )

      case 'textarea':
        return (
          <CustomTextField
            fullWidth
            multiline
            rows={field.rows ? field.rows : 3} // Specify the number of rows for the textarea
            value={field.value}
            label={field.label}
            disabled={field?.disabled}
            onChange={field.onChange}
            error={Boolean(errors[field.name])}
            placeholder={field?.placeholder || ''}
            {...(errors[field.name] && { helperText: `${field.label} is required` })}
          />
        )

      case 'hr':
        return <Head title={field.label} />

      case 'editor':
        return (
          <FormControl fullWidth error={Boolean(errors[field.name])}>
            <FormLabel>{field.label}</FormLabel>
            <RichTextEditor value={field.value} setvalue={field.onChange} />
          </FormControl>
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
      <CardHeader title={title} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {fields.map(field =>
              field.name === 'access' && accessData ? (
                <Grid key={field.name}>
                  <UserAccess accessData={accessData} setAccessData={setAccessData} />
                </Grid>
              ) : (
                <Grid key={field.name} item xs={12} sm={field?.isFullWidth ? 12 : 6}>
                  <Controller
                    name={field.name}
                    control={control}
                    rules={{ required: isEdit ? false : field?.required }}
                    render={({ field: { value, onChange } }) => renderField({ ...field, value, onChange })}
                  />
                </Grid>
              )
            )}

            <Grid item xs={12}>
              {title === 'Edit Notification' ? null : (
                <Button
                  disabled={!formIsValid || loading === true ? true : false}
                  type='submit'
                  variant='contained'
                  endIcon={loading && <CircularProgress color='secondary' size={12} />}
                >
                  {isEdit ? 'Update' : 'Submit'}
                </Button>
              )}

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

export default AddEditForm

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import CustomTextField from 'src/@core/components/mui/text-field'
import { useForm, Controller } from 'react-hook-form'
import IconifyIcon from 'src/@core/components/icon'
import { CardContent, CardHeader, CircularProgress, FormControlLabel, MenuItem, Switch } from '@mui/material'
import Head from './Head'

const CustomInputForm = ({ onSubmit, data, fields, loading, title }) => {
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

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {fields.map(field => (
              <Grid item xs={12} sm={field?.fullWidth ? 12 : 6} key={field.name}>
                {(() => {
                  switch (field.type) {
                    case 'switch':
                      return (
                        <Controller
                          name={field.name}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <FormControlLabel
                              label={field.label}
                              onChange={event => onChange(event.target.checked)}
                              checked={value}
                              control={<Switch size='medium' />}
                            />
                          )}
                        />
                      )
                    case 'select':
                      return (
                        <Controller
                          name={field.name}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              select
                              value={value}
                              disabled={field?.disabled}
                              label={field.label}
                              onChange={e => onChange(e.target.value)}
                              error={Boolean(errors[field.name])}
                              {...(errors[field.name] && { helperText: `${field.label} is required` })}
                            >
                              {field.options.map(option => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                  style={{ display: 'flex', alignItems: 'center' }}
                                >
                                  <span> {option.label}</span>
                                </MenuItem>
                              ))}
                            </CustomTextField>
                          )}
                        />
                      )
                    case 'hr':
                      return <Head title={field.label} />
                    default:
                      return (
                        <Controller
                          name={field.name}
                          control={control}
                          rules={{ required: false }}
                          render={({ field: { value, onChange } }) => (
                            <CustomTextField
                              fullWidth
                              value={value}
                              label={field.label}
                              onChange={onChange}
                              placeholder={field?.placeholder}
                              error={Boolean(errors[field.name])}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position='start'>
                                    <IconifyIcon icon={field.icon} />
                                  </InputAdornment>
                                )
                              }}
                              {...(errors[field.name] && { helperText: `${field.label} url is required` })}
                            />
                          )}
                        />
                      )
                  }
                })()}
              </Grid>
            ))}

            <Grid item xs={12}>
              {onSubmit && (
                <Button
                  disabled={loading}
                  type='submit'
                  variant='contained'
                  endIcon={loading && <CircularProgress color='secondary' size={12} />}
                >
                  Submit
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default CustomInputForm

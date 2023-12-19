import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Badge from '@mui/material/Badge'
import { Country, State, City } from 'country-state-city'
import { Chip } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import DataServices from 'src/services/requestApi'

const CountryStateCityCard = ({}) => {
  const auth = useAuth()
  const token = auth.accessToken
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [states, setStates] = useState([])
  const [selectedState, setSelectedState] = useState('')
  const [userCount, setUserCount] = useState(0)
  const [countryName, setCountryName] = useState(0)

  const getData = async (country, state) => {
    try {
      if (token) {
        let query = `country=${country}&state=${state}`

        const res = await DataServices.callGetPlayersCountByCountryState(query, token)

        if (res?.data?.status === true) {
          const count = res?.data?.data?.count

          setUserCount(count)
        } else {
          toast.error(res?.data?.message)
        }
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }
  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Fetch countries using the "country-state-city" library
    const countriesData = Country.getAllCountries()
    setCountries(countriesData)
  }, [])

  const handleCountryChange = event => {
    let countryIsoCode = event.target.value

    const selectedCountryObject = countries.find(country => {
      return country.isoCode === countryIsoCode
    })

    setCountryName(selectedCountryObject?.name)
    setSelectedCountry(countryIsoCode)

    // Fetch states for the selected country
    const statesData = State.getStatesOfCountry(countryIsoCode)
    setStates(statesData)

    // Reset selected state
    setSelectedState('')

    getData(selectedCountryObject?.name)
  }

  const handleStateChange = event => {
    const state = event.target.value
    setSelectedState(state)

    // Simulate fetching user count based on selected country and state

    // Callback to parent component with selected country and state
    getData(countryName, state)
  }

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select value={selectedCountry} onChange={handleCountryChange}>
                {countries.map((country, index) => (
                  <MenuItem key={index} value={country.isoCode}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>State</InputLabel>
              <Select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
                {states.map((state, index) => (
                  <MenuItem key={index} value={state.name}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ mt: 3 }}>
            Live Players:
            <Chip label={userCount} color='primary' sx={{ ml: 2 }} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CountryStateCityCard

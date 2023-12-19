import Grid from '@mui/material/Grid'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import DataServices from 'src/services/requestApi'
import { useEffect, useState } from 'react'
import PlayerEditForm from 'src/components/PlayerEditForm'

const Test = () => {
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const token = auth.accessToken
  const playerId = localStorage.getItem('pid')
  const [data, setData] = useState({})
  const [dataLoading, setDataLoading] = useState(false)
  const [currencyList, setCurrencyList] = useState([])

  const getPlayerData = async () => {
    try {
      if (token && playerId) {
        setDataLoading(true)
        const res = await DataServices.callGetPlayerById(playerId, token)
        const currencyRes = await DataServices.callGetCurrency(token)

        if (res?.data?.status === true) {
          setData(res?.data?.data)
          setDataLoading(false)
        } else toast.error(res?.data?.message)

        if (currencyRes?.data?.status === true) {
          const siteCurrency = currencyRes?.data?.data

          const options = siteCurrency.map(elem => ({
            value: elem.currencyShortName,
            label: elem.currencyShortName,
            icon: elem?.iconUrl
          }))
          setCurrencyList(options)
        }
      }
    } catch (err) {
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }
  useEffect(() => {
    getPlayerData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async data => {
    try {
      setLoading(true)
      const res = await DataServices.callCreateTestTransaction({ playerId, ...data }, token)

      if (res?.data?.status === true) {
        setLoading(false)
        getPlayerData()
        toast.success('Form Submitted')
      } else {
        setLoading(false)
        toast.error(res?.data?.message)
      }
    } catch (err) {
      console.log('err::', err)
      setLoading(false)
      toast.error('Something wrent wrong!')
    }
  }

  const fields = [
    { name: 'amount', type: 'text', label: 'Amount', placeholder: 'Amount', required: true },
    {
      name: 'note',
      label: 'Note',
      type: 'select',
      options: [
        { value: 0, label: 'Add Money' },
        { value: 1, label: 'Withdraw' },
        { value: 2, label: 'Join' },
        { value: 3, label: 'Win' },
        { value: 4, label: 'Refund' },
        { value: 5, label: 'Reward' }
      ],
      required: true
    },
    { name: 'historyId', type: 'text', label: 'History Id', placeholder: 'History Id', required: false },
    { name: 'gameIdDev', type: 'text', label: 'Game Id Dev', placeholder: 'Game Id Dev', required: false },

    // {
    //   name: 'transactionType',
    //   label: 'Transaction Type',
    //   type: 'select',
    //   options: [
    //     { value: 0, label: 'Debit' },
    //     { value: 1, label: 'Credit' }
    //   ],
    //   required: true
    // },
    // {
    //   name: 'walletType',
    //   label: 'Wallet Type',
    //   type: 'select',
    //   options: [
    //     { value: 0, label: 'Deposit' },
    //     { value: 1, label: 'Withdraw' }
    //   ],
    //   required: true
    // },
    {
      name: 'currency',
      label: 'Select Currency',
      type: 'select',
      options: currencyList,
      required: true
    }
  ]

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <>
          {!dataLoading && (
            <PlayerEditForm title='Test' data={data} loading={loading} fields={fields} onSubmit={onSubmit} />
          )}
        </>
      </Grid>
    </Grid>
  )
}

export default Test

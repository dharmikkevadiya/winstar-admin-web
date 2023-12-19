import Grid from '@mui/material/Grid'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import DataServices from 'src/services/requestApi'
import { useEffect, useState } from 'react'
import PlayerEditForm from 'src/components/PlayerEditForm'
import BankCards from 'src/components/BankCards'
import AddEditForm from 'src/components/AddEditForm'

const PlayerBanks = () => {
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const token = auth.accessToken
  const playerId = localStorage.getItem('pid')
  const [data, setData] = useState(null)
  const [id, setId] = useState(null)
  const [dataLoading, setDataLoading] = useState(false)

  const [showAddEditForm, setshowAddEditForm] = useState({
    isVisible: false,
    data: {},
    isEdit: false
  })

  const onEditClick = data => {
    console.log('data::::::::::::::::', data)
    setId(data?._id)
    setshowAddEditForm({
      isVisible: true,
      isEdit: true,
      data: data
    })
  }
  const onCloseClick = () => setshowAddEditForm({ isVisible: false, data: {}, isEdit: false })

  const getPlayerData = async () => {
    try {
      if (token && playerId) {
        setDataLoading(true)
        const res = await DataServices.callGetPlayersBanks(playerId, token)
        if (res?.data?.status === true) {
          setData(res?.data?.data)
          setDataLoading(false)
        } else toast.error(res?.data?.message)
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
      const res = await DataServices.callUpdatePlayersBank(playerId, { id, ...data }, token)

      if (res?.data?.status === true) {
        setLoading(false)
        onCloseClick()
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
    { name: 'bankName', type: 'text', label: 'Bank Name', placeholder: 'Bank Name', disabled: false },
    {
      name: 'bankAccountNo',
      type: 'text',
      label: 'Bank Account No.',
      placeholder: 'Bank Account Number',
      disabled: false
    },
    { name: 'IFSCCode', type: 'text', label: 'IFSC Code', placeholder: 'IFSC Code', disabled: false },
    { name: 'UPIId', type: 'text', label: 'UPI Id', placeholder: 'UPI Id', disabled: false }
  ]

  return (
    <div className='main-container container-fluid' style={{ overflow: 'hidden' }}>
      <div className='mt-3'>
        {showAddEditForm.isEdit === true ? (
          <AddEditForm
            data={showAddEditForm.data}
            isEdit={showAddEditForm.isEdit}
            onSubmit={onSubmit}
            fields={fields}
            onClose={onCloseClick}
            loading={loading}
            title='Edit Bank'
          />
        ) : (
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <>
                {!dataLoading && (
                  <BankCards
                    title='Player Banks'
                    data={data?.bankAccounts}
                    loading={loading}
                    fields={fields}
                    onSubmit={onSubmit}
                    handleEdit={onEditClick}
                  />
                )}
              </>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  )
}

export default PlayerBanks

import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import CustomInputForm from 'src/components/CustomInputForm'
import _ from 'lodash'
import usePermission from 'src/hooks/usePermission'

const BonusAndReward = () => {
  const [loading, setLoading] = useState(false)
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState({})
  const [dataLoading, setDataLoading] = useState(false)

  // access
  const isEditAccess = usePermission('Web Setting', 'Bonus & Reward', 'Edit')

  const getSettingData = async () => {
    try {
      if (token) {
        setDataLoading(true)
        const res = await DataServices.callGetSettings(token)
        if (res?.data?.status === true) {
          setDataLoading(false)
          setData(res?.data?.data)
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
    getSettingData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async data => {
    try {
      setLoading(true)
      let res = await DataServices.callUpdateSettings(data, token)

      if (res?.data?.status === true) {
        setLoading(false)
        getSettingData()
        toast.success('Update successfully')
      } else {
        setLoading(false)
        toast.error(res?.data?.message)
      }
    } catch (err) {
      setLoading(false)
      console.log('err::', err)
      toast.error('Something wrent wrong!')
    }
  }

  const inputList = [
    {
      name: 'commissionRate',
      label: 'Commission Rate',
      type: 'String',
      placeholder: 'Commision Rate %',
      icon: 'prime:percentage'
    },
    {
      name: 'referDepositeRate',
      label: 'Refer Deposite Rate',
      type: 'String',
      placeholder: 'Refer Deposite Rate %',
      icon: 'prime:percentage'
    },
    {
      name: 'referWithdrawRate',
      label: 'Refer Withdraw Rate',
      type: 'String',
      placeholder: 'Refer Withdraw Rate %',
      icon: 'prime:percentage'
    },

    // Bronz
    { name: 'Bronz Ranking', type: 'hr', label: 'Bronz Ranking', fullWidth: true },
    { name: 'bronzWagerAmount', label: 'Wager Amount', placeholder: '0' },
    {
      name: 'bronzMonthlyBonuses',
      label: 'Monthly Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'bronzLevelUpBonuses',
      label: 'LevelUp Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'bronzRakeBack',
      label: 'Rake Back',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'bronzWeeklyBonuses',
      label: 'Weekly Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },

    // Silver
    { name: 'Silver Ranking', type: 'hr', label: 'Silver Ranking', fullWidth: true },
    { name: 'silverWagerAmount', label: 'Wager Amount', placeholder: '0' },
    {
      name: 'silverMonthlyBonuses',
      label: 'Monthly Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'silverLevelUpBonuses',
      label: 'LevelUp Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'silverRakeBack',
      label: 'Rake Back',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'silverWeeklyBonuses',
      label: 'Weekly Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'silverBonusGrowth',
      label: 'Bonus Growth',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },

    // Gold
    { name: 'Gold Ranking', type: 'hr', label: 'Gold Ranking', fullWidth: true },
    { name: 'goldWagerAmount', label: 'Wager Amount', placeholder: '0' },
    {
      name: 'goldMonthlyBonuses',
      label: 'Monthly Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'goldLevelUpBonuses',
      label: 'LevelUp Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'goldRakeBack',
      label: 'Rake Back',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'goldWeeklyBonuses',
      label: 'Weekly Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'goldBonusGrowth',
      label: 'Bonus Growth',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },

    // Platinum
    { name: 'Platinum Ranking', type: 'hr', label: 'Platinum Ranking', fullWidth: true },
    { name: 'platinumWagerAmount', label: 'Wager Amount', placeholder: '0' },
    {
      name: 'platinumMonthlyBonuses',
      label: 'Monthly Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'platinumLevelUpBonuses',
      label: 'LevelUp Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'platinumRakeBack',
      label: 'Rake Back',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'platinumWeeklyBonuses',
      label: 'Weekly Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'platinumBonusGrowth',
      label: 'Bonus Growth',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    },
    {
      name: 'platinumDailyBonuses',
      label: 'Daily Bonuses',
      placeholder: '0',
      required: true,
      icon: 'prime:percentage'
    }
  ]

  return (
    <>
      {!dataLoading && (
        <CustomInputForm
          title='Bonus & Reward Setting'
          data={data}
          loading={loading}
          fields={inputList}
          onSubmit={isEditAccess ? onSubmit : null}
        />
      )}
    </>
  )
}

export default BonusAndReward

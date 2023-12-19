// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import DataServices from 'src/services/requestApi'
import { useAuth } from 'src/hooks/useAuth'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'

const donutColors = {
  series1: '#826bf8',
  series2: '#00d4bd'
}

const ApexDonutChart = () => {
  const auth = useAuth()
  const token = auth.accessToken
  const [data, setData] = useState(null)

  const getStatistics = async () => {
    try {
      if (token) {
        const res = await DataServices.callGetStatistics(token)

        if (res?.data?.status === true) {
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
    getStatistics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const theme = useTheme()

  const options = {
    type: 'donut',
    stroke: { width: 0 },
    labels: ['Bet', 'Win'],
    colors: [donutColors.series1, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter: val => `${parseInt(val, 10)}%`
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem'
            },
            value: {
              fontSize: '1.2rem',
              color: theme.palette.text.secondary,
              formatter: val => `₹${parseInt(val, 10)}`
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: theme.typography.body1.fontSize
                  },
                  value: {
                    fontSize: theme.typography.body1.fontSize
                  },
                  total: {
                    fontSize: theme.typography.body1.fontSize
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader
        title='Bet/Win Amount'
        subheader='Spending on various categories'
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      <CardContent>
        {data && (
          <ReactApexcharts
            type='donut'
            height={400}
            options={options}
            series={[data?.totalBetAmount, data?.totalWinAmount]}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default ApexDonutChart

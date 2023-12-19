const navigation = () => {
  return [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'ic:outline-dashboard'
    },
    {
      title: 'Admin',
      icon: 'eos-icons:admin',
      children: [
        {
          title: 'Admin List',
          path: '/admin/list'
        }
      ]
    },
    {
      title: 'Player',
      icon: 'heroicons:user-group-solid',
      children: [
        {
          title: 'Player List',
          path: '/player/list'
        },
        {
          title: 'Player Banned',
          path: '/player/banned'
        }
      ]
    },
    {
      title: 'Game',
      icon: 'mdi:games',
      children: [
        {
          title: 'Game List',
          path: '/game/list'
        },
        {
          title: 'Game Providers',
          path: '/game/providers'
        },
        {
          title: 'Game Types',
          path: '/game/types'
        },
        {
          title: 'Game Subtypes',
          path: '/game/subtypes'
        }
      ]
    },
    {
      title: 'Controls',
      icon: 'ant-design:control-outlined',
      children: [
        {
          title: 'Banner',
          path: '/controls/banner'
        },

        // {
        //   title: 'Version',
        //   path: '/controls/version'
        // },
        {
          title: 'Spin Wheel',
          path: '/controls/spin-wheel'
        },
        {
          title: 'Restricted Area',
          path: '/controls/restricted-area'
        },
        {
          title: 'CMS',
          path: '/controls/cms'
        },
        {
          title: 'Ticket',
          path: '/controls/ticket'
        },
        {
          title: 'Blog',
          path: '/controls/blog'
        },
        {
          title: 'FAQs',
          path: '/controls/faqs'
        },
        {
          title: 'Notification',
          path: '/controls/notification'
        }
      ]
    },
    {
      title: 'Payment',
      icon: 'mdi:recurring-payment',
      children: [
        {
          title: 'History',
          path: '/payment/history'
        },
        {
          title: 'Add Cash',
          path: '/payment/add-cash'
        },
        {
          title: 'Payout',
          path: '/payment/payout'
        },
        {
          title: 'Bet',
          path: '/payment/bet'
        },
        {
          title: 'Win',
          path: '/payment/win'
        }
      ]
    },
    {
      title: 'Web Setting',
      icon: 'gala:settings',
      children: [
        {
          title: 'Social',
          path: '/web-setting/social'
        },
        {
          title: 'Currency',
          path: '/web-setting/currency'
        },
        {
          title: 'Maintenance',
          path: '/web-setting/maintenance'
        },
        {
          title: 'Bonus & Reward',
          path: '/web-setting/bonus-reward'
        },
        {
          title: 'Withdraw',
          path: '/web-setting/withdraw'
        },
        {
          title: 'Deposit',
          path: '/web-setting/deposit'
        }
      ]
    },
    {
      icon: 'fluent:person-support-16-filled',
      title: 'Contact Details',
      path: '/contact-details'
    }
  ]
}

export default navigation

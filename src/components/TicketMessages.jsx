import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const ChatMessages = ({ data }) => {
  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '280px', // Set your desired height
        overflowY: 'auto', // Add a vertical scrollbar if needed
        marginBottom: '20px',
        border: '1px solid gray'
      }}
    >
      <CardContent>
        {data && data.length > 0 ? (
          data.map(message => (
            <div
              key={message._id}
              style={{
                display: 'flex',
                justifyContent: message.sendType === 'admin' ? 'flex-end' : 'flex-start',
                marginBottom: '8px'
              }}
            >
              <div
                style={{
                  margin: '0px',
                  lineHeight: '1.467',
                  fontSize: '0.9375rem',
                  fontFamily:
                    '"Public Sans", sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                  fontWeight: 400,
                  color: 'rgba(208, 212, 241, 0.78)',
                  boxShadow: 'rgba(15, 20, 34, 0.3) 0px 2px 4px 1px',
                  borderRadius: '0px 6px 6px',
                  maxWidth: '100%',
                  width: 'fit-content',
                  overflowWrap: 'break-word',
                  padding: '0.5625rem 1rem',
                  backgroundColor: message.sendType === 'admin' ? 'rgba(115, 103, 240)' : 'rgba(47,51,73)',
                  color: 'white'
                }}
              >
                {message.sendMessage}
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <p style={{ textAlign: 'center', margin: '0' }}>No ticket messages!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ChatMessages

import dynamic from 'next/dynamic'
import { useTheme } from '@mui/material/styles'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>
})

export default function CustomQuillEditor({ value, onChange }) {
  const theme = useTheme()

  const customToolbarStyles = `
    .ql-toolbar.ql-snow {
      color: ${theme.palette.mode === 'light' ? 'black' : 'white'} !important;
    }
    .ql-toolbar button {
      color: ${theme.palette.mode === 'light' ? 'black' : 'white'} !important;
    }
    .ql-toolbar button:hover {
      color: #fff !important;  // Change the hover color if needed
    }
    .ql-toolbar .ql-stroke {
      fill: none;
      stroke: ${theme.palette.mode === 'light' ? 'black' : 'white'} !important;
    }
    .ql-toolbar .ql-fill {
      fill: ${theme.palette.mode === 'light' ? 'black' : 'white'} !important;
      stroke: none;
    }
    .ql-toolbar .ql-picker {
      color: ${theme.palette.mode === 'light' ? 'black' : 'white'} !important;
    }
  `

  return (
    <>
      <style jsx global>
        {`
          ${customToolbarStyles}
        `}
      </style>
      <QuillNoSSRWrapper
        value={value}
        onChange={onChange}
        modules={{
          toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }}
        style={{ height: '200px', marginBottom: '50px' }}
      />
    </>
  )
}

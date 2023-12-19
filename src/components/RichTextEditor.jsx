import React from 'react'
import { Editor } from '@tinymce/tinymce-react'

const RichTextEditor = ({ value, setvalue }) => {
  return (
    <div style={{ borderRadius: '10px', backgroundColor: '#3e3c61', color: '#fff' }}>
      <Editor
        apiKey='rex55g9sqxo30h3mko0yz2a8j1qf44b0defpbn9gsjirgpx8'
        value={value}
        init={{
          selector: 'textarea#basic-example',
          height: 400,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'help',
            'wordcount'
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style:
            'body { font-family: Helvetica, Arial, sans-serif; font-size: 16px; background-color: #2F3349; color: #fff; }',
          toolbar_sticky: true,
          toolbar_mode: 'sliding',
          skin: 'oxide-dark' // Optional: Use the dark skin for TinyMCE
        }}
        onEditorChange={(newValue, editor) => {
          setvalue(newValue)
        }}
      />
    </div>
  )
}

export default RichTextEditor

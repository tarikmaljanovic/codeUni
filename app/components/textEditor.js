// TextEditor.js
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles
import { Button } from '@mui/joy'
import axios from 'axios';

export default function TextEditor(props) {
  const [content, setContent] = useState(props.content);

  const handleLessonUpdate = () => {
    const data = {
      token: JSON.parse(localStorage.getItem('token')),
      content: content,
      id: props.id
    }
    axios.post('/api/lessons/updateLesson', data).then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    })
  }

  const handleProjectUpdate = () => {
    const data = {
      token: JSON.parse(localStorage.getItem('token')),
      content: content,
      id: props.id
    }
    axios.put('/api/projects/updateProject', data).then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    setContent(props.content)
  }, [props.content])

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['code-block'],
      [{'script': 'sub'}, {'script': 'super'}],
      [{'indent': '-1'}, {'indent': '+1'}],
      [{'direction': 'rtl'}],
      [{'color': []}, {'background': []}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'code-block', 'script', 'indent', 'direction',
    'color', 'background', 'link', 'image', 'video'
  ];

  return (
    <div>
      <div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={content}
          onChange={(value) => {setContent(value)}}
          style={{marginTop: '20px'}}
        />
        <Button onClick={props.project ? handleProjectUpdate : handleLessonUpdate} style={{marginTop: '20px'}} className='bttn'>Insert</Button>
      </div>
    </div>
  );
};
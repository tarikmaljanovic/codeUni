'use client'
import '../styles/lesson.scss'
import Navbar from "./navbar"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import TextEditor from './textEditor'
import { Delete, Edit, Add } from '@mui/icons-material'
import { Box, SpeedDial, SpeedDialAction } from '@mui/material'
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { Button } from '@mui/joy'
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';

export default function LessonUI(props) {
    const actions = [
        { icon: <Delete />, name: 'Delete Lesson', open: () => {setOpen({...open, deleteModule: true})} },
        { icon: <Edit />, name: 'Edit Lesson Name', open: () => {setOpen({...open, editModule: true})}}
    ];
    const [open, setOpen] = useState({deleteModule: false, editModule: false})
    const [action, setAction] = useState('')
    const router = useRouter()
    const [lesson, setLesson] = useState({})
    const [content, setContent] = useState('')
    const [user, setUser] = useState({})
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')))
    const [lessonData, setLessonData] = useState({
        lesson_title: lesson.lesson_title
    })

    useEffect(() => {
        axios.get(`/api/lessons/getLesson/${props.id}`).then(res => {
            setLesson(res.data)
            setContent(res.data.lesson_content.content)
        })
    }, [])

    useEffect(() => {
        axios.get(`/api/verify/${token}`).then(res => {
            if(res.data.message != 'valid') {
                setToken(null)
            } else {
                setUser(res.data.payload)
            }
        })
    }, [])

    const handleDeleteLesson = () => {
        axios.delete(`/api/lessons/deleteLesson/${props.id}/${token}`).then(res => {
            router.push(`/course/${lesson.course_id}`)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleNameChange = () => {
        const data = {
            token: token,
            lesson_title: lessonData.lesson_title,
            id: props.id
        }
        axios.put('/api/lessons/updateLessonName', data).then(res => {
            console.log(res.data)
            setLesson({...lesson, lesson_title: lessonData.lesson_title})
        }).catch(err => {
            console.log(err)
        })
    }


    if(token) {
        return (
            <div className='container is-fluid px-5 lesson-container'>
                <Navbar user={user} />
                <div className='lesson-content'>
                    <h1 className='lesson-title'>
                        {lesson.lesson_title}
                    </h1>
                    <div className='lesson-section' id='lesson'>
                        {
                            user.admin ? 
                                (lesson && <TextEditor content={content} id={props.id} />) : 
                                (
                                    lesson && 
                                    <>
                                        <div dangerouslySetInnerHTML={{ __html: content }} />
                                        <iframe
                                            style={{marginTop: '20px'}}
                                            height="450px"  
                                            src="https://onecompiler.com/embed/javascript" 
                                            width="100%"
                                        />
                                    </>)
                        }
                    </div>
                </div>
                {
                    user.admin ? (
                        <>
                            <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1, display: 'flex', alignSelf: 'flex-end' }}>
                                <SpeedDial
                                    icon={<Add/>}
                                    ariaLabel="SpeedDial basic example"
                                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                                >
                                    {actions.map((action) => (
                                        <SpeedDialAction
                                            key={action.name}
                                            icon={action.icon}
                                            tooltipTitle={action.name}
                                            onClick={() => {
                                                setAction(action.name)
                                                action.open()
                                            }}
                                        />
                                    ))}
                                </SpeedDial>
                            </Box>
                            <Modal open={open.deleteModule} onClose={() => setOpen({...open, deleteModule: false})}>
                                <ModalDialog>
                                    <DialogTitle>{action}</DialogTitle>
                                    <DialogContent>Are you sure you want to delete this lesson?</DialogContent>
                                    <Button onClick={() => {
                                        handleDeleteLesson()
                                        setOpen({...open, deleteModule: false})
                                    }} className='bttn-danger' type="submit">Delete Lesson</Button>
                                    <Button onClick={() => {
                                        setOpen({...open, deleteModule: false})
                                    }} className='bttn' type="submit">Cancel</Button>
                                </ModalDialog>
                            </Modal>
                            <Modal open={open.editModule} onClose={() => setOpen({...open, editModule: false})}>
                                <ModalDialog>
                                    <DialogTitle>{action}</DialogTitle>
                                    <DialogContent>Are you sure you want to rename this lesson?</DialogContent>
                                    <FormControl>
                                        <FormLabel>Name</FormLabel>
                                        <Input onChange={(e) => {setLessonData({lesson_title: e.target.value})}} />
                                    </FormControl>
                                    <Button onClick={() => {
                                        handleNameChange()
                                        setOpen({...open, editModule: false})
                                    }} className='bttn-danger' type="submit">Save Changes</Button>
                                    <Button onClick={() => {
                                        setOpen({...open, editModule: false})
                                    }} className='bttn' type="submit">Cancel</Button>
                                </ModalDialog>
                            </Modal>
                        </>
                    ) : null
                }
            </div>
        )
    } else {
        localStorage.clear()
        router.push('/')
    }
}
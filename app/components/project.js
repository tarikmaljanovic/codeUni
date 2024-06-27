'use client'
import '../styles/project.scss'
import Navbar from "./navbar"
import { useState, useEffect } from 'react'
import axios from 'axios'
import TextEditor from './textEditor'
import { useRouter } from 'next/navigation'
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

export default function ProjectUI(props) {
    const actions = [
        { icon: <Delete />, name: 'Delete Project', open: () => {setOpen({...open, deleteModule: true})} },
        { icon: <Edit />, name: 'Edit Project Name', open: () => {setOpen({...open, editModule: true})}}
    ];
    const [open, setOpen] = useState({deleteModule: false, editModule: false})
    const [action, setAction] = useState('')
    const router = useRouter()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [courseId, setCourseId] = useState(localStorage.getItem('course'))
    const [project, setProject] = useState({})
    const [content, setContent] = useState('')
    const [projectName, setProjectName] = useState('')
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')))

    useEffect(() => {
        axios.get(process.env.API_HOST + `projects/byId/${props.id}`).then(res => {
            setProject(res.data)
            setContent(JSON.parse(res.data.project_content).content)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    const handleDeleteProject = () => {
        axios.put(process.env.API_HOST + `projects/deleteProject/${props.id}`, {token: token}).then(res => {
            router.push(`/course/${project.course_id}`)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleNameChange = () => {
        axios.put(process.env.API_HOST + `projects/updateProject/${props.id}`, {
            token: JSON.parse(localStorage.getItem('token')),
            project_title: projectName,
        }).then(res => {
            setProject({...project, project_title: projectName})
        }).catch(err => {
            console.log(err)
        })
    }

    const handleFinishProject = () => {
        axios.put(process.env.API_HOST + `courses/updateProgress`, {
            course_id: courseId,
            user_id: user.id,
            project_id: props.id,
            type: "project"
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })

        axios.post(process.env.API_HOST + 'badges/assignBadge', {
            user_id: user.id
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    if(token) {
        return (
            <div className='container is-fluid px-5 project-container'>
                <Navbar user={user} />
                <div className='project-content'>
                    <h1 className='project-title'>
                        {project.project_title}
                    </h1>
                    <div className='project-section' id='project'>
                        {
                            user.admin ? 
                            (project && <TextEditor project={true} content={content} id={props.id} />) :
                            (
                                project && 
                                <>
                                    <div dangerouslySetInnerHTML={{__html: content}}/>
                                </>
                            )
                        }
                    </div>
                    <Button onClick={() => handleFinishProject()} style={{margin: 'auto', marginTop: '20px'}} className='bttn'>Finish Project</Button>
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
                                    <DialogContent>Are you sure you want to delete this project?</DialogContent>
                                    <Button onClick={() => {
                                        handleDeleteProject()
                                        setOpen({...open, deleteModule: false})
                                    }} className='bttn-danger' type="submit">Delete Project</Button>
                                    <Button onClick={() => {
                                        setOpen({...open, deleteModule: false})
                                    }} className='bttn' type="submit">Cancel</Button>
                                </ModalDialog>
                            </Modal>
                            <Modal open={open.editModule} onClose={() => setOpen({...open, editModule: false})}>
                                <ModalDialog>
                                    <DialogTitle>{action}</DialogTitle>
                                    <DialogContent>Are you sure you want to rename this project?</DialogContent>
                                    <FormControl>
                                        <FormLabel>Name</FormLabel>
                                        <Input onChange={(e) => {setProjectName(e.target.value)}} />
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
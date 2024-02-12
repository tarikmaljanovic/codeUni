'use client'
import '../styles/course.scss'
import { ImportContacts, KeyboardArrowRight, Code, Add, Delete, Edit, Upload, Favorite, FavoriteBorder } from '@mui/icons-material'
import { Box, SpeedDial, SpeedDialAction, Checkbox } from '@mui/material'
import { Button } from '@mui/joy'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack'
import axios from 'axios'
import Navbar from './navbar'
import Link from 'next/link'

export default function CourseUI(props) {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const router = useRouter()
    const [action, setAction] = useState('')
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')))
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [course, setCourse] = useState({})
    const [isFavorite, setIsFavorite] = useState(null)
    const [open, setOpen] = useState({
        lessonModule: false,
        projectModule: false,
        deleteModule: false,
        editModule: false
    })
    const actions = [
        { icon: <ImportContacts />, name: 'Create Lesson', open: () => {setOpen({...open, lessonModule: true})} },
        { icon: <Code />, name: 'Create Project', open: () => {setOpen({...open, projectModule: true})} },
        { icon: <Delete />, name: 'Delete Course', open: () => {setOpen({...open, deleteModule: true})} },
        { icon: <Edit />, name: 'Edit Course', open: () => {setOpen({...open, editModule: true})}}
    ];
    const [lessonData, setLessonData] = useState({
        lesson_title: '',
        course_id: props.id,
        token: token
    })
    const [projectData, setProjectData] = useState({
        project_title: '',
        course_id: props.id,
        token: token
    })
    const [courseData, setCourseData] = useState({
        course_title: '',
        course_image_data: null,
        token: token
    })


    useEffect(() => {
        if(user.id) {
            axios.get(`http://localhost:8000/courses/byId/${props.id}/${user.id}`).then(res => {
                setCourse(res.data)
                setIsFavorite(res.data.course.UserCour.starred)
            })
        }
    }, [])

    const createLesson = () => {
        axios.post('http://localhost:8000/lessons/createLesson', lessonData).then(res => {
            setCourse({...course, lessons: [...course.lessons, res.data]})
        }).catch(err => {
            console.log(err)
        })
    }

    const createProject = () => {
        axios.post('http://localhost:8000/projects/createProject', projectData).then(res => {
            setCourse({...course, projects: [...course.projects, res.data]})
        }).catch(err => {
            console.log(err)
        })
    }

    const handleDeleteCourse = () => {
        axios.put(`http://localhost:8000/courses/deleteCourse/${props.id}`, {
            token: token
        }).then(res => {
            router.push('/dashboard')
        }).catch(err => {
            console.log(err)
        })
    }

    const handleEditCourse = () => {
        const form = new FormData()
        form.append('file', courseData.course_image_data)
        form.append('upload_preset', 'tariksdp');

        axios.post('https://api-eu.cloudinary.com/v1_1/ds2qt32nd/image/upload', form).then(res => {
            axios.put(`http://localhost:8000/courses/updateCourse/${props.id}`, {
                course_id: props.id,
                course_title: courseData.course_title,
                course_image_url: res.data.url,
                token: token
            }).then(res => {
                setCourse({...course, course_title: res.data.course_title})
            }).catch(err => {
                console.log(err)
            })
        })
    }

    const handleFavorite = () => {
        setIsFavorite(!isFavorite)
        axios.put('http://localhost:8000/courses/favoriteCourse', {
            course_id: props.id,
            user_id: user.id,
            favorite: isFavorite
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    if(token) {
         return(
            <div className='container is-fluid px-5 course-container'>
                <Navbar user={user} />
                <div className='section-title'>
                    <div>
                        <span className='text'>{course?.course?.course_title || 'Loading...'}</span>
                        <Checkbox {...label} onClick={handleFavorite} icon={<Favorite color={`${isFavorite ? 'primary' : 'disabled'}`} />} checkedIcon={<Favorite />} />
                    </div>
                    <progress className="progress is-link" value={`${course?.course?.UserCour?.progress * 100 || 0}`} max="100">{course?.course?.UserCour?.progress * 100 || 0}%</progress>
                </div>
                <div className='columns is-multiline is-desktop course-list'>
                    {
                        course?.lessons?.map((item, index) => {
                            return (
                                <div key={item.id} className='column is-12 course-cell lesson-cell'>
                                    <Link href={`/lesson/${item.id}`}>
                                        <div className='notification course-box lesson-box'>
                                            <div className='left'>
                                                <ImportContacts />
                                                <span>{item.lesson_title}</span>
                                            </div>
                                            <KeyboardArrowRight />
                                        </div>
                                    </Link>
                                </div>
                            )
                        })
                    }
                    {
                        course?.projects?.map((item, index) => {
                            return (
                                <div key={item.id} className='column is-12 course-cell project-cell'>
                                    <Link href={`/project/${item.id}`}>
                                        <div className='notification course-box project-box'>
                                            <div className='left'>
                                                <Code />
                                                <span>{item.project_title}</span>
                                            </div>
                                            <KeyboardArrowRight />
                                        </div>
                                    </Link>
                                </div>
                            )
                        })
                    }
                </div>
                <Button disabled={course?.course?.UserCour?.progress != 1 || 0} className='bttn'>Finish Course</Button>
                {
                    user?.admin ? (
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
                    ) : null
                }
                {
                    user?.admin ? (
                        <Modal open={open.lessonModule} onClose={() => setOpen({...open, lessonModule: false})}>
                            <ModalDialog>
                                <DialogTitle>{action}</DialogTitle>
                                <DialogContent>Provide a name for the lesson.</DialogContent>
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input onChange={(e) => setLessonData({...lessonData, lesson_title: e.target.value})}/>
                                </FormControl>
                                    <Button onClick={() => {
                                        createLesson()
                                        setOpen({...open, lessonModule: false})
                                    }} className='bttn' type="submit">Submit</Button>
                            </ModalDialog>
                        </Modal>
                    ) : null
                }
                {
                    user?.admin ? (
                        <Modal open={open.projectModule} onClose={() => setOpen({...open, projectModule: false})}>
                            <ModalDialog>
                                <DialogTitle>{action}</DialogTitle>
                                <DialogContent>Provide a name for the project.</DialogContent>
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input onChange={(e) => setProjectData({...projectData, project_title: e.target.value})}/>
                                </FormControl>
                                    <Button onClick={() => {
                                        createProject()
                                        setOpen({...open, projectModule: false})
                                    }} className='bttn' type="submit">Submit</Button>
                            </ModalDialog>
                        </Modal>
                    ) : null
                }
                {
                    user?.admin ? (
                        <Modal open={open.deleteModule} onClose={() => setOpen({...open, deleteModule: false})}>
                            <ModalDialog>
                                <DialogTitle>{action}</DialogTitle>
                                <DialogContent>Are you sure you want to delete this course?</DialogContent>
                                    <Button onClick={() => {
                                        handleDeleteCourse()
                                        setOpen({...open, deleteModule: false})
                                    }} className='bttn-danger' type="submit">Delete Course</Button>
                                    <Button onClick={() => {
                                        setOpen({...open, deleteModule: false})
                                    }} className='bttn' type="submit">Cancel</Button>
                            </ModalDialog>
                        </Modal>
                    ) : null
                }
                {
                    user?.admin ? (
                        <Modal open={open.editModule} onClose={() => setOpen({...open, editModule: false})}>
                            <ModalDialog>
                            <DialogTitle>{action}</DialogTitle>
                            <DialogContent>Provide a name and an image.</DialogContent>
                            <form
                                onSubmit={(event) => {
                                event.preventDefault();
                                setOpen({...open, editModule: false});
                                }}
                            >
                                <Stack spacing={2}>
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input onChange={(e) => {setCourseData({...courseData, course_title: e.target.value})}} />
                                </FormControl>
                                <div className="file">
                                    <label className="file-label">
                                        <input 
                                            onChange={(e) => {setCourseData({...courseData, course_image_data: e.target.files[0]})}}
                                            className="file-input"
                                            type="file"
                                            name="resume"
                                        />
                                        <span className="file-cta">
                                        <span className="file-icon">
                                            <Upload />
                                        </span>
                                        <span className="file-label">
                                            Choose a file…
                                        </span>
                                        </span>
                                    </label>
                                </div>
                                <Button onClick={() => {
                                    handleEditCourse()
                                }} className='bttn' type="submit">Submit</Button>
                                </Stack>
                            </form>
                            </ModalDialog>
                        </Modal>
                    ) : null
                }
            </div>
        )
    } else {
        localStorage.clear()
        router.push('/')
    }
}
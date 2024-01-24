'use client'
import '../styles/dashboard.scss'
import Image from 'next/image'
import Navbar from './navbar'
import { Add, Code, Upload } from '@mui/icons-material'
import { Box, SpeedDial, SpeedDialAction } from '@mui/material'
import { useEffect, useState } from 'react'
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import CourseList from './courseList';
import axios from 'axios'

export default function AdminDashboardUI(props) {
    const actions = [
        { icon: <Code />, name: 'Create Course' },
    ];
    const [action, setAction] = useState('')
    const [open, setOpen] = useState(false)
    const [signal, setSignal] = useState(0)
    const [courses, setCourses] = useState([])
    const [badges, setBadges] = useState([])
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')))
    const[courseData, setCourseData] = useState({
        course_title: '',
        course_image_data: null,
        token: token
    })

    const createCourse = () => {
        const form = new FormData()
        form.append('file', courseData.course_image_data)
        form.append('upload_preset', 'tariksdp');

        axios.post('https://api-eu.cloudinary.com/v1_1/ds2qt32nd/image/upload', form).then(res => {
            axios.post('api/courses/createCourse', {
                course_title: courseData.course_title,
                course_image_url: res.data.url,
                token: token
            }).then(res => {
                setSignal(signal+1)
            })
        })
    }

    useEffect(() => {
        axios.get(`api/courses/getCourses/${token}`).then(res => {
            setCourses(res.data)
        })
    }, [signal])

    useEffect(() => {
        axios.get(`api/badges/getBadges/${token}`).then(res => {
            setBadges(res.data)
        })
    }, [token])

    return(
        <div className='container is-fluid px-5 dashboard-container'>
            <Navbar user={props.user} />
            <div className='section-title'>
                Course List
            </div>
            <CourseList admin={true} courses={courses} />
            <div className='section-title'>
                Badges
            </div>
            <div className='columns is-multiline is-desktop list'>
                {
                    badges?.map((item, index) => {
                        return(
                            <div key={index} className='column is-4 badge-cell'>
                                <div className='notification badge-box'>
                                    <Image alt='badge-icon' src={item.badge_image_url} width={100} height={100} />
                                    <div className='description-section'>
                                        <p className='badge-name'>{item.badge_name}</p>
                                        <p className='badge-description'>
                                            {item.badge_description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
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
                                setOpen(true)
                            }}
                        />
                    ))}
                </SpeedDial>
            </Box>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                <DialogTitle>{action}</DialogTitle>
                <DialogContent>Provide a name and an image.</DialogContent>
                <form
                    onSubmit={(event) => {
                    event.preventDefault();
                    setOpen(false);
                    }}
                >
                    <Stack spacing={2}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input onChange={(e) => setCourseData({...courseData, course_title: e.target.value})} autoFocus required />
                    </FormControl>
                    <div className="file">
                        <label className="file-label">
                            <input onChange={(e) => setCourseData({
                                ...courseData,
                                course_image_data: e.target.files[0]
                            })}
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
                        createCourse(courseData)
                    }} className='bttn' type="submit">Submit</Button>
                    </Stack>
                </form>
                </ModalDialog>
            </Modal>
        </div>
    )
}
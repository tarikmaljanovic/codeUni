'use client'
import '../styles/profile.scss'
import '../styles/dashboard.scss'
import { EmojiEvents, WorkspacePremium, Download } from '@mui/icons-material'
import { Button } from '@mui/joy'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import CourseList from './courseList'
import axios from 'axios'
import Navbar from "./navbar"
import Image from 'next/image'
import { Edit, Add } from '@mui/icons-material'
import { Box, SpeedDial, SpeedDialAction } from '@mui/material'
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';

export default function ProfileUI() {
    const actions = [
        { icon: <Edit />, name: 'Edit Profile Information', open: () => setOpen(true)}
    ];
    const [open, setOpen] = useState(false)
    const [action, setAction] = useState('')
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [courses, setCourses] = useState([])
    const [favoriteCourses, setFavoriteCourses] = useState([])
    const [otherCourses, setOtherCourses] = useState([])
    const [completedCourses, setCompletedCourses] = useState([])
    const [badges, setBadges] = useState([])
    const [students, setStudents] = useState([])
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    })


    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            if (storedToken && storedUser) {
                setToken(JSON.parse(storedToken));
                setUser(JSON.parse(storedUser));
            } else {
                // Handle the case when token or user is not available in localStorage
                router.push('/');
            }
        }
    }, []);

    useEffect(() => {
        if (user) {
            axios.get(process.env.API_HOST + `courses/userCourses/${user.id}`)
                .then(res => setCourses(res.data))
                .catch(err => console.error(err));

            axios.get(process.env.API_HOST + `badges/userBadges/${user.id}`)
                .then(res => setBadges(res.data))
                .catch(err => console.error(err));

            setUserData({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: ''
            });

            if (user.admin) {
                axios.get(process.env.API_HOST + 'users/allStudents')
                    .then(res => setStudents(res.data))
                    .catch(err => console.error(err));
            }
        }
    }, [user]);

    useEffect(() => {
        const favs = courses.filter(course => course?.UserCour?.starred === true);
        const notFavs = courses.filter(course => course?.UserCour?.starred === false);
        const completed = courses.filter(course => course?.UserCour?.certificate === true);
        setCompletedCourses(completed);
        setOtherCourses(notFavs);
        setFavoriteCourses(favs);
    }, [courses]);

    const handleSaveChanges = () => {
        axios.put(process.env.API_HOST + `users/update/${user.id}`, userData)
            .then(res => {
                localStorage.setItem('user', JSON.stringify(res.data));
                setUser(res.data);
                setOpen(false);
            })
            .catch(err => console.error(err));
    };

    const disableAccount = (id) => {
        axios.put(process.env.API_HOST + 'users/disableAccount', {
            token: token,
            user_id: id
        })
            .then(res => {
                setStudents(students.map(student => {
                    if (student.id === id) {
                        student.disabled = true;
                    }
                    return student;
                }));
            })
            .catch(err => console.error(err));
    };

    const enableAccount = (id) => {
        axios.put(process.env.API_HOST + 'users/enableAccount', {
            token: token,
            user_id: id
        })
            .then(res => {
                setStudents(students.map(student => {
                    if (student.id === id) {
                        student.disabled = false;
                    }
                    return student;
                }));
            })
            .catch(err => console.error(err));
    };

    const generatePdf = async (course_title) => {
        try {
            const response = await axios.post(
                process.env.API_HOST + 'users/downloadCertificate',
                {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    course_title: course_title
                },
                { responseType: 'blob' }
            );

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'certificate.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading the PDF', error);
        }
    };

    if (typeof window === 'undefined' || !token) {
        return null; // or return a loading indicator or redirect
    }

    return (
        <div className='container is-fluid px-5 profile-container'>
        <Navbar user={user} />
        <div className='section-title'>
            {user.first_name} {user.last_name} <span className='user-tag'>{user.admin ? 'Admin' : 'Student'}</span>
        </div>
        {
            user?.admin ? (
                <>
                    <div className='container is-fluid px-0 dashboard-container'>
                        <div className='columns is-multiline is-desktop list'>
                            <div className={`column is-12 leaderboard-cell`}>
                                {
                                    students?.map((item, index) => {
                                        return(
                                            <div key={index} className='notification leaderboard-box'>
                                                <span className='user-name'>{item.first_name} {item.last_name}</span>
                                                <span className='rank'>{item.email}</span>
                                                {
                                                    item.disabled ? (
                                                        <Button onClick={() => enableAccount(item.id)} size="md" variant={'solid'} color="success">Enable</Button>
                                                    ) : (
                                                        <Button onClick={() => disableAccount(item.id)} size="md" variant={'solid'} color="danger">Disbale</Button>
                                                    )
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='section-title'>
                        Favourite Courses
                    </div>
                    <CourseList courses={favoriteCourses} />
                    <div className='section-title'>
                        My Courses
                    </div>
                    <CourseList courses={otherCourses} />
                    <div className='section-title'>
                        My Badges
                    </div>
                    <div className='columns is-multiline is-desktop list'>
                        {
                            badges?.map((item, index) => {
                                return (
                                    <div key={index} className='column is-4 badge-cell'>
                                        <div className='notification badge-box'>
                                            <Image alt='.' src={item.Badge.badge_image_url} width={100} height={100} />
                                            <div className='description-section'>
                                                <p className='badge-name'>{item.Badge.badge_name}</p>
                                                <p className='badge-description'>
                                                    {item.Badge.badge_description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) || null
                        }
                        {
                            badges.length == 0 ? (
                                <div className='column is-12 empty-list'>
                                    <div className='notification empty-list-entry'>
                                        <span className='text'>No recent Badges earned</span>
                                        <EmojiEvents />
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                    <div className='section-title'>
                        My Certificates
                    </div>
                    <div className='columns is-multiline is-desktop list'>
                        {
                            completedCourses?.map((item, index) => {
                                return (
                                    <div key={index} className='column is-4 certificate-cell'>
                                        <div className='notification certificate-box'>
                                            <Image alt='img' src={item.course_image_url} width={100} height={100} className='course-image'/>
                                            <div className='right'>
                                                <span className='course-name'>{item.course_title}</span>
                                                <Button onClick={() => generatePdf(item.course_title)} className='bttn'>Download<Download/></Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) || null
                        }
                        {
                            completedCourses.length == 0 ? (
                                <div className='column is-12 empty-list'>
                                    <div className='notification empty-list-entry'>
                                        <span className='text'>No Certificates earned</span>
                                        <WorkspacePremium />
                                    </div>
                                </div>
                            ) : null
                        }
                    </div>
                </>
            )
        }
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog>
                <DialogTitle>{action}</DialogTitle>
                <DialogContent>Edit your Profile Information</DialogContent>
                <FormControl>
                    <FormLabel>First Name</FormLabel>
                    <Input value={userData.first_name} onChange={(e) => setUserData({...userData, first_name: e.target.value})}  />
                </FormControl>
                <FormControl>
                    <FormLabel>Last Name</FormLabel>
                    <Input value={userData.last_name} onChange={(e) => setUserData({...userData, last_name: e.target.value})} />
                </FormControl>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
                </FormControl>
                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input onChange={(e) => setUserData({...userData, password: e.target.value})} />
                </FormControl>
                <Button onClick={handleSaveChanges} className='bttn-danger' type="submit">Save Changes</Button>
                <Button onClick={() => setOpen(false)} className='bttn' type="submit">Cancel</Button>
            </ModalDialog>
        </Modal>
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
    </div>
    );
}

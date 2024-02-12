'use client'
import '../styles/profile.scss'
import { EmojiEvents, WorkspacePremium, Download } from '@mui/icons-material'
import { Button } from '@mui/joy'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import CourseList from './courseList'
import axios from 'axios'
import Navbar from "./navbar"
import icon from '../../public/icon.svg'
import js from '../../public/js.svg'
import Image from 'next/image'


export default function ProfileUI() {
    const router = useRouter()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [courses, setCourses] = useState([])
    const [favoriteCourses, setFavoriteCourses] = useState([])
    const [otherCourses, setOtherCourses] = useState([])
    const [completedCourses, setCompletedCourses] = useState([])
    const [badges, setBadges] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:8000/courses/userCourses/${user.id}`).then(res => {
            setCourses(res.data)
        }).catch(err => {
            console.log(err)
        })

        axios.get(`http://localhost:8000/badges/userBadges/${user.id}`).then(res => {
            setBadges(res.data)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    useEffect(() => {
        const favs = courses.filter(course => course?.UserCour?.starred === true)
        const notFavs = courses.filter(course => course?.UserCour?.starred === false)
        const completed = courses.filter(course => course?.UserCour?.certificate === true)
        setCompletedCourses(completed)
        setOtherCourses(notFavs)
        setFavoriteCourses(favs)
    }, [courses])

    if(token) {
        return(
            <div className='container is-fluid px-5 profile-container'>
                <Navbar user={user} />
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
                                        <Image alt='.' src={item.badge_image_url} width={100} height={100} />
                                        <div className='description-section'>
                                            <p className='badge-name'>{item.badge_name}</p>
                                            <p className='badge-description'>
                                                {item.badge_description}
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
                                            <Button className='bttn'>Download<Download/></Button>
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
            </div>
        )
    } else {
        const router = useRouter()
        router.push('/login')
    }
}
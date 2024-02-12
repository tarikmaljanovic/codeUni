'use client'
import '../styles/dashboard.scss'
import  { EmojiEvents, Leaderboard } from '@mui/icons-material'
import Navbar from './navbar'
import CourseList from './courseList'
import AdminDashboardUI from './adminDashboard'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardUI() {
    const router = useRouter()
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')))
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [courses, setCourses] = useState([])
    const [badges, setBadges] = useState([])
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        if(!user.admin) {
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
            
            axios.get('http://localhost:8000/users/leaderboard').then(res => {
                setLeaderboard(res.data)
            }).catch(err => {
                console.log(err)
            })
        }
    }, [])

    if(token) {
        if(user?.admin) {
            return(
                <AdminDashboardUI user={user}/>
            )
        } else {
            return(
                <div className='container is-fluid px-5 dashboard-container'>
                    <Navbar user={user}/>
                    <div className='section-title'>
                        Course List
                    </div>
                    <CourseList admin={false} courses={courses} />
                    <div className='section-title'>
                        Recent Badges
                    </div>
                    <div className='columns is-multiline is-desktop list'>
                        {
                            badges?.map((item, index) => {
                                if(index < 3) {
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
                                }
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
                        Leaderboard
                    </div>
                    <div className='columns is-multiline is-desktop list'>
                        <div className={`column is-12 leaderboard-cell ${leaderboard.length ? '' : 'is-hidden'}`}>
                            <div className='notification leaderboard-box head'>
                                <span className='user-name'>Full Name</span>
                                <span className='rank'>Rank</span>
                                <span className='course-count'>Courses Completed</span>
                                <span className='badge-count'>Badges Earned</span>
                            </div>
                            {
                                leaderboard?.map((item, index) => {
                                    return(
                                        <div key={index} className='notification leaderboard-box'>
                                            <span className='user-name'>{item.user}</span>
                                            <span className='rank'>{++index}</span>
                                            <span className='course-count'>{item.courses}</span>
                                            <span className='badge-count'>{item.badges}</span>
                                        </div>
                                    )
                                }) || null
                            }
                        </div>
                            {
                                leaderboard.length == 0 ? (
                                    <div className='column is-12 empty-list'>
                                        <div className='notification empty-list-entry'>
                                            <span className='text'>No Leaderboard entries</span>
                                            <Leaderboard />
                                        </div>
                                    </div>
                                ) : null
                            }
                    </div>
                </div>
            )
        }
    } else {
        localStorage.clear()
        router.push('/')
    }
}
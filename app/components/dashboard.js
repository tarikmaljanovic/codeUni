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
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [courses, setCourses] = useState([])
    const [badges, setBadges] = useState([])
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        // Check if running on client-side
        if (typeof window !== 'undefined') {
            const storedToken = JSON.parse(localStorage.getItem('token'))
            const storedUser = JSON.parse(localStorage.getItem('user'))
            setToken(storedToken)
            setUser(storedUser)
        }
    }, [])

    useEffect(() => {
        if(user && !user.admin) {
            axios.get(process.env.API_HOST + `courses/userCourses/${user.id}`).then(res => {
                setCourses(res.data)
            }).catch(err => {
                console.log(err)
            })

            axios.get(process.env.API_HOST + `badges/userBadges/${user.id}`).then(res => {
                setBadges(res.data)
            }).catch(err => {
                console.log(err)
            })
            
            axios.get(process.env.API_HOST + 'users/leaderboard').then(res => {
                setLeaderboard(res.data)
            }).catch(err => {
                console.log(err)
            })
        }
    }, [user])

    if(token && user) {
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
        return null
    }
}
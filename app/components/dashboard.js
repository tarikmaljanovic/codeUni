'use client'
import '../styles/dashboard.scss'
import  { EmojiEvents, Leaderboard } from '@mui/icons-material'
import Navbar from './navbar'
import CourseList from './courseList'
import AdminDashboardUI from './adminDashboard'
import Image from 'next/image'
import icon from '../../public/icon.svg'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardUI() {
    const router = useRouter()
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')))
    const [user, setUser] = useState({})
    const [courses, setCourses] = useState([])
    const [badges, setBadges] = useState([])
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        axios.post('/api/verify', {token: token}).then(res => {
            if(res.data.message != 'valid') {
                setToken(null)
            } else {
                setUser(res.data.payload)
            }
        })
    }, [])

    useEffect(() => {
        axios.post('api/courses/getCourses', {
            token: token
        }).then(res => {
            console.log(res.data)
            setCourses(res.data)
        })
    }, [])

    useEffect(() => {
        axios.post('api/badges/getBadges', {
            token: token
        }).then(res => {
            setBadges(res.data)
        })
    }, [])

    useEffect(() => {
        axios.post('api/leaderboard', {
            token: token
        }).then(res => {
            setLeaderboard(res.data)
        })
    }, [])

    useEffect(() => {
        if(token == null) {
            localStorage.clear()
            router.push('/')
        }
    }, [ ,token])

    return (
        user?.admin ? <AdminDashboardUI user={user}/> : (
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
                    })
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
                        })
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
    )
}
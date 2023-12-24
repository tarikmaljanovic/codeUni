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
            <CourseList />
            <div className='section-title'>
                Recent Badges
            </div>
            <div className='columns is-multiline is-desktop list'>
                <div className='column is-4 badge-cell'>
                    <div className='notification badge-box'>
                        <Image alt='.' src={icon.src} width={100} height={100} />
                        <div className='description-section'>
                            <p className='badge-name'>Senior</p>
                            <p className='badge-description'>
                                By completing all but one course, you have earned the 'Senior' badge.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='column is-4 badge-cell'>
                    <div className='notification badge-box'>
                        <Image alt='.' src={icon.src} width={100} height={100} />
                        <div className='description-section'>
                            <p className='badge-name'>Senior</p>
                            <p className='badge-description'>
                                By completing all but one course, you have earned the 'Senior' badge.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='column is-4 badge-cell'>
                    <div className='notification badge-box'>
                        <Image alt='.' src={icon.src} width={100} height={100} />
                        <div className='description-section'>
                            <p className='badge-name'>Senior</p>
                            <p className='badge-description'>
                                By completing all but one course, you have earned the 'Senior' badge.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='column is-12 empty-list is-hidden'>
                    <div className='notification empty-list-entry'>
                        <span className='text'>No recent Badges earned</span>
                        <EmojiEvents />
                    </div>
                </div>
            </div>
            <div className='section-title'>
                Leaderboard
            </div>
            <div className='columns is-multiline is-desktop list'>
                <div className='column is-12 leaderboard-cell'>
                    <div className='notification leaderboard-box head'>
                        <span className='user-name'>Full Name</span>
                        <span className='rank'>Rank</span>
                        <span className='course-count'>Courses Completed</span>
                        <span className='badge-count'>Badges Earned</span>
                    </div>
                    <div className='notification leaderboard-box'>
                        <span className='user-name'>Tarik Maljanovic</span>
                        <span className='rank'>1</span>
                        <span className='course-count'>6</span>
                        <span className='badge-count'>12</span>
                    </div>
                    <div className='notification leaderboard-box'>
                        <span className='user-name'>Tarik Maljanovic</span>
                        <span className='rank'>1</span>
                        <span className='course-count'>6</span>
                        <span className='badge-count'>12</span>
                    </div>
                </div>
                <div className='column is-12 empty-list is-hidden'>
                    <div className='notification empty-list-entry'>
                        <span className='text'>No Leaderboard entries</span>
                        <Leaderboard />
                    </div>
                </div>
            </div>
        </div>
        )
    )
}
'use client'
import { useState } from 'react'
import '../styles/dashboard.scss'
import Navbar from './navbar'
import  { KeyboardArrowRight, EmojiEvents, Leaderboard } from '@mui/icons-material'

export default function DashboardUI() {
    const [showMore, setShowMore] = useState(false)
    
    return(
        <div className='container is-fluid px-5'>
            <Navbar />
            <div className='section-title'>
                Course List
            </div>
            <div className='columns is-multiline is-desktop course-list'>
                {
                    Array(15).fill().map((_, index) => {
                        if(index < 6) {
                            return (
                                <div key={index} className='column is-4 course-cell'>
                                    <div className='notification is-primary course-box'>
                                        <span className='course-name'>JavaScript</span>
                                        <KeyboardArrowRight/>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>
            <div className={`columns is-multiline is-desktop course-list ${showMore ? '' : 'less'}`}>
                {
                    Array(15).fill().map((_, index) => {
                        if(index > 6) {
                            return(
                                <div key={index} className={`column is-4 course-cell`}>
                                    <div className='notification is-primary course-box'>
                                        <span className='course-name'>JavaScript</span>
                                        <KeyboardArrowRight/>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>
            <span className='link' onClick={() => setShowMore(!showMore)}>{showMore ? 'Show Less' : 'Show More'}</span>
            <div className='section-title'>
                Recent Badges
            </div>
            <div className='columns is-multiline is-desktop list'>
                <div className='column is-12 empty-list'>
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
                <div className='column is-12 empty-list'>
                    <div className='notification empty-list-entry'>
                        <span className='text'>No Leaderboard entries</span>
                        <Leaderboard />
                    </div>
                </div>
            </div>
        </div>
    )
}
'use client'
import '../styles/profile.scss'
import { useState } from 'react'
import { EmojiEvents, WorkspacePremium, KeyboardArrowRight } from '@mui/icons-material'
import Navbar from "./navbar"
import CourseList from './courseList'
import icon from '../../public/icon.svg'
import Image from 'next/image'


export default function ProfileUI() {
    const [showMore, setShowMore] = useState(false)

    return(
        <div className='container is-fluid px-5'>
            <Navbar />
            <div className='section-title'>
                My Courses
            </div>
            <CourseList />
            <div className='section-title'>
                My Badges
            </div>
            <div className='columns is-multiline is-desktop list'>
                <div className='column is-4 badge-cell'>
                    <div className='notification badge-box'>
                        <Image src={icon.src} width={100} height={100} />
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
                        <Image src={icon.src} width={100} height={100} />
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
                        <Image src={icon.src} width={100} height={100} />
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
                My Certificates
            </div>
            <div className='columns is-multiline is-desktop list'>
                <div className='column is-12 empty-list'>
                    <div className='notification empty-list-entry'>
                        <span className='text'>No recent Certificates earned</span>
                        <WorkspacePremium />
                    </div>
                </div>
            </div>
        </div>
    )
}
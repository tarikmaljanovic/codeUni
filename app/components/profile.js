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

    return(
        <div className='container is-fluid px-5 profile-container'>
            
            <div className='section-title'>
                Favourite Courses
            </div>
            <CourseList />
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
                <div className='column is-4 certificate-cell'>
                    <div className='notification certificate-box'>
                        <Image src={js.src} width={100} height={100} className='course-image'/>
                        <div className='right'>
                            <span className='course-name'>JavaScript</span>
                            <Button className='bttn'>Download<Download/></Button>
                        </div>
                    </div>
                </div>
                <div className='column is-4 certificate-cell'>
                    <div className='notification certificate-box'>
                        <Image src={js.src} width={100} height={100} className='course-image'/>
                        <div className='right'>
                            <span className='course-name'>JavaScript</span>
                            <Button className='bttn'>Download<Download/></Button>
                        </div>
                    </div>
                </div>
                <div className='column is-12 empty-list is-hidden'>
                    <div className='notification empty-list-entry'>
                        <span className='text'>No recent Certificates earned</span>
                        <WorkspacePremium />
                    </div>
                </div>
            </div>
        </div>
    )
}
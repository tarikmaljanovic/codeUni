'use client'
import '../styles/profile.scss'
import Navbar from "./navbar"
import { EmojiEvents, WorkspacePremium } from '@mui/icons-material'

export default function ProfileUI() {
    return(
        <div className='container is-fluid px-5'>
            <Navbar />
            <div className='section-title'>
                My Courses
            </div>
            <div className='columns is-multiline is-desktop course-list'>

            </div>
            <div className='section-title'>
                My Badges
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
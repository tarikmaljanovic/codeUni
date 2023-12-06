'use client'
import '../styles/course.scss'
import { ImportContacts, KeyboardArrowRight, Code } from '@mui/icons-material'
import { Button } from '@mui/joy'
import Navbar from './navbar'

export default function CourseUI(props) {
    return(
        <div className='container is-fluid px-5'>
            <Navbar />
            <div className='section-title'>
                <span className='text'>Java</span>
                <progress className="progress is-link" value="30" max="100">30%</progress>

            </div>
            <div className='columns is-multiline is-desktop course-list'>
                <div className='column is-12 course-cell lesson-cell'>
                    <div className='notification course-box lesson-box'>
                        <div className='left'>
                            <ImportContacts />
                            <span>Lesson 1: Introduction</span>
                        </div>
                        <KeyboardArrowRight />
                    </div>
                </div>
                <div className='column is-12 course-cell project-cell'>
                    <div className='notification course-box project-box'>
                        <div className='left'>
                            <Code />
                            <span>Project 1: Introduction</span>
                        </div>
                        <KeyboardArrowRight />
                    </div>
                </div>
            </div>
            <Button disabled className='bttn'>Finish Course</Button>
        </div>
    )
}
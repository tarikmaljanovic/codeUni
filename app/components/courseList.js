import '../styles/courseList.scss'
import { KeyboardArrowRight } from '@mui/icons-material'
import { useState } from 'react'

export default function CourseList() {
    const [showMore, setShowMore] = useState(false)

    return (
        <>
            <div className='columns is-multiline is-desktop course-list'>
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
            </div>
            <span className='link' onClick={() => setShowMore(!showMore)}>{showMore ? 'Show Less' : 'Show More'}</span>
        </>
    )
}
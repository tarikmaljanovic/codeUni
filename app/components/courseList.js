import { KeyboardArrowRight } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CourseList(props) {
    const [showMore, setShowMore] = useState(false)
    const [courses, setCourses] = useState([])

    useEffect(() => {
        setCourses(props.courses)
    }, [ ,props.courses])

    return (
        <>
            <div className='columns is-multiline is-desktop course-list'>
                {
                    courses?.map((item, index) => {
                        if(item.deleted == 1) {
                            return null;
                        }
                        if(index < 6) {
                            return (
                                    <div key={index} className='column is-4 course-cell'>
                                        <Link href={`course/${item.id}`}>
                                            <div className='notification is-primary course-box'>
                                                <span className='course-name'>
                                                    {item.course_title}
                                                </span>
                                                <KeyboardArrowRight/>
                                            </div>
                                        </Link>
                                    </div>
                            )
                        }
                    })
                    }
                </div>
                <div className={`columns is-multiline is-desktop course-list ${showMore ? '' : 'less'}`}>
                {
                    courses?.map((item, index) => {
                        if(item.deleted == 1) {
                            return null;
                        }
                        if(index > 6) {
                            return(
                                <div key={index} className={`column is-4 course-cell`}>
                                    <div className='notification is-primary course-box'>
                                        <span className='course-name'>
                                            {item.course_title}
                                        </span>
                                        <KeyboardArrowRight/>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>
            <span className='link' onClick={() => setShowMore(!showMore)}>{showMore ? 'Show Less' : 'Show More'}</span>
        </>
    )
}
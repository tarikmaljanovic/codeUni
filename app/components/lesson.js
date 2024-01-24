'use client'
import '../styles/lesson.scss'
import Navbar from "./navbar"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function LessonUI(props) {
    const router = useRouter()
    const [lesson, setLesson] = useState({})
    const [user, setUser] = useState({})
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')))

    useEffect(() => {
        axios.get(`/api/lessons/getLesson/${props.id}`).then(res => {
            setLesson(res.data)
        })
    }, [])

    useEffect(() => {
        axios.get(`/api/verify/${token}`).then(res => {
            if(res.data.message != 'valid') {
                setToken(null)
            } else {
                setUser(res.data.payload)
            }
        })
    },[])


    if(token) {
        return(
            <div className='container is-fluid px-5 lesson-container'>
                <Navbar user={user} />
                <div className='lesson-content'>
                    <h1 className='lesson-title'>
                        {lesson.lesson_title}
                    </h1>
                    <div className='lesson-section'>
                        <h2 className='section-title'>
                            Section Title Here
                        </h2>
                        <p className='section-content'>
                            Modern JavaScript is a “safe” programming language. It does not provide low-level access to memory or the CPU, because it was initially created for browsers which do not require it.
                            JavaScript’s capabilities greatly depend on the environment it’s running in. For instance, Node.js supports functions that allow JavaScript to read/write arbitrary files, perform network requests, etc.
                            In-browser JavaScript can do everything related to webpage manipulation, interaction with the user, and the webserver.
                        </p>
                        <ul>
                            <li>ONE</li>
                            <li>ONE</li>
                            <li>ONE</li>
                            <li>ONE</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    } else {
        localStorage.clear()
        router.push('/')
    }
}
'use client'
import '../styles/navbar.scss'
import { useState } from 'react'
import  { Button } from '@mui/material'
import { AccountCircle, Menu, GridView, Logout } from '@mui/icons-material'
import { ClickAwayListener } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function Navbar(props) {
    const [dropdown, setDropdown] = useState(false)
    const [sidebar, setSidebar] = useState(false)
    const router = useRouter()

    const toggleDropdown = () => {
        setDropdown(!dropdown)
    }

    return(
        <>
            <div className="nav-container">
                <div className='title is-mobile'>
                    codeuni
                </div>
                <ClickAwayListener onClickAway={() => setDropdown(false)}>
                    <div className='user-section is-hidden-touch' onClick={() => toggleDropdown()}>
                        <AccountCircle/>
                        <span className='user-name'>{props.user?.first_name} {props.user?.last_name}</span>
                        <div className={`dropdown ${dropdown ? '' : 'is-hidden'}`}>
                            <div onClick={() => {
                                router.push('/profile')
                            }} className='dropdown-item'>
                                <span className='dropdown-text'>My Profile</span>
                                <AccountCircle/>
                            </div>
                            <div onClick={() => {
                                router.push('/dashboard')
                            }} className='dropdown-item'>
                                <span className='dropdown-text'>Dashboard</span>
                                <GridView />
                            </div>
                            <div onClick={() => {
                                    localStorage.clear()
                                    router.push('/')
                                }} className='dropdown-item'>
                                <span className='dropdown-text'>Log out</span>
                                <Logout />
                            </div>
                        </div>
                    </div>
                </ClickAwayListener>
                <Menu className='is-hidden-desktop' onClick={() => setSidebar(true)}/>
            </div>
            <div className={`sidebar ${sidebar ? '' : 'hidden'}`}>
                <span className='welcome'>Welcome:</span>
                <span className='user-name'>{props.user?.first_name} {props.user?.last_name}</span>
                <div className='buttons'>
                    <Button onClick={() => {
                        router.push('/profile')
                    }} className='bttn'>My Profile <AccountCircle/></Button>
                    <Button onClick={() => {
                        router.push('/dashboard')
                    }} className='bttn'>Dashboard <GridView/></Button>
                    <Button className='bttn' onClick={() => {
                        localStorage.clear()
                        router.push('/')
                    }}>Log out <Logout/></Button>
                </div>
            </div>
            <div onClick={() => setSidebar(false)} className={`back ${sidebar ? '' : 'is-hidden'}`}></div>
        </>
    )
}
'use client'
import { useState } from 'react'
import '../styles/navbar.scss'
import  { Button } from '@mui/material'
import { AccountCircle, Menu, GridView, Logout } from '@mui/icons-material'
import { ClickAwayListener } from '@mui/material'

export default function Navbar() {
    const [dropdown, setDropdown] = useState(false)
    const [sidebar, setSidebar] = useState(false)

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
                        <span className='user-name'>Tarik Maljanovic</span>
                        <div className={`dropdown ${dropdown ? '' : 'is-hidden'}`}>
                            <div className='dropdown-item'>
                                <span className='dropdown-text'>My Profile</span>
                                <AccountCircle/>
                            </div>
                            <div className='dropdown-item'>
                                <span className='dropdown-text'>Dashboard</span>
                                <GridView />
                            </div>
                            <div className='dropdown-item'>
                                <span className='dropdown-text'>Log out</span>
                                <Logout />
                            </div>
                        </div>
                    </div>
                </ClickAwayListener>
                <Menu className='is-hidden-desktop' onClick={() => setSidebar(true)} />
            </div>
            <div className={`sidebar-container is-hidden-desktop ${sidebar ? '' : 'is-hidden'}`}>
                <div className='back' onClick={() => setSidebar(false)}></div>
                <div className={`sidebar ${sidebar ? '' : 'hidden'}`}>
                    <span className='welcome'>Welcome:</span>
                    <span className='user-name'>Tarik Maljanovic</span>
                    <div className='buttons'>
                        <Button className='bttn'>My Profile <AccountCircle/></Button>
                        <Button className='bttn'>Dashboard <GridView/></Button>
                        <Button className='bttn'>Log out <Logout/></Button>
                    </div>
                </div>
            </div>
        </>
    )
}
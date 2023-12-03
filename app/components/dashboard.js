'use client'
import '../styles/dashboard.scss'
import Navbar from './navbar'

export default function DashboardUI() {
    return(
        <div className='container is-fluid px-5'>
            <Navbar />
            <div className='rows courses-list'>
                <div className='columns'>
                    <div className='column is-1'>
                        <div className='notification course'></div>
                    </div>
                    <div className='column is-1'>
                        <div className='notification course'></div>
                    </div>
                    <div className='column is-1'>
                        <div className='notification course'></div>
                    </div>
                </div>
                <div className='columns'>
                    <div className='column is-4'>
                        <div className='notification course'></div>
                    </div>
                    <div className='column is-4'>
                        <div className='notification course'></div>
                    </div>
                    <div className='column is-4'>
                        <div className='notification course'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
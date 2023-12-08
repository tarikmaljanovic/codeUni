'use client'
import '../styles/dashboard.scss'
import Image from 'next/image'
import CourseList from './courseList'
import Navbar from './navbar'
import icon from '../../public/icon.svg'
import { Add, Code, WorkspacePremium, Upload } from '@mui/icons-material'
import { Box, SpeedDial, SpeedDialAction } from '@mui/material'
import { useState } from 'react'
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';

export default function AdminDashboardUI() {
    const actions = [
        { icon: <Code />, name: 'Create Course' },
      ];

      const [action, setAction] = useState('')
      const [open, setOpen] = useState(false)

      
    return(
        <div className='container is-fluid px-5 dashboard-container'>
            <Navbar />
            <div className='section-title'>
                Course List
            </div>
            <CourseList />
            <div className='section-title'>
                Badges
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
            </div>
            <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1, display: 'flex', alignSelf: 'flex-end' }}>
                <SpeedDial
                    icon={<Add/>}
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() => {
                                setAction(action.name)
                                setOpen(true)
                            }}
                        />
                    ))}
                </SpeedDial>
            </Box>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog>
                <DialogTitle>{action}</DialogTitle>
                <DialogContent>Provide a name and an image.</DialogContent>
                <form
                    onSubmit={(event) => {
                    event.preventDefault();
                    setOpen(false);
                    }}
                >
                    <Stack spacing={2}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input autoFocus required />
                    </FormControl>
                    <div className="file">
                        <label className="file-label">
                            <input className="file-input" type="file" name="resume"/>
                            <span className="file-cta">
                            <span className="file-icon">
                                <Upload />
                            </span>
                            <span className="file-label">
                                Choose a file…
                            </span>
                            </span>
                        </label>
                    </div>
                    <Button className='bttn' type="submit">Submit</Button>
                    </Stack>
                </form>
                </ModalDialog>
            </Modal>
        </div>
    )
}
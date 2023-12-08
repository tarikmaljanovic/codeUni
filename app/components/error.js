'use client'
import { useEffect } from 'react'
import '../styles/error.scss'
import { Modal, ModalDialog, ModalClose, Typography } from '@mui/joy'
import { useRouter } from 'next/navigation'

export default function ErrorUI(props) {
    const router = useRouter()

    useEffect(() => {
        if(props.msg == 'invalid') {
            setTimeout(() => {
                localStorage.clear()
                router.push('/')
            }, 5000)
        }
    }, [])

    return(
        <>
            <div className="container is-fluid px-5 error-container">
                <Modal open>
                    <ModalDialog
                        color="danger"
                        variant="solid"
                    >
                        <ModalClose />
                        <Typography
                            component="h2"
                            id="modal-title"
                            level="h4"
                            textColor="inherit"
                            fontWeight="lg"
                            mb={1}
                        >
                            You are not authorised to access this page or your session has expired. You will be taken to the login page.
                        </Typography>

                    </ModalDialog>
                </Modal>
            </div>
        </>
    )
}
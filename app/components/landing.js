'use client'
import '../styles/landing.scss'
import axios from 'axios'
import { Button } from '@mui/joy'
import { TextField, Input, InputAdornment, IconButton, InputLabel, FormControl, Alert, Snackbar } from '@mui/material'
import { Visibility, VisibilityOff, Email } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Landing() {
    const router = useRouter()

    const sendSignupRequest = (data) => {
        axios.post('/api/signup', data).then(res => {
            if(res.data.message == 'User already exists') {
                setErrors({...errors, signupError: true})
                setSnackbars({...snackbars, existingUser: true })
                return null
            }
            localStorage.setItem('user', JSON.stringify(res.data.user))
            localStorage.setItem('token', JSON.stringify(res.data.token))
            router.push('/dashboard')
        }).catch(error => {
            console.log(error)
        })
    }

    const sendLoginRequest = (data) => {
        axios.post('api/login', data).then(res => {
            if(res.data.message == 'Wrong password' || res.data.message == 'User not found') {
                setErrors({...errors, loginError: true})
                setSnackbars({...snackbars, wrongInfo: true})
                return null
            }
            localStorage.setItem('user', JSON.stringify(res.data.user))
            localStorage.setItem('token', JSON.stringify(res.data.token))
            router.push('/dashboard')
        }).catch(error => {
            console.log(error)
        })
    }

    const [displays, setDisplays] = useState({
        showPassword: false,
        showPassword2: false,
        showPassword3: false,
        showForm: true,
        showForm2: false,
        isSignUp: false,
        isLogin: true,
    })
    const [signupData, setSignupData] = useState({
        firstName: '',
        lastName: '',
        password: '',
        password2: '',
        email: '',
    })
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState({
        signupError: false,
        loginError: false
    })
    const [snackbars, setSnackbars] = useState({
        signupError: false,
        passwordLengthError: false,
        loginError: false,
        emailError: false,
        existingUser: false,
        wrongInfo: false
    })

    return(
        <div className='container is-fluid landing-container'>
            <div className={`box landing-box ${displays.isSignUp ? '' : 'is-hidden'}`}>
                <div className='banner'>
                    codeuni
                </div>
                <div className={`form-body ${displays.showForm ? '' : 'is-hidden'}`}>
                    <TextField
                        onChange={(e) => setSignupData({
                            ...signupData,
                            firstName: e.target.value
                        })}
                        error={errors.signupError}
                        className='text-field'
                        id="standard-basic"
                        label="First Name" 
                        variant="standard" />
                    <TextField
                        onChange={(e) => setSignupData({
                            ...signupData,
                            lastName: e.target.value
                        })}
                        error={errors.signupError}
                        className='text-field' 
                        id="standard-basic" 
                        label="Last Name" 
                        variant="standard" />
                </div>
                <FormControl className={`form-body ${displays.showForm2 ? '' : 'is-hidden'}`}>
                    <FormControl className='form-control'>
                        <InputLabel htmlFor="standard-adornment-email">Email</InputLabel>
                        <Input
                            onChange={(e) => setSignupData({
                                ...signupData,
                                email: e.target.value
                            })}
                            error={errors.signupError}
                            className='text-field'
                            id="standard-adornment-email"
                            type='email'
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton>
                                    <Email />
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl className='form-control'>
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                            onChange={(e) => setSignupData({
                                ...signupData,
                                password: e.target.value
                            })}
                            error={errors.signupError}
                            className='text-field'
                            id="standard-adornment-password"
                            type={displays.showPassword ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setDisplays({...displays, showPassword: !displays.showPassword})}
                                >
                                    {displays.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl className='form-control'>
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                            onChange={(e) => setSignupData({
                                ...signupData,
                                password2: e.target.value
                            })}
                            error={errors.signupError}
                            className='text-field'
                            id="standard-adornment-password"
                            type={displays.showPassword2 ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setDisplays({...displays, showPassword2: !displays.showPassword2})}
                                >
                                    {displays.showPassword2 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                </FormControl>
                <span className='to-login'>Already have an account? <a onClick={() => setDisplays({...displays, isSignUp: false, isLogin: true})} className='link'>Log in</a></span>
                <div className='buttons'>
                    <Button
                        className={`bttn back-button ${displays.showForm2 ? '' : 'is-invisible'}`}
                        onClick={() => 
                            setDisplays({
                                ...displays,
                                showForm: true,
                                showForm2: false
                            })
                        }
                    >
                        Back
                    </Button>
                    <Button
                        className='bttn next-button'
                        onClick={() => {
                                if(displays.showForm) {
                                    if(signupData.firstName == '' || signupData.lastName == '') {
                                        setErrors({...errors, signupError: true})
                                        setSnackbars({...snackbars, signupError: true})
                                    } else {
                                        setErrors({...errors, signupError: false})
                                        setDisplays({
                                            ...displays,
                                            showForm: false,
                                            showForm2: true
                                        })
                                    }
                                } else {
                                    if(signupData.email == '' || signupData.password == '' || signupData.password2 == '') {
                                        setErrors({...errors, signupError: true})
                                        setSnackbars({...snackbars, signupError: true})
                                    } else if(signupData.password.length < 8) {
                                        setErrors({...errors, signupError: true})
                                        setSnackbars({...snackbars, passwordLengthError: true})
                                    } else if(signupData.password != signupData.password2) {
                                        setErrors({...errors, signupError: true})
                                        setSnackbars({...snackbars, passwordMatchError: true})
                                    } else if(signupData.email.includes('@') == false) {
                                        setErrors({...errors, signupError: true})
                                        setSnackbars({...snackbars, emailError: true})
                                    } else {
                                        setErrors({...errors, signupError: false})
                                        sendSignupRequest(signupData)
                                    }
                                }
                            }
                        }
                    >
                        {displays.showForm2 ? 'Sign Up' : 'Next'}
                    </Button>
                </div>
            </div>
            <div className={`box landing-box ${displays.isLogin ? '' : 'is-hidden'}`}>
                <div className='banner'>
                    codeuni
                </div>
                <FormControl className={`form-body`}>
                    <FormControl className='form-control'>
                        <InputLabel htmlFor="standard-adornment-email">Email</InputLabel>
                        <Input
                            onChange={(e) => setLoginData({
                                ...loginData,
                                email: e.target.value
                            })}
                            error={errors.loginError}
                            className='text-field'
                            id="standard-adornment-email"
                            type='email'
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton>
                                    <Email />
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                    <FormControl className='form-control'>
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                            onChange={(e) => setLoginData({
                                ...loginData,
                                password: e.target.value
                            })}
                            error={errors.loginError}
                            className='text-field'
                            id="standard-adornment-password"
                            type={displays.showPassword3 ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setDisplays({...displays, showPassword3: !displays.showPassword3})}
                                >
                                    {displays.showPassword3 ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                </FormControl>
                <span className='to-login'>Don't have an account? <a onClick={() => setDisplays({...displays, isSignUp: true, isLogin: false})} className='link'>Sign up</a></span>
                <div className='buttons'>
                    <Button className='is-invisible'></Button>
                    <Button
                        className='bttn login-button'
                        onClick={() => {
                            if(loginData.email == '' || loginData.password == '') {
                                setErrors({...errors, loginError: true})
                                setSnackbars({...snackbars, loginError: true})
                            } else if(loginData.email.includes('@') == false) {
                                setErrors({...errors, loginError: true})
                                setSnackbars({...snackbars, loginError: true})
                            } else {
                                setErrors({...errors, loginError: false})
                                sendLoginRequest(loginData)
                            }
                        }}
                    >
                        Log In
                    </Button>
                </div>
            </div>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={snackbars.signupError} autoHideDuration={6000} onClose={() => setSnackbars({...snackbars, signupError: false})}>
                <Alert onClose={() => setSnackbars({...snackbars, signupError: false})} severity="error" sx={{ width: '100%' }}>
                    Please fill out every input field!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={snackbars.passwordLengthError} autoHideDuration={6000} onClose={() => setSnackbars({...snackbars, passwordLengthError: false})}>
                <Alert onClose={() => setSnackbars({...snackbars, passwordLengthError: false})} severity="error" sx={{ width: '100%' }}>
                    Password needs to be at least 8 characters long and contain at least one number!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={snackbars.passwordMatchError} autoHideDuration={6000} onClose={() => setSnackbars({...snackbars, passwordMatchError: false})}>
                <Alert onClose={() => setSnackbars({...snackbars, passwordMatchError: false})} severity="error" sx={{ width: '100%' }}>
                    The Passwords have to match!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={snackbars.loginError} autoHideDuration={6000} onClose={() => setSnackbars({...snackbars, loginError: false})}>
                <Alert onClose={() => setSnackbars({...snackbars, loginError: false})} severity="error" sx={{ width: '100%' }}>
                    Please fill out every input field!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={snackbars.loginError} autoHideDuration={6000} onClose={() => setSnackbars({...snackbars, emailError: false})}>
                <Alert onClose={() => setSnackbars({...snackbars, emailError: false})} severity="error" sx={{ width: '100%' }}>
                    Please provide a valid email!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={snackbars.existingUser} autoHideDuration={6000} onClose={() => setSnackbars({...snackbars, existingUser: false})}>
                <Alert onClose={() => setSnackbars({...snackbars, existingUser: false})} severity="error" sx={{ width: '100%' }}>
                    User with this email already exists!
                </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={snackbars.wrongInfo} autoHideDuration={6000} onClose={() => setSnackbars({...snackbars, wrongInfo: false})}>
                <Alert onClose={() => setSnackbars({...snackbars, wrongInfo: false})} severity="error" sx={{ width: '100%' }}>
                    Please enter correct credentials!
                </Alert>
            </Snackbar>
        </div>
    )
}
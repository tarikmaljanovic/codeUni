'use client'
import '../styles/landing.scss'
import { Button } from '@mui/joy'
import { TextField, Input, InputAdornment, IconButton, InputLabel, FormControl, Alert, Snackbar } from '@mui/material'
import { Visibility, VisibilityOff, Email } from '@mui/icons-material'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import loginSchema from '../validationSchemas/login'
import signupSchema from '../validationSchemas/signup'
import { useAuth } from '../context/AuthContext'
import { securePost } from '../utils/apiClient'

export default function Landing() {
    const router = useRouter()
    const { login } = useAuth()
    const [errorMessage, setErrorMessage] = useState('')
    const [error, setError] = useState(false)
    const [isLogin, setIsLogin] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const [formVisibility, setFormVisibility] = useState(false)
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })
    const [signupData, setSignupData] = useState({
        first_name: '',
        last_name: '',
        password: '',
        email: '',
    })

    const handleError = (error) => {
        const message = error.response?.data?.message || error.message || 'An error occurred';
        setErrorMessage(message);
        setError(true);
        setTimeout(() => setError(false), 5000);
    };

    const handleLogin = async () => {
        try {
            await loginSchema.validate(loginData);
            const response = await securePost('users/login', loginData);
            login(response.user, response.token);
            router.push('/dashboard');
        } catch (error) {
            handleError(error);
        }
    };

    const handleSignup = async () => {
        try {
            await signupSchema.validate(signupData);
            const response = await securePost('users/signup', signupData);
            login(response.user, response.token);
            router.push('/dashboard');
        } catch (error) {
            handleError(error);
        }
    };

    return(
        <div className='container is-fluid landing-container'>
            <div className={`box landing-box ${isLogin ? 'is-hidden' : ''}`}>
                <div className='banner signup-banner'>
                    codeuni
                </div>
                <div className={`form-body ${isLogin ? 'is-hidden' : ''}`}>
                    <TextField
                        onChange={(e) => setSignupData({
                            ...signupData,
                            first_name: e.target.value
                        })}
                        error={error}
                        className='text-field'
                        label="First Name" 
                        variant="standard" />
                    <TextField
                        onChange={(e) => setSignupData({
                            ...signupData,
                            last_name: e.target.value
                        })}
                        error={error}
                        className='text-field'  
                        label="Last Name" 
                        variant="standard" />
                </div>
                <FormControl className={`form-body ${formVisibility ? '' : 'is-hidden'}`}>
                    <FormControl className='form-control'>
                        <InputLabel htmlFor="standard-adornment-email">Email</InputLabel>
                        <Input
                            onChange={(e) => setSignupData({
                                ...signupData,
                                email: e.target.value
                            })}
                            error={error}
                            className='text-field'
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
                            error={error}
                            className='text-field'
                            type={isVisible? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setIsVisible(!isVisible)}
                                >
                                    {isVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                </FormControl>
                <span className='to-login'>Already have an account? <a onClick={() => setIsLogin(true)} className='link'>Log in</a></span>
                <div className='buttons'>
                    <Button
                        className={`bttn back-button ${formVisibility ? '' : 'is-invisible'}`}
                        onClick={() => 
                            setFormVisibility(!formVisibility)
                        }
                    >
                        Back
                    </Button>
                    <Button
                        className='bttn next-button'
                        onClick={() => {
                                formVisibility ? handleSignup() : setFormVisibility(!formVisibility)
                            }
                        }
                    >
                        {formVisibility ? 'Sign Up' : 'Next'}
                    </Button>
                </div>
            </div>
            <div className={`box landing-box ${isLogin ? '' : 'is-hidden'}`}>
                <div className='banner login-banner'>
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
                            error={error}
                            className='text-field'
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
                            error={error}
                            className='text-field'
                            type={isVisible ? 'text' : 'password'}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setIsVisible(!isVisible)}
                                >
                                    {isVisible ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                </FormControl>
                <span className='to-login'>No account? <a onClick={() => setIsLogin(false)} className='link'>Sign up</a></span>
                <div className='buttons'>
                    <Button className='is-invisible'></Button>
                    <Button
                        className='bttn login-button'
                        onClick={() => {
                            handleLogin()
                        }}
                    >
                        Log In
                    </Button>
                </div>
            </div>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={error} autoHideDuration={6000} onClose={() => setError(false)}>
                <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
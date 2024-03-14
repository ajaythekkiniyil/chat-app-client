import GoogleIcon from '@mui/icons-material/Google';
import { Alert } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../axios/axiosInstance';

function Login() {
    const navigate = useNavigate()

    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    })
    const [errorMessage, setErrorMessage] = useState("")

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setInputValue({
            ...inputValue,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        axiosInstance.post('/user/login', inputValue)
            .then(resp => {
                if (resp.status === 200) {
                    navigate('/home')
                }
            })
            .catch(err => {
                setErrorMessage(err?.response?.data?.message)
                setTimeout(() => {
                    setErrorMessage("")
                }, 5000)
            })
    }

    return (
        <div className='flex flex-col login-container h-screen'>
            <div className='flex h-screen justify-center items-center w-full'>
                <div className='w-3/4 lg:w-1/4'>
                    <h1 className='font-semibold text-3xl py-4'>Welcome to chat app</h1>

                    {
                        errorMessage &&
                        <Alert
                            message="Error"
                            description={errorMessage}
                            type="error"
                            showIcon
                        />
                    }

                    <form onSubmit={handleSubmit}>
                        <label className='font-medium'>Email <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            name='email'
                            placeholder='Enter your email'
                            required
                            onChange={handleInputChange}
                        />

                        <label className='font-medium'>Password <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            name='password'
                            placeholder='Enter your password'
                            required
                            onChange={handleInputChange}
                        />

                        <p className='text-sm text-blue-700 font-medium cursor-pointer'>Forgot password?</p>
                        <button type='submit' className='btn-login'>Login</button>
                    </form>

                    <p className='text-center'>or</p>
                    <button className='google-btn'><GoogleIcon style={{ fontSize: '16px', margin: '2px' }} />Sign up with google</button>

                    <p className='text-sm text-center font-medium mt-4'>Don't have account? <span className='text-blue-700 cursor-pointer' onClick={() => navigate('/signup')}>Register here</span></p>
                </div>
            </div>
        </div>
    )
}

export default Login
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../axios/axiosInstance'
import { useState } from 'react'
import { Alert, message } from 'antd';

function SignUp() {
    const navigate = useNavigate()
    const [inputValue, setInputValue] = useState({
        name: "",
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
        axiosInstance.post('/user/signup', inputValue)
            .then(resp => {
                if (resp.status === 201) {
                    navigate('/')
                }
            })
            .catch(err => {
                setErrorMessage(err?.response?.data?.message)
                setTimeout(()=>{
                    setErrorMessage("")
                },2000)
            })
    }

    return (
        <div className='flex flex-col login-container h-screen'>
            <div className='flex h-screen justify-center items-center w-full'>
                <div className='w-3/4 lg:w-1/4'>
                    <h1 className='font-semibold text-3xl py-4'>Register now</h1>

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
                        <label className='font-medium'>Name <span className='text-red-600'>*</span></label>
                        <input
                            type="text"
                            name='name'
                            placeholder='Enter your Name'
                            required
                            onChange={handleInputChange}
                        />

                        <label className='font-medium'>Email <span className='text-red-600'>*</span></label>
                        <input
                            type="email"
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

                        <button type='submit' className='btn-login'>Signup</button>
                    </form>

                    <p className='text-center'>or</p>

                    <p className='text-sm text-center font-medium mt-4'>Already have account? <span className='text-blue-700 cursor-pointer' onClick={() => navigate('/')}>Login now</span></p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
function SignUp() {
    return (
        <div className='flex flex-col login-container h-screen'>
            <div className='flex h-screen justify-center items-center w-full'>
                <div className='w-3/4 lg:w-1/4'>
                    <h1 className='font-semibold text-3xl py-4'>Register now</h1>
                    <label className='font-medium'>Email <span className='text-red-600'>*</span></label>
                    <input type="text" placeholder='Enter your email' />
                    <label className='font-medium'>Password <span className='text-red-600'>*</span></label>
                    <input type="text" placeholder='Enter your password' />
                    <button className='btn-login'>Login</button>

                    <p className='text-center'>or</p>

                    <p className='text-sm text-center font-medium mt-4'>Already have account? <span className='text-blue-700 cursor-pointer'>Login now</span></p>
                </div>
            </div>
        </div>
    )
}

export default SignUp
import { useSelector } from 'react-redux'
import welcomeImage from '../assets/welcome.png'

function WelcomeScreen() {
    const darkMode = useSelector((state)=> state.theme.value)

    return (
        <div className={"welcome-screen flex flex-col justify-center items-center" + (darkMode ? ' light-dark-mode' : '')}>
            <img src={welcomeImage} className='welcome-image' />
            <p className={'pt-5 text-gray-600' + (darkMode ? ' light-dark-mode' : '')}>Click conversation to start chat</p>
        </div>
    )
}

export default WelcomeScreen
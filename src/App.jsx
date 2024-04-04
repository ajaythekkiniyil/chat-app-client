import { Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import MainContainer from './Components/MainContainer';
import WelcomeScreen from './Components/WelcomeScreen';
import Chats from './Components/Chats';

import { io } from 'socket.io-client'

function App() {
  // .env variable importing
  const socketUrl = import.meta.env.VITE_SOCKET_URL
  const socket = io(socketUrl)

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/home' element={<MainContainer socket={socket} />}>
          <Route index element={<WelcomeScreen />} />
          <Route path='chats/:receiverId' element={<Chats socket={socket} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

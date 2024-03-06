import { Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import MainContainer from './Components/MainContainer';
import WelcomeScreen from './Components/WelcomeScreen';
import Chats from './Components/Chats';

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/home' element={<MainContainer />}>
        <Route index element={<WelcomeScreen />}/>
        <Route path='chats/:id' element={<Chats />}/>
      </Route>
    </Routes>
    </>
  )
}

export default App

import '../App.css'
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConversationList from '../Components/ConversationList';
import { Outlet, useNavigate } from 'react-router-dom';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import { useSelector, useDispatch } from 'react-redux'
import { changeTheme } from '../store/themeSlice';
import { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance'
import AllUsersListModal from './AllUsersListModal';
import SearchBox from './SearchBox';
import { Spin } from 'antd';

function MainContainer() {
    const darkMode = useSelector((state) => state.theme.value)
    const chatOpen = useSelector((state) => state.chatOpen.value)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // for all users list modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => { setIsModalOpen(true) };
    const handleCancel = () => { setIsModalOpen(false) };

    const [loading, setLoading] = useState(false)
    const [conversations, setConversations] = useState([])
    const [reloadConversation, setReloadConversation] = useState(true)
    const userId = localStorage.getItem('userId')

    useEffect(() => {
        if (reloadConversation) {
            setLoading(true)
            axiosInstance.get('/chat/get-all-conversations')
                .then(resp => {
                    if (resp.status === 200) {
                        setConversations(resp.data)
                        setReloadConversation(false)
                        setLoading(false)
                    }
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        navigate('/')
                        setReloadConversation(false)
                        setLoading(false)
                    }
                })
        }
    }, [reloadConversation])

    // return only friendId removing logged user id
    const filterFriedId = (users) => {
        return (users.filter(id => id !== userId)[0])
    }

    return (
        <>
            <div className='bg-slate-300 h-screen p-7'>
                <div className={'bg-white rounded-lg p-3 wrapper-container' + (darkMode ? ' dark-mode' : '')}>
                    <div className='flex flex-col md:flex-row'>
                        {/* sidebar */}
                        <div className={'w-full md:w-80 pr-3' + (chatOpen ? ' chat-open' : '')}>
                            {/* topbar */}
                            <div className='my-2 flex justify-between'>
                                <div>
                                    <IconButton className={darkMode ? ' dark-mode' : ''}
                                    // onClick={handleLogout}
                                    >
                                        <AccountCircleIcon />
                                    </IconButton>
                                </div>
                                <div>
                                    {/* Online users */}
                                    <AllUsersListModal isModalOpen={isModalOpen} handleCancel={handleCancel} setReloadConversation={setReloadConversation} />

                                    <IconButton
                                        title='Online users' className={darkMode ? ' dark-mode' : ''}
                                        onClick={showModal}
                                    >
                                        <PeopleIcon />
                                    </IconButton>

                                    {/* Available groups */}
                                    <IconButton title='Available groups' className={darkMode ? ' dark-mode' : ''}>
                                        <GroupsIcon />
                                    </IconButton>

                                    {/* create group */}
                                    <IconButton title='Create group' className={darkMode ? ' dark-mode' : ''}>
                                        <GroupAddIcon />
                                    </IconButton>

                                    {
                                        !darkMode &&
                                        <IconButton
                                            title='Dark mode'
                                            className={darkMode ? ' dark-mode' : ''}
                                            onClick={() => dispatch(changeTheme())}>
                                            <NightsStayIcon />
                                        </IconButton>
                                    }
                                    {
                                        darkMode &&
                                        <IconButton
                                            title='Light mode'
                                            className={darkMode ? ' dark-mode' : ''}
                                            onClick={() => dispatch(changeTheme())}>
                                            <WbSunnyIcon />
                                        </IconButton>
                                    }
                                </div>
                            </div>

                            {/* search box */}
                            <SearchBox />

                            {/* conversations */}
                            <div className={'flex-1 my-2 bg-slate-100 rounded-md conversation-container p-1' + (darkMode ? ' light-dark-mode' : '')}>
                                <div>
                                    {
                                        loading &&
                                        <div className='flex justify-center'>
                                            <Spin size="large" />
                                        </div>
                                    }
                                    {
                                        conversations.map(conversation => {
                                            const friendId = filterFriedId(conversation.users)
                                            return <ConversationList key={conversation._id} friendId={friendId} />
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        {/* right area */}
                        <div className={'flex-1 bg-slate-100 rounded-md my-2' + (darkMode ? ' light-dark-mode' : '') + (chatOpen ? '' : ' hidden-right-side-mobile')}>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainContainer
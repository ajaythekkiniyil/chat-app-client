import '../App.css'
import { IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ConversationList from '../Components/ConversationList';
import { Outlet } from 'react-router-dom';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PeopleIcon from '@mui/icons-material/People';
import GroupsIcon from '@mui/icons-material/Groups';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { changeTheme } from '../store/themeSlice';

function MainContainer() {
    const darkMode = useSelector((state)=> state.theme.value)
    const dispatch = useDispatch()

    return (
        <>
            <div className='bg-slate-300 h-screen p-7'>
                <div className={'bg-white rounded-lg p-3 wrapper-container' + (darkMode ? ' dark-mode' : '')}>
                    <div className='flex flex-col md:flex-row'>
                        {/* sidebar */}
                        <div className='w-full md:w-80 pr-3'>
                            {/* topbar */}
                            <div className='my-2 flex justify-between'>
                                <div>
                                    <IconButton className={darkMode ? ' dark-mode' : ''}>
                                        <AccountCircleIcon />
                                    </IconButton>
                                </div>
                                <div>
                                    {/* Online users */}
                                    <IconButton title='Online users' className={darkMode ? ' dark-mode' : ''}>
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

                            {/* search */}
                            <div className={'flex justify-between bg-slate-100 search-box-container rounded-md px-1' + (darkMode ? ' dark-mode' : '')}>
                                <input type="text" placeholder='Search' className='px-5 flex-1 search-box' />
                                <IconButton className={darkMode ? ' dark-mode' : ''}>
                                    <SearchIcon />
                                </IconButton>
                            </div>

                            {/* conversations */}
                            <div className={'flex-1 my-2 bg-slate-100 rounded-md conversation-container p-1' + (darkMode ? ' light-dark-mode' : '')}>
                                <div>
                                    <ConversationList />
                                </div>
                            </div>
                        </div>
                        {/* right area */}
                        <div className={'flex-1 bg-slate-100 rounded-md my-2' + (darkMode ? ' light-dark-mode' :'')}>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainContainer
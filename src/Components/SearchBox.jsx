import { IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from 'react-redux';
import axiosInstance from '../axios/axiosInstance'
import { useEffect, useState } from 'react';

function SearchBox({ setAllUsers, setLoading }) {
    const darkMode = useSelector((state) => state.theme.value)
    const [searchKey, setSearchKey] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        fetchUsers()
    }

    const fetchUsers = () => {
        axiosInstance.post('/chat/search-users', { searchKey: searchKey })
            .then(resp => {
                setAllUsers(resp.data)
            })
            .catch(err => {

            })
    }

    return (
        <>
            <form onSubmit={handleSearch}>
                <div className={'flex justify-between bg-slate-100 search-box-container rounded-md px-1' + (darkMode ? ' dark-mode' : '')}>
                    <input
                        type="text"
                        placeholder='Search'
                        className='px-5 flex-1 search-box'
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                    />
                    <IconButton className={darkMode ? ' dark-mode' : ''} onClick={handleSearch}>
                        <SearchIcon />
                    </IconButton>
                </div>
            </form>
        </>
    )
}

export default SearchBox
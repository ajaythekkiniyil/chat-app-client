import { Modal, Spin } from 'antd';
import axiosInstance from '../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ConversationList from './ConversationList';
import '../index.css'
import SearchBox from './SearchBox';
import { useSelector } from 'react-redux';

function AllUsersListModal({ isModalOpen, handleCancel }) {
    const darkMode = useSelector((state) => state.theme.value)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        if (isModalOpen) {
            setLoading(true)
            axiosInstance.get('/chat/get-all-users')
                .then(resp => {
                    setAllUsers(resp.data.allUsers)
                    setLoading(false)
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        navigate('/')
                    }
                    setLoading(false)
                })
        }
    }, [isModalOpen])

    return (
        <div className='all-users'>
            <Modal
                footer={null}
                title="All users"
                open={isModalOpen}
                onCancel={handleCancel}
                width={300}
            >
                {/* loading */}
                {
                    loading &&
                    <div className='flex justify-center'>
                        <Spin size="large" />
                    </div>
                }

                {/* search box */}
                <div className='my-2'>
                    <SearchBox setAllUsers={setAllUsers} setLoading={setLoading}/>
                </div>
                <hr />

                <div className='max-h-80 overflow-y-scroll all-users-list'>
                    {
                        allUsers.map(user => (
                            <ConversationList key={user._id} name={user.name} image={user.image} createdAt={user.createdAt} />
                        ))
                    }
                </div>
            </Modal>
        </div>
    )
}

export default AllUsersListModal
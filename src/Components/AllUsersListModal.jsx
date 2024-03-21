import { Modal, Spin } from 'antd';
import axiosInstance from '../axios/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ConversationList from './ConversationList';
import '../index.css'
import SearchBox from './SearchBox';
import { useSelector } from 'react-redux';
import { message } from 'antd'

function AllUsersListModal({ isModalOpen, handleCancel, setReloadConversation }) {
    const darkMode = useSelector((state) => state.theme.value)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [allUsers, setAllUsers] = useState([])
    const userId = localStorage.getItem('userId')
    const [messageApi, contextHolder] = message.useMessage();

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

    const startConversation = (friendId) => {
        setLoading(true)
        axiosInstance.post('/chat/create-converation',
            {
                'sender': userId,
                'receiver': friendId
            }
        ).then(resp => {
            if (resp.status === 200) {
                success()
                handleCancel()
                setReloadConversation(true)
                setLoading(false)
            }
        }).catch(err => {
            warning()
            setLoading(false)
        })
    }

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'start your conversation',
        });
    };

    const warning = () => {
        messageApi.open({
            type: 'warning',
            content: 'conversation already started',
        });
    }

    return (
        <div className='all-users'>
            {/* message popup */}
            {contextHolder}

            <Modal
                footer={null}
                title="All users"
                open={isModalOpen}
                onCancel={handleCancel}
                width={300}
                className={darkMode ? 'dark-modal' : ''}
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
                    <SearchBox setAllUsers={setAllUsers} setLoading={setLoading} />
                </div>
                <hr style={{ display: darkMode ? 'none' : 'block' }} />

                <div className='max-h-80 overflow-y-scroll all-users-list'>
                    {
                        allUsers.map(user => (
                            <span key={user._id} onClick={() => startConversation(user._id)}>
                                <ConversationList
                                    name={user.name}
                                    image={user.image}
                                    createdAt={user.createdAt}
                                />
                            </span>
                        ))
                    }
                </div>
            </Modal>
        </div>
    )
}

export default AllUsersListModal
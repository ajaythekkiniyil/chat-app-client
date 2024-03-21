import { Modal, Checkbox, Spin, message } from "antd"
import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import axiosInstance from "../axios/axiosInstance"
import { format } from "timeago.js"
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import '../index.css'

function CreateGroup({ createGroupModal, handleCreateGroupModalCancel, setReloadConversation }) {
    const darkMode = useSelector((state) => state.theme.value)
    const [messageApi, contextHolder] = message.useMessage()

    const [groupName, setGroupName] = useState("")
    const [allUsers, setAllUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [groupMembers, setGroupMembers] = useState([])

    // State to track selected users
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        if (createGroupModal) {
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
    }, [createGroupModal])

    const handleSelectUser = (e, userId) => {
        let checked = e.target.checked
        if (checked) {
            // adding user to groupMembers
            setGroupMembers(prevS => [...prevS, userId])
        }
        else {
            // remove user from groupMembers
            const filteredGroupMembers = groupMembers.filter(id => id !== userId)
            setGroupMembers(filteredGroupMembers)
        }
    }

    const handleCreateGroup = (e) => {
        e.preventDefault()
        setLoading(true)

        let payload = {
            chatName: groupName,
            members: groupMembers
        }

        axiosInstance.post('/chat/create-group', payload)
            .then(resp => {
                if (resp.status === 200) {
                    setGroupName("")
                    setGroupMembers([])
                    handleCreateGroupModalCancel()
                    success()
                    setLoading(false)
                    setReloadConversation(true)
                    uncheckAll()
                }
            })
            .catch(err => {
                if (err.response.status === 401) {
                    navigate('/')
                }
                setLoading(false)
                error()
            })
    }

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'Group created',
        });
    };

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Something went to wrong!',
        });
    };

    // Function to uncheck all checkboxes
    const uncheckAll = () => {
        setSelectedUsers([])
    }

    return (
        <>
            {/* message popup */}
            {contextHolder}

            <Modal
                footer={null}
                title="Create new group"
                open={createGroupModal}
                onCancel={handleCreateGroupModalCancel}
                width={300}
                className={darkMode ? 'dark-modal' : ''}
            >
                {
                    loading &&
                    <div className='flex justify-center'>
                        <Spin size="large" />
                    </div>
                }
                <form onSubmit={handleCreateGroup}>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group name"
                        className={"w-full p-2 my-2 border border-slate-200 rounded-sm outline-none" + (darkMode? ' light-dark-mode': '')}
                        required
                    />
                    {
                        (groupMembers.length > 0) &&
                        <button type="submit" className="create-group">Create group <GroupAddIcon /></button>
                    }
                    <hr style={{display: darkMode ? 'none' : 'block'}}/>
                    <div className={"max-h-80 overflow-y-scroll create-group-scroll" + (darkMode ? ' p-1 light-dark-mode' : '')}>
                        {
                            allUsers.map(user => (
                                <div
                                    key={user._id}
                                    className={"conversations rounded-md p-2" + (darkMode ? ' dark-mode' : '')}
                                >
                                    <Checkbox className="checkbox" onChange={(e) => handleSelectUser(e, user._id)} checked={groupMembers.includes(user._id)}>
                                        <div className="flex">
                                            <div className="image-container">
                                                <img src={user.image} alt="" />
                                            </div>
                                            <div className="pl-3">
                                                <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>{user.name}</p>
                                                <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>{format(user.createdAt)}</span>
                                            </div>
                                        </div>
                                    </Checkbox>
                                </div>
                            ))
                        }
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default CreateGroup
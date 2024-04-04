import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { openChat } from '../store/chatSlice'
import { format } from 'timeago.js'
import { useEffect, useState } from "react"
import axiosInstance from '../axios/axiosInstance'

function ConversationList({socket, active, name, image, createdAt, friendId, groupName, groupImage, groupId }) {
    // console.log(active)
    const darkMode = useSelector((state) => state.theme.value)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [userData, setUserData] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([])

    const handleChatOpen = (id) => {
        navigate(`chats/${id}`)
        dispatch(openChat())
    }

    useEffect(() => {
        if (friendId) {
            axiosInstance.post('/chat/get-user-details', { userId: friendId })
                .then(resp => {
                    if (resp.status === 200) {
                        setUserData(resp.data)
                    }
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        navigate('/')
                    }
                })
        }
    }, [friendId])

    useEffect(() => {
        socket?.on('live users', (users) => {
            setOnlineUsers(users.map(user => user.userId))
        })
    }, [])

    return (
        <>
            {
                userData
                &&
                // conversation lists
                <>
                    <div
                        onClick={() => {
                            handleChatOpen(userData._id)
                        }}
                        className={"conversations flex rounded-md p-2" + (darkMode ? ' dark-mode' : '')}
                        style={{ borderLeft: active ? '2px solid orange' : '' }}
                    >
                        <div className="image-container">
                            <img src={userData.image} alt="" />
                            {/* online status */}
                            <span className={onlineUsers.includes(userData._id) ? 'active-user': ''}></span>
                        </div>
                        <div className="pl-3">
                            <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>{userData.name}</p>
                            <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>
                                {/* {format(userData.createdAt)} */}
                                click to start conversation
                            </span>
                        </div>
                    </div>
                </>
            }
            {

                name &&
                // all user list
                <>
                    <div
                        className={"conversations flex rounded-md p-2" + (darkMode ? ' dark-mode' : '')}
                        style={{ borderLeft: active ? '2px solid orange' : '' }}
                    >
                        <div className="image-container">
                            <img src={image} alt="" />
                        </div>
                        <div className="pl-3">
                            <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>{name}</p>
                            <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>{format(createdAt)}</span>
                        </div>
                    </div>
                </>
            }
            {/* groups */}
            {
                (groupName && groupImage && groupId) &&
                <>
                    <div
                        onClick={() => {
                            handleChatOpen(groupId)
                        }}
                        className={"conversations flex rounded-md p-2" + (darkMode ? ' dark-mode' : '')}
                        style={{ borderLeft: active ? '2px solid orange' : '' }}
                    >
                        <div className="image-container">
                            <img src={groupImage} alt="" />
                        </div>
                        <div className="pl-3">
                            <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>{groupName}</p>
                            <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>{format(createdAt)}</span>
                        </div>
                    </div>
                </>
            }
        </>
    )
}
export default ConversationList
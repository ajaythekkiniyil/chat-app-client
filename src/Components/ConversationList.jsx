import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { openChat } from '../store/chatSlice'
import { format } from 'timeago.js'
import { useEffect, useState } from "react"
import axiosInstance from '../axios/axiosInstance'

function ConversationList({ active, name, image, createdAt, friendId }) {
    // console.log(active)
    const darkMode = useSelector((state) => state.theme.value)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [userData, setUserData] = useState({})

    // const handleChatOpen = () => {
    //     navigate('chats/1')
    //     dispatch(openChat())
    // }

    useEffect(() => {
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
    }, [userData])

    return (
        <>
            {
                userData
                    ?
                    <>
                        <div
                            // onClick={handleChatOpen}
                            className={"conversations flex rounded-md p-2" + (darkMode ? ' dark-mode' : '')}
                            style={{ borderLeft: active ? '2px solid orange' : '' }}
                        >
                            <div className="image-container">
                                <img src={userData.image} alt="" />
                            </div>
                            <div className="pl-3">
                                <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>{userData.name}</p>
                                <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>{format(userData.createdAt)}</span>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <div
                            // onClick={handleChatOpen}
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
        </>
    )
}
export default ConversationList
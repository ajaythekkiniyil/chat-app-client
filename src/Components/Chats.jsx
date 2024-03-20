import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { openChat } from '../store/chatSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosInstance'
import { format } from "timeago.js"
import Loader from '../Components/Loader'

function Chats() {
    const darkMode = useSelector((state) => state.theme.value)
    const conversationId = useSelector((state) => state.currentConversation.value)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    let { receiverId } = useParams()
    const [loading, setLoading] = useState(false)

    // receiver user information
    const [receiver, setReceiver] = useState({})
    const [messages, setMessages] = useState([])

    const handleChatClose = () => {
        navigate('/home')
        dispatch(openChat())
    }

    const getUserDetails = () => {
        setLoading(true)
        axiosInstance.post('/chat/get-user-details', { userId: receiverId })
            .then(resp => {
                setReceiver(resp.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    const getAllMessages = () => {
        setLoading(true)
        axiosInstance.post('/message/get-messages', { conversationId: conversationId })
            .then(resp => {
                setMessages(resp.data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }

    useEffect(() => {
        getUserDetails()
        getAllMessages()
    }, [receiverId])

    return (
        <div>
            {
                loading && <Loader />
            }

            {/* chat head */}
            <div className={"chats-head flex m-1 rounded-md p-2" + (darkMode ? ' dark-mode' : '')}>
                <div
                    onClick={handleChatClose}
                    className='md:hidden p-2 cursor-pointer'
                >
                    <ArrowBackIcon />
                </div>
                <div className="image-container">
                    <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.1395880969.1709337600&semt=sph" alt="" />
                </div>
                <div className="pl-3">
                    <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>{receiver?.name}</p>
                    <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>{format(receiver?.updatedAt)}</span>
                </div>
            </div>

            {/* chat area */}
            <div className='chat-area'>
                {
                    messages.map(eachMessage => (
                        <>
                            <div
                                className={'message' + (darkMode ? ' dark-mode' : '') + ((eachMessage.receiver === receiverId) ? ' receiver' : ' sender')}
                            >
                                {eachMessage.message}
                            </div>
                        </>
                    ))
                }
            </div>

            {/* message send area */}
            <div className={'flex send-messages rounded-md p-2' + (darkMode ? ' dark-mode' : '')}>
                <IconButton className={(darkMode ? ' dark-mode' : '')}>
                    <AddIcon />
                </IconButton>
                <input type="text" placeholder='Type a message here...' className='flex-1 search-box' />
                <IconButton className={(darkMode ? ' dark-mode' : '')}>
                    <SendIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default Chats
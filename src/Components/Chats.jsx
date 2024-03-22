import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { openChat } from '../store/chatSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '../axios/axiosInstance'
import { format } from "timeago.js"
import Loader from '../Components/Loader'
import EmojiPicker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import DescriptionIcon from '@mui/icons-material/Description';

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
    const [newMessage, setNewMessage] = useState("")

    const [showEmoji, setShowEmoji] = useState(false)
    const [showMedia, setShowMedia] = useState(false)
    const [imagePreview, setImagePreview] = useState([])

    const endMessageRef = useRef(null)

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

    const handleSendMessage = (e) => {
        e.preventDefault()

        if (newMessage) {
            // adding new message to messages array so instantly we can seen the message without refresh
            let msgObj = {
                "receiver": receiverId,
                "message": newMessage,
            }

            setMessages(prevS => (
                [
                    ...prevS,
                    msgObj
                ]
            ))

            setNewMessage("")

            let payload = {
                "receiver": receiverId,
                "message": newMessage
            }

            axiosInstance.post('/message/send-message', payload)
                .then(resp => {
                    if (resp.status === 200) {
                        setNewMessage("")
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    useEffect(() => {
        getUserDetails()
        getAllMessages()
    }, [receiverId])

    // scrolling to show last message
    useEffect(() => {
        endMessageRef.current?.scrollIntoView()
    }, [messages])

    const handleEmojiClick = (e) => {
        let emoji = e.emoji
        let newMsg = newMessage + emoji
        setNewMessage(newMsg)
    }

    const handleImageUpload = (e) => {
        let images = [];

        for (let i = 0; i < e.target.files.length; i++) {
            images.push(URL.createObjectURL(e.target.files[i]));
        }
        setImagePreview(images)
        // closing media selection area
        setShowMedia(prevS => !prevS)
    }

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
                    <img src={receiver?.image} alt="" />
                </div>
                <div className="pl-3">
                    <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>{receiver?.name}</p>
                    <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>{format(receiver?.updatedAt)}</span>
                </div>
            </div>

            {/* chat area */}
            <div className='chat-area'>
                {
                    messages.map((eachMessage, index) => (
                        <div
                            ref={endMessageRef}
                            key={index}
                            className={'message' + (darkMode ? ' dark-mode' : '') + ((eachMessage.receiver === receiverId) ? ' receiver' : ' sender')}
                        >
                            {eachMessage.message}
                        </div>
                    ))
                }

                {/* emoji's */}
                {
                    showEmoji &&
                    <div className='emoji-container'>
                        <EmojiPicker width={350} height={350} onEmojiClick={handleEmojiClick} />
                    </div>
                }

                {
                    showMedia &&
                    <div className='media-container'>
                        {/* image */}
                        <label htmlFor="image-upload">
                            <PermMediaIcon className='m-2 cursor-pointer' />
                        </label>
                        <input
                            type="file"
                            id='image-upload'
                            accept='.png, .jpg, .jpeg'
                            className='hidden'
                            multiple
                            onChange={handleImageUpload}
                        />

                        {/* camera */}
                        <CameraAltIcon className='m-2 cursor-pointer' />

                        {/* documents */}
                        <DescriptionIcon className='m-2 cursor-pointer' />
                    </div>
                }

                {
                    imagePreview.length > 0 &&
                    <div className='image-preview-container grid grid-cols-4 gap-1 max-h-52 overflow-y-scroll'>
                        {
                            imagePreview.map(previewUrl => (
                                <div>
                                    <img src={previewUrl} />
                                </div>
                            ))
                        }
                    </div>
                }
            </div>

            {/* message send area */}
            <form onSubmit={handleSendMessage}>
                <div className={'flex send-messages rounded-md p-2' + (darkMode ? ' dark-mode' : '')}>
                    {/* media selection */}
                    <IconButton className={(darkMode ? ' dark-mode' : '')} onClick={() => setShowMedia(prevS => !prevS)}>
                        <AddIcon />
                    </IconButton>

                    {/* input box */}
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder='Type a message here...'
                        className='flex-1 search-box'
                    />

                    {/* emoji button */}
                    <IconButton className={(darkMode ? ' dark-mode' : '')} onClick={() => setShowEmoji(prevS => !prevS)}>
                        <EmojiEmotionsIcon />
                    </IconButton>

                    {/* send button */}
                    <IconButton className={(darkMode ? ' dark-mode' : '')} onClick={handleSendMessage}>
                        <SendIcon />
                    </IconButton>
                </div>
            </form>
        </div>
    )
}

export default Chats
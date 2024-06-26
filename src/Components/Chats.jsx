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
import { Image } from 'antd'
import CloseIcon from '@mui/icons-material/Close';

function Chats({ socket }) {
  const darkMode = useSelector((state) => state.theme.value)
  const conversationId = useSelector((state) => state.currentConversation.value)
  const currentUserId = localStorage.getItem('userId')
  const currentUserName = localStorage.getItem('userName')

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
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [imagePreview, setImagePreview] = useState([])
  const [isPreviewVisible, setPreviewVisible] = useState(false)
  
  const [typing, setTyping] = useState(false)

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

  const sendMessage = (payload) => {
    axiosInstance.post('/message/send-message', payload)
      .then(resp => {
        if (resp.status === 200) {
          // socket emitting
          socket.emit('chat message',
            {
              message: newMessage,
              receiver: receiverId,
              sender: currentUserId,
              fileUrl: imagePreview.length > 0 ? imagePreview : null,
            }
          )
          setNewMessage("")
          setImagePreview([])
          setShowEmoji(false)
          setShowMedia(false)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const sendGroupMessage = (payload) => {
    axiosInstance.post('/message/send-group-message', payload)
      .then(resp => {
        if (resp.status === 200) {
          setNewMessage("")
          setImagePreview([])
          setShowEmoji(false)
          setShowMedia(false)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if(!newMessage && !selectedMedia){
      return ;
    }

    let msgObj = {
      "sender": currentUserId,
      "message": newMessage,
      "fileUrl": imagePreview.length > 0 ? imagePreview : null,
      "senderInfo": {
        "name": currentUserName
      }
    }

    // adding new message to messages array so instantly we can seen the message without refresh
    setMessages(prevS => (
      [
        ...prevS,
        msgObj
      ]
    ))

    setNewMessage("")


    // payload for group chat and single chat is different
    if (receiver?.isGroupChat) {
      let payload = new FormData()
      payload.append('groupId', receiver._id)
      payload.append('message', newMessage)
      payload.append('file', selectedMedia ? selectedMedia : null)
      sendGroupMessage(payload)
      return;
    }

    let payload = new FormData()
    payload.append('receiver', receiverId)
    payload.append('message', newMessage)
    payload.append('file', selectedMedia ? selectedMedia : null)

    sendMessage(payload)

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
    setSelectedMedia(e.target.files[0])
    // closing media selection area
    setShowMedia(prevS => !prevS)
  }

  const handleKeyPress = (e) => {
    if(e.key === 'Enter'){
      socket.emit('typing', {typing: false, conversationId: conversationId, typingUser: currentUserId, receiverOfTyping: receiverId})
      return ;
    }
    socket.emit('typing', {typing: true, conversationId: conversationId, typingUser: currentUserId, receiverOfTyping: receiverId})
  }

  // for socket
  useEffect(() => {
    // listening on new in-coming message
    socket.on('chat message', (payload) => {
      let message = payload.message
      let receiver = payload.receiver
      let sender = payload.sender

      if (receiver === currentUserId) {
        let msgObj = {
          "sender": sender,
          "message": message,
          "fileUrl": imagePreview.length > 0 ? imagePreview : null,
          "senderInfo": {
            "name": currentUserName
          }
        }

        // adding new message to messages array so instantly we can seen the message without refresh
        setMessages(prevS => (
          [
            ...prevS,
            msgObj
          ]
        ))
      }
    })

    socket.on('typing', (payload)=>{
      if(payload.conversationId === conversationId && currentUserId === payload.receiverOfTyping){
        setTyping(payload.typing)
      }
    })
  }, [])

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
          <img src={(receiver?.groupImage) ? receiver?.groupImage : receiver?.image} alt="" />
        </div>
        <div className="pl-3">
          <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>{(receiver?.isGroupChat) ? receiver?.chatName : receiver?.name}</p>
          {/* <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>{format(receiver?.updatedAt)}</span> */}
          {typing && <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>typing...</span>}
        </div>
      </div>

      {/* chat area */}
      <div className='chat-area'>
        {
          messages.map((eachMessage, index) => {

            return (
              (
                <span key={index}>
                  <div className={(eachMessage?.sender === currentUserId) ? 'sender' : 'receiver'}>
                    {
                      <div className='message-author'>
                        <img src='https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' className='rounded-full' />
                      </div>
                    }
                    <div>
                      <div className={(eachMessage?.fileUrl) ? ' file-holder' : 'message'}>
                        <span className='name'>{eachMessage?.senderInfo?.name}</span>
                        {
                          eachMessage?.message && <p>{eachMessage?.message}</p>
                        }
                        {
                          eachMessage?.fileUrl && <img src={eachMessage?.fileUrl} width={150} />
                        }
                      </div>
                      <small className='message-time'>{format(eachMessage?.createdAt)}</small>
                    </div>
                  </div>
                  <div ref={endMessageRef}></div>
                </span>
              )
            )
          })
        }
      </div>

      {/* message send area */}
      <form onSubmit={handleSendMessage}>
        <div className={'flex send-messages rounded-md p-2' + (darkMode ? ' dark-mode' : '')}>
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
                // multiple
                onChange={handleImageUpload}
              />

              {/* camera */}
              <CameraAltIcon className='m-2 cursor-pointer' />

              {/* documents */}
              <DescriptionIcon className='m-2 cursor-pointer' />
            </div>
          }

          {/* image preview */}
          {
            imagePreview.length > 0 &&
            <div className={'image-preview-container' + (darkMode ? ' dark-mode' : '')}>
              <IconButton className={(darkMode ? ' dark-mode' : '')} onClick={() => {
                setImagePreview([])
                setSelectedMedia(null)
              }}>
                <CloseIcon />
              </IconButton>
              <br />
              <div>
                {
                  imagePreview.map((previewUrl, index) => (
                    <Image
                      key={index}
                      height={250}
                      preview={{
                        visible: isPreviewVisible,
                        onVisibleChange: (visible, prevVisible) => setPreviewVisible(visible),
                      }}
                      src={previewUrl}
                    />
                  ))
                }
              </div>

            </div>
          }

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
            onKeyUp={handleKeyPress}
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
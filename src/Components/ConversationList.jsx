import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { openChat } from '../store/chatSlice'
import { format } from 'timeago.js'

function ConversationList({ active, name, image, createdAt }) {
    // console.log(active)
    const darkMode = useSelector((state) => state.theme.value)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleChatOpen = () => {
        navigate('chats/1')
        dispatch(openChat())
    }

    return (
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
    )
}
export default ConversationList
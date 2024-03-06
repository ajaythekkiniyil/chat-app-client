import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { openChat } from '../store/chatSlice'

function ConversationList({ active }) {
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
            onClick={handleChatOpen}
            className={"conversations flex rounded-md p-2" + (darkMode ? ' dark-mode' : '')}
            style={{ borderLeft: active ? '2px solid orange' : '' }}
        >
            <div className="image-container">
                <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.1395880969.1709337600&semt=sph" alt="" />
            </div>
            <div className="pl-3">
                <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>user</p>
                <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>23 minutes ago</span>
            </div>
        </div>
    )
}
export default ConversationList
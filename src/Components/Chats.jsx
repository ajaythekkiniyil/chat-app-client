import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';

function Chats() {
    const darkMode = useSelector((state) => state.theme.value)

    return (
        <div>
            {/* chat head */}
            <div className={"chats-head flex m-1 rounded-md p-2" + (darkMode ? ' dark-mode' : '')}>
                <div className="image-container">
                    <img src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.1395880969.1709337600&semt=sph" alt="" />
                </div>
                <div className="pl-3">
                    <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>Ajay</p>
                    <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>23 minutes ago</span>
                </div>
            </div>

            {/* chat area */}
            <div class='chat-area'>
                <div class={'message sender' + (darkMode ? ' dark-mode' : '')}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                </div>
                <div class='message receiver'>
                    hello
                </div>
                <div class={'message sender' + (darkMode ? ' dark-mode' : '')}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                </div>
                <div class='message receiver'>
                    hello
                </div>
                <div class={'message sender' + (darkMode ? ' dark-mode' : '')}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
                </div>
                <div class='message receiver'>
                    hello
                </div>
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
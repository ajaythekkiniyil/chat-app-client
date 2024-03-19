import { Modal } from "antd"
import { useEffect, useState } from "react"
import axiosInstance from "../axios/axiosInstance"
import { useSelector } from "react-redux"
import Loader from './Loader'
import { format } from "timeago.js"

function ShowAllGroups({ allGroupModal, cancelAllGroupModal }) {
    const darkMode = useSelector((state) => state.theme.value)
    const [allGroups, setAllGroups] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        axiosInstance.get('/chat/get-all-group')
            .then(resp => {
                if (resp.status === 200) {
                    setAllGroups(resp.data)
                    setLoading(false)
                }
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
    }, [])

    return (
        <>
            <Modal footer={null} width={300} title="All groups" open={allGroupModal} onCancel={cancelAllGroupModal}>
                <div className="h-80 overflow-y-scroll create-group-scroll">
                    {
                        loading && <Loader />
                    }
                    {
                        allGroups.map(group => (
                            <div
                                key={group._id}
                                className={"conversations rounded-md p-2" + (darkMode ? ' dark-mode' : '')}
                            >
                                <div className="flex">
                                    <div className="image-container">
                                        <img src={group.groupImage} alt="" />
                                    </div>
                                    <div className="pl-3">
                                        <p className={"text-slate-950 text-lg font-medium" + (darkMode ? ' dark-mode' : '')}>{group.chatName}</p>
                                        <span className={"text-xs text-slate-500" + (darkMode ? ' dark-mode' : '')}>{format(group.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Modal>
        </>
    )
}

export default ShowAllGroups
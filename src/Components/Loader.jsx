import { Spin } from 'antd'

function Loader() {
    return (
        <div className='flex justify-center'>
            <Spin size="large" />
        </div>
    )
}

export default Loader
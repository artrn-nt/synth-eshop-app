import React from 'react'
import '../../scss/components/utilities/Message.scss'

const Message = ({ error }) => {
    return (
        <span className='error-msg'>
            {error}
        </span>
    )
}

export default Message

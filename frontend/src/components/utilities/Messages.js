import React from 'react'
import '../../scss/components/utilities/Messages.scss'

const Alert = ({ className, message }) => {
    return (
        <span className={className}>
            {message}
        </span>
    )
}

const ErrorMsg = ({ message }) => {
    return (
        <span className='error-msg'>
            {message}
        </span>
    )
}

export { Alert, ErrorMsg }


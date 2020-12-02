import React from 'react'
import '../../scss/components/utilities/ActionBtn.scss'

const ActionBtn = ({ type, className, disabled, onClickHandler, text }) => {
    return (
        <button
            type={type}
            className={className}
            disabled={disabled}
            onClick={onClickHandler}
        >
            {text}
        </button>
    )
}

export default ActionBtn

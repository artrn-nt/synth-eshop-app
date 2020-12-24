import React from 'react'
import { Link } from 'react-router-dom'
import '../../scss/components/utilities/ActionBtnLink.scss'

const ActionBtn = ({ children, type, className, disabled, onClickHandler, text }) => {
    return (
        <button
            type={type}
            className={className}
            disabled={disabled}
            onClick={onClickHandler}
        >
            {children}
            {text}
        </button>
    )
}

const ActionLink = ({ children, path, className }) => {
    return (
        <Link
            to={path}
            className={className}
        >
            {children}
        </Link>
    )
}

export { ActionBtn, ActionLink }

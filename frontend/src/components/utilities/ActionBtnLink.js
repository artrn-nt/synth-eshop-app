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
            {text || children}
        </button>
    )
}

const ActionLink = ({ children, path, className, text }) => {
    return (
        <Link
            to={path}
            className={className}
        >
            {path === '/cart' &&
                <>
                    <i className='fas fa-shopping-cart' />
                </>}
            <span>{text || children}</span>
        </Link>
    )
}

export { ActionBtn, ActionLink }

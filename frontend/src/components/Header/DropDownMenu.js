import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Transition } from 'react-transition-group'
import gsap from 'gsap'
import '../../scss/components/DropDownMenu.scss'

const DropDownMenu = ({ username, logout }) => {

    const [drop, setDrop] = useState(false)
    const selectContainerRef = useRef(null)
    const usernameSpanRef = useRef(null)

    useEffect(() => {
        selectContainerRef.current.style.width = `${usernameSpanRef.current.clientWidth + 70}px`
    }, [])

    useEffect(() => {
        if (drop) {
            gsap.to(selectContainerRef.current, {
                duration: .6,
                height: '102.8px',
                ease: 'power3.out'
            })
        } else {
            gsap.to(selectContainerRef.current, {
                duration: .6,
                height: '2.1rem',
                ease: 'power3.out'
            })
        }
    }, [drop])

    const handleDrop = () => {
        setDrop(prevState => !prevState)
    }

    const transitionStyles = {
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 }
    }

    return (
        <div className={drop ? 'select-container active' : 'select-container'} ref={selectContainerRef}>
            <div className='username-wrapper' onClick={handleDrop}>
                <span ref={usernameSpanRef}>{username}</span>
                <i
                    className='fas fa-caret-down'
                    style={{
                        WebkitTransform: drop && 'rotate(180deg)',
                        transform: drop && 'rotate(180deg)'
                    }} />
            </div>
            <Transition in={drop} timeout={{ enter: 300, exit: 0 }} unmountOnExit>
                {state => (
                    <ul className='dropdown-list' style={{ ...transitionStyles[state] }}>
                        <li className='dropdown-list-item'>
                            <Link to='/profile'>Profile</Link>
                        </li>
                        <li className='dropdown-list-item' onClick={logout}>
                            <span>
                                Logout
                                <i className='fas fa-sign-out-alt' />
                            </span>
                        </li>
                    </ul>
                )}
            </Transition>
        </div>
    )
}

export default DropDownMenu

import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Transition } from 'react-transition-group'
import gsap from 'gsap'
import useWindowSize from '../../utils/useWindowSize'
import '../../scss/components/Header/UserDropDownMenu.scss'
import breakpoints from '../../scss/media-queries.module.scss'

const parseWidth = (str) => +str.slice(0, str.indexOf('p'))

const UserDropDownMenu = ({ admin, username, logout }) => {

    const size = useWindowSize()

    const [drop, setDrop] = useState(false)
    const selectContainerRef = useRef(null)
    const usernameSpanRef = useRef(null)

    useEffect(() => {
        if (drop) {
            gsap.to(selectContainerRef.current, {
                duration: .6,
                height: '100.8px',
                ease: 'power3.out'
            })
        } else {
            gsap.to(selectContainerRef.current, {
                delay: .15,
                duration: .6,
                height: '33.6px',
                ease: 'power3.out'
            })
        }
    }, [drop])

    const transitionStyles = {
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        exiting: { opacity: 1 },
        exited: { opacity: 0 }
    }

    return (
        <div
            className={drop ? 'user-select-container active' : 'user-select-container'}
            style={{ marginBottom: size.width > parseWidth(breakpoints.mdScreen) ? 'unset' : admin ? '12.6px' : 'unset' }}
            ref={selectContainerRef}
        >
            <div className='username-wrapper' onClick={() => setDrop(prevState => !prevState)}>
                <span ref={usernameSpanRef}>{username}</span>
                <i
                    className='fas fa-caret-down'
                    style={{
                        WebkitTransform: drop && 'rotate(180deg)',
                        transform: drop && 'rotate(180deg)'
                    }} />
            </div>
            <Transition in={drop} timeout={{ enter: 290, exit: 0 }} unmountOnExit>
                {state => (
                    <ul className='dropdown-list' style={{ ...transitionStyles[state] }}>
                        <li className='dropdown-list-item' onClick={() => setDrop(false)}>
                            <Link to='/profile'>Profile</Link>
                        </li>
                        <li className='dropdown-list-item' onClick={() => {
                            logout()
                            setDrop(false)
                        }}>
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

export default UserDropDownMenu

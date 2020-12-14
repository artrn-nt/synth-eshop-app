import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Transition } from 'react-transition-group'
import gsap from 'gsap'
import '../../scss/components/Header/AdminDropDownMenu.scss'

const AdminDropDownMenu = () => {

    const [drop, setDrop] = useState(false)
    const selectContainerRef = useRef(null)

    // useEffect(() => {
    //     selectContainerRef.current.style.width = `${usernameSpanRef.current.clientWidth + 70}px`
    // }, [])

    useEffect(() => {
        if (drop) {
            gsap.to(selectContainerRef.current, {
                duration: .6,
                height: '134.4px',
                ease: 'power3.out'
            })
        } else {
            gsap.to(selectContainerRef.current, {
                duration: .6,
                delay: .15,
                height: '2.1rem',
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
        <div className={drop ? 'admin-select-container active' : 'admin-select-container'} ref={selectContainerRef}>
            <div className='admin' onClick={() => setDrop(prevState => !prevState)}>
                <span>Admin interface</span>
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
                            <Link to='/admin/userslist'>Users</Link>
                        </li>
                        <li className='dropdown-list-item' onClick={() => setDrop(false)}>
                            <Link to='/admin/productslist'>Products</Link>
                        </li>
                        <li className='dropdown-list-item' onClick={() => setDrop(false)}>
                            <Link to='/admin/orderslist'>Orders</Link>
                        </li>
                    </ul>
                )}
            </Transition>
        </div>
    )
}

export default AdminDropDownMenu

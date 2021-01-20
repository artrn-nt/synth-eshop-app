import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import gsap from 'gsap'
import { logout } from '../../actions/userActions'
import UserDropDownMenu from './UserDropDownMenu'
import AdminDropDownMenu from './AdminDropDownMenu'
import useWindowSize from '../../utils/useWindowSize'
import config from '../../scss/config.module.scss'
import breakpoints from '../../scss/media-queries.module.scss'

const parseWidth = (str) => +str.slice(0, str.indexOf('p'))

const Header = () => {

    const size = useWindowSize()

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [indicatorValue, setIndicatorValue] = useState(null)

    const cartLinkRef = useRef(null)
    const cartIndicatorRef = useRef(null)

    useEffect(() => {
        if (cartItems.length !== 0 && cartIndicatorRef.current) {
            gsap.fromTo(cartIndicatorRef.current, {
                opacity: 0
            }, {
                duration: .9,
                opacity: 1,
                ease: 'power2.inOut'

            })
            setIndicatorValue(cartItems.reduce((acc, item) => acc + item.qty, 0))
        }
    }, [cartItems, cartIndicatorRef])

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <header>
            <h1>
                <span>Synths</span>
                <span>Mini-Market</span>
                <span>we bring electric waves to you</span>
            </h1>
            <nav 
                className='menu'
                style={{ 
                    marginBottom: size.width > parseWidth(breakpoints.mdScreen) ? userInfo ? '12.6px' : '8.4px' : '32px'
                }}
            >

                <div className='nav-menu'>
                    <NavLink to='/' activeStyle={{ color: config.bright }} exact>PRODUCTS</NavLink>
                    <NavLink activeStyle={{ color: config.bright }} to='/info'>INFO</NavLink>
                </div>

                <div 
                    className='utils-menu'
                    style={{ 
                        alignItems: userInfo ? size.width > parseWidth(breakpoints.mdScreen) ? 'flex-start' : 'center' : 'center' 
                    }}
                >
                    <NavLink
                        to='/cart'
                        className='cart-link'
                        activeStyle={{ color: config.bright }}
                        activeClassName='cart-link active'
                        ref={cartLinkRef}
                    >
                        {cartItems.length !== 0 &&
                            <span className='cart-indicator' ref={cartIndicatorRef}>{indicatorValue}</span>}
                        <i className='fas fa-shopping-cart' />
                        CART
                    </NavLink>
                    {userInfo ?
                        <UserDropDownMenu
                            admin={userInfo.isAdmin}
                            username={userInfo.name.length > 15 ? `${userInfo.name.slice(0, 13)}...` : userInfo.name}
                            logout={logoutHandler} /> :
                        <NavLink activeStyle={{ color: config.bright }} to='/login'>
                            <i className='fas fa-user-alt' />
                            SIGN-IN
                        </NavLink>}
                    {userInfo && userInfo.isAdmin && (
                        <AdminDropDownMenu />
                    )}
                </div>

            </nav>
        </header>
    )
}

export default Header

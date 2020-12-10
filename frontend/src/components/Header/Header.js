import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import gsap from 'gsap'
import UserDropDownMenu from './UserDropDownMenu'
import AdminDropDownMenu from './AdminDropDownMenu'
import { logout } from '../../actions/userActions'

const Header = () => {

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    // console.log(userInfo)

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

    // useEffect(() => {
    //     if (!userInfo) {
    //         cartLinkRef.current.style.marginRight = '1.4rem'
    //     } else {
    //         cartLinkRef.current.style.marginRight = `${cartLinkRef.current.nextSibling.clientWidth + 1.4 * 16}px`
    //     }
    // }, [userInfo])

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <header>
            <h1>Synths Mini-Market</h1>
            <nav className='menu' style={{ marginBottom: userInfo ? '.7875rem' : '.525rem' }}>

                <div className='left-menu'>
                    <NavLink to='/' activeStyle={{ color: '#edf3f5' }} exact>PRODUCTS</NavLink>
                    <NavLink activeStyle={{ color: '#edf3f5' }} to='/info'>INFO</NavLink>
                    <NavLink activeStyle={{ color: '#edf3f5' }} to='/contact'>CONTACT</NavLink>
                </div>

                <div className='right-menu' style={{ alignItems: userInfo ? 'flex-start' : 'center' }}>
                    <NavLink
                        to='/cart'
                        className='cart-link'
                        activeStyle={{ color: '#edf3f5' }}
                        activeClassName='cart-link active'
                        ref={cartLinkRef}
                    >
                        {cartItems.length !== 0 &&
                            <span className='cart-indicator' ref={cartIndicatorRef}>{indicatorValue}</span>}
                        <i className='fas fa-shopping-cart' />
                        CART
                    </NavLink>
                    {userInfo ?
                        <UserDropDownMenu username={userInfo.name} logout={logoutHandler} /> :
                        <NavLink activeStyle={{ color: '#edf3f5' }} to='/login'>
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

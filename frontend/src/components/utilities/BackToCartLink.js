import React from 'react'
import { Link } from 'react-router-dom'
import '../../scss/components/utilities/BackToCartLink.scss'

const BackToCartLink = () => {
    return (
        <Link to='/cart' className='back-to-cart-link'>
            <i className='fas fa-shopping-cart' />
            <span>Back to cart</span>
        </Link>
    )
}

export default BackToCartLink

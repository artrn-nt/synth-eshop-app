import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import CartItemValue from './CartItemValue'

const CartItem = (props) => {

    const [qtyUnavailable, setQtyUnavailable] = useState(null)
    const [trash, setTrash] = useState(false)

    const cartItemRef = useRef(null)

    useEffect(() => {
        if (props.countInStock === props.qty) setQtyUnavailable(true)
        else setQtyUnavailable(false)
    }, [props])

    useEffect(() => {
        if (trash) {
            gsap.to(cartItemRef.current, {
                duration: .6,
                opacity: 0,
                ease: 'power2.inOut',
                onComplete: () => props.trashFromCartHandler(props._id)
            })
        }
    }, [trash, props])

    return (
        <li key={props._id} className='cart-item' ref={cartItemRef}>
            <div className='cart-it-col-1'>
                <Link
                    to={`/product/${props._id}`}
                    className='img-wrapper'
                >
                    <img src={props.image} alt={props.name} />
                </Link>
                <div className='item-infos'>
                    <Link to={`/product/${props._id}`}>
                        <span className='c-i-name'>{props.name}</span>
                    </Link>
                    <span className='c-i-description_m'>{props.description_m}</span>
                    <span className='c-i-price'>€{props.price.toFixed(2)}</span>
                </div>
            </div>

            <div className='cart-it-col-2'>
                <div className='cart-it-row-1'>

                    <div className='qty-wrap'>
                        <div className='qty-sub-wrap'>
                            <button
                                className='qty-btn'
                                type='button'
                                onClick={() => props.removeFromCartHandler(props._id)}
                                disabled={props.qty === 1}
                            >
                                -
                            </button>

                            <CartItemValue elClassName='qty' value={props.qty} />

                            <button
                                className='qty-btn'
                                type='button'
                                onClick={() => {
                                    if (props.countInStock !== props.qty) props.addToCartHandler(props._id)
                                }}
                            // disabled={countInStock === qty}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className='it-total-wrap'>
                        <CartItemValue elClassName='it-total' value={`€${(props.qty * props.price).toFixed(2)}`} />
                    </div>

                    <div className='trash-wrap'>
                        <i
                            className='fas fa-trash'
                            onClick={() => setTrash(true)}
                        />
                    </div>

                </div>

                {qtyUnavailable && <span className='stock-alert-cs'>Not enough stock to add more</span>}

            </div>

        </li>
    )
}

export default CartItem

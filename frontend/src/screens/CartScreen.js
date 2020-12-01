import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart, trashFromCart, resetAddToCart } from '../actions/cartActions'
import CartItem from '../components/CartScreen/CartItem'
import CheckoutTotal from '../components/CartScreen/CheckoutTotal'
import ScreenTitle from '../components/utilities/ScreenTitle'
// import Message from '../components/utilities/Message'
import '../scss/screens/CartScreen.scss'

const CartScreen = ({ history }) => {

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { loading, error, cartItems, prevCartQty } = cart
    // console.log(cart)
    const cartItemsListRef = useRef(null)
    const tl = useRef(null)

    useEffect(() => {
        return () => dispatch(resetAddToCart())
    }, [dispatch])

    useEffect(() => {
        if ((cartItems && cartItems.length !== 0) && prevCartQty === 0) {
            tl.current = gsap.timeline()
                .to(cartItemsListRef.current.children, {
                    duration: 0,
                    x: 22
                })
                .fromTo('.cart-container.full', {
                    opacity: 0,
                    y: 38
                }, {
                    delay: .15,
                    duration: 1.1,
                    opacity: 1,
                    y: 0,
                    ease: 'power3.out'
                })
                .to(cartItemsListRef.current.children, {
                    duration: .6,
                    x: 0,
                    ease: 'power3.inOut',
                    stagger: .15
                }, "-=1")
        } else if (cartItems && cartItems.length === 0 && prevCartQty === 0) {
            gsap.fromTo('.cart-container.empty', {
                opacity: 0
            }, {
                delay: .15,
                duration: .4,
                opacity: 1,
                ease: 'power2.out'
            })
        }   
    }, [cartItems, prevCartQty])

    const addToCartHandler = (id) => {
        dispatch(addToCart(id))
    }

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const trashFromCartHandler = (id) => {
        dispatch(trashFromCart(id))
    }

    const checkoutMemberHandler = () => {
        console.log('checkout member')
        history.push('/login?redirect=shipping')
    }

    const checkoutGuestHandler = () => {
        console.log('checkout guest')
    }

    return (
        <section className='cart-section'>
            <ScreenTitle title={'Shopping Cart'}/>
                {cartItems.length === 0 ?
                    (<div className='cart-container empty'>
                        <p className='empty-msg'>
                            <span>Your cart is empty</span>
                            <span>
                                Sounds like a good time to
                                <Link
                                    className='start-shop'
                                    to='/'
                                >
                                    start shopping
                                </Link>
                            </span>
                        </p>
                    </div>) :
                    (<div className='cart-container full'>

                        <ul className='cart-items' ref={cartItemsListRef}>
                            {cartItems.map(item => <CartItem 
                                                        key={item._id}
                                                        _id={item._id}
                                                        image={item.image}
                                                        name={item.name}
                                                        description_m={item.description_m}
                                                        price={item.price}
                                                        qty={item.qty}
                                                        countInStock={item.countInStock}
                                                        addToCartHandler={addToCartHandler}
                                                        removeFromCartHandler={removeFromCartHandler}
                                                        trashFromCartHandler={trashFromCartHandler}/>
                            )}
                        </ul>

                        <div className='checkout'>
                            <CheckoutTotal 
                                totalQty={cartItems.reduce((acc,item) => acc + item.qty, 0)} 
                                totalPrice={cartItems.reduce((acc, item) => acc + (item.qty * item.price), 0).toFixed(2)}
                            />
                            <span>Shipping &amp; taxes calculated at checkout</span>
                            <div className='checkout-btns'>
                                <button
                                    type='button'
                                    className='btn-checkout-member'
                                    onClick={checkoutMemberHandler}
                                >
                                    Checkout as member
                                </button>
                                <button
                                    type='button'
                                    className='btn-checkout-guest'
                                    onClick={checkoutGuestHandler}
                                >
                                    Checkout as guest
                                </button>
                            </div>
                        </div>

                    </div>)
                }
        </section>
    )
}

export default CartScreen

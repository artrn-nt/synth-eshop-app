import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../actions/orderActions'
import { resetCart } from '../actions/cartActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import CheckOutSteps from '../components/utilities/CheckoutSteps'
import ScreenTitle from '../components/utilities/ScreenTitle'
import OrderItem from '../components/utilities/OrderItem'
import { ActionBtn, ActionLink } from '../components/utilities/ActionBtnLink'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/PlaceOrderScreen.scss'

const PlaceOrderScreen = ({ history }) => {

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, loading, success, error } = orderCreate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [itemsPrice, setItemsPrice] = useState(0)
    const [shippingPrice, setShippingPrice] = useState(0)
    const [taxPrice, setTaxPrice] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)

    const addDecimals = (nb) => {
        return Number((Math.round(nb * 100) / 100).toFixed(2))
    }

    useEffect(() => {
        if (!loading && !error) {
            gsap.fromTo('.place-order-main-row', {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1.1,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })
        }
    }, [loading, error])

    useEffect(() => {
        if (!userInfo) history.push('/login')
    }, [userInfo, history])

    useEffect(() => {

        const itemsTotal = cart.cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0)
        const shipping = itemsTotal > 100 ? 0 : 45
        const tax = 0.196 * itemsTotal

        setItemsPrice(addDecimals(itemsTotal))
        setShippingPrice(addDecimals(shipping))
        setTaxPrice(addDecimals(tax))
        setTotalPrice(addDecimals(itemsTotal + shipping))

    }, [cart])

    useEffect(() => {
        if (success) {
            history.push(`/orders/${order._id}`)
            return () => {
                dispatch({ type: ORDER_CREATE_RESET })
                dispatch(resetCart())
            }
        }
    }, [success, history])

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingInfo: cart.shippingInfo,
            paymentMethod: cart.paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        }))
    }

    if (!userInfo) return null

    return (
        <section className='place-order-section'>
            <ScreenTitle title='Place order' />
            <CheckOutSteps step1 step2 step3 />
            <div className='place-order-main-row'>

                <div className='place-order-col-1'>

                    <div className='place-order-row'>
                        <h3>Shipping info</h3>
                        <div className='data'>
                            <h4>Name:</h4>
                            <span>{cart.shippingInfo.firstName && `${cart.shippingInfo.firstName}, `}{cart.shippingInfo.lastName}</span>

                            <h4>Address:</h4>
                            <span>{cart.shippingInfo.address},{' '}{cart.shippingInfo.addressDetails && cart.shippingInfo.addressDetails}</span>
                            <span>{cart.shippingInfo.zipCode},{' '}{cart.shippingInfo.city}, {' '}{cart.shippingInfo.country}</span>


                            {cart.shippingInfo.phone && (
                                <>
                                    <h4>Phone:</h4>
                                    <span>{cart.shippingInfo.phone}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className='place-order-row'>
                        <h3>Payment</h3>
                        <div className='data'>
                            <h4>Method:</h4>
                            <span>{cart.paymentMethod}</span>
                        </div>
                    </div>

                    <div className='place-order-row'>
                        <h3>Order item(s)</h3>
                        <ul className='order-items'>
                            {cart.cartItems.map(item => <OrderItem
                                key={item._id}
                                _id={item._id}
                                image={item.image}
                                name={item.name}
                                description_m={item.description_m}
                                price={item.price}
                                qty={item.qty} />
                            )}
                        </ul>
                    </div>

                </div>


                <div className='order-summary'>
                    <h3>Order summary</h3>
                    <div className='place-order-infos'>
                        <p><span>Items <small>(incl. VAT)</small>:</span><span>€{itemsPrice}</span></p>
                        <p>Shipping:<span>€{shippingPrice}</span></p>
                        <p><span>VAT <small>(tax)</small>:</span><span>€{taxPrice}</span></p>
                        <p>Total:<span>€{totalPrice}</span></p>
                    </div>
                    <ActionBtn
                        type='button'
                        className='btn-place-order'
                        disabled={cart.cartItems.length === 0}
                        onClickHandler={placeOrderHandler}
                        text='Place order'
                    >
                        Place order
                    </ActionBtn>

                    {error && <ErrorMsg message={error} />}

                </div>

            </div>

            <ActionLink path='/cart' className='back-to-cart-link'>
                <i className='fas fa-shopping-cart' />
                Back to cart
            </ActionLink>

        </section>
    )
}

export default PlaceOrderScreen

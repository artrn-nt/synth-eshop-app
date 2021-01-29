import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DETAILS_RESET } from '../constants/orderConstants'
import OrderItem from '../components/utilities/OrderItem'
import StripePaymentIntent from '../components/OrderStatusScreen/StripePaymentIntent'
import ScreenTitle from '../components/utilities/ScreenTitle'
import CheckoutSteps from '../components/utilities/CheckoutSteps'
import { ErrorMsg } from '../components/utilities/Messages'
import Spinner from '../components/utilities/Spinner'
import config from '../scss/config.module.scss'
import '../scss/screens/OrderStatusScreen.scss'
import PaypalPaymentIntents from '../components/OrderStatusScreen/PaypalPaymentIntents'

const OrderStatusScreen = ({ match, history }) => {

    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading: loadingDetails, error: errorDetails } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, error: errorPay, success: successPay } = orderPay
    // console.log(orderPay)

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [isReady, setIsReady] = useState(false)
    const [orderId, setOrderId] = useState(null)

    useEffect(() => {
        if (!userInfo) history.push('/login')
        return () => {
            dispatch({ type: ORDER_DETAILS_RESET })
            console.log('order status unmount')
        }
    }, [userInfo, history, dispatch])

    useEffect(() => {
        setOrderId(match.params.id)
    }, [match])

    useEffect(() => {
        if (orderId !== null) {
            // console.log('rerendered')
            dispatch(getOrderDetails(orderId))
        }
    }, [dispatch, orderId])

    // useEffect(() => {
    //     if (Object.entries(order).length !== 0 && order.constructor === Object) {
    //         console.log(order.paymentMethod === "stripe")
    //     }
    // }, [order])

    // useEffect(() => {
    //     if (!loadingDetails && !errorDetails) {
    //         gsap.fromTo('.order-status-main-row', {
    //             opacity: 0,
    //             y: 38
    //         }, {
    //             delay: .15,
    //             duration: 1.1,
    //             opacity: 1,
    //             y: 0,
    //             ease: 'power3.out'
    //         })
    //     }
    // }, [loadingDetails, errorDetails])

    // useEffect(() => {
    //     return () => dispatch({ type: ORDER_CREATE_RESET })
    // }, [dispatch])

    // useEffect(() => {
    //     // if ((typeof order === 'undefined' || order._id !== orderId) || successPay) {
    //         console.log('entered')
    //         dispatch({ type: ORDER_PAY_RESET })
    //         dispatch(getOrderDetails(orderId))
    // }, [dispatch, order, orderId])

    const paymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult))
    }

    const paymentReadyHandler = () => {
        setIsReady(true)
    }

    if (!userInfo || typeof order === 'undefined') return null
    if (Object.entries(order).length === 0 && order.constructor === Object) return null

    return (
        <section className='order-status-section'>

            <ScreenTitle title='Order status' />
            <CheckoutSteps step1 step2 step3 step4 />

            <div className={loadingDetails || errorDetails ? 'order-status-main-row ctr' : 'order-status-main-row str'}>

                {loadingDetails ? <Spinner /> :
                    errorDetails ? <ErrorMsg message={errorDetails} /> :

                        <>

                            <div className='order-status-col-1'>

                                <div className='order-status-row'>
                                    <h3>Order ID: {order._id}</h3>
                                </div>

                                <div className='order-status-row'>
                                    <h3>User account</h3>
                                    <div className='data'>
                                        <h4>Username:</h4>
                                        <span>{order.user.name}</span>
                                        <h4>Email:</h4>
                                        <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                    </div>
                                </div>

                                <div className='order-status-row'>
                                    <h3>Shipping info</h3>
                                    <div className='data'>
                                        <h4>Name:</h4>
                                        <span>{order.shippingInfo.firstName && `${order.shippingInfo.firstName}, `}{order.shippingInfo.lastName}</span>

                                        <h4>Address:</h4>
                                        <span>{order.shippingInfo.address},{' '}{order.shippingInfo.addressDetails && order.shippingInfo.addressDetails}</span>
                                        <span>{order.shippingInfo.zipCode},{' '}{order.shippingInfo.city}, {' '}{order.shippingInfo.country}</span>

                                        {order.shippingInfo.phone && (
                                            <>
                                                <h4>Phone:</h4>
                                                <span>{order.shippingInfo.phone}</span>
                                            </>
                                        )}

                                        {order.isShipped ?
                                            <span className='shipped-status'><i className='fas fa-check-circle' />Shipped on {order.shippedAt.substring(0, 10)}</span> :
                                            <span className='unshipped-status'><i className='fas fa-times-circle' />Not shipped yet</span>}
                                    </div>
                                </div>

                                <div className='order-status-row'>
                                    <h3>Payment</h3>
                                    <div className='data'>
                                        <h4>Method:</h4>
                                        <span>{order.paymentMethod}</span>
                                        {order.isPaid ?
                                            <span className='paid-status'><i className='fas fa-check-circle' />Paid on {order.paidAt.substring(0, 10)}</span> :
                                            <span className='unpaid-status'><i className='fas fa-times-circle' />Not paid yet</span>}
                                    </div>
                                </div>

                                <div className='order-status-row'>
                                    <h3>Order items</h3>
                                    <ul className='order-items'>
                                        {order.orderItems.map(item => <OrderItem
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

                            <div className='order-status-summary'>
                                <h3>Order summary</h3>
                                <div className='order-status-infos'>
                                    <p><span>Items <small>(incl. VAT)</small>:</span><span>€{order.itemsPrice}</span></p>
                                    <p>Shipping:<span>€{order.shippingPrice}</span></p>
                                    <p><span>VAT <small>(tax)</small>:</span><span>€{order.taxPrice}</span></p>
                                    <p>Total:<span>€{order.totalPrice}</span></p>
                                </div>

                                {!order.isPaid && (
                                    <div 
                                        className='payment-container'
                                        style={{ 
                                            backgroundColor: loadingPay || !isReady ? config.mainTheme : config.bright 
                                        }}
                                    >

                                        {order.paymentMethod === 'paypal' &&
                                            <PaypalPaymentIntents 
                                                orderDetails={{
                                                    amount: order.totalPrice
                                                }}
                                                isReady={isReady}
                                                paymentHandler={paymentHandler}
                                                paymentReadyHandler={paymentReadyHandler}
                                            />
                                        }

                                        {order.paymentMethod === 'stripe' && 
                                            <StripePaymentIntent  
                                                orderDetails={{ 
                                                    amount: order.totalPrice * 100,
                                                    description: order.orderItems.reduce((acc, curr) => [...acc, curr.name], []).join(' / '),
                                                    email: order.user.email
                                                }}
                                                isReady={isReady}
                                                paymentHandler={paymentHandler}
                                                paymentReadyHandler={paymentReadyHandler}
                                            />
                                        }
                                        
                                    </div>
                                )}

                            </div>

                        </>}

            </div>

        </section>
    )
}

export default OrderStatusScreen

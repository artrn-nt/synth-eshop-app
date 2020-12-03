import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET } from '../constants/orderConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import OrderItem from '../components/PlaceOrderScreen/OrderItem'
import Message from '../components/utilities/Message'
import Spinner from '../components/utilities/Spinner'
import '../scss/screens/OrderScreen.scss'

const OrderScreen = ({ match }) => {

    const dispatch = useDispatch()
    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails
    const orderPay = useSelector(state => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const [sdkReady, setSdkReady] = useState(false)

    const orderId = match.params.id

    useEffect(() => {
        const addPaypalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }
            document.body.appendChild(script)
        }

        if ((!order || order._id !== orderId) || successPay) {
            dispatch({ type: ORDER_PAY_RESET })
            dispatch(getOrderDetails(orderId))
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPaypalScript()
            } else {
                setSdkReady(true)
            }
        }

    }, [dispatch, order, orderId, successPay])

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }

    return loading ? <Spinner /> : error ? <Message error={error} /> :
        <section className='place-order-section'>
            <ScreenTitle title={`Order ${order._id}`} />
            {/* <ScreenTitle title='Order' /> */}

            <div className='place-order-main-row'>

                <div className='place-order-col-1'>

                    <div className='place-order-row'>
                        <h3>User account</h3>
                        <div className='data'>
                            <h4>Username:</h4>
                            <span>{order.user.name}</span>
                            <h4>Email:</h4>
                            <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </div>
                    </div>

                    <div className='place-order-row'>
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

                            {order.isDelivered ? <span>Paid on {order.deliveredAt}</span> : <span>Not delivered</span>}
                        </div>
                    </div>

                    <div className='place-order-row'>
                        <h3>Payment</h3>
                        <div className='data'>
                            <h4>Method:</h4>
                            <span>{order.paymentMethod}</span>
                            {order.isPaid ? <span>Paid on {order.paidAt}</span> : <span>Not paid</span>}
                        </div>
                    </div>

                    <div className='place-order-row'>
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

                <div className='place-order-col-2'>

                    <div className='place-order'>
                        <h3>Order summary</h3>
                        <div className='place-order-infos'>
                            <p><span>Items <small>(incl. VAT)</small>:</span><span>€{order.itemsPrice}</span></p>
                            <p>Shipping:<span>€{order.shippingPrice}</span></p>
                            <p><span>VAT <small>(tax)</small>:</span><span>€{order.taxPrice}</span></p>
                            <p>Total:<span>€{order.totalPrice}</span></p>
                        </div>

                        {!order.isPaid && (
                            <>
                                {loadingPay && <Spinner />}
                                {!sdkReady ?
                                    <Spinner /> :
                                    <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />}
                            </>
                        )}

                    </div>

                </div>

            </div>

        </section>
}

export default OrderScreen

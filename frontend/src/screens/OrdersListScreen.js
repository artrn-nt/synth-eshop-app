import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ORDERS_LIST_RESET, ORDER_SHIP_RESET } from '../constants/orderConstants'
import { listAllOrders, shipOrder } from '../actions/orderActions'
import ScreenTitle from '../components/utilities/ScreenTitle'
import AdminConfirmAlert from '../components/utilities/AdminConfirmAlert'
import { ActionBtn } from '../components/utilities/ActionBtnLink'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/OrdersListScreen.scss'

const OrdersListScreen = ({ history }) => {

    const [objectID, setObjectID] = useState(null)
    const [confirm, setConfirm] = useState(false)
    const [pendingOrders, setPendingOrders] = useState(0)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const ordersList = useSelector(state => state.ordersList)
    const { loading, error, orders } = ordersList

    const orderShip = useSelector(state => state.orderShip)
    const { error: errorShip, success: successShip } = orderShip

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) dispatch(listAllOrders())
        else history.push('/login')

        return () => dispatch({ type: ORDERS_LIST_RESET })
    }, [userInfo, dispatch, history])

    useEffect(() => {
        if (!loading && !error && typeof orders !== 'undefined' && orders.length !== 0) {
            gsap.fromTo(['.orders-list-table', '.stats-row'], {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })

            setPendingOrders(orders.reduce((acc, order) => order.isPaid && !order.isShipped ? acc + 1 : acc, 0))

        }
    }, [loading, error, orders])

    useEffect(() => {
        if (successShip) {
            dispatch({ type: ORDER_SHIP_RESET })
            dispatch(listAllOrders())
        }
    }, [successShip, dispatch])

    // Mark order as shipped handlers - confirm alert
    const confirmHandler = (bool) => {
        setConfirm(bool)
    }

    const objectIDHandler = (ID) => {
        setObjectID(ID)
    }

    const actionHandler = (ID) => {
        dispatch(shipOrder(ID))
        setObjectID(null)
    }

    return (
        <section className='orders-list-section'>

            <ScreenTitle title='Admin - Orders list' />

            <div className={!userInfo || !userInfo.isAdmin ||
                loading || error || errorShip || orders.length === 0 ? 'orders-list-main-row ctr' : 'orders-list-main-row str'}>

                {loading ? <Spinner /> :
                    error || errorShip ? <ErrorMsg message={error || errorShip} /> :
                        orders.length !== 0 ? (
                            <>
                                <div className='stats-row'>
                                    <div className='stats-card'>
                                        <i className='fas fa-sync-alt' />
                                        <span>
                                            Pending orders: {pendingOrders}
                                        </span>
                                    </div>
                                </div>
                                <table className='orders-list-table'>
                                    <thead>
                                        <tr>
                                            <th scope='col' width='15%'>ORDER ID</th>
                                            <th scope='col' width='12.5%'>DATE</th>
                                            <th scope='col' width='12.5%'>USER</th>
                                            <th scope='col' width='17.5%'>SHIPPING INFO</th>
                                            <th scope='col' width='17.5%'>ITEMS</th>
                                            <th scope='col' width='12.5%'>PAID</th>
                                            <th scope='col' width='12.5%'>SHIPPED</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id}>
                                                <td>
                                                    <Link to={`/orders/${order._id}`}>{order._id}</Link>
                                                </td>
                                                <td>Created on: <br />{order.createdAt.substring(0, 10)}</td>
                                                <td>{order.user !== null ? order.user.name : 'Deleted user'}</td>
                                                <td>
                                                    <ul>
                                                        <li>{order.shippingInfo.lastName} {order.shippingInfo.hasOwnProperty('firstName') ? order.shippingInfo.firstName : null}</li>
                                                        <li>{order.shippingInfo.address}</li>
                                                        {order.shippingInfo.hasOwnProperty('addressDetails') ? <li>{order.shippingInfo.addressDetails}</li> : null}
                                                        <li>{order.shippingInfo.zipCode}</li>
                                                        <li>{order.shippingInfo.city}</li>
                                                        <li>{order.shippingInfo.country}</li>
                                                        {Object.values(order.shippingInfo.phone).join('') ? <li>Phone: {order.shippingInfo.phone}</li> : null}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <ul>
                                                        {order.orderItems.map(item => <li key={item._id}>{item.name} (Qty: {item.qty})</li>)}
                                                    </ul>
                                                    Total price: <br />
                                                    €{order.totalPrice.toFixed(2)}
                                                </td>
                                                <td>{order.isPaid ?
                                                    <>
                                                        Paid on:<br />
                                                        {order.paidAt.substring(0, 10)}
                                                    </> :
                                                    (<i className='fas fa-times-circle' style={{ color: 'tomato' }} />)}
                                                </td>
                                                <td>{order.isShipped ?
                                                    <>
                                                        Shipped on:<br />
                                                        {order.shippedAt.substring(0, 10)}
                                                    </> :
                                                    <ActionBtn
                                                        type='button'
                                                        className='shipped-order-btn'
                                                        onClickHandler={() => {
                                                            objectIDHandler(order._id)
                                                            confirmHandler(true)
                                                        }}
                                                    >
                                                        <i className='fas fa-truck' />
                                                    </ActionBtn>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </>

                        ) :

                            <p>No orders to display</p>}

                {objectID && <AdminConfirmAlert
                    objectID={objectID}
                    confirm={confirm}
                    objectIDHandler={objectIDHandler}
                    confirmHandler={confirmHandler}
                    actionHandler={actionHandler}
                    text='Mark as shipped'
                />}

            </div>

        </section >
    )
}

export default OrdersListScreen

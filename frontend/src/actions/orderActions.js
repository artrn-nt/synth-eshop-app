import axios from 'axios'
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_USER_REQUEST,
    ORDER_USER_SUCCESS,
    ORDER_USER_FAIL,
    ORDERS_LIST_REQUEST,
    ORDERS_LIST_SUCCESS,
    ORDERS_LIST_FAIL,
    ORDER_SHIP_REQUEST,
    ORDER_SHIP_SUCCESS,
    ORDER_SHIP_FAIL
} from '../constants/orderConstants'

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post('/api/orders', order, config)

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })
    }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
    
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`/api/orders/${id}`, config)

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })
    }
}

export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_PAY_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config)

        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })
    }
}

export const shipOrder = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_SHIP_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        await axios.put(`/api/orders/${id}/ship`, {}, config)

        dispatch({ type: ORDER_SHIP_SUCCESS })

    } catch (error) {
        dispatch({
            type: ORDER_SHIP_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })
    }
}

export const listUserOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_USER_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get('/api/orders/myorders', config)

        dispatch({
            type: ORDER_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ORDER_USER_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })
    }
}

export const listAllOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDERS_LIST_REQUEST })

        const { userLogin: { userInfo } } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get('/api/orders', config)

        dispatch({
            type: ORDERS_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {

        dispatch({
            type: ORDERS_LIST_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })

    }
}
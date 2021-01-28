import axios from 'axios'
import {
    CART_ADD_REQUEST,
    CART_ADD_SUCCESS,
    CART_ADD_FAIL,
    CART_REMOVE,
    CART_TRASH,
    CART_SAVE_SHIPPING_INFO,
    CART_SAVE_PAYMENT_METHOD,
    CART_RESET
} from '../constants/cartConstants'

export const addToCart = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: CART_ADD_REQUEST })

        const { data } = await axios.get(`/api/products/${id}`)

        dispatch({
            type: CART_ADD_SUCCESS,
            payload: {
                _id: data._id,
                name: data.name,
                description_m: data.description_m,
                image: data.image,
                price: data.price,
                qty: 1,
                countInStock: data.countInStock
            }
        })

    } catch (error) {
        dispatch({
            type: CART_ADD_FAIL,
            payload:
                error.response && error.response.data.message ?
                    error.response.data.message :
                    error.message
        })
    }

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: CART_REMOVE,
        payload: id
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const trashFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: CART_TRASH,
        payload: id
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingInfo = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_INFO,
        payload: data
    })

    localStorage.setItem('shippingInfo', JSON.stringify(data))
}

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
}

export const resetCart = () => (dispatch) => {
    dispatch({ type: CART_RESET })
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingInfo')
    localStorage.removeItem('paymentMethod')
}
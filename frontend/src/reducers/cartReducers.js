import {
    CART_ADD_REQUEST,
    CART_ADD_SUCCESS,
    CART_ADD_FAIL,
    CART_REMOVE,
    CART_TRASH,
    CART_ADD_RESET,
    CART_SAVE_SHIPPING_INFO,
    CART_SAVE_PAYMENT_METHOD,
    CART_RESET
} from '../constants/cartConstants'

export const cartReducer = (state = { cartItems: [], prevCartQty: 0, shippingInfo: {}, paymentMethod: '' }, action) => {
    switch (action.type) {
        case CART_ADD_REQUEST:
            return { ...state, loading: true }
        case CART_ADD_SUCCESS:
            const item = action.payload
            const existItem = state.cartItems.find(p => p._id === item._id)

            if (existItem) {
                return {
                    loading: false,
                    cartItems: state.cartItems.map(p => p._id === existItem._id ? { ...item, qty: p.qty + 1 } : p),
                    prevCartQty: state.cartItems.reduce((acc, p) => acc + p.qty, 0),
                    shippingInfo: state.shippingInfo,
                    paymentMethod: state.paymentMethod,
                    error: false
                }
            } else {
                return {
                    loading: false,
                    cartItems: [...state.cartItems, item],
                    prevCartQty: state.cartItems.reduce((acc, p) => acc + p.qty, 0),
                    shippingInfo: state.shippingInfo,
                    paymentMethod: state.paymentMethod,
                    error: false
                }
            }
        case CART_ADD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case CART_REMOVE:
            return {
                cartItems: state.cartItems.map(p => p._id === action.payload ? { ...p, qty: p.qty !== 1 ? p.qty - 1 : 1 } : p),
                prevCartQty: state.cartItems.reduce((acc, p) => acc + p.qty, 0),
                shippingInfo: state.shippingInfo,
                paymentMethod: state.paymentMethod
            }
        case CART_TRASH:
            return {
                cartItems: state.cartItems.filter(p => p._id !== action.payload),
                prevCartQty: state.cartItems.reduce((acc, p) => acc + p.qty, 0),
                shippingInfo: state.shippingInfo,
                paymentMethod: state.paymentMethod
            }
        case CART_ADD_RESET:
            return {
                cartItems: state.cartItems,
                prevCartQty: 0,
                shippingInfo: state.shippingInfo,
                paymentMethod: state.paymentMethod
            }
        case CART_SAVE_SHIPPING_INFO:
            return {
                ...state,
                shippingInfo: action.payload
            }
        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload
            }
        case CART_RESET:
            return {
                cartItems: [],
                prevCartQty: 0,
                shippingInfo: state.shippingInfo,
                paymentMethod: state.paymentMethod
            }
        default:
            return state
    }
}
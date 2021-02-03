import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_CREATE_RESET,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_RESET,
    ORDER_USER_REQUEST,
    ORDER_USER_SUCCESS,
    ORDER_USER_FAIL,
    ORDER_USER_RESET,
    ORDERS_LIST_REQUEST,
    ORDERS_LIST_SUCCESS,
    ORDERS_LIST_FAIL,
    ORDERS_LIST_RESET,
    ORDER_SHIP_REQUEST,
    ORDER_SHIP_SUCCESS,
    ORDER_SHIP_FAIL,
    ORDER_SHIP_RESET,
    ORDER_DETAILS_RESET
} from '../constants/orderConstants'

export const orderCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return {
                loading: true
            }
        case ORDER_CREATE_SUCCESS:
            return {
                loading: false,
                success: true,
                order: action.payload
            }
        case ORDER_CREATE_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_CREATE_RESET:
            return {}
        default:
            return state
    }
}

export const orderDetailsReducer = (state = { order: {} }, action) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return {
                loading: true,
                order: {}
            }
        case ORDER_DETAILS_SUCCESS:
            return {
                loading: false,
                order: action.payload
            }
        case ORDER_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_DETAILS_RESET:
            return {
                order: {}
            }
        default:
            return state
    }
}

export const orderPayReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_PAY_REQUEST:
            return {
                loading: true
            }
        case ORDER_PAY_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case ORDER_PAY_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_PAY_RESET:
            return {}
        default:
            return state
    }
}

export const orderShipReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_SHIP_REQUEST:
            return {
                loading: true
            }
        case ORDER_SHIP_SUCCESS:
            return {
                loading: false,
                success: true
            }
        case ORDER_SHIP_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_SHIP_RESET:
            return {}
        default:
            return state
    }
}

export const orderListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDER_USER_REQUEST:
            return {
                loading: true
            }
        case ORDER_USER_SUCCESS:
            return {
                loading: true,
                orders: action.payload
            }
        case ORDER_USER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDER_USER_RESET:
            return { orders: [] }
        default:
            return state
    }
}

export const ordersListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDERS_LIST_REQUEST:
            return {
                loading: true
            }
        case ORDERS_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload
            }
        case ORDERS_LIST_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case ORDERS_LIST_RESET:
            return { orders: [] }
        default:
            return state
    }
}
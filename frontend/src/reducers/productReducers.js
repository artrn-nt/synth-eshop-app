import {
    PRODUCTS_LIST_REQUEST,
    PRODUCTS_LIST_SUCCESS,
    PRODUCTS_LIST_FAIL,
    PRODUCTS_LIST_RESET,
    PRODUCTS_IDS_LIST_REQUEST,
    PRODUCTS_IDS_LIST_SUCCESS,
    PRODUCTS_IDS_LIST_FAIL,
    PRODUCTS_IDS_LIST_RESET,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_RESET,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL
} from '../constants/productConstants'

export const productsListReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case PRODUCTS_LIST_REQUEST:
            return { loading: true, ...state }
        case PRODUCTS_LIST_SUCCESS:
            return { loading: false, products: action.payload }
        case PRODUCTS_LIST_FAIL:
            return { loading: false, error: action.payload }
        case PRODUCTS_LIST_RESET:
            return { products: [] }
        default:
            return state
    }
}

export const idsListReducer = (state = { ids: [] }, action) => {
    switch (action.type) {
        case PRODUCTS_IDS_LIST_REQUEST:
            return { loading: true, ...state }
        case PRODUCTS_IDS_LIST_SUCCESS:
            return { loading: false, ids: action.payload }
        case PRODUCTS_IDS_LIST_FAIL:
            return { loading: false, error: action.payload }
        case PRODUCTS_IDS_LIST_RESET:
            return { loading: false, ids: [] }
        default:
            return state
    }
}

export const productDetailsReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return { loading: true, ...state }
        case PRODUCT_DETAILS_SUCCESS:
            return { loading: false, product: action.payload }
        case PRODUCT_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        case PRODUCT_DETAILS_RESET:
            return { loading: false, product: {} }
        default:
            return state
    }
}

export const productDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_DELETE_REQUEST:
            return { loading: true }
        case PRODUCT_DELETE_SUCCESS:
            return { loading: false, success: true }
        case PRODUCT_DELETE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}
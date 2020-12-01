import axios from 'axios'
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
    PRODUCT_DETAILS_RESET
} from '../constants/productConstants'

export const listProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCTS_LIST_REQUEST })

        const { data } = await axios.get('/api/products')

        dispatch({
            type: PRODUCTS_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCTS_LIST_FAIL,
            payload:
                error.response && error.response.data.message ?
                error.response.data.message : 
                error.message
        })
    }
}

export const resetListProducts = () => async (dispatch) => {
    dispatch({ type: PRODUCTS_LIST_RESET })
}

export const listProductsIds = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCTS_IDS_LIST_REQUEST })

        const { data } = await axios.get('/api/products')

        dispatch({
            type: PRODUCTS_IDS_LIST_SUCCESS,
            payload: [].concat.apply([], data.map(p => Object.entries(p).filter(entry => entry[0] === '_id').map(item => item[1])))
        })
    } catch (error) {
        dispatch({
            type: PRODUCTS_IDS_LIST_FAIL,
            payload:
                error.response && error.response.data.message ?
                error.response.data.message : 
                error.message
        })
    }
}

export const resetListProductsIds = () => async (dispatch) => {
    dispatch({ type: PRODUCTS_IDS_LIST_RESET })
}

export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/products/${id}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message ?
                error.response.data.message : 
                error.message
        })
    }
}

export const resetProductDetails = () => async (dispatch) => {
    dispatch({ type: PRODUCT_DETAILS_RESET })
}
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
    productsListReducer,
    productDetailsReducer,
    productDeleteReducer,
    productCreateReducer,
    productUpdateReducer
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import {
    userLoginReducer,
    userRegisterReducer,
    userDetailsReducer,
    userUpdateProfileReducer,
    usersListReducer,
    userDeleteReducer,
    userUpdateReducer
} from './reducers/userReducers'
import {
    orderCreateReducer,
    orderDetailsReducer,
    orderListReducer,
    orderPayReducer,
    orderShipReducer,
    ordersListReducer
} from './reducers/orderReducers.js'

const reducer = combineReducers({
    productsList: productsListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    usersList: usersListReducer,
    userUpdate: userUpdateReducer,
    userDelete: userDeleteReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderShip: orderShipReducer,
    orderList: orderListReducer,
    ordersList: ordersListReducer
})

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const shippingInfoFromStorage = localStorage.getItem('shippingInfo') ?
    JSON.parse(localStorage.getItem('shippingInfo')) : {}

const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ?
    JSON.parse(localStorage.getItem('paymentMethod')) : 'paypal'

const initialState = {
    cart: {
        cartItems: cartItemsFromStorage,
        prevCartQty: 0,
        shippingInfo: shippingInfoFromStorage,
        paymentMethod: paymentMethodFromStorage
    },
    userLogin: {
        userInfo: userInfoFromStorage
    }
}

const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails } from '../actions/productActions'
import { PRODUCT_DETAILS_RESET } from '../constants/productConstants'
import { CART_ADD_RESET } from '../constants/cartConstants'
import { addToCart } from '../actions/cartActions'
import ScreenTitle from '../components/utilities/ScreenTitle'
import { ActionBtn } from '../components/utilities/ActionBtnLink'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/ProductScreen.scss'

const ProductScreen = ({ match }) => {

    console.log('branch commit test')

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    const idsList = useSelector(state => state.idsList)
    const { loading: loadingIds, error: errorIds } = idsList

    const [added, setAdded] = useState(null)
    const [isProduct, setIsProduct] = useState(null)

    useEffect(() => {
        dispatch(listProductDetails(match.params.id))
        console.log(match)
        return () => {
            dispatch({ type: PRODUCT_DETAILS_RESET })
            dispatch({ type: CART_ADD_RESET })
        }
    }, [dispatch, match])

    useEffect(() => {
        if (typeof product === 'undefined' || (Object.entries(product).length === 0 && product.constructor === Object)) setIsProduct(false)
        else setIsProduct(true)
    }, [product])

    useEffect(() => {
        if ((!loading && !loadingIds) && (!error && !errorIds) && isProduct) {
            gsap.fromTo('.product-main-col', {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1.1,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })
        }
    }, [loading, loadingIds, error, errorIds, isProduct])

    useEffect(() => {
        if (cart.error !== undefined) {
            if (!cart.error) setAdded(true)
            else setAdded(false)
        } else setAdded(null)
    }, [cart])

    const compareStockToCartQtyHandler = () => {
        const existItem = cartItems.find(item => item._id === product._id)
        return existItem ? existItem.qty === product.countInStock : false
    }

    const addToCartHandler = () => dispatch(addToCart(match.params.id))

    if (!isProduct) return null

    return (
        <section className='product-section'>

            <div className='product-main-col'>

                {loading || loadingIds ? <Spinner /> :
                    error || errorIds ? <ErrorMsg message={error || errorIds} /> :

                        <>

                            <ScreenTitle title={product.name} />   

                            <div className='product-row'>
                            
                                <div className='product-col-1'>
                                    <div className='img-wrapper'>
                                        <img src={product.image} alt={product.name} />
                                    </div>
                                    <div className='add-row'>
                                        <div className='info-wrapper'>
                                            <span className='price'>Price: €{product.price.toFixed(2)}</span>
                                            <span className='status'>Status: {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
                                            {product.countInStock > 0 && <span className='count-in-stock'>{product.countInStock} remaining</span>}
                                        </div>
                                        <ActionBtn
                                            type='button'
                                            className={product.countInStock === 0 || compareStockToCartQtyHandler() ? 'btn-add-cart disabled' : 'btn-add-cart active'}
                                            onClickHandler={() => {
                                                if (product.countInStock > 0) {
                                                    if (cartItems.length === 0) addToCartHandler()
                                                    else {
                                                        const existItem = cartItems.find(item => item._id === product._id)

                                                        if (existItem) {
                                                            if (existItem.qty < product.countInStock) addToCartHandler()
                                                            else return
                                                        } else addToCartHandler()
                                                    }
                                                }
                                            }}
                                        >
                                            Add To Cart
                                        </ActionBtn>
                                    </div>

                                    <div className={cart.loading || cart.error ? 'alert-row-product ctr' : 'alert-row-product str'}>
                                        {cart.loading && <Spinner />}
                                        {!cart.loading && !cart.error && added !== null ? added ?
                                            (<p className={compareStockToCartQtyHandler() ? 'add-cart-alert margin' : 'add-cart-alert'}>
                                                <span>Item added to your cart</span><br />
                                                <span>View <Link to='/cart'>your cart</Link> or <Link to='/'>continue shopping</Link></span>
                                            </p>) :
                                            <span className='error-alert-add-cart'>Something went wrong. Please refresh and retry to add this product to your cart</span> : null}
                                        {compareStockToCartQtyHandler() &&
                                            <span className='stock-alert-product'>Not enough stock to add more than {product.countInStock} {product.name} to your cart</span>}
                                    </div>
                                </div>

                                <div className='product-col-2'>
                                    <div className='description-wrapper'>
                                        <span>{product.description_m}</span>
                                        <ul className='details-list-wrapper'>
                                            {product.features.map((detail, index) => {
                                                return <li key={product._id + index.toString()}>{detail}</li>
                                            })}
                                        </ul>
                                    </div>
                                </div>

                            </div> 
                        </>}

            </div>

        </section>
    )
}

export default ProductScreen
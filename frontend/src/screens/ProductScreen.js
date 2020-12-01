import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, resetProductDetails } from '../actions/productActions'
import { addToCart, resetAddToCart } from '../actions/cartActions'
import ScreenTitle from '../components/utilities/ScreenTitle'
import Spinner from '../components/utilities/Spinner'
import Message from '../components/utilities/Message'
import '../scss/screens/ProductScreen.scss'

const ProductScreen = ({ match }) => {

    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails 
    const cart = useSelector(state => state.cart)
    const { cartItems } = cart
    // console.log(cart)

    const [added, setAdded] = useState(null)
    
    useEffect(() => {
        dispatch(listProductDetails(match.params.id))
        return () => {
            dispatch(resetProductDetails())
            dispatch(resetAddToCart())
            console.log('unmount ?')
        }
    }, [dispatch, match])

    useEffect(() => {
        if (product && Object.keys(product).length !== 0 && product.constructor === Object) {
            
            gsap.fromTo('.main-row-product', {
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
    }, [product])

    useEffect(() => { 
        if (cart.error !== undefined) {
            if (!cart.error) setAdded(true)
            else setAdded(false)
        }  else setAdded(null)
    }, [cart])

    const compareStockToCartQtyHandler = () => {
        const existItem = cartItems.find(item => item._id === product._id)
        return existItem ? existItem.qty === product.countInStock : false
    }
    
    const addToCartHandler = () => dispatch(addToCart(match.params.id))

    if (loading) return ( <section className='product-container ctr'><Spinner /></section> )
    else if (error) return ( <section className='product-container ctr'><Message error={error} /></section> )
    else if (Object.entries(product).length === 0 && product.constructor === Object) return null

    return (
        <section className='product-container str'>

            <ScreenTitle title={product.name} />
            <div className='main-row-product'>
                
                <div className='col-1-product'>
                    <div className='img-wrapper'>
                        <img src={product.image} alt={product.name} />
                    </div>
                    <div className='add-row'>
                        <div className='info-wrapper'>
                            <span className='price'>Price: €{product.price.toFixed(2)}</span>
                            <span className='status'>Status: {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span> 
                            {product.countInStock > 0 && <span className='count-in-stock'>{product.countInStock} remaining</span>}
                        </div>
                        <button 
                            onClick={() => {
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
                            className={product.countInStock === 0 || compareStockToCartQtyHandler() ? 'btn-add-cart disabled' : 'btn-add-cart active'}
                            type='button'
                        >
                            Add To Cart
                        </button>
                    </div>
                    <div className={cart.loading || cart.error ? 'alert-row-product ctr' : 'alert-row-product str'}>
                        {cart.loading && <Spinner />}
                        {!cart.loading && !cart.error && added !== null ? added ?
                        (<p className={compareStockToCartQtyHandler() ? 'add-cart-alert margin' : 'add-cart-alert'}>
                            <span>Item added to your cart</span><br/>
                            <span>View <Link to='/cart'>your cart</Link> or <Link to='/'>continue shopping</Link></span>
                        </p>) :
                        <span className='error-alert-add-cart'>Something went wrong. Please refresh and retry to add this product to your cart</span> : null}
                        {compareStockToCartQtyHandler() && 
                        <span className='stock-alert-product'>Not enough stock to add more than {product.countInStock} {product.name} to your cart</span>}
                    </div>
                </div>

                <div className='col-2-product'>
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

        </section>
    )
}

export default ProductScreen
import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../actions/cartActions'
import Spinner from '../utilities/Spinner'
import ScreenTitle from '../utilities/ScreenTitle'
import { ActionBtn } from '../utilities/ActionBtnLink'
import { ErrorMsg } from '../utilities/Messages'
import '../../scss/components/ProductScreen/ProductDetails.scss'

const usePrevious = (val) => {
    const ref = useRef()
    useEffect(() => {
        ref.current = val
    })
    return ref.current
}

const ProductDetails = ({ match, products }) => {

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    const [product, setProduct] = useState({})
    const [added, setAdded] = useState(null)

    const prevParamId = usePrevious(match.params.id)

    useEffect(() => {
        setProduct(products.find(p => p._id === match.params.id))

        if (match.params.id !== prevParamId &&
            (typeof product !== 'undefined' && (Object.entries(product).length !== 0 && product.constructor === Object))) {
                gsap.set('.product-details', { autoAlpha: 0 })
        }

        return () => {
            setProduct({})
            setAdded(null)
        }
    }, [match, products, prevParamId, product])

    useEffect(() => {
        if (typeof product !== 'undefined' && (Object.entries(product).length !== 0 && product.constructor === Object)) {
            gsap.fromTo('.product-details', {
                autoAlpha: 0,
                y: 38
            }, {
                delay: .1,
                duration: .9,
                autoAlpha: 1,
                y: 0,
                ease: 'power2.out'
            })
        }
    }, [product])

    useEffect(() => {
        if (cart.error !== undefined) {
            if (!cart.error) setAdded(true)
            else setAdded(false)
        } else setAdded(null)
    }, [cart])

    const addToCartHandler = (product) => {

        if (product.countInStock > 0) {
            if (cartItems.length === 0) dispatch(addToCart(match.params.id))
            else {
                const existItem = cartItems.find(item => item._id === product._id)

                if (existItem) {
                    if (existItem.qty < product.countInStock) dispatch(addToCart(match.params.id))
                    else return
                } else dispatch(addToCart(match.params.id))
            }
        }
    }

    const compareStockToCartQtyHandler = () => {
        const existItem = cartItems.find(item => item._id === product._id)
        return existItem ? existItem.qty === product.countInStock : false
    }

    if (typeof product === 'undefined') return (
        <div className='product-details' style={{ opacity: 1 }}>
            <ErrorMsg message={'Product not found'} />
        </div>
    )

    if (Object.entries(product).length === 0 && product.constructor === Object) return null

    return (
        <div className='product-details'>

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
                            className={(product.countInStock === 0) || compareStockToCartQtyHandler() ? 'btn-add-cart disabled' : 'btn-add-cart active'}
                            onClickHandler={() => addToCartHandler(product)}
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
        </div>
    )
}

export default ProductDetails

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, resetListProducts } from '../actions/productActions'
import ScreenTitle from '../components/utilities/ScreenTitle'
import Spinner from '../components/utilities/Spinner'
import Message from '../components/utilities/Message'
import ProductCard from '../components/ProductsScreen/ProductCard'
import '../scss/screens/ProductsScreen.scss'

const ProductsScreen = () => {

    const dispatch = useDispatch()
    const productsList = useSelector(state => state.productsList)
    const { loading, error, products } = productsList

    const productsRef = useRef(null)

    useEffect(() => {
        dispatch(listProducts())
        return () => dispatch(resetListProducts())
    }, [dispatch])

    useEffect(() => {
        if (products && products.length !== 0) {
            const productCards = Object.values(productsRef.current.children)
            gsap.fromTo(productCards, {
                opacity: 0,
                yPercent: 7
            }, {
                delay: .15,
                duration: .8,
                ease: 'power3.out',
                opacity: 1,
                yPercent: 0,
                stagger: .125
            })
        }
    }, [products])
    
    return (
        <section className={`products-container ${loading || error ? 'ctr' : 'str'}`}>
            {loading ? <Spinner /> :  
                error ? <Message error={error} /> :
                (<>
                    <ScreenTitle title='products' />
                    <div className='products' ref={productsRef}>
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </>)}
        </section>
    )
}

export default ProductsScreen

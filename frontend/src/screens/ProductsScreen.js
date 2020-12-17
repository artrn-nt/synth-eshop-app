import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import { PRODUCTS_LIST_RESET } from '../constants/productConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import Hero from '../components/ProductsScreen/Hero'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import ProductCard from '../components/ProductsScreen/ProductCard'
import '../scss/screens/ProductsScreen.scss'

const ProductsScreen = () => {

    const dispatch = useDispatch()
    const productsList = useSelector(state => state.productsList)
    const { loading, error, products } = productsList

    const [latestProducts, setLatestProducts] = useState([])

    const productsRef = useRef(null)

    useEffect(() => {
        dispatch(listProducts())
        return () => dispatch({ type: PRODUCTS_LIST_RESET })
    }, [dispatch])

    useEffect(() => {
        if (products && products.length !== 0) {
            setLatestProducts(products.filter(p => p.brand === 'Moog'))
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
                error ? <ErrorMsg message={error} /> :
                    (<>
                        {/* <Hero latestProducts={latestProducts} /> */}
                        <ScreenTitle title='All products' />
                        <div className='products' ref={productsRef}>
                            {products.sort((p1, p2) => {
                                const product1Name = p1.name.toLowerCase(), product2Name = p2.name.toLowerCase()
                                if (product1Name < product2Name) return -1
                                if (product1Name > product2Name) return 1
                                return 0
                            }).map((product) => product.isPublished && <ProductCard key={product._id} product={product} />)}
                        </div>
                    </>)}
        </section>
    )
}

export default ProductsScreen
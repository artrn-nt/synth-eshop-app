import React, { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import { PRODUCTS_LIST_RESET } from '../constants/productConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import Hero from '../components/ProductsScreen/Hero'
import ProductsFilter from '../components/utilities/ProductsFilter'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import ProductCard from '../components/ProductsScreen/ProductCard'
import '../scss/screens/ProductsScreen.scss'

gsap.registerPlugin(ScrollTrigger)

const ProductsScreen = () => {

    const dispatch = useDispatch()

    const productsList = useSelector(state => state.productsList)
    const { loading, error, products } = productsList

    const [allProducts, setAllProducts] = useState([])
    const [carouselProducts, setCarouselProducts] = useState([])
    const [mounted, setMounted] = useState(false)
    const [brands, setBrands] = useState([])
    const [touched, setTouched] = useState(null)
    const [productsContainerHeight, setProductsContainerHeight] = useState(null)

    const productsContainerRef = useRef(null)
    const productsGridRef = useRef(null)
    const scrollTrigger = useRef(null)

    const sortProductsByName = (productsArr) => {
        const productsArrCopy = [...productsArr]
        return productsArrCopy.sort((p1, p2) => {
            const p1Name = p1.name.toLowerCase(), p2Name = p2.name.toLowerCase()
            if (p1Name < p2Name) return -1
            if (p1Name > p2Name) return 1
            return 0
        })
    }
    
    const sortProductsByPrice = (productsArr) => {
        const productsArrCopy = [...productsArr]
        return productsArrCopy.sort((p1, p2) => {
            const p1Price = p1.price, p2Price = p2.price
            if (p1Price < p2Price) return -1
            if (p1Price > p2Price) return 1
            return 0
        })
    }

    useEffect(() => {
        dispatch(listProducts())
        return () => {
            dispatch({ type: PRODUCTS_LIST_RESET })
        }
    }, [dispatch])

    useEffect(() => {
        if (!loading && !error && typeof products !== 'undefined' && products.length !== 0) {

            const brandArr = []

            for (const p of products) {
                brandArr.push(Object.entries(p).filter(entry => entry[0] === 'brand').flat()[1])
            }

            setBrands([...new Set(brandArr)])
            setAllProducts(sortProductsByName(products))
            setCarouselProducts(products.filter(p => p.name === 'Moog Mother-32' || p.name === 'Moog Subharmonicon' || p.name === 'Moog Werkstatt-01'))

        }
    }, [loading, error, products])

    useEffect(() => {

        if (productsGridRef.current !== null) {
            const productCards = Object.values(productsGridRef.current.children)

            if (allProducts.length !== 0 && touched === null) {
                scrollTrigger.current = ScrollTrigger.batch(productCards, {
                    start: 'top 60%',
                    interval: .125,
                    batchMax: 4,
                    onEnter: batch => gsap.to(batch, {
                        autoAlpha: 1, 
                        transform: 'translate3d(0, 0, 0)',
                        duration: .75,
                        ease: 'power3.out',
                        stagger: .125
                    })
                })

                if (productsContainerRef.current !== null) {
                    setProductsContainerHeight(productsContainerRef.current.clientHeight)
                }
    
            } else if (allProducts.length !== 0 && touched) {
                gsap.set(productCards, { transform: 'translate3d(0, 0, 0)' })
                gsap.fromTo('.product-card', {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: .75,
                    ease: 'power2.inOut',
                })
            } 

        }

        if (allProducts.length === 0 && touched) {
            gsap.fromTo('.no-result', {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: .75,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })
        }
        
    }, [allProducts, touched])

    // Filter products handler // ugly
    const productsFilterHandler = useCallback((type, criteria) => {
        setTouched(true)

        if (scrollTrigger.current !== null) {
            // ScrollTrigger.kill()
            scrollTrigger.current = null
        }

        if (type === 'Indifferent') {
            setAllProducts(sortProductsByName(products))
        } else if (type === 'Brand') {
            setAllProducts(products.filter(p => p.brand === criteria))
        } else if (type === 'Categories') {
            setAllProducts(products.filter(p => {
                if (criteria.synthesis !== null && criteria.voiceType === null) {
                    return JSON.stringify(p.categories) === JSON.stringify({
                        synthesis: criteria.synthesis,
                        voiceType: p.categories.voiceType,
                        semiModular: criteria.semiModular,
                        desktop: criteria.desktop
                    })
                } else if (criteria.voiceType !== null && criteria.synthesis === null) {
                    return JSON.stringify(p.categories) === JSON.stringify({
                        synthesis: p.categories.synthesis,
                        voiceType: criteria.voiceType,
                        semiModular: criteria.semiModular,
                        desktop: criteria.desktop
                    })
                } else if (criteria.synthesis !== null && criteria.voiceType !== null) {
                    return JSON.stringify(p.categories) === JSON.stringify(criteria)
                } else if (criteria.synthesis === null && criteria.voiceType === null && criteria.semiModular && !criteria.desktop) {
                    return p.categories.semiModular && !p.categories.desktop
                } else if (criteria.synthesis === null && criteria.voiceType === null && !criteria.semiModular && criteria.desktop) {
                    return p.categories.desktop && !p.categories.semiModular
                } else if (criteria.synthesis === null && criteria.voiceType === null && criteria.semiModular && criteria.desktop) {
                    return p.categories.semiModular && p.categories.desktop
                } else if (criteria.synthesis === null && criteria.voiceType === null && !criteria.semiModular && !criteria.desktop) {
                    return !p.categories.semiModular && !p.categories.desktop
                } else return null

            }))
        } else if (type === 'Price') {
            setAllProducts(sortProductsByPrice(products))
        }
    }, [products])

    return (
        <section className={`products-section ${loading || error ? 'ctr' : 'str'}`}>
            {loading ? <Spinner /> :
                error ? <ErrorMsg message={error} /> :
                    <div 
                        className='products-container' 
                        style={{ 
                            minHeight: `${productsContainerHeight}px`,
                            opacity:  mounted ? 1 : 0
                        }}
                        ref={productsContainerRef}
                    >
                        <Hero 
                            carouselProducts={carouselProducts} 
                            mounted={() => setMounted(true)}
                        />
                        <ScreenTitle title='Our products' />
                        <ProductsFilter
                            brands={brands}
                            price
                            productsFilterHandler={productsFilterHandler}
                        />
                        {allProducts.length === 0 && touched ?
                            <p className='no-result'>- No product found matching your filter criterias -</p> :
                            <div className='products-grid' ref={productsGridRef}>
                                {allProducts.map((product) => product.isPublished && <ProductCard key={product._id} product={product} />)}
                            </div>}
                    </div>}
        </section>
    )
}

export default ProductsScreen
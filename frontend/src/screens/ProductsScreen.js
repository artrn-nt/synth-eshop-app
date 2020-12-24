import React, { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
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

const ProductsScreen = () => {

    const [products, setProducts] = useState([])
    const [brands, setBrands] = useState([])
    const [touched, setTouched] = useState(null)
    const [productsContainerHeight, setProductsContainerHeight] = useState(null)

    const dispatch = useDispatch()

    const productsList = useSelector(state => state.productsList)
    const { loading, error, products: allProducts } = productsList

    const [heroProducts, setHeroProducts] = useState([])

    const productsContainerRef = useRef(null)
    const productsGridRef = useRef(null)

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
        return () => dispatch({ type: PRODUCTS_LIST_RESET })
    }, [dispatch])

    useEffect(() => {
        if (!loading && !error && allProducts && allProducts.length !== 0) {
            setHeroProducts(allProducts.filter(p => p.brand === 'Moog'))

            const brandArr = []

            for (let p of allProducts) {
                brandArr.push(Object.entries(p).filter(entry => entry[0] === 'brand').flat()[1])
            }

            setBrands([...new Set(brandArr)])
            setProducts(sortProductsByName(allProducts))

        }
    }, [loading, error, allProducts])

    useEffect(() => {

        if (productsGridRef.current !== null) {
            const productCards = Object.values(productsGridRef.current.children)

            if (products.length !== 0 && touched === null) {
                gsap.fromTo(productCards, {
                    opacity: 0,
                    yPercent: 7
                }, {
                    delay: .15,
                    duration: .75,
                    ease: 'power3.out',
                    opacity: 1,
                    yPercent: 0,
                    stagger: .125
                })

                if (productsContainerRef.current !== null) {
                    setProductsContainerHeight(productsContainerRef.current.clientHeight)
                }

            } else if (products.length !== 0 && touched) {

                gsap.fromTo(productCards, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: .75,
                    ease: 'power2.inOut',
                })

            }
        }

        if (products.length === 0 && touched) {

            gsap.fromTo('.no-product-filter', {
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
    }, [products, touched])

    // Filter products handler
    const productsFilterHandler = useCallback((type, criteria) => {
        setTouched(true)
        if (type === 'Indifferent') {
            setProducts(sortProductsByName(allProducts))
        } else if (type === 'Brand') {
            setProducts(allProducts.filter(p => p.brand === criteria))
        } else if (type === 'Categories') {
            setProducts(allProducts.filter(p => {
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
            setProducts(sortProductsByPrice(allProducts))
        }
    }, [allProducts])

    return (
        <section className={`products-section ${loading || error ? 'ctr' : 'str'}`}>
            {loading ? <Spinner /> :
                error ? <ErrorMsg message={error} /> :
                    <div className='products-container' style={{ minHeight: `${productsContainerHeight}px` }} ref={productsContainerRef}>
                        {/* <Hero latestProducts={latestProducts} /> */}
                        <ScreenTitle title='Our products' />
                        <ProductsFilter
                            brands={brands}
                            price
                            productsFilterHandler={productsFilterHandler}
                        />
                        {products.length === 0 && touched ?
                            <p className='no-product-filter'>- No product found matching your filter criterias -</p> :
                            <div className='products-grid' ref={productsGridRef}>
                                {products.map((product) => product.isPublished && <ProductCard key={product._id} product={product} />)}
                            </div>}
                    </div>}
        </section>
    )
}

export default ProductsScreen
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { listProductsIds, resetListProductsIds } from '../../actions/productActions'
import '../../scss/components/utilities/ProductsNav.scss'

const ProductsNav = ({ pathname_id }) => {

    const dispatch = useDispatch()
    const idsList = useSelector(state => state.idsList)
    const { loading, error, ids } = idsList
    
    const [currentIndex, setCurrentIndex] = useState(null)
    const [lastIndex, setLastIndex] = useState(null)

    const linksRowRef = useRef(null)

    useEffect(() => {
        dispatch(listProductsIds())
        return () => dispatch(resetListProductsIds())
    }, [dispatch])

    useEffect(() => {
        if (ids && ids.length !== 0) {
            gsap.fromTo(linksRowRef.current, {
                opacity: 0
            }, {
                delay: .15,
                duration: 1.1,
                opacity: 1,
                ease: 'power3.out'
            })
        }
    }, [ids])    

    useEffect(() => {
        if (ids) {
            setCurrentIndex(ids.findIndex(id => id === pathname_id))
            setLastIndex(ids.length - 1)
        }
    }, [ids, pathname_id])

    if (loading || error) return null

    return (
        <nav className='products-nav' ref={linksRowRef}>
            <ul>
                <li>
                    <Link 
                        className='prev'
                        to={`/product/${currentIndex - 1 < 0 ? ids[lastIndex] : ids[currentIndex - 1]}`}
                    >
                        Previous
                    </Link>
                </li>
                <span>/</span>
                <li>
                    <Link
                        className='next'
                        to={`/product/${currentIndex + 1 > lastIndex ? ids[0] : ids[currentIndex + 1]}`}
                    >
                        Next
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default ProductsNav

import React, { useState, useEffect, useRef } from 'react'
import { useLocation} from 'react-router-dom'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import '../../scss/components/ProductScreen/ProductsNav.scss'

const ProductsNav = ({ ids }) => {

    const { pathname } = useLocation()
    
    const [currentId, setCurrentId] = useState(null)
    const [currentIndex, setCurrentIndex] = useState(null)
    const [lastIndex, setLastIndex] = useState(null)

    const [disabled, setDisabled] = useState(false)
    // console.log(disabled)

    const linksRowRef = useRef(null)
    const timeout = useRef(null)

    useEffect(() => {
        setCurrentId(pathname.split('/')[2])
    }, [pathname])

    useEffect(() => {
        if (ids.length !== 0) {
            setCurrentIndex(ids.findIndex(id => id === currentId))
            setLastIndex(ids.length - 1)
        }
    }, [ids, currentId])

    useEffect(() => {
        timeout.current = setTimeout(() => {
            setDisabled(false)
        }, 1100)

        return () => {
            clearTimeout(timeout.current)
            timeout.current = null
        }

    }, [disabled])   

    useEffect(() => {
        if (ids.length !== 0) {
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

    return (
        <nav className='products-nav' ref={linksRowRef}>
            <ul>
                <li>
                    <Link
                        onClick={() => setDisabled(true)} 
                        // to={`/product/${currentIndex - 1 < 0 ? ids[lastIndex] : ids[currentIndex - 1]}`}
                        to={disabled ? `/product/${ids[currentIndex]}` : `/product/${currentIndex - 1 < 0 ? ids[lastIndex] : ids[currentIndex - 1]}`}
                    >
                        Previous
                    </Link>
                </li>
                <span>/</span>
                <li>
                    <Link
                        onClick={() => setDisabled(true)} 
                        to={disabled ? `/product/${ids[currentIndex]}` : `/product/${currentIndex + 1 > lastIndex ? ids[0] : ids[currentIndex + 1]}`}
                    >
                        Next
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default ProductsNav

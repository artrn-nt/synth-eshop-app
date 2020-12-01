import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

const Footer = () => {

    const location = useLocation()
    const footerRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(footerRef.current, {
            opacity: 0
        }, {
            delay: .5,
            duration: .15,
            opacity: 1
        })
    }, [location])

    return (
        <footer ref={footerRef}>
            <span>Synth Mini-Market &copy; {new Date().getFullYear()}</span>
            <div className='logos-wrapper'>
                <i className='fab fa-cc-paypal' />
                <i className='fab fa-ups' />
            </div>
        </footer>
    )
}

export default Footer

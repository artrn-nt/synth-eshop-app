import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

const Footer = () => {

    const { pathname } = useLocation()
    const footerRef = useRef(null)

    useEffect(() => {
        gsap.set(footerRef.current, { autoAlpha: 0 })
        gsap.fromTo(footerRef.current, {
            autoAlpha: 0,
        }, {
            delay: .75,
            duration: .35,
            autoAlpha: 1,
            ease: 'power2.out'
        })
    }, [pathname])

    return (
        <footer ref={footerRef}>
            <p>&copy; {new Date().getFullYear()}, Synth Mini-Market</p>
            <div className='logos-wrapper'>
                <i className='fab fa-cc-paypal' />
                <i className='fab fa-cc-stripe' />
                <i className='fab fa-ups' />
            </div>
        </footer>
    )
}

export default Footer

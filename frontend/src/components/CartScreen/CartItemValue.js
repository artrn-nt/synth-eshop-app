import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

const CartItemValue = ({ elClassName, value }) => {

    const [state, setState] = useState(null)
    const spanRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(spanRef.current, {
            opacity: 0
        }, {
            duration: .9,
            opacity: 1,
            ease: 'power2.inOut'
        })
        setState(value)
    }, [value])

    return (
        <span className={elClassName} ref={spanRef}>
            {state}
        </span>
    )
}

export default CartItemValue

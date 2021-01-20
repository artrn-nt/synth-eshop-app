import React, { useState, useEffect } from 'react'
import gsap from 'gsap'

const CheckoutTotal = ({ totalQty, totalPrice }) => {

    const [qtyTotal, setQtyTotal] = useState(0)
    const [priceTotal, setPriceTotal] = useState(0)

    useEffect(() => {
        gsap.fromTo(['.subtotal', '.total'], {
            opacity: 0
        }, {
            duration: .9,
            opacity: 1,
            ease: 'power2.inOut'
        })
        setQtyTotal(totalQty)
        setPriceTotal(totalPrice)
    }, [totalQty, totalPrice])

    return (
        <>
            <span className='subtotal'>Subtotal ({qtyTotal}) items</span>
            <span className='total'>€{priceTotal} <small>(VAT incl.)</small></span>
        </>
    )
}

export default CheckoutTotal

import React, { useState, useEffect } from 'react'
import gsap from 'gsap'

const CheckoutTotal = ({ totalQty, totalPrice }) => {

    const [qtyTotal, setQtyTotal] = useState(0)
    const [priceTotal, setPriceTotal] = useState(0)

    useEffect(() => {
        gsap.fromTo(['.checkout-subtotal', '.checkout-total'], {
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
            <h3 className='checkout-subtotal'>Subtotal ({qtyTotal}) items</h3>
            <span className='checkout-total'>€{priceTotal} <small>(VAT incl.)</small></span>
        </>
    )
}

export default CheckoutTotal

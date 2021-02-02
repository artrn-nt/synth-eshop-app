import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import Spinner from '../utilities/Spinner'

const PaypalPaymentIntents = ({ orderDetails, isReady, paymentHandler, paymentReadyHandler }) => {

    const ref = useRef(null)

    useEffect(() => {

        const addPaypalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&locale=en_US`
            script.async = true
            script.onload = () => {
                paymentReadyHandler()
            }

            document.body.appendChild(script)
        }

        if (typeof window !== 'undefined' && !window.paypal) {
            addPaypalScript()
        } else {
            paymentReadyHandler()
        }

    }, [paymentReadyHandler])

    useEffect(() => {
        if (isReady) {
            ref.current.children[1].firstChild.style.minWidth = '175px'
        }
    }, [isReady])

    return (
        <>
            {!isReady ? 
                <Spinner /> :
                <div
                    className='payment-container-inner-paypal' 
                    ref={ref}
                >
                    <h4>Payment</h4>
                    <PayPalButton 
                        amount={orderDetails.amount} 
                        onSuccess={paymentHandler} 
                        currency='EUR' 
                        locale='en_US'
                        style={{
                            color: 'blue',   // gold, blue, silver, black or white
                            height: 34
                        }}
                    />
                </div>
            }
        </>
    )
}

export default PaypalPaymentIntents

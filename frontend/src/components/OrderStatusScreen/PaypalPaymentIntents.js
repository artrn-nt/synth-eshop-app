import React, { useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import Spinner from '../utilities/Spinner'

const PaypalPaymentIntents = ({ orderDetails, isReady, paymentHandler, paymentReadyHandler, loadingPay }) => {

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

    return (
        <>
            {!isReady || loadingPay ?
                <Spinner /> :
                <>
                    <h4>Payment</h4>
                    <PayPalButton 
                        amount={orderDetails.amount} 
                        onSuccess={paymentHandler} 
                        currency='EUR' 
                        locale='en_US'
                        style={{
                            color: 'blue'   // gold, blue, silver, black or white
                        }}
                    />
                </>
            }
        </>
    )
}

export default PaypalPaymentIntents

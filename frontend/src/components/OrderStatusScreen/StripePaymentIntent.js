import React from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import '../../scss/components/OrderStatusScreen/StripePaymentIntent.scss'

const StripePaymentIntent = ({ paymentHandler, orderDetails }) => {

    const stripe = useStripe()
    const elements = useElements()

    console.log(orderDetails)

    const onSubmitHandler = async (ev) => {
        ev.preventDefault()
        const cardElement = elements.getElement(CardElement)

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement
        })

        if (!error) {
            const paymentResult = {
                ...orderDetails,
                id: paymentMethod.id
            }
            console.log(paymentResult)
            paymentHandler(paymentResult)
        }
        // else setError dans le front-end - error handler
    }

    return (
        <form className='stripe-form' onSubmit={onSubmitHandler}>
            <div className='card-el-container'>
                <CardElement />
            </div>
            <button disabled={!stripe || !elements}>
                <i className='fab fa-stripe'/>
            </button>
            <p>Powered by <span><i className='fab fa-stripe'/></span></p>
        </form>
    )
}

export default StripePaymentIntent

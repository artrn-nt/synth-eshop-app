import React from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useDispatch } from 'react-redux'
import { payOrder } from '../../actions/orderActions'
import '../../scss/components/OrderStatusScreen/StripePaymentIntent.scss'

const StripePaymentIntent = ({ orderDetails }) => {

    const stripe = useStripe()
    const elements = useElements()
    const dispatch = useDispatch()

    const onSubmitHandler = async (ev) => {
        ev.preventDefault()
        const cardElement = elements.getElement(CardElement)

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement
        })

        if (!error) {
            console.log(paymentMethod)
            // const { id } = paymentMethod

            try {
                // const response = await axios.post('/api/')
            } catch (error) {
                console.log(error)
            }
        }


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

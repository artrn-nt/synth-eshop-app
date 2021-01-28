import React, { useState, useEffect, useRef } from 'react'
import { CardElement, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js'
import styled from '@emotion/styled'
import useWindowSize from '../../utils/useWindowSize'
import '../../scss/components/OrderStatusScreen/StripePaymentIntent.scss'
import config from '../../scss/config.module.scss'
import breakpoints from '../../scss/media-queries.module.scss'
// console.log(config)
console.log(breakpoints)

const parseWidth = (str) => +str.slice(0, str.indexOf('p'))

const CardElementContainer = styled.div`
    position: relative;
    height: 35px;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        display: block;
        width: ${props => props.focus ? 100 : 0}%;
        height: 1.7px;
        background-color: rgb(90, 103, 220);
        transition: width 280ms ease-out;
    }

    & .StripeElement {
        width: 100%;
    }

`

const iframeStyles = {
    base: {
        fontSize: '15px',
        color: `${config.mainTheme}`,
        iconColor: `${config.greyish}`,
        '::placeholder': {
            color: `${config.greyish}`
        }
    },
    invalid: {
        color: `${config.subTheme}`,
        iconColor: `${config.subTheme}`
    }
}

const cardElementOptions = {
    iconStyle: 'solid',
    style: iframeStyles,
    hidePostalCode: true
}

const StripePaymentIntent = ({ paymentHandler, orderDetails }) => {

    const stripe = useStripe()
    const elements = useElements()
    const size = useWindowSize()
    const [isFocused, setIsFocused] = useState(false)

    const onSubmitHandler = async (ev) => {
        ev.preventDefault()
        const cardNumberElement = elements.getElement(CardNumberElement)
        const cardElement = elements.getElement(CardElement)

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement
        })

        if (!error) {
            console.log(paymentMethod)
            const paymentResult = {
                ...orderDetails,
                id: paymentMethod.id
            }
            // console.log(paymentResult)
            // paymentHandler(paymentResult)
        }
        // else setError dans le front-end - error handler
    }

    return (
        <>
            {size.width > parseWidth(breakpoints.smScreen) ? 

                <form className='stripe-form' onSubmit={onSubmitHandler}>
                    <CardElementContainer focus={isFocused}>
                        <CardElement 
                            options={cardElementOptions} 
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </CardElementContainer>
                    <button className='stripe-btn' disabled={!stripe || !elements}>
                        <i className='fab fa-stripe'/>
                    </button>
                    <p>Powered by <span><i className='fab fa-stripe'/></span></p>
                </form> 
                
                : 

                <form className='stripe-form' onSubmit={onSubmitHandler}>
                    <fieldset>
                        <div className='form-row-1'>
                            <CardNumberElement  
                            />
                        </div>
                        <div className='form-row'>
                            <CardExpiryElement 
                            />
                        </div>
                        <div className='form-row'>
                            <CardCvcElement 
                            />
                        </div>
                    </fieldset>
                    <button className='stripe-btn'>
                        <i className='fab fa-stripe'/>
                    </button>
                    <p>Powered by <span><i className='fab fa-stripe'/></span></p>
                </form>
            }
        </>
    ) 

}

export default StripePaymentIntent

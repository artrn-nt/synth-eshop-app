import React, { useState, useEffect } from 'react'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import styled from '@emotion/styled'
import useWindowSize from '../../utils/useWindowSize'
import '../../scss/components/OrderStatusScreen/StripePaymentIntent.scss'
import config from '../../scss/config.module.scss'
import breakpoints from '../../scss/media-queries.module.scss'

const parseWidth = (str) => +str.slice(0, str.indexOf('p'))

const CardElementsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 110px;
    padding: ${props => props.size > parseWidth(breakpoints.smScreen) ? '0 16.8px' : '0'};
    margin-bottom: 16.8px;

    & .StripeElement {
        position: relative;
        width: 100%;
        height: 26px;

        &::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 0;
            display: block;
            height: 1.6px;
            background-color: rgb(90, 103, 220);
            transition: width 280ms ease-out;
        }

        &:nth-of-type(1)::after {
            width: ${props => props.focus.cardNumber ? 100 : 0}%;
        }

        &:nth-of-type(2)::after {
            width: ${props => props.focus.cardExpiry ? 100 : 0}%;
        }

        &:nth-of-type(3)::after {
            width: ${props => props.focus.cardCvc ? 100 : 0}%;
        }

    }

`

const StripePaymentIntent = ({ paymentHandler, orderDetails }) => {

    const stripe = useStripe()
    const elements = useElements()
    const size = useWindowSize()
    
    const [disabled, setDisabled] = useState(false)
    const [isFocused, setIsFocused] = useState({
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false
    })

    // ugly
    useEffect(() => {
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
            },
            complete: {
                iconColor: 'rgb(90, 103, 220)',
                color: 'rgb(90, 103, 220)'
            }
        }

        const cardNumber = elements.create('cardNumber', {
            showIcon: true,
            iconStyle: 'solid',
            placeholder: 'Card Number',
            style: iframeStyles
        })

        const cardExpiryElement = elements.create('cardExpiry', {
            placeholder: 'MM / YY',
            style: iframeStyles
        })

        const cardCvcElement = elements.create('cardCvc', {
            placeholder: 'CVC',
            style: iframeStyles
        })

        cardNumber.mount('#card-number-element')
        cardNumber.on('focus', () => {
            setIsFocused(prev => ({
                ...prev,
                cardNumber: true
            }))
        })
        cardNumber.on('blur', () => {
            setIsFocused(prev => ({
                ...prev,
                cardNumber: false
            }))
        })

        cardExpiryElement.mount('#card-expiry-element')
        cardExpiryElement.on('focus', () => {
            setIsFocused(prev => ({
                ...prev,
                cardExpiry: true
            }))
        })
        cardExpiryElement.on('blur', () => {
            setIsFocused(prev => ({
                ...prev,
                cardExpiry: false
            }))
        })

        cardCvcElement.mount('#card-cvc-element')
        cardCvcElement.on('focus', () => {
            setIsFocused(prev => ({
                ...prev,
                cardCvc: true
            }))
        })
        cardCvcElement.on('blur', () => {
            setIsFocused(prev => ({
                ...prev,
                cardCvc: false
            }))
        })

        return () => {
            // cardNumber.unmount()
            // cardExpiryElement.unmount()
            // cardCvcElement.unmount()
            // cardNumber.clear()
            // cardExpiryElement.clear()
            // cardCvcElement.clear()
            cardNumber.destroy()
            cardExpiryElement.destroy()
            cardCvcElement.destroy()
        }

    }, [elements])

    const onSubmitHandler = async (ev) => {
        ev.preventDefault()
        const cardNumberElement = elements.getElement('cardNumber')

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumberElement
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
        <form className='stripe-form' onSubmit={onSubmitHandler}>
            <CardElementsContainer focus={isFocused} size={size.width}>
                <div id='card-number-element' />
                <div id='card-expiry-element' />
                <div id='card-cvc-element' />
            </CardElementsContainer>
            <button className='stripe-btn' disabled={!stripe || !elements}>
                <i className='fab fa-stripe'/>
            </button>
            <p>Powered by <span><i className='fab fa-stripe'/></span></p>
        </form> 

    ) 

}

export default StripePaymentIntent



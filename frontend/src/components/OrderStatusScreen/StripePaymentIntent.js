import React, { useState, useEffect } from 'react'
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import styled from '@emotion/styled'
import Spinner from '../utilities/Spinner'
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

const StripePaymentIntent = ({
    orderDetails, 
    isReady, 
    paymentHandler, 
    paymentReadyHandler, 
    loadingPay, 
    errorPay, 
    paymentErrorStripeHandler
}) => {

    const stripe = useStripe()
    const elements = useElements()
    const size = useWindowSize()
    
    const [isDisabled, setIsDisabled] = useState(false)
    const [isFocused, setIsFocused] = useState({
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false
    })

    useEffect(() => {
        if (typeof stripe !== 'undefined' && typeof elements !== 'undefined') paymentReadyHandler(true)
    }, [stripe, elements, paymentReadyHandler])

    useEffect(() => {
        if (errorPay) setIsDisabled(false)
    }, [errorPay])

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

    const onSubmitHandler = async (ev) => {
        ev.preventDefault()
        setIsDisabled(true)
        const cardNumberElement = elements.getElement('cardNumber')

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardNumberElement
        })

        if (!error) {
            const paymentResult = {
                ...orderDetails,
                id: paymentMethod.id
            }
            paymentHandler(paymentResult)
        } else {
            paymentErrorStripeHandler()
            setIsDisabled(false)
        }
    }

    return (
        <>
            {!isReady ?
                <Spinner /> :
                <>
                    <h4>Payment</h4>
                    <form className='stripe-form' onSubmit={onSubmitHandler}>
                        <CardElementsContainer focus={isFocused} size={size.width}>
                            <CardNumberElement 
                                options={{
                                    showIcon: true,
                                    iconStyle: 'solid',
                                    placeholder: 'Card Number',
                                    style: iframeStyles
                                }}
                                onFocus={() => setIsFocused(prev => ({...prev, cardNumber: true}))}
                                onBlur={() => setIsFocused(prev => ({...prev, cardNumber: false}))}
                            />
                            <CardExpiryElement 
                                options={{
                                    placeholder: 'MM / YY',
                                    style: iframeStyles
                                }}
                                onFocus={() => setIsFocused(prev => ({...prev, cardExpiry: true}))}
                                onBlur={() => setIsFocused(prev => ({...prev, cardExpiry: false}))}
                            />
                            <CardCvcElement
                                options={{
                                    placeholder: 'CVC',
                                    style: iframeStyles
                                }}
                                onFocus={() => setIsFocused(prev => ({...prev, cardCvc: true}))}
                                onBlur={() => setIsFocused(prev => ({...prev, cardCvc: false}))}
                            />
                        </CardElementsContainer>
                        <button className='stripe-btn' disabled={!stripe || !elements || isDisabled}>
                            <i className='fab fa-stripe'/>
                        </button>
                        <p>Powered by <span><i className='fab fa-stripe'/></span></p>
                    </form>
                </>} 
        </>
    ) 

}

export default StripePaymentIntent



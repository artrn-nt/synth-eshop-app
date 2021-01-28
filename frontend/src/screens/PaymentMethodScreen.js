import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../actions/cartActions'
import { Formik, Form } from 'formik'
import CheckOutSteps from '../components/utilities/CheckoutSteps'
import ScreenTitle from '../components/utilities/ScreenTitle'
import RadioInputField from '../components/utilities/RadioInputField'
import { ActionBtn, ActionLink } from '../components/utilities/ActionBtnLink'
import '../scss/screens/PaymentMethodScreen.scss'

const PaymentMethodScreen = ({ history }) => {

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { shippingInfo, paymentMethod } = cart

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [payment, setPayment] = useState('')

    useEffect(() => {
        if (!userInfo) history.push('/login')
    }, [userInfo, history])

    useEffect(() => {
        if (!shippingInfo || Object.entries(shippingInfo).length === 0) {
            history.push('/shipping')
        }
        setPayment(paymentMethod)
    }, [shippingInfo, history, paymentMethod])

    useEffect(() => {
        gsap.fromTo('.payment-form-container', {
            opacity: 0,
            y: 38
        }, {
            delay: .15,
            duration: 1.1,
            opacity: 1,
            y: 0,
            ease: 'power3.out'
        })
    }, [])

    if (!userInfo) return null

    return (
        <section className='payment-section'>
            <ScreenTitle title='Payment method' />
            <CheckOutSteps step1 step2 />
            <Formik
                initialValues={{ paymentMethod }}
                onSubmit={() => {
                    dispatch(savePaymentMethod(payment))
                    history.push('/placeorder')
                }}
            >
                {({ isSubmitting, values, handleChange, handleSubmit }) => (
                    <div className='payment-form-container'>
                        <h3>Select your payment method</h3>
                        <Form
                            name='payment'
                            method='post'
                            onSubmit={handleSubmit}
                        >

                            <div className='payment-group'>

                                <RadioInputField
                                    id='paypal'
                                    name='paymentMethod'
                                    value='paypal'
                                    checked={values.paymentMethod === 'paypal'}
                                    onChangeHandler={ev => {
                                        handleChange(ev)
                                        setPayment(ev.target.value)
                                    }}
                                    text='Paypal or credit card'
                                />

                                <RadioInputField
                                    id='stripe'
                                    name='paymentMethod'
                                    value='stripe'
                                    checked={values.paymentMethod === 'stripe'}
                                    onChangeHandler={ev => {
                                        handleChange(ev)
                                        setPayment(ev.target.value)
                                    }}
                                    text='Stripe'
                                />

                            </div>

                            <ActionBtn type='submit' className='btn-checkout-step' disabled={isSubmitting}>Continue</ActionBtn>
                            <ActionLink path='/cart' className='back-to-cart-link'>
                                <i className='fas fa-shopping-cart' />
                                Back to cart
                            </ActionLink>

                        </Form>

                    </div>
                )}

            </Formik>

        </section>
    )
}

export default PaymentMethodScreen

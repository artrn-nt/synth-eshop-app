import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../actions/cartActions'
import { Formik, Form } from 'formik'
import CheckOutSteps from '../components/utilities/CheckoutSteps'
import ScreenTitle from '../components/utilities/ScreenTitle'
import RadioInput from '../components/PaymentScreen/RadioInput'
import { ActionBtn, ActionLink } from '../components/utilities/ActionBtnLink'
import '../scss/screens/PaymentMethodScreen.scss'

const PaymentMethodScreen = ({ history }) => {

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { shippingInfo } = cart

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const [paymentMethod, setPaymentMethod] = useState('paypal')

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

    useEffect(() => {
        if (!userInfo) history.push('/login')
    }, [userInfo, history])

    if (Object.entries(shippingInfo).length === 0 || !shippingInfo) {
        history.push('/shipping')
    }

    if (!userInfo) return null

    return (
        <section className='payment-section'>
            <ScreenTitle title='Payment method' />
            <CheckOutSteps step1 step2 />
            <Formik
                initialValues={{ paymentMethod: cart.paymentMethod ? cart.paymentMethod : paymentMethod }}
                onSubmit={() => {
                    dispatch(savePaymentMethod(paymentMethod))
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

                                <RadioInput
                                    paymentMethod='paypal'
                                    value='paypal'
                                    checked={values.paymentMethod === 'paypal'}
                                    onChangeHandler={ev => {
                                        handleChange(ev)
                                        setPaymentMethod(ev.target.value)
                                    }}
                                    text='PayPal or credit card'
                                />

                                <RadioInput
                                    paymentMethod='stripe'
                                    value='stripe'
                                    checked={values.paymentMethod === 'stripe'}
                                    onChangeHandler={ev => {
                                        handleChange(ev)
                                        setPaymentMethod(ev.target.value)
                                    }}
                                    text='Stripe'
                                />

                            </div>

                            <ActionBtn type='submit' className='btn-checkout-step2' disabled={isSubmitting} text='Continue' />
                            <ActionLink path='/cart' className='back-to-cart-link' text='Back to cart' />

                        </Form>

                    </div>
                )}

            </Formik>

        </section>
    )
}

export default PaymentMethodScreen

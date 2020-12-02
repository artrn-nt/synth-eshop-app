import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../actions/cartActions'
import { Formik, Form } from 'formik'
// import * as yup from 'yup'
import CheckOutSteps from '../components/utilities/CheckoutSteps'
import ScreenTitle from '../components/utilities/ScreenTitle'
import RadioInput from '../components/PaymentScreen/RadioInput'
import ActionBtn from '../components/utilities/ActionBtn'
import BackToCartLink from '../components/utilities/BackToCartLink'
import '../scss/screens/PaymentScreen.scss'

const PaymentScreen = ({ history }) => {

    const dispatch = useDispatch()

    const cart = useSelector(state => state.cart)
    const { shippingInfo } = cart

    const [paymentMethod, setPaymentMethod] = useState('paypal')

    if (Object.entries(shippingInfo).length === 0 || !shippingInfo) {
        history.push('/shipping')
    }

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

                            <ActionBtn type='submit' className='submit-btn-checkout' disabled={isSubmitting} text='Continue to order' />

                        </Form>

                    </div>
                )}

            </Formik>

            <BackToCartLink />

        </section>
    )
}

export default PaymentScreen

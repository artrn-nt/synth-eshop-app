import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { savePaymentMethod } from '../actions/cartActions'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import CheckOutSteps from '../components/utilities/CheckoutSteps'
import ScreenTitle from '../components/utilities/ScreenTitle'
import '../scss/screens/PaymentScreen.scss'

const PaymentScreen = ({ history }) => {

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { shippingInfo } = cart

    if (!shippingInfo) {
        history.push('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState('Paypal')

    return (
        <section className='payment-section'>
            <ScreenTitle title='Payment' />
            <CheckOutSteps step1 step2 />

            <Formik
                initialValues={{ paymentMethod }}
                // initialErrors={{ address: '', city: '', zipCode: '', country: '' }}
                validationSchema={yup.object({
                    paymentMethod: yup.string()
                        .trim()
                        // .matches(/^[A-Za-z0-9\s\-]+$/, 'Address is not valid, special characters are not allowed')
                        .required('Payment method is required'),
                    // city: yup.string()
                    //     .trim()
                    //     .matches(/^[A-Za-z\s\-]+$/, 'City is not valid')
                    //     .required('City is required'),
                    // zipCode: yup.string()
                    //     .trim()
                    //     .matches(/^[A-Za-z0-9\s\-]+$/, 'Zip code is not valid')
                    //     .required('Zip code is required'),
                    // country: yup.string()
                    //     .trim()
                    //     .matches(/^[A-Za-z\s\-]+$/, 'Country is not valid')
                    //     .required('Country is required'),
                })}
                onSubmit={() => {
                    dispatch(savePaymentMethod(paymentMethod))
                    history.push('/placeorder')
                }}

            >
                {({ isSubmitting, handleChange, handleSubmit }) => (
                    <div className='shipping-form-container'>
                        <Form
                            name='shipping'
                            method='post'
                            onSubmit={handleSubmit}
                        >

                            <div className='field-control'>
                                <label htmlFor='paymentMethod'>Payment method</label>
                                <Field
                                    type='text'
                                    name='paymentMethod'
                                    id='paymentMethod'
                                    autoComplete='off'
                                    placeholder='Enter your address'
                                    value={paymentMethod}
                                    onChange={ev => {
                                        handleChange(ev)
                                        setPaymentMethod(ev.target.value)
                                    }}
                                />
                                <ErrorMessage
                                    name='paymentMethod'
                                    render={msg => <span className='form-alert'>{msg}</span>}
                                />
                            </div>

                            <button
                                className='btn-shipping-form'
                                type='submit'
                                disabled={isSubmitting}
                            >
                                Continue
                            </button>

                        </Form>

                    </div>
                )}

            </Formik>
        </section>
    )
}

export default PaymentScreen

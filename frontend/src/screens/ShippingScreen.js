import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveShippingInfo } from '../actions/cartActions'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import CheckOutSteps from '../components/utilities/CheckoutSteps'
import ScreenTitle from '../components/utilities/ScreenTitle'
import '../scss/screens/ShippingScreen.scss'

const ShippingScreen = ({ history }) => {

    const dispatch = useDispatch()
    const cart = useSelector(state => state.cart)
    const { shippingInfo } = cart

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [address, setAddress] = useState('')
    const [addressDetails, setAddressDetails] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [city, setCity] = useState('')
    const [country, setCountry] = useState('')

    useEffect(() => {
        if (Object.entries(shippingInfo).length !== 0 && shippingInfo.constructor === Object) {
            console.log(shippingInfo)
            setFirstName(shippingInfo.firstName)
            setLastName(shippingInfo.lastName)
            setAddress(shippingInfo.address)
            setAddressDetails(shippingInfo.addressDetails)
            setZipCode(shippingInfo.zipCode)
            setCity(shippingInfo.city)
            setCountry(shippingInfo.country)
        }
    }, [shippingInfo])

    return (
        <section className='shipping-section'>
            <ScreenTitle title='Shipping info' />
            <CheckOutSteps step1 />
            <Formik
                initialValues={{
                    firstName,
                    lastName,
                    address,
                    addressDetails,
                    zipCode,
                    city,
                    country
                }}
                initialErrors={{
                    lastName: '',
                    address: '',
                    zipCode: '',
                    city: '',
                    country: ''
                }}
                validationSchema={yup.object({
                    firstName: yup.string()
                        .trim()
                        .matches(/^[A-Za-z0-9\s-]+$/, 'Address is not valid, special characters are not allowed'),
                    lastName: yup.string()
                        .trim()
                        .matches(/^[A-Za-z0-9\s-]+$/, 'Address is not valid, special characters are not allowed')
                        .required('Address is required'),
                    address: yup.string()
                        .trim()
                        .matches(/^[A-Za-z0-9\s-]+$/, 'Address is not valid, special characters are not allowed')
                        .required('Address is required'),
                    addressDetails: yup.string()
                        .trim()
                        .matches(/^[A-Za-z0-9\s-]+$/, 'Address is not valid, special characters are not allowed')
                        .required('Address is required'),
                    zipCode: yup.string()
                        .trim()
                        .matches(/^[A-Za-z0-9\s-]+$/, 'Zip code is not valid')
                        .required('Zip code is required'),
                    city: yup.string()
                        .trim()
                        .matches(/^[A-Za-z\s-]+$/, 'City is not valid')
                        .required('City is required'),
                    country: yup.string()
                        .trim()
                        .matches(/^[A-Za-z\s-]+$/, 'Country is not valid')
                        .required('Country is required'),
                })}
                onSubmit={() => {
                    dispatch(saveShippingInfo({ firstName, lastName, address, addressDetails, zipCode, city, country }))
                    history.push('/payment')
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
                                <label htmlFor='firstName'>First name<span>(optional)</span></label>
                                <Field
                                    type='text'
                                    name='firstName'
                                    id='firstName'
                                    autoComplete='off'
                                    placeholder='Enter your first name'
                                    value={firstName}
                                    onChange={ev => {
                                        handleChange(ev)
                                        setFirstName(ev.target.value)
                                    }}
                                />
                                <ErrorMessage
                                    name='firstName'
                                    render={msg => <span className='form-alert'>{msg}</span>}
                                />
                            </div>

                            <div className='field-control'>
                                <label htmlFor='lastName'>Last name</label>
                                <Field
                                    type='text'
                                    name='lastName'
                                    id='lastName'
                                    autoComplete='off'
                                    placeholder='Enter your last name'
                                    value={lastName}
                                    onChange={ev => {
                                        handleChange(ev)
                                        setLastName(ev.target.value)
                                    }}
                                />
                                <ErrorMessage
                                    name='lastName'
                                    render={msg => <span className='form-alert'>{msg}</span>}
                                />
                            </div>

                            <div className='field-control'>
                                <label htmlFor='address'>Address</label>
                                <Field
                                    type='text'
                                    name='address'
                                    id='address'
                                    autoComplete='off'
                                    placeholder='Enter your address'
                                    value={address}
                                    onChange={ev => {
                                        handleChange(ev)
                                        setAddress(ev.target.value)
                                    }}
                                />
                                <ErrorMessage
                                    name='address'
                                    render={msg => <span className='form-alert'>{msg}</span>}
                                />
                            </div>

                            <div className='field-control'>
                                <label htmlFor='addressDetails'>Address details<span>(optional)</span></label>
                                <Field
                                    type='text'
                                    name='addressDetails'
                                    id='addressDetails'
                                    autoComplete='off'
                                    placeholder='Enter your address details'
                                    value={addressDetails}
                                    onChange={ev => {
                                        handleChange(ev)
                                        setAddressDetails(ev.target.value)
                                    }}
                                />
                                <ErrorMessage
                                    name='addressDetails'
                                    render={msg => <span className='form-alert'>{msg}</span>}
                                />
                            </div>

                            <div className='field-control'>
                                <label htmlFor='zipCode'>Zip code</label>
                                <Field
                                    type='text'
                                    name='zipCode'
                                    id='zipCode'
                                    autoComplete='off'
                                    placeholder='Enter your zip code'
                                    value={zipCode}
                                    onChange={ev => {
                                        handleChange(ev)
                                        setZipCode(ev.target.value)
                                    }}
                                />
                                <ErrorMessage
                                    name='zipCode'
                                    render={msg => <span className='form-alert'>{msg}</span>}
                                />
                            </div>

                            <div className='field-control'>
                                <label htmlFor='city'>City</label>
                                <Field
                                    type='text'
                                    name='city'
                                    id='city'
                                    autoComplete='off'
                                    placeholder='Enter your city'
                                    value={city}
                                    onChange={ev => {
                                        handleChange(ev)
                                        setCity(ev.target.value)
                                    }}
                                />
                                <ErrorMessage
                                    name='city'
                                    render={msg => <span className='form-alert'>{msg}</span>}
                                />
                            </div>

                            <div className='field-control'>
                                <label htmlFor='country'>Country</label>
                                <Field
                                    type='text'
                                    name='country'
                                    id='country'
                                    autoComplete='off'
                                    placeholder='Enter your country'
                                    value={country}
                                    onChange={ev => {
                                        handleChange(ev)
                                        setCountry(ev.target.value)
                                    }}
                                />
                                <ErrorMessage
                                    name='country'
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

export default ShippingScreen

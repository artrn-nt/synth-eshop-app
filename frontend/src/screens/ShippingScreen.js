import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { saveShippingInfo } from '../actions/cartActions'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import CheckOutSteps from '../components/utilities/CheckoutSteps'
import ScreenTitle from '../components/utilities/ScreenTitle'
import ActionBtn from '../components/utilities/ActionBtn'
import BackToCartLink from '../components/utilities/BackToCartLink'
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
    const [phone, setPhone] = useState('')

    useEffect(() => {
        if (Object.entries(shippingInfo).length !== 0 && shippingInfo.constructor === Object) {
            // console.log(shippingInfo)
            setFirstName(shippingInfo.firstName)
            setLastName(shippingInfo.lastName)
            setAddress(shippingInfo.address)
            setAddressDetails(shippingInfo.addressDetails)
            setZipCode(shippingInfo.zipCode)
            setCity(shippingInfo.city)
            setCountry(shippingInfo.country)
            setPhone(shippingInfo.phone)
        }
    }, [shippingInfo])

    return (
        <section className='shipping-section'>
            <ScreenTitle title='Shipping info' />
            <CheckOutSteps step1 />
            <Formik
                initialValues={{
                    firstName,
                    lastName: shippingInfo.lastName ? shippingInfo.lastName : '',
                    address: shippingInfo.address ? shippingInfo.address : '',
                    addressDetails,
                    zipCode: shippingInfo.zipCode ? shippingInfo.zipCode : '',
                    city: shippingInfo.city ? shippingInfo.city : '',
                    country: shippingInfo.country ? shippingInfo.country : '',
                    phone
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
                        .min(2, 'Seems a bit short don\'t you think?')
                        .max(65, 'Seems a bit long don\'t you think?')
                        .matches(/^[A-Za-z\s\-'éèàùç]+$/, 'First name is not valid'),
                    lastName: yup.string()
                        .trim()
                        .min(2, 'Seems a bit short don\'t you think?')
                        .max(65, 'Seems a bit long don\'t you think?')
                        .matches(/^[A-Za-z\s\-'éèàùç]+$/, 'Last name is not valid')
                        .required('Last name is required'),
                    address: yup.string()
                        .trim()
                        .min(2, 'Seems a bit short don\'t you think?')
                        .max(97, 'Seems a bit long don\'t you think?')
                        .matches(/^[A-Za-z0-9\s\-']+$/, 'Special characters are not allowed')
                        .required('Address is required'),
                    addressDetails: yup.string()
                        .trim()
                        .min(2, 'Seems a bit short don\'t you think?')
                        .max(65, 'Seems a bit long don\'t you think?')
                        .matches(/^[A-Za-z0-9\s\-']+$/, 'Special characters are not allowed'),
                    zipCode: yup.string()
                        .trim()
                        .min(2, 'Seems a bit short don\'t you think?')
                        .max(33, 'Seems a bit long don\'t you think?')
                        .matches(/^[A-Za-z0-9\s-]+$/, 'Zip code is not valid')
                        .required('Zip code is required'),
                    city: yup.string()
                        .trim()
                        .min(2, 'Seems a bit short don\'t you think?')
                        .max(65, 'Seems a bit long don\'t you think?')
                        .matches(/^[A-Za-z\s\-']+$/, 'Special characters are not allowed')
                        .required('City is required'),
                    country: yup.string()
                        .trim()
                        .min(2, 'Seems a bit short don\'t you think?')
                        .max(65, 'Seems a bit long don\'t you think?')
                        .matches(/^[A-Za-z\s\-']+$/, 'Special characters are not allowed')
                        .required('Country is required'),
                    phone: yup.string()
                        .trim()
                        .min(8, 'Seems a bit short don\'t you think?')
                        .max(25, 'Seems a bit long don\'t you think?')
                        .matches(/^[0-9+]+$/, 'Phone number is not valid')
                })}
                onSubmit={() => {
                    dispatch(saveShippingInfo({ firstName, lastName, address, addressDetails, zipCode, city, country, phone }))
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
                                    id='firstname'
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
                                    id='lastname'
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
                                    id='address-details'
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
                                    id='zipcode'
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

                            <div className='field-control'>
                                <label htmlFor='phone'>Phone</label>
                                <Field
                                    type='text'
                                    name='phone'
                                    id='phone'
                                    autoComplete='off'
                                    placeholder='Enter your phone number'
                                    value={phone}
                                    onChange={ev => {
                                        handleChange(ev)
                                        setPhone(ev.target.value)
                                    }}
                                />
                                <ErrorMessage
                                    name='phone'
                                    render={msg => <span className='form-alert'>{msg}</span>}
                                />
                            </div>

                            <ActionBtn type='submit' className='submit-btn-checkout' disabled={isSubmitting} text='Continue to payment' />

                        </Form>


                    </div>
                )}

            </Formik>

            <BackToCartLink />

        </section>
    )
}

export default ShippingScreen

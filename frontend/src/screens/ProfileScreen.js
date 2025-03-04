import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { USER_DETAILS_RESET } from '../constants/userConstants'
import { listUserOrders } from '../actions/orderActions'
import { ORDER_USER_RESET } from '../constants/orderConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import ShowPassword from '../components/utilities/ShowPassword'
import Spinner from '../components/utilities/Spinner'
import { Alert, ErrorMsg } from '../components/utilities/Messages'
import { ActionBtn } from '../components/utilities/ActionBtnLink'
import '../scss/screens/ProfileScreen.scss'

const ProfileScreen = ({ history }) => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [show, setShow] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(null)
    const [fadeOut, setFadeOut] = useState(null)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading: loadingDetails, error: errorDetails, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const orderList = useSelector(state => state.orderList)
    const { loading: loadingOrders, error: errorOrders, orders } = orderList

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)

    const timeOut1 = useRef(null)
    const timeOut2 = useRef(null)

    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            if (!loadingDetails && !errorDetails && !user.name) {
                dispatch(getUserDetails('profile'))
                dispatch(listUserOrders())
            }
        }
    }, [userInfo, history, loadingDetails, errorDetails, user, dispatch])

    useEffect(() => {
        return () => {
            dispatch({ type: USER_DETAILS_RESET })
            dispatch({ type: ORDER_USER_RESET })
        }
    }, [dispatch])

    useEffect(() => {
        if (!loadingDetails && !errorDetails && Object.entries(user).length !== 0 && user.constructor === Object) {
            setUsername(user.name)
            setEmail(user.email)
        }
    }, [loadingDetails, errorDetails, user])

    useEffect(() => {
        if (userUpdateProfile.success) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET })
            dispatch(getUserDetails('profile'))
            setFadeOut(null)
            setUpdateSuccess(true)
            setPassword('')
            timeOut1.current = setTimeout(() => {
                setUpdateSuccess(false)
            }, 9000)
            timeOut2.current = setTimeout(() => {
                setFadeOut(true)
            }, 8050)
        }

        if (updateSuccess) return () => {
            clearTimeout(timeOut1.current)
            timeOut1.current = null
            clearTimeout(timeOut2.current)
            timeOut2.current = null
        }

    }, [userUpdateProfile, dispatch, updateSuccess])

    useEffect(() => {
        if (!loadingDetails && !errorDetails) {
            gsap.fromTo('.profile-form', {
                autoAlpha: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1.1,
                autoAlpha: 1,
                y: 0,
                ease: 'power3.out'
            })
        }
    }, [loadingDetails, errorDetails])

    useEffect(() => {
        if (!loadingOrders && !errorOrders && orders.length !== 0) {
            gsap.fromTo('.my-orders-table', {
                autoAlpha: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1.1,
                autoAlpha: 1,
                y: 0,
                ease: 'power3.out'
            })
        } else if (!loadingOrders && !errorOrders && orders.length === 0) {
            gsap.set('.no-orders', { autoAlpha: 1 })
        }
    }, [loadingOrders, errorOrders, orders])

    if (!userInfo) return null

    return (
        <section className='profile-section'>

            <ScreenTitle title='My profile' />

            <div className='profile-grid'>

                <div className='profile-col-1'>

                    <div className='outer-col-title'>
                        <h3>My info</h3>
                    </div>

                    {loadingDetails ? <Spinner /> :
                        errorDetails ? <ErrorMsg message={errorDetails} /> :

                        <div className='profile-form-container'>
                            <Formik
                                initialValues={{
                                    username: user.name ? user.name : '',
                                    email: user.email ? user.email : '',
                                    password: '',
                                    confirmationPassword: '',
                                    showPassword: false
                                }}
                                initialErrors={{ username: '', email: '', password: '', confirmationPassword: '' }}
                                validationSchema={yup.object({
                                    username: yup.string()
                                        .trim()
                                        .min(5, 'Username must be at least 5 characters long')
                                        .max(24, 'Username must be less than 25 characters long')
                                        .matches(/^[A-Za-z0-9\-_]+$/, 'Username is not valid, special characters (except hyphen and underscore) and spaces are not allowed')
                                        .required('Username is required'),
                                    email: yup.string()
                                        .trim()
                                        .lowercase()
                                        .email('Invalid email address')
                                        .required('Email is required'),
                                    password: yup.string()
                                        .trim()
                                        .min(9, 'Password must be at least 8 characters long')
                                        .max(24, 'Password must be less than 25 characters long')
                                        .matches(/(?=(?:\D*\d){2}\D*$)(?=.*[A-Z])(?=.*[@&€+\-*/=:;.#!%?_])/, 'Password must include two numbers, one uppercase letter and one special character @&€+-*/=:;.#!%?_')
                                        .required('Password is required'),
                                    confirmationPassword: yup.string()
                                        .trim()
                                        .oneOf([yup.ref('password'), null], 'Passwords must match')
                                        .required('Password is required'),
                                })}
                                onSubmit={() => {
                                    dispatch(updateUserProfile({ id: user._id, name: username, email, password }))
                                }}
                            >
                                {({ isSubmitting, values, handleChange, handleSubmit }) => (

                                    <Form
                                        name='profile'
                                        method='post'
                                        className='profile-form'
                                        onSubmit={handleSubmit}
                                    >
                                        <div className='field-control'>
                                            <label htmlFor='username'>Username</label>
                                            <Field
                                                type='text'
                                                name='username'
                                                id='username'
                                                autoComplete='off'
                                                placeholder='Enter your (new) username'
                                                value={username}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setUsername(ev.target.value)
                                                }}
                                            />
                                            <ErrorMessage
                                                name='username'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        <div className='field-control'>
                                            <label htmlFor='email'>Email address</label>
                                            <Field
                                                type='text'
                                                name='email'
                                                id='email'
                                                autoComplete='off'
                                                placeholder='Enter your (new) email'
                                                value={email}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setEmail(ev.target.value)
                                                }}
                                            />
                                            <ErrorMessage
                                                name='email'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        <div className='field-control'>
                                            <label htmlFor='password'>Password</label>
                                            <div className='password-input-wrap-profile'>

                                                <Field
                                                    type={show ? 'text' : 'password'}
                                                    name='password'
                                                    id='password'
                                                    autoComplete='off'
                                                    placeholder='Enter your (new) password'
                                                    value={password}
                                                    onChange={ev => {
                                                        handleChange(ev)
                                                        setPassword(ev.target.value)
                                                    }}
                                                />

                                                <ShowPassword checked={values.showPassword} onClickHandler={() => setShow(prevState => !prevState)} />

                                            </div>

                                            <ErrorMessage
                                                name='password'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />

                                        </div>

                                        <div className='field-control'>
                                            <label htmlFor='confirmationPassword'>Confirm password</label>
                                            <Field
                                                type={show ? 'text' : 'password'}
                                                name='confirmationPassword'
                                                id='confirmationPassword'
                                                autoComplete='off'
                                                placeholder='Confirm your (new) password'
                                            />
                                            <ErrorMessage
                                                name='confirmationPassword'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        <div className='bottom-row'>
                                            <ActionBtn type='submit' className='btn-update' disabled={isSubmitting}>Update profile</ActionBtn>
                                            {updateSuccess && <Alert className={!fadeOut ? 'alert-update fade-in' : 'alert-update fade-out'} message='Profile updated' />}
                                        </div>


                                    </Form>
                                )}

                            </Formik>
                        </div>
                    }

                </div>

                <div className='profile-col-2'>
                    
                    <div className='outer-col-title'>
                        <h3>My orders</h3>
                    </div>

                    {loadingOrders ? <Spinner /> : 
                        errorOrders ? <ErrorMsg message={errorOrders} /> :
                            <div 
                                className='table-container' 
                                style={{ alignItems: orders.length !== 0 ? 'flex-start' : 'center' }}
                            >
                                {orders.length !== 0 ?
                                    (<table className='my-orders-table'>
                                        <thead>
                                            <tr>
                                                <th scope='col' width='37.5%'>ID</th>
                                                <th scope='col' width='15.625%'>DATE</th>
                                                <th scope='col' width='15.625%'>TOTAL</th>
                                                <th scope='col' width='15.625%'>PAID</th>
                                                <th scope='col' width='15.625%'>SHIPPED</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order._id}>
                                                    <td>
                                                        <Link to={`/orders/${order._id}`}>{order._id}</Link>
                                                    </td>
                                                    <td>{order.createdAt.substring(0, 10)}</td>
                                                    <td>€{(order.totalPrice).toFixed(2)}</td>
                                                    <td>
                                                        {order.isPaid ? order.paidAt.substring(0, 10) :
                                                            (<i className='fas fa-times-circle' style={{ color: 'tomato' }} />)}
                                                    </td>
                                                    <td>
                                                        {order.isShipped ? order.shippedAt.substring(0, 10) :
                                                            (<i className='fas fa-times-circle' style={{ color: 'tomato' }} />)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>) :
                                    (<p className='no-orders'>
                                        <span>You didn't make any order from us</span>
                                        <span>
                                            Sounds like a good time
                                        <Link
                                                className='start-shop'
                                                to='/'
                                            >
                                                to make one
                                        </Link>
                                        </span>
                                    </p>)
                                } 
                            </div>
                    }
                    
                </div>
            </div>

        </section>
    )

}

export default ProfileScreen


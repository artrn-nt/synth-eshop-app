import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { register, registerReset } from '../actions/userActions'
import ScreenTitle from '../components/utilities/ScreenTitle'
import Spinner from '../components/utilities/Spinner'
import Message from '../components/utilities/Message'
import '../scss/screens/RegisterScreen.scss'

const RegisterScreen = ({ history, location }) => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [inputType, setInputType] = useState(false)

    const dispatch = useDispatch()
    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo } = userRegister

    const redirect = location.search ? location.search.split('=')[1] : '/'
    // console.log(location)
    // console.log(location.search)
    // console.log(location.search ? true : false)
    // console.log(redirect)
    // console.log(redirect ? true : false)

    useEffect(() => {
        gsap.fromTo(['.register-form-container', '.login-link'], {
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
        if (userInfo) {
            history.push(redirect)
        }
        return () => error && dispatch(registerReset())
    }, [userInfo, history, redirect, error, dispatch])

    return (
        <section className='register-section'>
            <ScreenTitle title='Sign-Up' />
            <Formik
                initialValues={{ username: '', email: '', password: '', confirmationPassword: '', showPasswords: false }}
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
                onSubmit={() => dispatch(register(username, email, password))}
            >
                {({ isSubmitting, values, handleChange, handleSubmit }) => (
                    <div className='register-form-container'>
                        <Form
                            name='register'
                            method='post'
                            onSubmit={handleSubmit}
                        >
                            <div className='field-control'>
                                <label htmlFor='username'>Username</label>
                                <Field
                                    type='text'
                                    name='username'
                                    id='username'
                                    autoComplete='off'
                                    placeholder='Enter your username'
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
                                    placeholder='Enter your email'
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
                                <div className='password-input-wrap-register'>

                                    <Field
                                        type={inputType ? 'text' : 'password'}
                                        name='password'
                                        id='password'
                                        autoComplete='off'
                                        placeholder='Enter your password'
                                        value={password}
                                        onChange={ev => {
                                            handleChange(ev)
                                            setPassword(ev.target.value)
                                        }}
                                    />

                                    <label htmlFor='checkbox' className='styled-checkbox'>
                                        <Field
                                            type='checkbox'
                                            name='showPasswords'
                                            checked={values.showPasswords}
                                            id='checkbox'
                                            onClick={() => setInputType(prevState => !prevState)}
                                        />
                                        <i className='far fa-eye' />
                                        <i className='far fa-eye-slash' />
                                    </label>

                                </div>

                                <ErrorMessage
                                    name='password'
                                    render={msg => <span className='form-err-msg'>{msg}</span>}
                                />

                            </div>

                            <div className='field-control'>
                                <label htmlFor='confirmationPassword'>Confirm password</label>
                                <Field
                                    type={inputType ? 'text' : 'password'}
                                    name='confirmationPassword'
                                    id='confirmationPassword'
                                    autoComplete='off'
                                    placeholder='Confirm your password'
                                />
                                <ErrorMessage
                                    name='confirmationPassword'
                                    render={msg => <span className='form-err-msg'>{msg}</span>}
                                />
                            </div>

                            <button
                                className='btn-register-form'
                                type='submit'
                                disabled={isSubmitting}
                            >
                                Sign-Up
                            </button>

                        </Form>

                    </div>
                )}

            </Formik>

            <p className='login-link'>
                Already have an account?
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                {/* <Link to='/login'>Login</Link> */}
            </p>

            <div className='alert-row-register'>
                {error && <Message error={error} />}
                {loading && <Spinner />}
            </div>

        </section>
    )
}

export default RegisterScreen

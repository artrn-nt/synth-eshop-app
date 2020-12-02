import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { login, loginReset } from '../actions/userActions'
import ScreenTitle from '../components/utilities/ScreenTitle'
import ShowPassword from '../components/utilities/ShowPassword'
import Spinner from '../components/utilities/Spinner'
import Message from '../components/utilities/Message'
import ActionBtn from '../components/utilities/ActionBtn'
import '../scss/screens/LoginScreen.scss'

const LoginScreen = ({ history, location }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [show, setShow] = useState(false)

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { loading, error, userInfo } = userLogin

    const redirect = location.search ? location.search.split('=')[1] : '/'
    // console.log(location)
    // console.log(location.search)
    // console.log(location.search ? true : false)
    // console.log(redirect)
    // console.log(redirect ? true : false)


    useEffect(() => {
        gsap.fromTo(['.login-form-container', '.register-link'], {
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
        return () => error && dispatch(loginReset())
    }, [userInfo, history, redirect, error, dispatch])

    return (
        <section className='login-section'>
            <ScreenTitle title='Sign-In' />
            <Formik
                initialValues={{ email: '', password: '', showPassword: false }}
                initialErrors={{ email: '', password: '' }}
                validationSchema={yup.object({
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
                })}
                onSubmit={() => dispatch(login(email, password))}
            >
                {({ isSubmitting, values, handleChange, handleSubmit }) => (
                    <div className='login-form-container'>
                        <Form
                            name='login'
                            method='post'
                            onSubmit={handleSubmit}
                        >
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
                                <div className='password-input-wrap-login'>

                                    <Field
                                        type={show ? 'text' : 'password'}
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

                                    <ShowPassword checked={values.showPassword} onClickHandler={() => setShow(prevState => !prevState)} />

                                </div>

                                <ErrorMessage
                                    name='password'
                                    render={msg => <span className='form-err-msg'>{msg}</span>}
                                />
                            </div>

                            <ActionBtn type='submit' className='submit-btn' disabled={isSubmitting} text='Sign-in' />

                        </Form>

                    </div>
                )}

            </Formik>

            <p className='register-link'>
                New customer?
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                {/* <Link to='/register'>Register</Link> */}
            </p>

            <div className='alert-row-login'>
                {error && <Message error={error} />}
                {loading && <Spinner />}
            </div>

        </section>
    )
}

export default LoginScreen

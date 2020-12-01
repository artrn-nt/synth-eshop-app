import React, { useState, useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import Spinner from '../components/utilities/Spinner'
import Message from '../components/utilities/Message'
import '../scss/screens/ProfileScreen.scss'

const ProfileScreen = ({ history }) => {

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [inputType, setInputType] = useState('')
    const [updateSuccess, setUpdateSuccess] = useState(null)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    // const { success } = userUpdateProfile



    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        } else {
            // console.log(user)
            if (!user || !user.name) {
                dispatch(getUserDetails('profile'))
            } else {
                setUsername(user.name)
                setEmail(user.email)
            }
        }

        if (userUpdateProfile.success) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET })
            dispatch(getUserDetails('profile'))
            setUpdateSuccess(true)
            setTimeout(() => {
                setUpdateSuccess(false)
            }, 5000)
        }

        return () => clearTimeout()

    }, [userInfo, history, dispatch, user, userUpdateProfile])

    return (
        <section className='profile-section'>

            <ScreenTitle title='User profile' />
            <div className='profile-main-row'>
                <div className='profile-col-1'>
                    <h3>My info</h3>

                    {username && email ?
                        <div className='profile-form-container'>
                            <Formik
                                initialValues={{
                                    username,
                                    email,
                                    password: '',
                                    confirmationPassword: '',
                                    showPasswords: false
                                }}
                                // initialErrors={{ username: '', email: '', password: '', confirmationPassword: '' }}
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
                                onSubmit={() => dispatch(updateUserProfile({ id: user._id, name: username, email, password }))}
                            >
                                {({ isSubmitting, values, handleChange, handleSubmit }) => (

                                    <Form
                                        name='profile'
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
                                            <div className='password-input-wrap-profile'>

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
                                            className='btn-profile-form'
                                            type='submit'
                                            disabled={isSubmitting}
                                        >
                                            Update profile
                                        </button>
                                    </Form>
                                )}

                            </Formik>
                        </div>
                        : null}

                </div>

                <div className='profile-col-2'>
                    <h3>My orders</h3>
                </div>

            </div>
            {updateSuccess && <div className='profile-utils-row'><Message error='Profile updated' /></div>}
            {error && <div className='profile-utils-row'><Message error={error} /></div>}
            {loading && <div className='profile-utils-row'><Spinner /></div>}
        </section>
    )

}

export default ProfileScreen


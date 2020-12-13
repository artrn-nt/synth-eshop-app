import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_DETAILS_RESET, USER_UPDATE_RESET } from '../constants/userConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import { ActionBtn, ActionLink } from '../components/utilities/ActionBtnLink'
import '../scss/screens/UserEditScreen.scss'

const UserEditScreen = ({ match, history }) => {

    const userId = match.params.id

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const userDetails = useSelector(state => state.userDetails)
    const { loading: loadingDetails, error: errorDetails, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate

    useEffect(() => {
        return () => dispatch({ type: USER_DETAILS_RESET })
    }, [dispatch])

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) history.push('/login')
        else dispatch(getUserDetails(match.params.id))
    }, [dispatch, history, match, userInfo])

    useEffect(() => {
        if (user.constructor === Object && Object.entries(user).length !== 0) {
            setUsername(user.name)
            setEmail(user.email)
            setIsAdmin(user.isAdmin)
        }
    }, [user])

    useEffect(() => {
        if (!loadingDetails && !errorDetails) {
            gsap.fromTo('.user-edit-form-container', {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1.1,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })
        }
    }, [loadingDetails, errorDetails])

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            history.push('/admin/userslist')
        }
    }, [dispatch, history, successUpdate])

    return (
        <section className='user-edit-section'>

            <ScreenTitle title='User edit' />

            <div className={loadingDetails || errorDetails ? 'user-edit-main-col ctr' : 'user-edit-main-col str'}>

                {loadingDetails ? <Spinner /> :
                    errorDetails ? <ErrorMsg error={errorDetails} /> :
                        <Formik
                            initialValues={{
                                username: user.name ? user.name : '',
                                email: user.email ? user.email : '',
                                isAdmin: user.isAdmin ? user.isAdmin : false
                            }}
                            initialErrors={{ username: '', email: '' }}
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
                            })}
                            onSubmit={() => dispatch(updateUser({ _id: userId, name: username, email, isAdmin }))}
                        >
                            {({ isSubmitting, values, handleChange, handleSubmit }) => (
                                <div className='user-edit-form-container'>
                                    <Form
                                        name='user-edit'
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
                                            <div className='checkbox-wrapper'>
                                                <label htmlFor='isAdmin'>
                                                    <Field
                                                        type='checkbox'
                                                        name='isAdmin'
                                                        id='isAdmin'
                                                        checked={values.isAdmin}
                                                        onClick={prevState => {
                                                            setIsAdmin(!values.isAdmin)
                                                            return !prevState
                                                        }}
                                                    />
                                                    <span className='circle' />
                                                </label>
                                                <span className='checkbox-text'>{values.isAdmin ? 'Admin' : 'Not admin'}</span>
                                            </div>
                                        </div>

                                        <ActionBtn
                                            type='submit'
                                            className='edit-user-btn'
                                            disabled={isSubmitting}
                                            text='Edit user'
                                        />

                                    </Form>

                                    <ActionLink
                                        path='/admin/userslist'
                                        className='go-back-link'
                                        text='Go back'
                                    />

                                </div>
                            )}

                        </Formik>}

                {loadingUpdate && <div className='update-status-row'><Spinner /></div>}
                {errorUpdate && <div className='update-status-row'><ErrorMsg error={errorUpdate} /></div>}

            </div>

        </section>
    )
}

export default UserEditScreen

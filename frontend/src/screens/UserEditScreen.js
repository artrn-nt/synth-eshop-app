import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { Formik, Form, Field } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_DETAILS_RESET, USER_UPDATE_RESET } from '../constants/userConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import SingleCheckboxField from '../components/utilities/SingleCheckboxField'
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
        if (!loadingDetails && !errorDetails) {

            if (user.constructor === Object && Object.entries(user).length !== 0) {
                setUsername(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
            }

            gsap.fromTo('.user-edit-form-container', {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })

        }
    }, [loadingDetails, errorDetails, user])

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            history.push('/admin/userslist')
        }
    }, [dispatch, history, successUpdate])

    return (
        <section className='user-edit-section'>

            <ScreenTitle title='User edit' />

            <div className={loadingDetails || loadingUpdate || errorDetails || errorUpdate ? 'user-edit-main-col ctr' : 'user-edit-main-col str'}>

                {loadingDetails || loadingUpdate ? <Spinner /> :
                    errorDetails || errorUpdate ? <ErrorMsg message={errorDetails || errorUpdate} /> :
                        <Formik
                            initialValues={{
                                username: user.name ? user.name : '',
                                email: user.email ? user.email : '',
                                isAdmin: user.isAdmin ? user.isAdmin : false
                            }}
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
                                        </div>

                                        <SingleCheckboxField
                                            value='isAdmin'
                                            checked={values.isAdmin}
                                            onClickHandler={(val) => {
                                                setIsAdmin(!values.isAdmin)
                                                return !val
                                            }}
                                            textTrue='Admin'
                                            textFalse='Not admin'
                                        />


                                        <ActionBtn
                                            type='submit'
                                            className='edit-user-btn'
                                            disabled={isSubmitting}
                                        >
                                            Edit user
                                        </ActionBtn>

                                    </Form>

                                    <ActionLink
                                        path='/admin/userslist'
                                        className='cancel-link'
                                    >
                                        Cancel
                                    </ActionLink>

                                </div>
                            )}

                        </Formik>}

            </div>

        </section>
    )
}

export default UserEditScreen

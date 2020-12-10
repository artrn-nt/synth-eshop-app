import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersList } from '../actions/userActions'
import ScreenTitle from '../components/utilities/ScreenTitle'
import { ActionLink, ActionBtn } from '../components/utilities/ActionBtnLink'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/UsersListScreen.scss'

const UsersListScreen = ({ history }) => {

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    console.log(userLogin)

    const usersList = useSelector(state => state.usersList)
    const { loading, error, users } = usersList

    // console.log(users)

    // useEffect(() => {
    //     if (!userInfo || !userInfo.isAdmin) history.push('/')
    // }, [userInfo, history])

    useEffect(() => {
        dispatch(getUsersList())
    }, [dispatch])

    const deleteHandler = (id) => {
        console.log('delete')
    }

    return (
        <section className='users-list-section'>

            <ScreenTitle title='Users list' />

            <div className={!userInfo || !userInfo.isAdmin || loading || error ? 'users-list-main-row ctr' : 'users-list-main-row str'}>

                {loading ? <Spinner /> :
                    error ? <ErrorMsg message={error} /> : (
                        <table className='users-list-table'>
                            <thead>
                                <tr>
                                    <th scope='col' colSpan='1' width='21.875%'>ID</th>
                                    <th scope='col' colSpan='1' width='21.875%'>NAME</th>
                                    <th scope='col' colSpan='1' width='21.875%'>EMAIL</th>
                                    <th scope='col' colSpan='1' width='21.875%'>ADMIN</th>
                                    <th scope='col' colSpan='1' width='6.25%'>Edit</th>
                                    <th scope='col' colSpan='1' width='6.25%'>Del</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                        <td>{user.isAdmin ?
                                            (<i className='fas fa-check-circle' style={{ color: 'seagreen' }} />) :
                                            (<i className='fas fa-times-circle' style={{ color: 'tomato' }} />)}
                                        </td>
                                        <td>
                                            <ActionLink
                                                to={`/user/${user._id}/edit`}
                                                className='edit-user-link'
                                            >
                                                <i className='fas fa-edit' />
                                            </ActionLink>
                                        </td>
                                        <td>
                                            <ActionBtn
                                                type='button'
                                                className='delete-user-btn'
                                                onClickHandler={() => deleteHandler(user._id)}
                                            >
                                                <i className='fas fa-trash' />
                                            </ActionBtn>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

            </div>

        </section>
    )
}

export default UsersListScreen

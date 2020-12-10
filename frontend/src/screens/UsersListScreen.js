import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { USERS_LIST_RESET } from '../constants/userConstants'
import { getUsersList, deleteUser } from '../actions/userActions'
import ScreenTitle from '../components/utilities/ScreenTitle'
import { ActionLink, ActionBtn } from '../components/utilities/ActionBtnLink'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/UsersListScreen.scss'

const UsersListScreen = ({ history }) => {

    const [eraseUser, setEraseUser] = useState(null)
    const [confirm, setConfirm] = useState(false)
    const [cancel, setCancel] = useState(null)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    // console.log(userLogin)

    const usersList = useSelector(state => state.usersList)
    const { loading, error, users } = usersList

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete

    // console.log(users)

    useEffect(() => {
        if (users && users.length !== 0)
            gsap.fromTo('.users-list-table', {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1.1,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })
    }, [users])

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(getUsersList())
        } else {
            history.push('/login')
        }

        return () => dispatch({ type: USERS_LIST_RESET })
    }, [userInfo, dispatch, history, successDelete])

    const deleteHandler = (id) => {
        dispatch(deleteUser(id))
        setEraseUser(null)
    }

    return (
        <section className='users-list-section'>

            <ScreenTitle title='Users list' />

            <div className={!userInfo && !userInfo.isAdmin || loading || error ? 'users-list-main-row ctr' : 'users-list-main-row str'}>

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
                                                path={`/admin/user/${user._id}/edit`}
                                                className='edit-user-link'
                                            >
                                                <i className='fas fa-edit' />
                                            </ActionLink>
                                        </td>
                                        <td>
                                            <ActionBtn
                                                type='button'
                                                className='delete-user-btn'
                                                // onClickHandler={() => deleteHandler(user._id)}
                                                onClickHandler={() => {
                                                    setEraseUser(user._id)
                                                    setConfirm(true)
                                                }}
                                            >
                                                <i className='fas fa-trash' />
                                            </ActionBtn>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                {eraseUser && (
                    <div
                        className={confirm ? 'confirm-alert fade-in' : 'confirm-alert fade-out'}
                        onAnimationEnd={() => {
                            if (cancel !== null && cancel) {
                                setCancel(null)
                                setEraseUser(null)
                            }
                            else if (cancel !== null && !cancel) {
                                setCancel(null)
                                deleteHandler(eraseUser)
                            }
                        }}>
                        <span>Are you sure?</span>
                        <div className='btns-row'>
                            <ActionBtn
                                type='button'
                                className='confirm-btn-admin'
                                onClickHandler={() => {
                                    setConfirm(false)
                                    setCancel(true)
                                }}
                                text='Cancel' />
                            <ActionBtn
                                type='button'
                                className='confirm-btn-admin'
                                onClickHandler={() => {
                                    setConfirm(false)
                                    setCancel(false)
                                }}
                                text='Confirm' />
                        </div>
                    </div>
                )}

            </div>

        </section>
    )
}

export default UsersListScreen

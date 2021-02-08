import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { USERS_LIST_RESET } from '../constants/userConstants'
import { getUsersList, deleteUser } from '../actions/userActions'
import ScreenTitle from '../components/utilities/ScreenTitle'
import AdminConfirmAlert from '../components/utilities/AdminConfirmAlert'
import { ActionLink, ActionBtn } from '../components/utilities/ActionBtnLink'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/UsersListScreen.scss'

const UsersListScreen = ({ history }) => {

    const [objectID, setObjectID] = useState(null)
    const [confirm, setConfirm] = useState(false)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const usersList = useSelector(state => state.usersList)
    const { loading, error, users } = usersList

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete

    useEffect(() => {
        if (users && users.length !== 0) {
            gsap.fromTo(['.users-list-table', '.stats-row'], {
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
    }, [users])

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) dispatch(getUsersList())
        else history.push('/login')

        return () => dispatch({ type: USERS_LIST_RESET })
    }, [userInfo, dispatch, history, successDelete])

    // Delete user handlers - confirm alert
    const confirmHandler = (bool) => {
        setConfirm(bool)
    }

    const objectIDHandler = (ID) => {
        setObjectID(ID)
    }

    const actionHandler = (ID) => {
        dispatch(deleteUser(ID))
        setObjectID(null)
    }

    return (
        <section className='users-list-section'>

            <ScreenTitle title='Admin - Users list' />

            <div className='users-list-main-row'>

                {loading ? <Spinner /> :
                    error ? <ErrorMsg message={error} /> : (
                        <>
                            {users.length !== 0 && <div className='stats-row'>
                                <div className='stats-card'>
                                    <i className='fas fa-users' />
                                    <span>
                                        Total number of users: {users.length}
                                    </span>
                                </div>
                            </div>}
                            <table className='users-list-table'>
                                <thead>
                                    <tr>
                                        <th scope='col' width='25.667%'>USER ID</th>
                                        <th scope='col' width='25.667%'>NAME</th>
                                        <th scope='col' width='25.667%'>EMAIL</th>
                                        <th scope='col' width='11.5%'>ADMIN</th>
                                        <th scope='col' width='5.75%'>EDIT</th>
                                        <th scope='col' width='5.75%'>DEL</th>
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
                                                    onClickHandler={() => {
                                                        objectIDHandler(user._id)
                                                        confirmHandler(true)
                                                    }}
                                                >
                                                    <i className='fas fa-trash' />
                                                </ActionBtn>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                {objectID && <AdminConfirmAlert
                    objectID={objectID}
                    confirm={confirm}
                    objectIDHandler={objectIDHandler}
                    confirmHandler={confirmHandler}
                    actionHandler={actionHandler}
                    text='Delete user'
                />}

            </div>

        </section>
    )
}

export default UsersListScreen

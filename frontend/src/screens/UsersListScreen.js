import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { USERS_LIST_RESET } from '../constants/userConstants'
import { getUsersList, deleteUser } from '../actions/userActions'
import ScreenTitle from '../components/utilities/ScreenTitle'
import DeleteConfirm from '../components/utilities/DeleteConfirm'
import { ActionLink, ActionBtn } from '../components/utilities/ActionBtnLink'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/UsersListScreen.scss'

const UsersListScreen = ({ history }) => {

    const [eraseId, setEraseId] = useState(null)
    const [confirm, setConfirm] = useState(false)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    // console.log(userLogin)

    const usersList = useSelector(state => state.usersList)
    const { loading, error, users } = usersList
    // console.log(users)

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete

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
        if (userInfo && userInfo.isAdmin) dispatch(getUsersList())
        else history.push('/')

        return () => dispatch({ type: USERS_LIST_RESET })
    }, [userInfo, dispatch, history, successDelete])

    const confirmHandler = (bool) => {
        setConfirm(bool)
    }

    const eraseIdHandler = (id) => {
        setEraseId(id)
    }

    const deleteHandler = (id) => {
        dispatch(deleteUser(id))
        setEraseId(null)
    }

    return (
        <section className='users-list-section'>

            <ScreenTitle title='Admin - Users list' />

            <div className={!userInfo || !userInfo.isAdmin || loading || error ? 'users-list-main-row ctr' : 'users-list-main-row str'}>

                {loading ? <Spinner /> :
                    error ? <ErrorMsg message={error} /> : (
                        <table className='users-list-table'>
                            <thead>
                                <tr>
                                    <th scope='col' colSpan='1' width='25.667%'>ID</th>
                                    <th scope='col' colSpan='1' width='25.667%'>NAME</th>
                                    <th scope='col' colSpan='1' width='25.667%'>EMAIL</th>
                                    <th scope='col' colSpan='1' width='11.5%'>ADMIN</th>
                                    <th scope='col' colSpan='1' width='5.75%'>Edit</th>
                                    <th scope='col' colSpan='1' width='5.75%'>Del</th>
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
                                                    eraseIdHandler(user._id)
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
                    )}

                {eraseId && <DeleteConfirm
                    eraseId={eraseId}
                    confirm={confirm}
                    eraseIdHandler={eraseIdHandler}
                    confirmHandler={confirmHandler}
                    deleteHandler={deleteHandler}
                    text='Delete this user'
                />}

            </div>

        </section>
    )
}

export default UsersListScreen

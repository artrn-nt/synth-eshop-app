import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, deleteProduct } from '../actions/productActions'
import { PRODUCTS_LIST_RESET } from '../constants/productConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import DeleteConfirm from '../components/utilities/DeleteConfirm'
import { ActionLink, ActionBtn } from '../components/utilities/ActionBtnLink'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/ProductsListScreen.scss'

const ProductsListScreen = ({ history }) => {

    const [eraseId, setEraseId] = useState(null)
    const [confirm, setConfirm] = useState(false)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productsList = useSelector(state => state.productsList)
    const { loading, error, products } = productsList

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    // console.log(products)

    useEffect(() => {
        return () => dispatch({ type: PRODUCTS_LIST_RESET })
    }, [dispatch])

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            history.push('/login')
        } else {
            dispatch(listProducts())
        }
    }, [dispatch, history, userInfo, successDelete])

    // useEffect(() => {
    //     if (users && users.length !== 0)
    //         gsap.fromTo('.users-list-table', {
    //             opacity: 0,
    //             y: 38
    //         }, {
    //             delay: .15,
    //             duration: 1.1,
    //             opacity: 1,
    //             y: 0,
    //             ease: 'power3.out'
    //         })
    // }, [users])

    const confirmHandler = (bool) => {
        setConfirm(bool)
    }

    const eraseIdHandler = (id) => {
        setEraseId(id)
    }

    const deleteHandler = (id) => {
        dispatch(deleteProduct(id))
        setEraseId(null)
    }

    const createHandler = () => {
        // CREATE PRODUCT
    }

    return (
        <section className='products-list-section'>

            <ScreenTitle title='Admin - Products list' />

            <div className={!userInfo && !userInfo.isAdmin || loading || error ? 'products-list-main-col ctr' : 'products-list-main-col str'}>

                {loading ? <Spinner /> :
                    error ? <ErrorMsg message={error} /> :

                        <>

                            <div className='create-btn-row'>
                                <ActionBtn
                                    type='button'
                                    className='create-product-btn'
                                    onClickHandler={createHandler}
                                    text='Create product'
                                >
                                    <i className='fas fa-plus-circle' />
                                </ActionBtn>
                            </div>

                            <table className='products-list-table'>
                                <thead>
                                    <tr>
                                        <th scope='col' colSpan='1' width='22%'>ID</th>
                                        <th scope='col' colSpan='1' width='22%'>NAME</th>
                                        <th scope='col' colSpan='1' width='12.5%'>PRICE</th>
                                        <th scope='col' colSpan='1' width='12.5%'>CATEGORY</th>
                                        <th scope='col' colSpan='1' width='12.5%'>BRAND</th>
                                        <th scope='col' colSpan='1' width='7.5%'>Stock</th>
                                        <th scope='col' colSpan='1' width='5.5%'>Edit</th>
                                        <th scope='col' colSpan='1' width='5.5%'>Del</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td>{product._id}</td>
                                            <td>{product.name}</td>
                                            <td>€{product.price.toFixed(2)}</td>
                                            <td>{product.category}</td>
                                            <td>{product.brand}</td>
                                            <td
                                                style={{
                                                    color: product.countInStock <= 3 && 'brown',
                                                    fontWeight: product.countInStock <= 3 && 600
                                                }}
                                            >
                                                {product.countInStock}
                                            </td>
                                            <td>
                                                <ActionLink
                                                    path={`/admin/product/${product._id}/edit`}
                                                    className='edit-product-link'
                                                >
                                                    <i className='fas fa-edit' />
                                                </ActionLink>
                                            </td>
                                            <td>
                                                <ActionBtn
                                                    type='button'
                                                    className='delete-product-btn'
                                                    onClickHandler={() => {
                                                        eraseIdHandler(product._id)
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
                        </>}

                {eraseId && <DeleteConfirm
                    eraseId={eraseId}
                    confirm={confirm}
                    eraseIdHandler={eraseIdHandler}
                    confirmHandler={confirmHandler}
                    deleteHandler={deleteHandler}
                    text='Delete this product'
                />}

            </div>

        </section>
    )
}

export default ProductsListScreen

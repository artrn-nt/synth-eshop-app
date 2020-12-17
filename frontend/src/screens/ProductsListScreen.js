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

    const [showWarning, setShowWarning] = useState(false)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productsList = useSelector(state => state.productsList)
    const { loading, error, products } = productsList

    const productDelete = useSelector(state => state.productDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = productDelete

    useEffect(() => {
        return () => dispatch({ type: PRODUCTS_LIST_RESET })
    }, [dispatch])

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) history.push('/login')

        dispatch(listProducts())

    }, [dispatch, history, userInfo, successDelete])

    useEffect(() => {
        if (!loading && !error && products && products.length !== 0)
            gsap.fromTo(['.create-link-row', '.products-list-table'], {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1.1,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })
    }, [loading, error, products])

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

    return (
        <section className='products-list-section'>

            <ScreenTitle title='Admin - Products list' />

            <div className={!userInfo || !userInfo.isAdmin ||
                loading || loadingDelete || error || errorDelete ? 'products-list-main-col ctr' : 'products-list-main-col str'}>

                {loading || loadingDelete ? <Spinner /> :
                    error || errorDelete ? <ErrorMsg message={error || errorDelete} /> :

                        <>

                            <div className='create-link-row'>
                                <ActionLink
                                    path={`/admin/product/create`}
                                    className='create-product-link'
                                >
                                    <i className='fas fa-plus-circle' />
                                    Create product
                                </ActionLink>
                            </div>

                            <table className='products-list-table'>
                                <thead>
                                    <tr>
                                        <th scope='col' width='18%'>ID</th>
                                        <th scope='col' width='18%'>NAME</th>
                                        <th scope='col' width='10.833%'>BRAND</th>
                                        <th scope='col' width='10.833%'>CATEGORIES</th>
                                        <th scope='col' width='10.833%'>PRICE</th>
                                        <th scope='col' width='10.5%'>
                                            {products.some(p => p.countInStock === 0) ?
                                                <>
                                                    <span className='stock-warn' onClick={() => setShowWarning(prevState => !prevState)}>
                                                        STOCK
                                                        <i className='fas fa-exclamation-circle' />
                                                    </span>
                                                    {showWarning && <ul className='out-of-stock-products'>
                                                        <span>Out of stock</span>
                                                        {products.map(product => product.countInStock === 0 && <li key={product._id}>{product.name}</li>)}
                                                    </ul>}
                                                </> :
                                                'STOCK'}
                                        </th>
                                        <th scope='col' width='10.5%'>PUBLISHED</th>
                                        <th scope='col' width='5.25%'>EDIT</th>
                                        <th scope='col' width='5.25%'>DEL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td>{product._id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.brand}</td>
                                            <td>
                                                <ul>
                                                    <li>{product.categories.synthesis}</li>
                                                    <li>{product.categories.voiceType}</li>
                                                    {product.categories.semiModular && <li>Semi-modular</li>}
                                                    {product.categories.desktop && <li>Desktop</li>}
                                                </ul>
                                            </td>
                                            <td>€{product.price.toFixed(2)}</td>
                                            <td
                                                style={{
                                                    color: product.countInStock <= 3 && 'brown',
                                                    fontWeight: product.countInStock <= 3 && 600
                                                }}
                                            >
                                                {product.countInStock}
                                            </td>
                                            <td>{product.isPublished ?
                                                (<i className='fas fa-check-circle' style={{ color: 'seagreen' }} />) :
                                                (<i className='fas fa-times-circle' style={{ color: 'tomato' }} />)
                                            }</td>
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

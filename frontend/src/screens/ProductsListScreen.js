import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, deleteProduct } from '../actions/productActions'
import { PRODUCTS_LIST_RESET } from '../constants/productConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import AdminConfirmAlert from '../components/utilities/AdminConfirmAlert'
import { ActionLink, ActionBtn } from '../components/utilities/ActionBtnLink'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/ProductsListScreen.scss'

// const StockWarning = ({ setShowWarning }) => {
//     return (
//         <div className='stock-warning-list'>
//             <span className='stock-warn' onClick={() => setShowWarning(prevState => !prevState)}>
//                 STOCK
//                 <i className='fas fa-exclamation-circle' />
//             </span>
//             {showWarning && <ul className='out-of-stock-products'>
//                 <span>Out of stock</span>
//                 {products.map(product => product.countInStock === 0 && <li key={product._id}>{product.name}</li>)}
//             </ul>}
//         </div> 
//     )
// }

const FilterList = ({ title, showFilterListHandler, showFilterList, items }) => {
    return (
        <>
            <span className={`th-${title.toLowerCase()}-title`} onClick={showFilterListHandler}>
                {title}
                <i className='fas fa-filter' />
            </span>
            {showFilterList && <div className='filter-list-container'>
                <ul>
                    {items.map((item, index) => <li key={index} className='filter-item'>{item}</li>)}
                </ul>
            </div>}
        </>
    )
}

const ProductsListScreen = ({ history }) => {

    const [objectID, setObjectID] = useState(null)
    const [confirm, setConfirm] = useState(false)

    const [showWarning, setShowWarning] = useState(false)

    const [brandFilterList, setBrandFilterList] = useState({
        isActive: false,
        items: []
    })
    const [categoriesFilterList, setCategoriesFilterList] = useState({
        isActive: false,
        items: []
    })
    console.log(brandFilterList)
    // console.log(categoriesFilterList)

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
        if (!loading && !error && products && products.length !== 0) {
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

            const brandArr = []
            // const categoriesArrTemp = []
            // const categoriesArr = []

            for (let p of products) {
                brandArr.push(Object.entries(p).filter(entry => entry[0] === 'brand').flat()[1])
                // categoriesArrTemp.push(Object.entries(Object.entries(p).filter(entry => entry[0] === 'categories').flat()[1])
                //     .filter((entry, index) => index === 0 || index === 1).flat()
                //     .filter((item, index) => index % 2))
            }

            // for (let arr of categoriesArrTemp) {
            //     arr.forEach(str => categoriesArr.push(str))
            // }

            setBrandFilterList({
                isActive: false,
                items: [...new Set(brandArr)]
            })

            // setCategoriesFilterList({
            //     isActive: false,
            //     items: [...new Set(categoriesArr)]
            // })

        }
    }, [loading, error, products])

    // Delete product handlers - confirm alert
    const confirmHandler = (bool) => {
        setConfirm(bool)
    }

    const objectIDHandler = (ID) => {
        setObjectID(ID)
    }

    const actionHandler = (ID) => {
        dispatch(deleteProduct(ID))
        setObjectID(null)
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
                                        <th scope='col' width='18%'>PRODUCT ID</th>
                                        <th scope='col' width='18%'>NAME</th>
                                        <th scope='col' width='10.833%'>
                                            <FilterList
                                                title='BRAND'
                                                showFilterListHandler={() => setBrandFilterList(prevState => ({
                                                    ...prevState,
                                                    isActive: !prevState.isActive
                                                }))}
                                                showFilterList={brandFilterList.isActive}
                                                items={brandFilterList.items}
                                            />
                                        </th>
                                        <th scope='col' width='10.833%'>
                                            {/* <FilterList
                                                title='CATEGORIES'
                                                showFilterListHandler={() => setCategoriesFilterList(prevState => ({
                                                    ...prevState,
                                                    isActive: !prevState
                                                }))}
                                                showFilterList={categoriesFilterList.isActive}
                                                items={categoriesFilterList.items}
                                            /> */}
                                        </th>
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
                                                        objectIDHandler(product._id)
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

                {objectID && <AdminConfirmAlert
                    objectID={objectID}
                    confirm={confirm}
                    objectIDHandler={objectIDHandler}
                    confirmHandler={confirmHandler}
                    actionHandler={actionHandler}
                    text='Delete product'
                />}

            </div>

        </section>
    )
}

export default ProductsListScreen

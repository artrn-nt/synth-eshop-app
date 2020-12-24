import React, { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, deleteProduct } from '../actions/productActions'
import { PRODUCTS_LIST_RESET } from '../constants/productConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import ProductsFilter from '../components/utilities/ProductsFilter'
import AdminConfirmAlert from '../components/utilities/AdminConfirmAlert'
import { ActionBtn, ActionLink } from '../components/utilities/ActionBtnLink'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/ProductsListScreen.scss'

const ProductTableRow = ({ id, name, image, brand, categories, price, countInStock, isPublished, objectIDHandler, confirmHandler }) => {

    const [showProductImage, setShowProductImage] = useState(false)

    return (
        <tr>
            <td>{id}</td>
            <td
                onMouseEnter={() => setShowProductImage(true)}
                onMouseLeave={() => setShowProductImage(false)}
            >
                {showProductImage ?
                    <div className='product-pic'>
                        <img src={image} alt={name} />
                    </div> :
                    name}
            </td>
            <td>{brand}</td>
            <td>
                <ul>
                    <li>{categories.synthesis}</li>
                    <li>{categories.voiceType}</li>
                    {categories.semiModular && <li>Semi-modular</li>}
                    {categories.desktop && <li>Desktop</li>}
                </ul>
            </td>
            <td>€{price.toFixed(2)}</td>
            <td
                style={{
                    color: countInStock <= 2 && 'brown',
                    fontWeight: countInStock <= 2 && 600
                }}
            >
                {countInStock === 0 ? 'Out of stock' : countInStock}
            </td>
            <td>{isPublished ?
                (<i className='fas fa-check-circle' style={{ color: 'seagreen' }} />) :
                (<i className='fas fa-times-circle' style={{ color: 'tomato' }} />)}
            </td>
            <td>
                <ActionLink
                    path={`/admin/product/${id}/edit`}
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
                        objectIDHandler(id)
                        confirmHandler(true)
                    }}
                >
                    <i className='fas fa-trash' />
                </ActionBtn>
            </td>
        </tr>
    )
}

const ProductsListScreen = ({ history }) => {

    const [products, setProducts] = useState([])
    const [brands, setBrands] = useState([])
    const [touchedFilter, setTouchedFilter] = useState(null)

    const [objectID, setObjectID] = useState(null)
    const [confirm, setConfirm] = useState(false)

    const productsListContainerRef = useRef(null)
    const [productsListContainerHeight, setProductsListContainerHeight] = useState(null)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productsList = useSelector(state => state.productsList)
    const { loading, error, products: allProducts } = productsList

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
        if (!loading && !error && allProducts && allProducts.length !== 0) {

            const brandArr = []

            for (let p of allProducts) {
                brandArr.push(Object.entries(p).filter(entry => entry[0] === 'brand').flat()[1])
            }

            setBrands([...new Set(brandArr)])
            setProducts(allProducts)

            gsap.fromTo('.products-list-container', {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })

            gsap.fromTo('.products-list-table', {
                opacity: 0
            }, {
                delay: .15,
                duration: 1,
                opacity: 1,
                ease: 'power3.out'
            })

        }
    }, [loading, error, allProducts])

    useEffect(() => {
        if (products.length !== 0 && touchedFilter === null && productsListContainerRef.current !== null) {

            setProductsListContainerHeight(productsListContainerRef.current.clientHeight)

        } else if (products.length !== 0 && touchedFilter) {

            gsap.fromTo('.products-list-table', {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: .75,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })

        } else if (products.length === 0 && touchedFilter) {

            gsap.fromTo('.no-product-filter', {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: .75,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })

        }

    }, [products, touchedFilter])

    // Filter products handler
    const productsFilterHandler = useCallback((type, criteria) => {
        setTouchedFilter(true)
        if (type === 'Indifferent') {
            setProducts(allProducts)
        } else if (type === 'Brand') {
            setProducts(allProducts.filter(p => p.brand === criteria))
        } else if (type === 'Categories') {
            gsap.to('.products-list-table', { opacity: 0, duration: 0 })
            setProducts(allProducts.filter(p => {
                if (criteria.synthesis !== null && criteria.voiceType === null) {
                    return JSON.stringify(p.categories) === JSON.stringify({
                        synthesis: criteria.synthesis,
                        voiceType: p.categories.voiceType,
                        semiModular: criteria.semiModular,
                        desktop: criteria.desktop
                    })
                } else if (criteria.voiceType !== null && criteria.synthesis === null) {
                    return JSON.stringify(p.categories) === JSON.stringify({
                        synthesis: p.categories.synthesis,
                        voiceType: criteria.voiceType,
                        semiModular: criteria.semiModular,
                        desktop: criteria.desktop
                    })
                } else if (criteria.synthesis !== null && criteria.voiceType !== null) {
                    return JSON.stringify(p.categories) === JSON.stringify(criteria)
                } else if (criteria.synthesis === null && criteria.voiceType === null && criteria.semiModular && !criteria.desktop) {
                    return p.categories.semiModular && !p.categories.desktop
                } else if (criteria.synthesis === null && criteria.voiceType === null && !criteria.semiModular && criteria.desktop) {
                    return p.categories.desktop && !p.categories.semiModular
                } else if (criteria.synthesis === null && criteria.voiceType === null && criteria.semiModular && criteria.desktop) {
                    return p.categories.semiModular && p.categories.desktop
                } else if (criteria.synthesis === null && criteria.voiceType === null && !criteria.semiModular && !criteria.desktop) {
                    return !p.categories.semiModular && !p.categories.desktop
                } else return null

            }))
        } else if (type === 'Out of stock') {
            setProducts(allProducts.filter(p => p.countInStock === 0))
        }
    }, [allProducts])

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
                loading || loadingDelete ||
                error || errorDelete ? 'products-list-main-col ctr' : 'products-list-main-col str'}>

                {loading || loadingDelete ? <Spinner /> :
                    error || errorDelete ? <ErrorMsg message={error || errorDelete} /> :

                        <div className='products-list-container' style={{ minHeight: `${productsListContainerHeight}px` }} ref={productsListContainerRef}>

                            <div className='create-link-row'>
                                <ActionLink
                                    path={`/admin/product/create`}
                                    className='create-product-link'
                                >
                                    <i className='fas fa-plus-circle' />
                                    Create product
                                </ActionLink>
                            </div>

                            <ProductsFilter
                                brands={brands}
                                outOfStock
                                productsFilterHandler={productsFilterHandler}
                            />

                            {products.length === 0 && touchedFilter ?
                                <p className='no-product-filter'>- No product found matching your filter criterias -</p> :
                                <table className='products-list-table'>
                                    <thead>
                                        <tr>
                                            <th scope='col' width='11%'>PRODUCT ID</th>
                                            <th scope='col' width='18%'>NAME</th>
                                            <th scope='col' width='13%'>BRAND</th>
                                            <th scope='col' width='13%'>CATEGORIES</th>
                                            <th scope='col' width='11.5%'>PRICE</th>
                                            <th scope='col' width='11.5%'>STOCK</th>
                                            <th scope='col' width='11.5%'>PUBLISHED</th>
                                            <th scope='col' width='5.25%'>EDIT</th>
                                            <th scope='col' width='5.25%'>DEL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <ProductTableRow
                                                key={product._id}
                                                id={product._id}
                                                name={product.name}
                                                image={product.image}
                                                brand={product.brand}
                                                categories={product.categories}
                                                price={product.price}
                                                countInStock={product.countInStock}
                                                isPublished={product.isPublished}
                                                objectIDHandler={objectIDHandler}
                                                confirmHandler={confirmHandler}
                                            />
                                        ))}
                                    </tbody>
                                </table>}

                        </div>}

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
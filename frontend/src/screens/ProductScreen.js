import React, { useState, useEffect } from 'react'
import { Route,  useRouteMatch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import { PRODUCTS_LIST_RESET } from '../constants/productConstants'
import { CART_ADD_RESET } from '../constants/cartConstants'
import ProductsNav from '../components/ProductScreen/ProductsNav'
import ProductDetails from '../components/ProductScreen/ProductDetails'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import '../scss/screens/ProductScreen.scss'

const ProductScreen = () => {

    const { url } = useRouteMatch()
    const dispatch = useDispatch()

    const productsList = useSelector(state => state.productsList)
    const { loading, error, products } = productsList 

    const [productsIds, setProductsIds] = useState([])

    const sortProductsByName = (productsArr) => {
        const productsArrCopy = [...productsArr]
        return productsArrCopy.sort((p1, p2) => {
            const p1Name = p1.name.toLowerCase(), p2Name = p2.name.toLowerCase()
            if (p1Name < p2Name) return -1
            if (p1Name > p2Name) return 1
            return 0
        })
    }

    useEffect(() => {
        dispatch(listProducts())

        return () => {
            dispatch({ type: CART_ADD_RESET })
            dispatch({ type: PRODUCTS_LIST_RESET })
        }
    }, [dispatch])

    useEffect(() => {
        if (typeof products !== 'undefined' && products.length !== 0) {
            setProductsIds([].concat.apply([], sortProductsByName(products).map(p => Object.entries(p).filter(entry => entry[0] === '_id').map(item => item[1]))))
        }
    }, [products])

    return (
        <section className='product-section'>
            {loading || productsIds.length === 0 ? <Spinner /> :
                error ? <ErrorMsg message={error} /> :
                <>
                    <ProductsNav ids={productsIds} />
                    <Route path={`${url}/:id`} render={(props) => <ProductDetails {...props} products={products} />} />
                </>}
        </section>
    )
}

export default ProductScreen
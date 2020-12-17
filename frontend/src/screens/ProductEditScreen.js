import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_DETAILS_RESET, PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import { ActionBtn, ActionLink } from '../components/utilities/ActionBtnLink'
import '../scss/screens/ProductEditScreen.scss'

const ProductEditScreen = ({ match, history }) => {

    const productId = match.params.id

    const [state, setState] = useState({
        userId: '',
        name: '',
        price: 0,
        imageURL: '',
        category: '',
        brand: '',
        countInStock: 0,
        description_m: '',
        features: [],
        uploading: false
    })
    console.log(state)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productDetails = useSelector(state => state.productDetails)
    const { loading: loadingDetails, error: errorDetails, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate

    useEffect(() => {
        return () => dispatch({ type: PRODUCT_DETAILS_RESET })
    }, [dispatch])

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) history.push('/login')
        else dispatch(listProductDetails(match.params.id))
    }, [dispatch, history, match, userInfo])

    useEffect(() => {
        if (!loadingDetails && !errorDetails) {
            if (product.constructor === Object && Object.entries(product).length !== 0) {
                // console.log(product)
                setState({
                    userId: product.user,
                    name: product.name,
                    price: product.price,
                    imageURL: product.image,
                    category: product.category,
                    brand: product.brand,
                    countInStock: product.countInStock,
                    description_m: product.description_m,
                    features: product.features
                })
            }
        }
    }, [loadingDetails, errorDetails, product])

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            history.push('/admin/productslist')
        }
    }, [successUpdate, dispatch, history])

    useEffect(() => {
        if (!loadingDetails && !errorDetails) {
            gsap.fromTo('.product-edit-form-container', {
                opacity: 0,
                y: 38
            }, {
                delay: .15,
                duration: 1.1,
                opacity: 1,
                y: 0,
                ease: 'power3.out'
            })
        }
    }, [loadingDetails, errorDetails])

    const uploadFileHandler = async (ev) => {
        const file = ev.target.files[0]
        const formData = new FormData()

        formData.append('image', file)

        setState(prevState => ({
            ...prevState,
            uploading: true
        }))

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/uploads', formData, config)

            setState(prevState => ({
                ...prevState,
                imageURL: data,
                uploading: false
            }))

        } catch (error) {
            console.error(error)

            setState(prevState => ({
                ...prevState,
                uploading: false
            }))
        }
    }

    return (
        <section className='product-edit-section'>

            <ScreenTitle title='Admin - Edit product' />

            <div className={loadingDetails || loadingUpdate || errorDetails || errorUpdate ? 'product-edit-main-col ctr' : 'product-edit-main-col str'}>

                {loadingDetails ? <Spinner /> :
                    errorDetails ? <ErrorMsg message={errorDetails || errorUpdate} /> :
                        <Formik
                            initialValues={{
                                userId: product.user ? product.user : '',
                                name: product.name ? product.name : '',
                                price: product.price ? product.price : 0,
                                category: product.category ? product.category : '',
                                brand: product.brand ? product.brand : '',
                                countInStock: product.countInStock ? product.countInStock : 0,
                                description_m: product.description_m ? product.description_m : '',
                                features: product.features ? product.features : [],
                                imageURL: product.image ? product.image : ''
                            }}
                            initialErrors={{
                                userId: '',
                                name: '',
                                price: 0,
                                category: '',
                                brand: '',
                                countInStock: 0,
                                description_m: '',
                                // features: [],
                                imageURL: ''
                            }}
                            validationSchema={yup.object({
                                userId: yup.string()
                                    .trim(),
                                // .min(5, 'Username must be at least 5 characters long')
                                // .max(24, 'Username must be less than 25 characters long')
                                // .matches(/^[A-Za-z0-9\-_]+$/, 'Username is not valid, special characters (except hyphen and underscore) and spaces are not allowed')
                                // .required('Username is required'),
                                name: yup.string()
                                    .trim(),
                                price: yup.string()
                                    .trim(),
                                category: yup.string()
                                    .trim(),
                                brand: yup.string()
                                    .trim(),
                                countInStock: yup.string()
                                    .trim(),
                                description_m: yup.string()
                                    .trim(),
                                image: yup.string()
                                    .trim(),
                                // .lowercase()
                                // .email('Invalid email address')
                                // .required('Email is required'),
                            })}
                            onSubmit={() => dispatch(updateProduct({
                                _id: productId,
                                user: state.userId,
                                name: state.name,
                                price: state.price,
                                category: state.category,
                                brand: state.brand,
                                countInStock: state.countInStock,
                                description_m: state.description_m,
                                features: state.features,
                                image: state.imageURL
                            }))}
                        >
                            {({ isSubmitting, handleChange, handleSubmit, setFieldValue }) => (
                                <div className='product-edit-form-container'>
                                    <Form
                                        name='product-edit'
                                        method='post'
                                        onSubmit={handleSubmit}
                                    >
                                        <div className='field-control'>
                                            <label htmlFor='userId'>Created / Edited by user</label>
                                            <Field
                                                type='text'
                                                name='userId'
                                                id='userId'
                                                autoComplete='off'
                                                placeholder='Enter your user id'
                                                value={state.userId}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setState(prevState => ({
                                                        ...prevState,
                                                        userId: ev.target.value
                                                    }))
                                                }}
                                            />
                                            <ErrorMessage
                                                name='userId'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        <div className='field-control'>
                                            <label htmlFor='name'>Name</label>
                                            <Field
                                                type='text'
                                                name='name'
                                                id='name'
                                                autoComplete='off'
                                                placeholder='Enter product name'
                                                value={state.name}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setState(prevState => ({
                                                        ...prevState,
                                                        name: ev.target.value
                                                    }))
                                                }}
                                            />
                                            <ErrorMessage
                                                name='name'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        <div className='field-control'>
                                            <label htmlFor='price'>Price</label>
                                            <Field
                                                type='text'
                                                name='price'
                                                id='price'
                                                autoComplete='off'
                                                placeholder='Enter product price'
                                                value={state.price}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setState(prevState => ({
                                                        ...prevState,
                                                        price: ev.target.value
                                                    }))
                                                }}
                                            />
                                            <ErrorMessage
                                                name='price'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        <div className='field-control'>
                                            <label htmlFor='category'>Category</label>
                                            <Field
                                                type='text'
                                                name='category'
                                                id='category'
                                                autoComplete='off'
                                                placeholder='Enter product category'
                                                value={state.category}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setState(prevState => ({
                                                        ...prevState,
                                                        category: ev.target.value
                                                    }))
                                                }}
                                            />
                                            <ErrorMessage
                                                name='category'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        <div className='field-control'>
                                            <label htmlFor='brand'>Brand</label>
                                            <Field
                                                type='text'
                                                name='brand'
                                                id='brand'
                                                autoComplete='off'
                                                placeholder='Enter product brand'
                                                value={state.brand}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setState(prevState => ({
                                                        ...prevState,
                                                        brand: ev.target.value
                                                    }))
                                                }}
                                            />
                                            <ErrorMessage
                                                name='brand'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        <div className='field-control'>
                                            <label htmlFor='countInStock'>Count in stock</label>
                                            <Field
                                                type='text'
                                                name='countInStock'
                                                id='countInStock'
                                                autoComplete='off'
                                                placeholder='Enter product countInStock'
                                                value={state.countInStock}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setState(prevState => ({
                                                        ...prevState,
                                                        countInStock: ev.target.value
                                                    }))
                                                }}
                                            />
                                            <ErrorMessage
                                                name='countInStock'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        <div className='field-control'>
                                            <label htmlFor='description_m'>Main description</label>
                                            <Field
                                                type='text'
                                                name='description_m'
                                                id='description_m'
                                                autoComplete='off'
                                                placeholder='Enter product main description'
                                                value={state.description_m}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setState(prevState => ({
                                                        ...prevState,
                                                        description_m: ev.target.value
                                                    }))
                                                }}
                                            />
                                            <ErrorMessage
                                                name='description_m'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        {/* <div className='form-group'> */}
                                        <div className='field-control'>
                                            <label htmlFor='imageURL'>image URL</label>
                                            <Field
                                                type='text'
                                                name='imageURL'
                                                id='imageURL'
                                                autoComplete='off'
                                                placeholder='Enter product image URL'
                                                value={state.imageURL}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setState(prevState => ({
                                                        ...prevState,
                                                        imageURL: ev.target.value
                                                    }))
                                                }}
                                            />
                                            <ErrorMessage
                                                name='imageURL'
                                                render={msg => <span className='form-err-msg'>{msg}</span>}
                                            />
                                        </div>

                                        {/* <div className='field-control'>
                                                <label htmlFor='imageFile'>Choose a file</label>
                                                <Field
                                                    type='file'
                                                    name='imageFile'
                                                    id='image-file'
                                                    onChange={(ev) => {
                                                        handleChange(ev)
                                                        // setFieldValue('file', ev.currentTarget.files[0])
                                                        // setFieldValue('file', ev.currentTarget.files[0])
                                                        uploadFileHandler(ev)
                                                    }}
                                                />
                                            </div> */}
                                        {/* </div> */}

                                        <ActionBtn
                                            type='submit'
                                            className='edit-product-btn'
                                            disabled={isSubmitting}
                                            text='Edit product'
                                        />

                                    </Form>

                                    <ActionLink
                                        path='/admin/productslist'
                                        className='go-back-link'
                                        text='Go back'
                                    />

                                </div>
                            )}

                        </Formik>}

            </div>

        </section>
    )
}

export default ProductEditScreen

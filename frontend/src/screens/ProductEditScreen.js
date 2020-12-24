import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
// import axios from 'axios'
import { Formik, Form, Field } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_DETAILS_RESET, PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import RadioInputField from '../components/utilities/RadioInputField'
import InputFieldArray from '../components/utilities/InputFieldArray'
import SingleCheckboxField from '../components/utilities/SingleCheckboxField'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import { ActionBtn, ActionLink } from '../components/utilities/ActionBtnLink'
import '../scss/screens/ProductEditScreen.scss'

const ProductEditScreen = ({ match, history }) => {

    const productID = match.params.id

    const [state, setState] = useState({
        userID: '',
        name: '',
        brand: '',
        categories: {
            synthesis: 'Analogue',
            voiceType: 'Monophonic',
            semiModular: false,
            desktop: false
        },
        price: 0,
        countInStock: 0,
        description_m: '',
        features: [],
        imageURL: '',
        isPublished: false,
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
                setState({
                    userID: product.user,
                    name: product.name,
                    brand: product.brand,
                    categories: product.categories,
                    price: product.price,
                    countInStock: product.countInStock,
                    description_m: product.description_m,
                    features: product.features,
                    imageURL: product.image,
                    isPublished: product.isPublished
                })
            }

            gsap.fromTo('.product-edit-form-container', {
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
    }, [loadingDetails, errorDetails, product])

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            history.push('/admin/productslist')
        }
    }, [successUpdate, dispatch, history])

    // Product features handlers
    const onChangeHandler = (ev, index) => {
        setState(prevState => {
            let featuresCopy = prevState.features
            featuresCopy[index] = ev.target.value

            return {
                ...prevState,
                features: featuresCopy
            }
        })
    }

    const onClickHandlerAddItem = () => {
        setState(prevState => {
            const currentFeatures = prevState.features
            return {
                ...prevState,
                features: [...currentFeatures, '']
            }
        })
    }

    const onClickHandlerRemoveItem = () => {
        setState(prevState => {
            let currentFeatures = prevState.features
            currentFeatures = currentFeatures.slice(0, currentFeatures.length - 1)

            return {
                ...prevState,
                features: currentFeatures
            }
        })
    }

    // const uploadFileHandler = async (ev) => {
    //     const file = ev.target.files[0]
    //     const formData = new FormData()

    //     formData.append('image', file)

    //     setState(prevState => ({
    //         ...prevState,
    //         uploading: true
    //     }))

    //     try {
    //         const config = {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         }

    //         const { data } = await axios.post('/api/uploads', formData, config)

    //         setState(prevState => ({
    //             ...prevState,
    //             imageURL: data,
    //             uploading: false
    //         }))

    //     } catch (error) {
    //         console.error(error)

    //         setState(prevState => ({
    //             ...prevState,
    //             uploading: false
    //         }))
    //     }
    // }

    return (
        <section className='product-edit-section'>

            <ScreenTitle title='Admin - Edit product' />

            <div className={loadingDetails || loadingUpdate || errorDetails || errorUpdate ? 'product-edit-main-col ctr' : 'product-edit-main-col str'}>

                {loadingDetails ? <Spinner /> :
                    errorDetails ? <ErrorMsg message={errorDetails || errorUpdate} /> :
                        <Formik
                            initialValues={{
                                userID: product.user ? product.user : '',
                                name: product.name ? product.name : '',
                                brand: product.brand ? product.brand : '',
                                synthesis: product.categories ? product.categories.synthesis : 'Analogue',
                                voiceType: product.categories ? product.categories.voiceType : 'Monophonic',
                                semiModular: product.categories ? product.categories.semiModular : false,
                                desktop: product.categories ? product.categories.desktop : false,
                                price: product.price ? product.price : 0,
                                countInStock: product.countInStock ? product.countInStock : 0,
                                description_m: product.description_m ? product.description_m : '',
                                features: product.features ? product.features : [],
                                imageURL: product.image ? product.image : '',
                                isPublished: product.isPublished ? product.isPublished : false
                            }}
                            onSubmit={() => dispatch(updateProduct({
                                _id: productID,
                                user: state.userID,
                                name: state.name,
                                brand: state.brand,
                                categories: state.categories,
                                price: state.price,
                                countInStock: state.countInStock,
                                description_m: state.description_m,
                                features: state.features,
                                image: state.imageURL,
                                isPublished: state.isPublished
                            }))}
                        >
                            {({ isSubmitting, values, errors, touched, handleChange, handleSubmit }) => (
                                <div className='product-edit-form-container'>
                                    <Form
                                        name='product-edit'
                                        method='post'
                                        onSubmit={handleSubmit}
                                    >
                                        <div className='field-control'>
                                            <label htmlFor='userID'>Created by user ID</label>
                                            <Field
                                                type='text'
                                                name='userID'
                                                id='userID'
                                                autoComplete='off'
                                                placeholder='Enter your user ID'
                                                value={state.userID}
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
                                        </div>

                                        <div className='form-group'>
                                            <label className='form-group-label'>Categories</label>
                                            <div className='form-group-row'>
                                                <div className='form-group-sub-col'>
                                                    <h4 className='col-title'>Synthesis</h4>
                                                    <RadioInputField
                                                        value='Analogue'
                                                        name='synthesis'
                                                        checked={values.synthesis === 'Analogue'}
                                                        onChangeHandler={(ev) => {
                                                            handleChange(ev)
                                                            setState(prevState => ({
                                                                ...prevState,
                                                                categories: {
                                                                    synthesis: ev.target.value,
                                                                    voiceType: prevState.categories.voiceType,
                                                                    semiModular: prevState.categories.semiModular,
                                                                    desktop: prevState.categories.desktop,
                                                                }
                                                            }))
                                                        }}
                                                        text='Analogue'
                                                    />

                                                    <RadioInputField
                                                        value='FM / Digital'
                                                        name='synthesis'
                                                        checked={values.synthesis === 'FM / Digital'}
                                                        onChangeHandler={(ev) => {
                                                            handleChange(ev)
                                                            setState(prevState => ({
                                                                ...prevState,
                                                                categories: {
                                                                    synthesis: ev.target.value,
                                                                    voiceType: prevState.categories.voiceType,
                                                                    semiModular: prevState.categories.semiModular,
                                                                    desktop: prevState.categories.desktop,
                                                                }
                                                            }))
                                                        }}
                                                        text='FM / Digital'
                                                    />

                                                    <RadioInputField
                                                        value='Hybrid'
                                                        name='synthesis'
                                                        checked={values.synthesis === 'Hybrid'}
                                                        onChangeHandler={(ev) => {
                                                            handleChange(ev)
                                                            setState(prevState => ({
                                                                ...prevState,
                                                                categories: {
                                                                    synthesis: ev.target.value,
                                                                    voiceType: prevState.categories.voiceType,
                                                                    semiModular: prevState.categories.semiModular,
                                                                    desktop: prevState.categories.desktop,
                                                                }
                                                            }))
                                                        }}
                                                        text='Hybrid'
                                                    />
                                                </div>

                                                <div className='form-group-sub-col'>
                                                    <h4 className='col-title'>Voice type</h4>
                                                    <RadioInputField
                                                        value='Monophonic'
                                                        name='voiceType'
                                                        checked={values.voiceType === 'Monophonic'}
                                                        onChangeHandler={(ev) => {
                                                            handleChange(ev)
                                                            setState(prevState => ({
                                                                ...prevState,
                                                                categories: {
                                                                    synthesis: prevState.categories.synthesis,
                                                                    voiceType: ev.target.value,
                                                                    semiModular: prevState.categories.semiModular,
                                                                    desktop: prevState.categories.desktop,
                                                                }
                                                            }))
                                                        }}
                                                        text='Monophonic'
                                                    />

                                                    <RadioInputField
                                                        value='Polyphonic'
                                                        name='voiceType'
                                                        checked={values.voiceType === 'Polyphonic'}
                                                        onChangeHandler={(ev) => {
                                                            handleChange(ev)
                                                            setState(prevState => ({
                                                                ...prevState,
                                                                categories: {
                                                                    synthesis: prevState.categories.synthesis,
                                                                    voiceType: ev.target.value,
                                                                    semiModular: prevState.categories.semiModular,
                                                                    desktop: prevState.categories.desktop,
                                                                }
                                                            }))
                                                        }}
                                                        text='Polyphonic'
                                                    />

                                                    <RadioInputField
                                                        value='Paraphonic'
                                                        name='voiceType'
                                                        checked={values.voiceType === 'Paraphonic'}
                                                        onChangeHandler={(ev) => {
                                                            handleChange(ev)
                                                            setState(prevState => ({
                                                                ...prevState,
                                                                categories: {
                                                                    synthesis: prevState.categories.synthesis,
                                                                    voiceType: ev.target.value,
                                                                    semiModular: prevState.categories.semiModular,
                                                                    desktop: prevState.categories.desktop,
                                                                }
                                                            }))
                                                        }}
                                                        text='Paraphonic'
                                                    />
                                                </div>

                                            </div>

                                            <div className='form-group-row'>
                                                <div className='form-group-sub-col'>
                                                    <h4 className='col-title'>Semi-modular</h4>
                                                    <div className='checkbox-wrap'>
                                                        <SingleCheckboxField
                                                            value='semiModular'
                                                            checked={values.semiModular}
                                                            onClickHandler={(val) => {
                                                                setState(prevState => ({
                                                                    ...prevState,
                                                                    categories: {
                                                                        synthesis: prevState.categories.synthesis,
                                                                        voiceType: prevState.categories.voiceType,
                                                                        semiModular: !values.semiModular,
                                                                        desktop: prevState.categories.desktop,
                                                                    }
                                                                }))
                                                                return !val
                                                            }}
                                                            textTrue='Yes'
                                                            textFalse='No'
                                                        />
                                                    </div>
                                                </div>

                                                <div className='form-group-sub-col'>
                                                    <h4 className='col-title'>Desktop</h4>
                                                    <div className='checkbox-wrap'>
                                                        <SingleCheckboxField
                                                            value='desktop'
                                                            checked={values.desktop}
                                                            onClickHandler={(val) => {
                                                                setState(prevState => ({
                                                                    ...prevState,
                                                                    categories: {
                                                                        synthesis: prevState.categories.synthesis,
                                                                        voiceType: prevState.categories.voiceType,
                                                                        semiModular: prevState.categories.semiModular,
                                                                        desktop: !values.desktop
                                                                    }
                                                                }))
                                                                return !val
                                                            }}
                                                            textTrue='Yes'
                                                            textFalse='No'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
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
                                        </div>

                                        <div className='field-control'>
                                            <label htmlFor='countInStock'>Count in stock</label>
                                            <Field
                                                type='text'
                                                name='countInStock'
                                                id='countInStock'
                                                autoComplete='off'
                                                placeholder='Enter product stock quantity'
                                                value={state.countInStock}
                                                onChange={ev => {
                                                    handleChange(ev)
                                                    setState(prevState => ({
                                                        ...prevState,
                                                        countInStock: ev.target.value
                                                    }))
                                                }}
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
                                        </div>

                                        <InputFieldArray
                                            valuesName='features'
                                            currentValues={state.features}
                                            valueName='feature'
                                            handleChange={handleChange}
                                            onChangeHandler={onChangeHandler}
                                            touched={touched.feature}
                                            errors={[errors.features, errors.feature]}
                                            onClickHandlerAddItem={onClickHandlerAddItem}
                                            onClickHandlerRemoveItem={onClickHandlerRemoveItem}
                                        />

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

                                        <SingleCheckboxField
                                            value='isPublished'
                                            checked={values.isPublished}
                                            onClickHandler={(val) => {
                                                setState(prevState => ({
                                                    ...prevState,
                                                    isPublished: !values.isPublished
                                                }))
                                                return !val
                                            }}
                                            textTrue='Publish now'
                                            textFalse='Don&apos;t publish'
                                        />

                                        <ActionBtn
                                            type='submit'
                                            className='edit-product-btn'
                                            disabled={isSubmitting}
                                            text='Edit product'
                                        />

                                    </Form>

                                    <ActionLink
                                        path='/admin/productslist'
                                        className='cancel-link'
                                    >
                                        Cancel
                                    </ActionLink>

                                </div>
                            )}

                        </Formik>}

            </div>

        </section>
    )
}

export default ProductEditScreen

import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
// import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import ScreenTitle from '../components/utilities/ScreenTitle'
import RadioInputField from '../components/utilities/RadioInputField'
import InputFieldArray from '../components/utilities/InputFieldArray'
import SingleCheckboxField from '../components/utilities/SingleCheckboxField'
import Spinner from '../components/utilities/Spinner'
import { ErrorMsg } from '../components/utilities/Messages'
import { ActionBtn, ActionLink } from '../components/utilities/ActionBtnLink'
import '../scss/screens/ProductCreateScreen.scss'

const ProductCreateScreen = ({ history }) => {

    const [state, setState] = useState({
        userID: '',
        name: '',
        brand: '',
        categories: {
            voiceType: 'Monophonic',
            synthesis: 'Analogue',
            semiModular: false,
            desktop: false
        },
        price: '',
        countInStock: '',
        description_m: '',
        features: new Array(5).fill(''),
        imageURL: '',
        isPublished: false,
        uploading: false
    })
    console.log(state)

    const dispatch = useDispatch()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productCreate = useSelector(state => state.productCreate)
    const { loading: loadingCreate, error: errorCreate, success: successCreate } = productCreate

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) history.push('/login')

        setState(prevState => ({
            ...prevState,
            userID: userInfo._id
        }))

        gsap.fromTo('.product-create-form-container', {
            opacity: 0,
            y: 38
        }, {
            delay: .15,
            duration: 1.1,
            opacity: 1,
            y: 0,
            ease: 'power3.out'
        })

    }, [history, userInfo])

    useEffect(() => {
        if (successCreate) {
            dispatch({ type: PRODUCT_CREATE_RESET })
            history.push('/admin/productslist')
        }
    }, [successCreate, dispatch, history])

    // product features handlers
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
        <section className='product-create-section'>

            <ScreenTitle title='Admin - Create product' />

            <div className={loadingCreate || errorCreate ? 'product-create-main-col ctr' : 'product-create-main-col str'}>

                {loadingCreate ? <Spinner /> :
                    errorCreate ? <ErrorMsg message={errorCreate} /> :
                        <Formik
                            initialValues={{
                                userID: state.userID,
                                name: '',
                                brand: '',
                                voiceType: state.categories.voiceType,
                                synthesis: state.categories.synthesis,
                                semiModular: state.categories.semiModular,
                                desktop: state.categories.desktop,
                                price: '',
                                countInStock: '',
                                description_m: '',
                                // features: state.features,
                                // feature: '',
                                imageURL: '',
                                isPublished: false
                            }}
                            initialErrors={{
                                userID: '',
                                name: '',
                                price: '',
                                brand: '',
                                countInStock: '',
                                description_m: '',
                                // features: ['', '', '', '', ''],
                                // features: Array(state.features.length).fill(''),
                                // feature: '',
                                // imageURL: ''
                            }}
                            // validationSchema={yup.object({
                            // userID: yup.string()
                            //     .trim()
                            //     .min(24, 'User ID must be at least 24 characters long')
                            //     .max(24, 'User ID can have a maximum of 24 characters')
                            //     .matches(/^[A-Za-z0-9]+$/, 'User ID is not valid')
                            //     .required('User ID is required'),
                            // name: yup.string()
                            //     .trim()
                            //     .required('Product name is required'),
                            // price: yup.string()
                            //     .trim()
                            //     .matches(/^[0-9]+$/, 'Price is not valid')
                            //     .required('Product price is required'),
                            // brand: yup.string()
                            //     .trim()
                            //     .matches(/^[A-Za-z0-9-]+$/, 'Product brand is not valid')
                            //     .required('Product brand is required'),
                            // // categories: yup.string()
                            // countInStock: yup.string()
                            //     .trim()
                            //     .matches(/^[0-9]+$/, 'Product quantity is not valid')
                            //     .required('Product quantity is required'),
                            // description_m: yup.string()
                            //     .trim()
                            //     .required('Product description is required'),
                            // image: yup.string()
                            //     .trim()
                            //     .required('Product image is required'),
                            // features: yup.array()
                            //     .of(yup.string().required('Each field must be fulfilled'))
                            //     .min(5)
                            //     .max(32),
                            // feature: yup.string()
                            //     .required('required')
                            // })}
                            // onSubmit={() => console.log('submitted')}
                            onSubmit={() => dispatch(createProduct({
                                user: state.userID,
                                name: state.name,
                                brand: state.brand,
                                categories: state.categories,
                                price: state.price,
                                countInStock: state.countInStock,
                                description_m: state.description_m,
                                features: state.features,
                                image: state.imageURL
                            }))}
                        >
                            {({ isSubmitting, values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
                                <div className='product-create-form-container'>
                                    <Form
                                        name='product-create'
                                        method='post'
                                        onSubmit={handleSubmit}
                                    >
                                        <div className='field-control'>
                                            <label htmlFor='userID'>User ID</label>
                                            <Field
                                                type='text'
                                                name='userID'
                                                id='userID'
                                                autoComplete='off'
                                                placeholder='Enter your user ID'
                                                value={state.userID}
                                            />
                                            <div className='form-err-msg-wrap'>
                                                <ErrorMessage
                                                    name='userID'
                                                    render={msg => <span className='form-err-msg'>{msg}</span>}
                                                />
                                            </div>
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
                                            <div className='form-err-msg-wrap'>
                                                <ErrorMessage
                                                    name='name'
                                                    render={msg => <span className='form-err-msg'>{msg}</span>}
                                                />
                                            </div>
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
                                            <div className='form-err-msg-wrap'>
                                                <ErrorMessage
                                                    name='brand'
                                                    render={msg => <span className='form-err-msg'>{msg}</span>}
                                                />
                                            </div>
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
                                                        value='FM'
                                                        name='synthesis'
                                                        checked={values.synthesis === 'FM'}
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
                                                        text='FM'
                                                    />

                                                    <RadioInputField
                                                        value='Digital'
                                                        name='synthesis'
                                                        checked={values.synthesis === 'Digital'}
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
                                                        text='Digital'
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
                                                            textTrue='Semi'
                                                            textFalse='Not semi'
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
                                                            textTrue='Desktop'
                                                            textFalse='Not desktop'
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
                                            <div className='form-err-msg-wrap'>
                                                <ErrorMessage
                                                    name='price'
                                                    render={msg => <span className='form-err-msg'>{msg}</span>}
                                                />
                                            </div>
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
                                            <div className='form-err-msg-wrap'>
                                                <ErrorMessage
                                                    name='countInStock'
                                                    render={msg => <span className='form-err-msg'>{msg}</span>}
                                                />
                                            </div>
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
                                            <div className='form-err-msg-wrap'>
                                                <ErrorMessage
                                                    name='description_m'
                                                    render={msg => <span className='form-err-msg'>{msg}</span>}
                                                />
                                            </div>
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
                                            <label htmlFor='imageURL'>Image URL</label>
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
                                            <div className='form-err-msg-wrap'>
                                                <ErrorMessage
                                                    name='imageURL'
                                                    render={msg => <span className='form-err-msg'>{msg}</span>}
                                                />
                                            </div>
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
                                            className='create-product-btn'
                                            disabled={isSubmitting}
                                            text='Create product'
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

export default ProductCreateScreen

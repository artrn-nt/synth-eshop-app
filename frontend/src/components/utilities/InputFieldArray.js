import React, { useState, useEffect } from 'react'
import { Field, FieldArray, ErrorMessage } from 'formik'
import '../../scss/components/utilities/InputFieldArray.scss'

const InputFieldArray = ({ valuesName, currentValues, valueName, handleChange, onChangeHandler, errors, touched, onClickHandlerAddItem, onClickHandlerRemoveItem }) => {

    const [alert, setAlert] = useState({
        show: false,
        text: ''
    })

    const [emptyField, setEmptyField] = useState(null)

    // useEffect(() => {
    //     console.log('mounted')
    // }, [errors])

    useEffect(() => {
        // if (typeof errors[0] === 'undefined' && typeof errors[1] === 'undefined' && typeof touched !== 'undefined') setEmptyField(false)
        // else if ((typeof errors[0] !== 'undefined' && typeof errors[1] === 'undefined' && typeof touched !== 'undefined') || (errors[1] && typeof touched !== 'undefined')) setEmptyField(true)
        if (typeof errors[0] === 'undefined' && typeof touched !== 'undefined') setEmptyField(false)
        else if (typeof errors[0] !== 'undefined' && typeof touched !== 'undefined') setEmptyField(true)
    }, [errors, touched])

    // useEffect(() => {
    //     console.log(currentValues)
    //     console.log(errors[0])
    // }, [currentValues, errors])

    // console.log(currentValues)
    // console.log(errors[0])
    // console.log('touched: ' + touched)
    // console.log(emptyField)

    return (
        <div className='field-array-control'>
            <label htmlFor={valuesName}>{valuesName[0].toUpperCase() + valuesName.slice(1)}</label>
            <FieldArray
                name={valuesName}
                id={valuesName}
                render={arrayHelpers => (
                    <>
                        {currentValues && currentValues.length > 0 && (
                            <ol>
                                {currentValues.map((values, index) => (
                                    <li key={index}>
                                        <span>{index + 1}</span>
                                        <Field
                                            type='text'
                                            name={valueName}
                                            id={valueName}
                                            autoComplete='off'
                                            placeholder={`Enter product ${valueName}`}
                                            value={currentValues[index]}
                                            onChange={ev => {
                                                handleChange(ev)
                                                onChangeHandler(ev, index)
                                            }}
                                        />
                                    </li>
                                ))}
                            </ol>
                        )}

                        <div className='btns-row'>

                            <button
                                type='button'
                                className='add-item'
                                onClick={() => {
                                    if (currentValues.length < 32) {
                                        setAlert({ show: false })
                                        arrayHelpers.insert(currentValues.length - 1, '')
                                        onClickHandlerAddItem()
                                    } else {
                                        setAlert({
                                            show: true,
                                            text: 'A maximum of 32 features can be entered'
                                        })
                                    }
                                }}
                            >
                                <i className='fas fa-plus-circle' />
                            </button>

                            <button
                                type='button'
                                className='remove-item'
                                onClick={() => {
                                    if (currentValues.length > 5) {
                                        setAlert({ show: false })
                                        arrayHelpers.remove(currentValues.length - 1)
                                        onClickHandlerRemoveItem()
                                    } else {
                                        setAlert({
                                            show: true,
                                            text: 'A minimum of 5 features must be entered'
                                        })
                                    }
                                }}
                            >
                                <i className='fas fa-minus-circle' />
                            </button>

                        </div>

                    </>
                )}
            />
        </div>
    )
}

export default InputFieldArray


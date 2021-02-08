import React, { useState } from 'react'
import { Field, FieldArray } from 'formik'
import '../../scss/components/utilities/InputFieldArray.scss'

const InputFieldArray = ({ value, currentValue, handleChange, onChangeHandler, onClickHandlerAddItem, onClickHandlerRemoveItem, touched, errors, errorMsg }) => {

    const [alert, setAlert] = useState({
        show: false,
        text: ''
    })

    return (
        <div className='field-array-control'>
            <label htmlFor={value}>{value[0].toUpperCase() + value.slice(1)}</label>
            <FieldArray
                name={value}
                id={value}
                render={arrayHelpers => (
                    <>
                        {currentValue && currentValue.length > 0 && (
                            <ol>
                                {currentValue.map((val, index) => (
                                    <li key={index}>
                                        <span>{index + 1}</span>
                                        <Field
                                            type='text'
                                            // name={`${value}[${index}]`}
                                            name={`${value}.${index}`}
                                            // id={`${value}[${index}]`}
                                            id={`${value}.${index}`}
                                            autoComplete='off'
                                            placeholder='Enter product feature'
                                            value={currentValue[index]}
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
                                    if (currentValue.length < 32) {
                                        setAlert({ show: false })
                                        // arrayHelpers.insert(currentValue.length - 1, '')
                                        arrayHelpers.push('')
                                        onClickHandlerAddItem()
                                    } else {
                                        setAlert({
                                            show: true,
                                            text: `A maximum of 32 ${value} can be entered`
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
                                    if (currentValue.length > 5) {
                                        setAlert({ show: false })
                                        arrayHelpers.remove(currentValue.length - 1)
                                        onClickHandlerRemoveItem()
                                    } else {
                                        setAlert({
                                            show: true,
                                            text: `A minimum of 5 ${value} must be entered`
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

            <div className='form-err-msg-wrap'>
                {/* {typeof errors !== 'undefined' && <span className='form-err-msg'>{errorMsg}</span>} */}
                {typeof errors !== 'undefined' && typeof touched !== 'undefined' && <span className='form-err-msg'>{errorMsg}</span>}
                {alert.show && <span className='length-err-msg'>{alert.text}</span>}
            </div>

        </div>
    )
}

export default InputFieldArray


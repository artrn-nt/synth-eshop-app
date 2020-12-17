import React from 'react'
import { Field } from 'formik'
import '../../scss/components/utilities/RadioInputField.scss'

const RadioInput = ({ value, name, checked, onChangeHandler, text }) => {
    return (
        <div className='radio-wrapper'>
            <label htmlFor={value}>
                <Field
                    type='radio'
                    id={value}
                    name={name}
                    value={value}
                    checked={checked}
                    onChange={onChangeHandler}
                />
                <span className='circle' />
            </label>
            <span className='radio-text'>{text}</span>
        </div>
    )
}

export default RadioInput

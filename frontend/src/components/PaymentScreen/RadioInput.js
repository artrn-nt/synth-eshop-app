import React from 'react'
import { Field } from 'formik'
import '../../scss/components/PaymentScreen/RadioInput.scss'

const RadioInput = ({ paymentMethod, value, checked, onChangeHandler, text }) => {
    return (
        <div className='radio-wrapper'>
            <label htmlFor={paymentMethod}>
                <Field
                    type='radio'
                    id={paymentMethod}
                    name='paymentMethod'
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

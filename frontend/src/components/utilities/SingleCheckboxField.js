import React from 'react'
import { Field } from 'formik'
import '../../scss/components/utilities/SingleCheckboxField.scss'

const CheckboxField = ({ value, name, checked, onClickHandler, textTrue, textFalse }) => {
    return (
        <div className='checkbox-wrapper'>
            <label htmlFor={value}>
                <Field
                    type='checkbox'
                    name={name}
                    id={value}
                    checked={checked}
                    onClick={onClickHandler}
                />
                <span className='circle' />
            </label>
            <span className='checkbox-text'>{checked ? textTrue : textFalse}</span>
        </div>
    )
}

export default CheckboxField

import React from 'react'
import { Field } from 'formik'
import '../../scss/components/utilities/ShowPassword.scss'

const ShowPassword = ({ checked, onClickHandler }) => {
    return (
        <label htmlFor='checkbox' className='show-password'>
            <Field
                type='checkbox'
                name='showPassword'
                checked={checked}
                id='checkbox'
                onClick={onClickHandler}
            />
            <i className='far fa-eye' />
            <i className='far fa-eye-slash' />
        </label>
    )
}

export default ShowPassword

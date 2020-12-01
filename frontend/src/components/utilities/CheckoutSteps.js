import React from 'react'
import { Link } from 'react-router-dom'
import '../../scss/components/utilities/CheckoutSteps.scss'

const CheckoutSteps = ({ step1, step2, step3 }) => {


    const onClickHandler = (ev, currentStep) => currentStep && ev.preventDefault()

    return (
        <nav className='checkout-steps'>
            <ul>
                {/* <li>
                    <Link
                        to='/login'
                        className={step1 ? 'active' : 'inactive'}
                        onClick={(ev) => onClickHandler(ev, step1)}
                    >
                        Login
                    </Link>
                </li>
                <span className={step2 ? 'active-gt' : 'inactive-gt'}>&gt;</span> */}
                <li>
                    <Link
                        to='/shipping'
                        className={step1 ? 'active' : 'inactive'}
                        onClick={(ev) => onClickHandler(ev, step1)}
                    >
                        Shipping info
                    </Link>
                </li>
                <span className={step2 ? 'active-gt' : 'inactive-gt'}>&gt;</span>
                <li>
                    <Link
                        to='/payment'
                        className={step2 ? 'active' : 'inactive'}
                    >
                        Payment
                    </Link>
                </li>
                <span className={step3 ? 'active-gt' : 'inactive-gt'}>&gt;</span>
                <li>
                    <Link
                        to='/placeorder'
                        className={step3 ? 'active' : 'inactive'}
                    >
                        Place order
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default CheckoutSteps

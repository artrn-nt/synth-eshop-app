import React from 'react'
import { Link } from 'react-router-dom'
import '../../scss/components/utilities/CheckoutSteps.scss'

const CheckoutSteps = (props) => {

    const propsKeysArr = Object.keys(props)

    return (
        <nav className='checkout-steps'>
            <ul>
                <li>
                    <Link
                        to='/shipping'
                        className={
                            props.step1 ?
                                propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[0] ?
                                    'active-1' : 'active-2' : 'inactive'
                        }
                        onClick={(ev) => propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[0] && ev.preventDefault()}
                    >
                        Shipping info
                    </Link>
                </li>
                <span className={props.step2 ? 'active-gt' : 'inactive-gt'}>&gt;</span>
                <li>
                    <Link
                        to='/payment'
                        className={
                            props.step2 ?
                                propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[1] ?
                                    'active-1' : 'active-2' : 'inactive'
                        }
                        onClick={(ev) => propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[1] && ev.preventDefault()}
                    >
                        Payment
                    </Link>
                </li>
                <span className={props.step3 ? 'active-gt' : 'inactive-gt'}>&gt;</span>
                <li>
                    <Link
                        to='/placeorder'
                        className={
                            props.step3 ?
                                propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[2] ?
                                    'active-1' : 'active-2' : 'inactive'
                        }
                        onClick={(ev) => propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[2] && ev.preventDefault()}
                    >
                        Place order
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default CheckoutSteps

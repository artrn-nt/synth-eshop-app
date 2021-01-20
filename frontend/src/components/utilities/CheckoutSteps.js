import React from 'react'
import { Link } from 'react-router-dom'
import useWindowSize from '../../utils/useWindowSize'
import '../../scss/components/utilities/CheckoutSteps.scss'

const CheckoutSteps = (props) => {

    const size = useWindowSize()
    const propsKeysArr = Object.keys(props)

    return (
        <nav className='checkout-steps'>
            <ul>
                <li>
                    <Link
                        to='/shipping'
                        className={
                            props.step4 ? 'inactive' : props.step1 ?
                                propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[0] ?
                                    'active-1' : 'active-2' : 'inactive'
                        }
                        onClick={(ev) => propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[0] && ev.preventDefault()}
                    >
                        Shipping info
                        <span>(01)</span>
                    </Link>
                </li>
                {size.width > 790 && <span className={props.step4 ? 'inactive-gt' : props.step2 || props.step3 ? 'active-gt' : 'inactive-gt'}>&gt;</span>}
                <li>
                    <Link
                        to='/payment'
                        className={
                            props.step4 ? 'inactive' : props.step2 ?
                                propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[1] ?
                                    'active-1' : 'active-2' : 'inactive'
                        }
                        onClick={(ev) => propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[1] && ev.preventDefault()}
                    >
                        Payment method
                        <span>(02)</span>
                    </Link>
                </li>
                {size.width > 790 && <span className={props.step4 ? 'inactive-gt' : props.step3 ? 'active-gt' : 'inactive-gt'}>&gt;</span>}
                <li>
                    <Link
                        to='/placeorder'
                        className={
                            props.step4 ? 'inactive' : props.step3 ?
                                propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[2] ?
                                    'active-1' : 'active-2' : 'inactive'
                        }
                        onClick={(ev) => propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[2] && ev.preventDefault()}
                    >
                        Place order
                        <span>(03)</span>
                    </Link>
                </li>
                {size.width > 790 && <span className='inactive-gt'>&gt;</span>}
                <li>
                    <Link
                        to='/'
                        className={
                            props.step4 ?
                                propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[3] ?
                                    'active-1' : 'active-2' : 'inactive'
                        }
                        onClick={(ev) => propsKeysArr[propsKeysArr.length - 1] === propsKeysArr[3] && ev.preventDefault()}
                    >
                        Order status
                        <span>(04)</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default CheckoutSteps

import React from 'react'
import { Link } from 'react-router-dom'

const OrderItem = (props) => {
    return (
        <li className='order-item'>
            <div className='col-1-it-order'>
                <Link
                    to={`/product/${props._id}`}
                    className='img-wrapper'
                >
                    <img src={props.image} alt={props.name} />
                </Link>
                <div className='item-infos'>
                    <Link to={`/product/${props._id}`}>
                        <span className='o-i-name'>{props.name}</span>
                    </Link>
                    <span className='o-i-description_m'>{props.description_m}</span>
                </div>
            </div>

            <div className='col-2-it-order'>
                <p className='it-order-values'>
                    <span>{props.qty}</span>
                    <span>x</span>
                    <span>€{props.price.toFixed(2)}</span>
                </p>
                <span>=</span>
                <span className='it-order-total'>€{(props.qty * props.price).toFixed(2)}</span>
            </div>

        </li>
    )
}

export default OrderItem

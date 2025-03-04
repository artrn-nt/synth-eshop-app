import React from 'react'
import { Link } from 'react-router-dom'
import '../../scss/components/ProductsScreen/ProductCard.scss'

const ProductCard = ({ product }) => {

    return (
        <div className='product-card' style={{ transform: 'translateY(7%)' }}>
            <Link className='img-link' to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} />
            </Link>

            <Link className='card-title-link' to={`/product/${product._id}`}>
                <h4 className='card-title'>
                    <span>{product.name}</span>
                    <span>€{product.price.toFixed(2)}</span>
                </h4>
            </Link>

        </div>
    )
}

export default ProductCard

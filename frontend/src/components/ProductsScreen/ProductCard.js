import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {

    return (
        <div className='product-card'>
            <Link className='img-link' to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name}/>
            </Link>

            <Link className='title-link' to={`/product/${product._id}`}>
                <p className='card-title'>
                    <span>{product.name}</span>
                    <span>€{product.price.toFixed(2)}</span>
                </p>
            </Link>

        </div>
    )
}

export default ProductCard

import React from 'react'
import { Link } from 'react-router-dom'
import '../scss/screens/NotFoundScreen.scss'

const NotFoundScreen = () => {
    return (
        <section className='not-found-section'>
            <p>Page not Found <Link to='/'>Go back to home page</Link></p>
        </section>
    )
}

export default NotFoundScreen

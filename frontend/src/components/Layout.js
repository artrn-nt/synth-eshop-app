import React from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import '../scss/components/Layout.scss'

const stripPromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY)

const Layout = ({ children }) => {

    return (
        <Elements stripe={stripPromise}>
            <div className='container'>
                <Header />
                <main className='content'>
                    {children}
                </main>
                <Footer />
            </div>
        </Elements>
    )
}

export default Layout

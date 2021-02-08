import React from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import '../scss/components/Layout.scss'

// PUBLISHABLE_KEY
const stripPromise = loadStripe('pk_test_51IDp34E72yJLmAQutixa8WMgEuYmWe7N3pjzBqE846bza7fD9VZW5Xra7egx1N3I7DTP8vq1et0y9PWqXCnPVTzs00ISvK5kvm', {
    locale: 'en'
})

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

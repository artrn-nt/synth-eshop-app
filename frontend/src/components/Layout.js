import React from 'react'
import Header from './Header/Header'
import Footer from './Footer/Footer'


const Layout = ({ children }) => {
    return (
        <div className='container'>
            <Header />
            <main className='content'>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout

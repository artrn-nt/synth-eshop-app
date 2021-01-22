import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header/Header'
import ProductsNav from './utilities/ProductsNav'
import Footer from './Footer/Footer'
import '../scss/components/Layout.scss'

const Layout = ({ children }) => {

    const { pathname } = useLocation()
    const url = pathname.slice(0, pathname.lastIndexOf('/'))
    console.log(pathname)

    return (
        <div className='container'>
            <Header />
            {url === '/product' && <ProductsNav pathname_id={pathname.slice(pathname.lastIndexOf('/') + 1)} />}
            <main className='content'>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout

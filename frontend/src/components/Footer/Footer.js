import React from 'react'

const Footer = () => {

    return (
        <footer>
            <p>&copy; {new Date().getFullYear()}, Synth Mini-Market</p>
            <div className='logos-wrapper'>
                <i className='fab fa-cc-paypal' />
                <i className='fab fa-cc-stripe' />
                <i className='fab fa-ups' />
            </div>
        </footer>
    )
}

export default Footer

import React, { useEffect } from 'react'
import gsap from 'gsap'
import ScreenTitle from '../components/utilities/ScreenTitle'
import '../scss/screens/InfoScreen.scss'

const InfoScreen = () => {

    useEffect(() => {
        gsap.fromTo('.info-content', {
            opacity: 0,
            y: 38
        }, {
            delay: .15,
            duration: 1.1,
            opacity: 1,
            y: 0,
            ease: 'power3.out'
        })
    }, [])

    return (
        <section className='info-container'>
            <ScreenTitle title='info' />
            <div className='info-content'>
                <p>
                    Hello I'm Arthur, I run Synths Mini-Market. Synths Mini-Market is for now a mail-order website which distributes synthesizers from different manufacturers across the whole European continent.
                    It sells new gears to individuals at appealing rates and keep shipping cost at the lowest price whatever sending destination is.<br/><br/>
                    Synths Mini-Market is going to turn into a physical shop by the end of the year in Strasbourg as I bought a small local in the center of the city that I'm currently renovating. But don't worry, this website will remains active.
                    After becoming a local shop the aim of Synths Mini-Market will be to create a community of persons who are interested by sound synthesis and hardware in order to share knowledges, music tastes and animate music workshops.<br/><br/>
                    For more informations about the project don't hesitate to send a message thanks to the contact section.
                </p>

                <div className='clients'>
                    <span>Synth Mini-Market already works with:</span>
                    <ul>
                        <a href='https://www.behringer.com/'>Behringer</a>
                        <a href='https://www.dreadbox-fx.com/'>Dreadbox</a>
                        <a href='https://www.elektron.se/'>Elektron</a>
                        <a href='https://www.korg.com/'>Korg</a>
                        <a href='https://malekkoheavyindustry.com/'>Malekko Heavy Industry</a>
                        <a href='https://www.moogmusic.com/'>Moog</a>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default InfoScreen

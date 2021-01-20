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
        <section className='info-section'>
            <ScreenTitle title='info' />
            <div className='info-content'>
                <p>
                    Synths Mini-Market is a french mail-order website which distributes synthesizers from different manufacturers across the whole European continent.
                    It sells recent musical hardware to individuals at appealing rates and keep shipping cost at the lowest price whatever sending destination is.<br /><br />
                    Synths Mini-Market is going to turn into a physical shop during 2021, so stay tuned.
                </p>

                <div className='partners'>
                    <span>Synth Mini-Market works in partnership with:</span>
                    <ul>
                        <li>
                            <a href='https://www.ashunsoundmachines.com/'>Ashun Sound Machines (ASM)</a>
                        </li>
                        <li>
                            <a href='https://www.behringer.com/'>Behringer</a>
                        </li>
                        <li>
                            <a href='http://www.doepfer.de/home.htm/'>Doepfer</a>
                        </li>
                        <li>
                            <a href='https://www.dreadbox-fx.com/'>Dreadbox</a>
                        </li>
                        <li>
                            <a href='https://www.elektron.se/'>Elektron</a>
                        </li>
                        <li>
                            <a href='https://www.ericasynths.lv/'>Erica Synths</a>
                        </li>
                        <li>
                            <a href='https://www.korg.com/'>Korg</a>
                        </li>
                        <li>
                            <a href='https://malekkoheavyindustry.com/'>Malekko Heavy Industry</a>
                        </li>
                        <li>
                            <a href='https://www.moogmusic.com/'>Moog</a>
                        </li>
                        <li>
                            <a href='https://novationmusic.com/'>Novation</a>
                        </li>
                        <li>
                            <a href='https://www.sequential.com//'>Sequential</a>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default InfoScreen

import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { CSSTransition } from 'react-transition-group'
import { Link } from 'react-router-dom'

const Hero = ({ latestProducts }) => {

    const [state, setState] = useState({
        isActive1: true,
        isActive2: false,
        isActive3: false
    })

    const [latest, setLatest] = useState(false)

    useEffect(() => {
        if (latestProducts.length !== 0) setLatest(true)
    }, [latestProducts])

    useEffect(() => {
        console.log(latest)
        if (latest) {
            setState({
                isActive1: true,
                isActive2: false,
                isActive3: false
            })
        }
    }, [latest, latestProducts])

    const countInit = 8.5
    const [count, setCount] = useState(0)
    const [mod, setMod] = useState(0)
    const [entered, setEntered] = useState(null)

    const interval = useRef(null), timeout = useRef(null)

    useEffect(() => {

        if (entered === null) {

            interval.current = setInterval(() => {
                setCount(prevState => ++prevState)
            }, countInit * 1000)

        } if (entered) {

            clearInterval(interval.current)
            interval.current = null

            gsap.fromTo(['.link-wrap-1, .link-wrap-2, .link-wrap-3'], {
                y: '100%'
            }, {
                y: 0,
                duration: .6,
                ease: 'power4.out'
            })

        } else if (!entered && entered !== null) {

            setTimeout(() => {
                setCount(prevState => ++prevState)
                interval.current = setInterval(() => {
                    setCount(prevState => ++prevState)
                }, countInit * 1000)

            }, 2500)

            gsap.fromTo(['.link-wrap-1, .link-wrap-2, .link-wrap-3'], {
                y: 0
            }, {
                y: '100%',
                duration: .6,
                ease: 'power4.out'
            })

        }

        return () => {
            clearInterval(interval.current)
            interval.current = null
            clearTimeout(timeout.current)
            timeout.current = null
        }

    }, [entered])

    useEffect(() => {
        setMod(count % 3)
    }, [count])

    useEffect(() => {
        setState({
            isActive1: mod === 0 ? true : false,
            isActive2: mod === 1 ? true : false,
            isActive3: mod === 2 ? true : false
        })
    }, [mod])

    if (!latest) return null

    return (
        <div className='products-hero'>
            <div
                className='products-carousel-wrapper'
                onMouseEnter={() => setEntered(prevState => !prevState)}
                onMouseLeave={() => setEntered(prevState => !prevState)}
            >
                <h3 className='carousel-title'><span>Latest arrivals:</span> Moog semi-modular synthesizers</h3>
                <div className='products-carousel'>
                    {latestProducts.map((product, index) => (
                        <CSSTransition
                            key={product._id}
                            in={Object.values(state)[index]}
                            timeout={1500}
                            classNames={`img-wrapper-${index + 1}`}>
                            <div
                                className={`img-wrapper-${index + 1}`}
                                style={{
                                    right: Object.values(state)[index] ? 'unset' : 0,
                                    opacity: Object.values(state)[index] ? 1 : 0
                                }}>
                                <img
                                    src={product.image_c}
                                    alt={product.name}
                                />
                            </div>
                        </CSSTransition>
                    ))}

                    {latestProducts.map((product, index) => (
                        <div
                            className={`link-wrap-${index + 1}`}
                            key={product._id}
                            style={{ display: Object.values(state)[index] ? 'flex' : 'none' }}>
                            <Link
                                to={`/product/${product._id}`}
                                className='carousel-link'
                            >
                                <h4>{product.name}</h4>
                                <p>{product.description_c}</p>
                            </Link>
                        </div>
                    ))}

                    {/* <CSSTransition in={state.isActive1} timeout={1500} classNames='img-wrapper-1'>
                        <div
                            className='img-wrapper-1'
                            style={{
                                right: state.isActive1 ? 'unset' : 0,
                                opacity: state.isActive1 ? 1 : 0,
                                // opacity: 1,
                                // left: 0
                            }}>
                            <img
                                src='images/latest_moog_subharmonicon_2.jpg'
                                // alt={latestProducts[0].name}
                                // src='images/latest_moog_subharmonicon_2.jpg'
                                alt='Moog'
                            />
                        </div>
                    </CSSTransition>

                    <CSSTransition in={state.isActive2} timeout={1500} classNames='img-wrapper-2'>
                        <div
                            className='img-wrapper-2'
                            style={{
                                right: state.isActive2 ? 'unset' : 0,
                                opacity: state.isActive2 ? 1 : 0
                            }}>
                            <img
                                src='images/latest_moog_werkstatt_2.jpg'
                                alt='moog'
                            />
                        </div>
                    </CSSTransition>

                    <CSSTransition in={state.isActive3} timeout={1500} classNames='img-wrapper-3'>
                        <div
                            className='img-wrapper-2'
                            style={{
                                right: state.isActive3 ? 'unset' : 0,
                                opacity: state.isActive3 ? 1 : 0
                            }}>
                            <img
                                src='images/latest_moog_mother.jpg'
                                alt='moog'
                            />
                        </div>
                    </CSSTransition> */}

                </div>
                <div className='dot-indicators'>
                    {latestProducts.map((product, index) => (
                        <span key={product._id} className={Object.values(state)[index] ? 'dot active' : 'dot inactive'} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Hero

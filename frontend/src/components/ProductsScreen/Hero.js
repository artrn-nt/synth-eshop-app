import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import '../../scss/components/ProductsScreen/Hero.scss'
import config from '../../scss/config.module.scss'

const CarouselTitle = ({ count, mod, state, carouselProducts, countInit, delayInit }) => {

    const elClassName = 'carousel-link'
    const tl = useRef(null)

    useEffect(() => {
        tl.current = gsap.timeline()
            .fromTo(`.${elClassName}`, {
                autoAlpha: 0,
            }, {
                autoAlpha: 1,
                duration: delayInit,
                ease: 'power1.in'
            })
            .fromTo(`.${elClassName}`, {
                autoAlpha: 1,
            }, {
                autoAlpha: 0,
                delay: countInit - delayInit,
                duration: delayInit,
                ease: 'power1.out'
            })

        return () => {
            tl.current.kill()
            tl.current = null
        }

    }, [state, countInit, delayInit])

    return (
        <h3 className='carousel-title'>
            <span>Latest arrivals</span>
            <span>
                <Link
                    className='carousel-link'
                    to={count === null ?
                        `/product/${carouselProducts[0]._id}` : mod === null ?
                            `/product/${carouselProducts[1]._id}` : `/product/${carouselProducts[mod]._id}`}
                >
                    {count === null ? carouselProducts[0].name : mod === null ?
                        carouselProducts[1].name : carouselProducts[mod].name}
                </Link>
            </span>
        </h3>
    )
}

const CarouselBtn = ({ btnClassName, iClassName, clickHandler, disabled }) => {

    const [entered, setEntered] = useState(false)

    return (
        <button
            className={btnClassName}
            onClick={() => {
                if (!disabled) clickHandler()
            }}
            onMouseEnter={() => setEntered(true)}
            onMouseLeave={() => setEntered(false)}
            style={{
                backgroundColor: entered ? config.bright : config.subTheme,
                color: entered ? config.mainTheme : config.bright
            }}
        >
            <i
                className={iClassName}
                style={{ animationPlayState: entered ? 'running' : 'paused' }}
            />
        </button>
    )
}

const Hero = ({ carouselProducts, mounted }) => {

    const [count, setCount] = useState(null)
    const [mod, setMod] = useState(null)
    const [state, setState] = useState({
        isActive1: null,
        isActive2: null,
        isActive3: null
    })

    const [forwards, setForwards] = useState(null)
    const [disabled, setDisabled] = useState(false)

    const imgRef = useRef([])
    const interval = useRef(null), timeOut_1 = useRef(null), timeOut_2 = useRef(null)

    const countInit = 7.5
    const delayInit = .85

    useEffect(() => {

        if (carouselProducts.length !== 0 && typeof carouselProducts !== 'undefined') {
            interval.current = setInterval(() => {
                setCount(prevState => ++prevState)
            }, countInit * 1000)

            timeOut_2.current = setTimeout(() => {
                mounted()
            }, 200)
        }

        return () => {
            clearInterval(interval.current)
            interval.current = null
            clearTimeout(timeOut_1.current)
            timeOut_1.current = null
            clearTimeout(timeOut_2.current)
            timeOut_2.current = null
        }

    }, [carouselProducts])

    useEffect(() => {
        if (count !== null) {
            setMod(count % 3)
        }
    }, [count])

    useEffect(() => {
        if (mod !== null) {
            setState({
                isActive1: mod === 0 ? true : false,
                isActive2: mod === 1 ? true : false,
                isActive3: mod === 2 ? true : false
            })
        }
    }, [mod])

    const fadeIn = (item) => {
        gsap.fromTo(item, {
            autoAlpha: 0,
            delay: delayInit
        }, {
            autoAlpha: 1,
            duration: delayInit,
            ease: 'power1.in'
        })
    }

    const fadeOut = (item, setForwards) => {
        gsap.fromTo(item, {
            autoAlpha: 1
        }, {
            autoAlpha: 0,
            duration: delayInit,
            ease: 'power1.out',
            onComplete: setForwards ? () => setForwards : null
        })
    }

    const onClickHandler = (direction) => {

        setDisabled(true)

        clearInterval(interval.current)
        interval.current = null

        interval.current = setInterval(() => {
            setCount(prevState => ++prevState)
        }, countInit * 1000)

        timeOut_1.current = setTimeout(() => {
            setDisabled(false)
        }, delayInit * 1000)

        if (direction === 'right') {
            setForwards(true)
            setCount(prevState => ++prevState)
        } else {
            setForwards(false)
            setCount(prevState => prevState === 0 ? carouselProducts.length : --prevState)
        }
    }

    useEffect(() => {
        if (carouselProducts.length !== 0 && typeof carouselProducts !== 'undefined' && state.isActive1 !== null) {

            if (imgRef.current.some(img => img.className.includes('forward'))) {
                if (state.isActive1) {
                    fadeOut('.img-3.forwards')
                    fadeIn('.img-1.forwards')
                    gsap.set('.img-2.forwards', { autoAlpha: 0 })
                } else if (state.isActive2) {
                    fadeOut('.img-1.forwards')
                    fadeIn('.img-2.forwards')
                    gsap.set('.img-3.forwards', { autoAlpha: 0 })
                } else if (state.isActive3) {
                    fadeOut('.img-2.forwards')
                    fadeIn('.img-3.forwards')
                    gsap.set('.img-1.forwards', { autoAlpha: 0 })
                }
            } else {
                if (state.isActive1) {
                    fadeOut('.img-2.backwards', setForwards(true))
                    fadeIn('.img-1.backwards')
                    gsap.set('.img-3.backwards', { autoAlpha: 0 })
                } else if (state.isActive2) {
                    fadeOut('.img-3.backwards', setForwards(true))
                    fadeIn('.img-2.backwards')
                    gsap.set('.img-1.backwards', { autoAlpha: 0 })
                } else if (state.isActive3) {
                    fadeOut('.img-1.backwards', setForwards(true))
                    fadeIn('.img-3.backwards')
                    gsap.set('.img-2.backwards', { autoAlpha: 0 })
                }
            }

        } else if (carouselProducts.length !== 0 && typeof carouselProducts !== 'undefined' && state.isActive1 === null) {
            fadeIn('.img-1')
        }
    }, [carouselProducts, state])

    if (carouselProducts.length === 0 || typeof carouselProducts === 'undefined') return null

    return (
        <div className='products-hero'>

            <div className='products-hero-inner'>

                <CarouselTitle
                    count={count}
                    mod={mod}
                    state={state}
                    carouselProducts={carouselProducts}
                    countInit={countInit}
                    delayInit={delayInit}
                />

                <div className='products-carousel-outer'>

                    <div className='products-carousel'>

                        <div className='products-carousel-inner'>
                            <ol>
                                {carouselProducts.map((product, index) => (
                                    <li
                                        key={product._id}
                                        className={`img-item-${index + 1}`}
                                    >
                                        <img
                                            className={forwards || forwards === null ? `img-${index + 1} forwards` : `img-${index + 1} backwards`}
                                            src={product.image_c}
                                            alt={product.name}
                                            ref={el => imgRef.current[index] = el}
                                        />
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className='dot-indicators'>
                            {carouselProducts.map((product, index) => (
                                <span
                                    key={product._id}
                                    className={index === 0 && Object.values(state)[index] === null ?
                                        'dot active' : Object.values(state)[index] ?
                                            'dot active' : 'dot inactive'}
                                />
                            ))}
                        </div>

                    </div>

                </div>

                <CarouselBtn
                    btnClassName='carousel-btn-left'
                    iClassName='fas fa-chevron-left'
                    clickHandler={() => onClickHandler('left')}
                    disabled={disabled}
                />

                <CarouselBtn
                    btnClassName='carousel-btn-right'
                    iClassName='fas fa-chevron-right'
                    clickHandler={() => onClickHandler('right')}
                    disabled={disabled}
                />

            </div>

        </div>
    )
}

export default Hero

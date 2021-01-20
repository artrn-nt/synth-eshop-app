import React, { useState, useEffect } from 'react'
import { Transition } from 'react-transition-group'
import gsap from 'gsap'
import useWindowSize from '../../utils/useWindowSize'
import '../../scss/components/utilities/ProductsFilter.scss'

const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 }
}

const BrandSelector = ({ drop, dropHandler, shutHandler, brands, productsFilterHandler }) => {

    const [brand, setBrand] = useState('Choose a brand')

    useEffect(() => {
        if (drop) {
            gsap.to('.brand-select-container', {
                duration: .6,
                height: `${(brands.length + 1) * 2.1 * 16}px`,
                ease: 'power3.out'
            })
        } else {
            gsap.to('.brand-select-container', {
                delay: .15,
                duration: .6,
                height: '2.1rem',
                ease: 'power3.out'
            })
        }
    }, [drop, brands])

    return (
        <div className={drop ? 'brand-select-container active' : 'brand-select-container'}>
            <div
                className='brand-wrapper'
                onClick={dropHandler}
            >
                <span>{brand}</span>
                <i
                    className='fas fa-caret-down'
                    style={{
                        WebkitTransform: drop && 'rotate(180deg)',
                        transform: drop && 'rotate(180deg)'
                    }}
                />
            </div>
            <Transition in={drop} timeout={{ enter: 290, exit: 0 }} unmountOnExit>
                {state => (
                    <ul className='brand-dropdown' style={{ ...transitionStyles[state] }}>
                        {brands.map((brand, index) => {
                            return (
                                <li
                                    key={brand + '_' + index}
                                    className='brand-dropdown-item'
                                    onClick={() => {
                                        productsFilterHandler('Brand', brand)
                                        setBrand(brand.length > 14 ? brand.slice(0, brand.indexOf(' ')) + '...' : brand)
                                        shutHandler()
                                    }}
                                >
                                    {brand.length > 14 ? brand.slice(0, brand.indexOf(' ')) + '...' : brand}
                                </li>
                            )
                        })}
                    </ul>
                )}
            </Transition>
        </div>
    )
}

const CategoriesItem = ({ onClickHandler, active, text }) => {
    return (
        <li
            className='cat-item'
            onClick={onClickHandler}
        >
            <div className={active ? 'cat-chip active' : 'cat-chip'} />
            {text}
        </li>
    )
}

const CategoriesSelector = ({ drop, dropHandler, productsFilterHandler }) => {

    const [categories, setCategories] = useState({
        synthesis: null,
        voiceType: null,
        semiModular: false,
        desktop: false
    })

    const [touched, setTouched] = useState(null)

    useEffect(() => {
        if (drop) {
            gsap.to('.categories-select-container', {
                duration: .6,
                height: `${15 * 2.1 * 16}px`,
                ease: 'power3.out'
            })
        } else {
            gsap.to('.categories-select-container', {
                delay: .15,
                duration: .6,
                height: '2.1rem',
                ease: 'power3.out'
            })
        }
    }, [drop])

    useEffect(() => {
        if (touched) {
            productsFilterHandler('Categories', categories)
        }
    }, [touched, categories, productsFilterHandler])

    const onClickHandler = (key, val) => {
        let tempObj = categories
        setTouched(true)

        if (typeof tempObj[key] !== 'boolean') {
            tempObj[key] = val
            setCategories({ ...tempObj })
        } else {
            tempObj[key] = !tempObj[key]
            setCategories({ ...tempObj })
        }
    }

    return (
        <div className={drop ? 'categories-select-container active' : 'categories-select-container'}>
            <div
                className='categories-wrapper'
                onClick={dropHandler}
            >
                <span>Choose categories</span>
                <i
                    className='fas fa-caret-down'
                    style={{
                        WebkitTransform: drop && 'rotate(180deg)',
                        transform: drop && 'rotate(180deg)'
                    }}
                />
            </div>
            <Transition in={drop} timeout={{ enter: 290, exit: 0 }} unmountOnExit>
                {state => (
                    <ul className='categories-dropdown' style={{ ...transitionStyles[state] }}>

                        <div className='cat-wrapper'>
                            <span>Synthesis</span>
                            <CategoriesItem
                                onClickHandler={() => onClickHandler('synthesis', null)}
                                active={categories.synthesis === null}
                                text='All'
                            />
                            <CategoriesItem
                                onClickHandler={() => onClickHandler('synthesis', 'Analogue')}
                                active={categories.synthesis === 'Analogue'}
                                text='Analogue'
                            />
                            <CategoriesItem
                                onClickHandler={() => onClickHandler('synthesis', 'FM / Digital')}
                                active={categories.synthesis === 'FM / Digital'}
                                text='FM / Digital'
                            />
                            <CategoriesItem
                                onClickHandler={() => onClickHandler('synthesis', 'Hybrid')}
                                active={categories.synthesis === 'Hybrid'}
                                text='Hybrid'
                            />
                        </div>

                        <div className='cat-wrapper'>
                            <span>Voice type</span>
                            <CategoriesItem
                                onClickHandler={() => onClickHandler('voiceType', null)}
                                active={categories.voiceType === null}
                                text='All'
                            />
                            <CategoriesItem
                                onClickHandler={() => onClickHandler('voiceType', 'Monophonic')}
                                active={categories.voiceType === 'Monophonic'}
                                text='Monophonic'
                            />
                            <CategoriesItem
                                onClickHandler={() => onClickHandler('voiceType', 'Polyphonic')}
                                active={categories.voiceType === 'Polyphonic'}
                                text='Polyphonic'
                            />
                            <CategoriesItem
                                onClickHandler={() => onClickHandler('voiceType', 'Paraphonic')}
                                active={categories.voiceType === 'Paraphonic'}
                                text='Paraphonic'
                            />
                        </div>

                        <div className='cat-wrapper'>
                            <span>Semi-modular</span>
                            <CategoriesItem
                                onClickHandler={() => onClickHandler('semiModular')}
                                active={categories.semiModular}
                                text={categories.semiModular ? 'Yes' : 'No'}
                            />
                        </div>

                        <div className='cat-wrapper'>
                            <span>Desktop</span>
                            <CategoriesItem
                                onClickHandler={() => onClickHandler('desktop')}
                                active={categories.desktop}
                                text={categories.desktop ? 'Yes' : 'No'}
                            />
                        </div>

                    </ul>
                )}
            </Transition>
        </div>
    )
}

const ProductsFilter = ({ brands, productsFilterHandler, outOfStock, price }) => {

    const size = useWindowSize()

    const [drop, setDrop] = useState({
        isActive1: false,
        isActive2: false
    })

    const [filterType, setFilterType] = useState('Indifferent (all)')

    useEffect(() => {
        if (drop.isActive1) {
            gsap.to('.filter-select-container', {
                duration: .6,
                height: '168px',
                ease: 'power3.out'
            })
        } else if (!drop.isActive1) {
            gsap.to('.filter-select-container', {
                delay: .15,
                duration: .6,
                height: '2.1rem',
                ease: 'power3.out'
            })
        }
    }, [drop])

    const dropHandler = () => {
        setDrop(prevState => ({
            ...prevState,
            isActive2: !prevState.isActive2
        }))
    }

    const shutHandler = () => {
        setDrop({
            isActive1: false,
            isActive2: false
        })
    }

    return (
        <div className='filter-row'>
            <p className='filter-text'>Sort products by:</p>
            <div
                className='filter-main-container'
                style={{
                    minHeight: size.width <= 790 ?
                        filterType === 'Brand' || filterType === 'Categories' ?
                            `${4.2 + .7875}rem` : '2.1rem' : '2.1rem'
                }}
            >
                <div className='filter-sub-container'>

                    <div className={drop.isActive1 ? 'filter-select-container active' : 'filter-select-container'}>
                        <div
                            className='filter-type-wrapper'
                            onClick={() => setDrop(prevState => ({
                                ...prevState,
                                isActive1: !prevState.isActive1
                            })
                            )}
                        >
                            <span>{filterType}</span>
                            <i
                                className='fas fa-caret-down'
                                style={{
                                    WebkitTransform: drop.isActive1 && 'rotate(180deg)',
                                    transform: drop.isActive1 && 'rotate(180deg)'
                                }}
                            />
                        </div>
                        <Transition in={drop.isActive1} timeout={{ enter: 290, exit: 0 }} unmountOnExit>
                            {state => (
                                <ul className='filter-type-dropdown' style={{ ...transitionStyles[state] }}>
                                    <li
                                        className='filter-type-dropdown-item'
                                        onClick={() => {
                                            setFilterType('Brand')
                                            setDrop({
                                                isActive1: false,
                                                isActive2: false
                                            })
                                        }}
                                    >
                                        Brand
                                    </li>
                                    <li
                                        className='filter-type-dropdown-item'
                                        onClick={() => {
                                            setFilterType('Categories')
                                            setDrop({
                                                isActive1: false,
                                                isActive2: false
                                            })
                                        }}
                                    >
                                        Categories
                                    </li>
                                    {price &&
                                        <li
                                            className='filter-type-dropdown-item'
                                            onClick={() => {
                                                setFilterType('Price (from cheapest)')
                                                setDrop({
                                                    isActive1: false,
                                                    isActive2: false
                                                })
                                                productsFilterHandler('Price')
                                            }}
                                        >
                                            Price (from cheapest)
                                        </li>}
                                    {outOfStock &&
                                        <li
                                            className='filter-type-dropdown-item'
                                            onClick={() => {
                                                setFilterType('Out of stock')
                                                setDrop({
                                                    isActive1: false,
                                                    isActive2: false
                                                })
                                                productsFilterHandler('Out of stock')
                                            }}
                                        >
                                            Out of stock
                                        </li>}
                                    <li
                                        className='filter-type-dropdown-item'
                                        onClick={() => {
                                            setFilterType('Indifferent (all)')
                                            setDrop({
                                                isActive1: false,
                                                isActive2: false
                                            })
                                            productsFilterHandler('Indifferent')
                                        }}
                                    >
                                        Indifferent (all)
                                    </li>
                                </ul>
                            )}
                        </Transition>
                    </div>

                    {filterType === 'Brand' ? size.width > 790 ?
                        <BrandSelector
                            drop={drop.isActive2}
                            dropHandler={dropHandler}
                            shutHandler={shutHandler}
                            brands={brands}
                            productsFilterHandler={productsFilterHandler}
                        /> :
                        <div className='filter-sub-wrapper'>
                            <BrandSelector
                                drop={drop.isActive2}
                                dropHandler={dropHandler}
                                shutHandler={shutHandler}
                                brands={brands}
                                productsFilterHandler={productsFilterHandler}
                            />
                        </div> : null
                    }

                    {filterType === 'Categories' ? size.width > 790 ?
                        <CategoriesSelector
                            drop={drop.isActive2}
                            dropHandler={dropHandler}
                            productsFilterHandler={productsFilterHandler}
                        /> :
                        <div className='filter-sub-wrapper'>
                            <CategoriesSelector
                                drop={drop.isActive2}
                                dropHandler={dropHandler}
                                productsFilterHandler={productsFilterHandler}
                            />
                        </div> : null
                    }

                </div>
            </div>
        </div>
    )
}

export default ProductsFilter
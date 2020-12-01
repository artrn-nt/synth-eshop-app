import React from 'react'
import gsap from 'gsap'

const ScreenTitle = ({ title }) => {

    // const titleRef = useRef() 

    // useEffect(() => {
    //     gsap.from(titleRef.current, {
    //         delay: .8,
    //         duration: .9,
    //         yPercent: 100,
    //         ease: 'power3.out'
    //     })
    // }, [])

    return (
        <div className='title-wrapper'>
            <h2>{title}</h2>
        </div>
    )
}

export default ScreenTitle

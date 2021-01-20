import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { ActionBtn } from './ActionBtnLink'
import useWindowSize from '../../utils/useWindowSize'
import '../../scss/components/utilities/AdminConfirmAlert.scss'

const AdminConfirmAlert = ({ objectID, confirm, objectIDHandler, confirmHandler, actionHandler, text }) => {

    const size = useWindowSize()

    const [cancel, setCancel] = useState(null)

    useEffect(() => {
        gsap.fromTo('.confirm-alert.fade-in', {
            yPercent: -30,
            opacity: 0
        }, {
            yPercent: -50,
            opacity: 1,
            duration: .65,
            ease: 'power3.out'
        })
    }, [])

    useEffect(() => {
        if (cancel !== null) {
            gsap.fromTo('.confirm-alert.fade-out', {
                yPercent: -50,
                opacity: 1
            }, {
                yPercent: -70,
                opacity: 0,
                duration: .55,
                ease: 'power2.out',
                onComplete: () => {
                    if (cancel) {
                        setCancel(null)
                        objectIDHandler(null)
                    } else {
                        setCancel(null)
                        actionHandler(objectID)
                    }
                }
            })
        }
    }, [cancel, objectID, objectIDHandler, actionHandler])

    return (
        <div
            className={confirm ? 'confirm-alert fade-in' : 'confirm-alert fade-out'}
            style={{
                left: size.width < 320 && '1.6125rem',
                transform: size.width < 320 && 'translate3d(0, -50%, 0)'
            }}
        >
            <span>{text}?</span>
            <div className='btns-row'>
                <ActionBtn
                    type='button'
                    className='cancel-btn-admin'
                    onClickHandler={() => {
                        confirmHandler(false)
                        setCancel(true)
                    }}
                >
                    Cancel
                </ActionBtn>
                <ActionBtn
                    type='button'
                    className='confirm-btn-admin'
                    onClickHandler={() => {
                        confirmHandler(false)
                        setCancel(false)
                    }}
                >
                    Confirm
                </ActionBtn>
            </div>
        </div>
    )
}

export default AdminConfirmAlert

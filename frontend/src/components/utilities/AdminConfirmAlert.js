import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { ActionBtn } from './ActionBtnLink'
import '../../scss/components/utilities/AdminConfirmAlert.scss'

const AdminConfirmAlert = ({ objectID, confirm, objectIDHandler, confirmHandler, actionHandler, text }) => {

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
        <div className={confirm ? 'confirm-alert fade-in' : 'confirm-alert fade-out'}>
            <span>{text}?</span>
            <div className='btns-row'>
                <ActionBtn
                    type='button'
                    className='cancel-btn-admin'
                    onClickHandler={() => {
                        confirmHandler(false)
                        setCancel(true)
                    }}
                    text='Cancel' />
                <ActionBtn
                    type='button'
                    className='confirm-btn-admin'
                    onClickHandler={() => {
                        confirmHandler(false)
                        setCancel(false)
                    }}
                    text='Confirm' />
            </div>
        </div>
    )
}

export default AdminConfirmAlert

import React, { useState, useEffect } from 'react'
import gsap from 'gsap'
import { ActionBtn } from './ActionBtnLink'
import '../../scss/components/utilities/DeleteConfirm.scss'

const DeleteConfirm = ({ eraseId, confirm, eraseIdHandler, confirmHandler, deleteHandler, text }) => {

    const [cancel, setCancel] = useState(null)

    useEffect(() => {
        gsap.fromTo('.delete-confirm.fade-in', {
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
            gsap.fromTo('.delete-confirm.fade-out', {
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
                        eraseIdHandler(null)
                    } else {
                        setCancel(null)
                        deleteHandler(eraseId)
                    }
                }
            })
        }
    }, [cancel, eraseId, eraseIdHandler, deleteHandler])

    return (
        <div className={confirm ? 'delete-confirm fade-in' : 'delete-confirm fade-out'}>
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

export default DeleteConfirm

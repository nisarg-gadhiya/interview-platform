import React from 'react'
import { BsClock } from 'react-icons/bs'

const OATimer = ({ timeRemaining }) => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    const isLowTime = timeRemaining < 300 // Less than 5 minutes
    const isCritical = timeRemaining < 60  // Less than 1 minute

    const formatTime = (val) => String(val).padStart(2, '0')

    return (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${
            isCritical ? 'bg-red-100 text-red-700 animate-pulse' :
            isLowTime ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
        }`}>
            <BsClock size={18} />
            <span>{formatTime(minutes)}:{formatTime(seconds)}</span>
        </div>
    )
}

export default OATimer

import Link from 'next/link'
import React from 'react'

function LinkComponent(currentVal) {
    return (
        <div>
            <Link href={`scales/${currentVal.currentVal.ScaleID}/${currentVal.currentVal.ScaleMetric?.toLowerCase()}/${currentVal.currentVal.ScaleMetricType?.toLowerCase()}`}>
                <a>{currentVal.currentVal.ScaleName}</a>
            </Link>
            {currentVal.currentVal.ScaleType === "Default" && "   *"}
        </div>
    )
}

export default LinkComponent
import React from 'react'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
    return (
        <div className="flex justify-center items-center w-full h-[90vh] gap-4 flex-col">
            <div className="flex gap-2 items-center">
                <h2 className="text-2xl">404 not found</h2>
                <div className="bg-[var(--cta-color)] text-lg p-1">Chatify</div>
            </div>

            <Link to="/" className="text-[var(--cta-color)]">Back to home</Link>
        </div>
    )
}

export default PageNotFound

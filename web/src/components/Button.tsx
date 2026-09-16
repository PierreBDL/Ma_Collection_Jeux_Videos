import type React from "react";

interface ButtonProps {
    children: React.ReactNode
    handleClick: () => void
    isDisable: boolean
}

export default function Button ({children, handleClick, isDisable = false}: ButtonProps) {
    return (
        <button disabled={isDisable} onClick={() => handleClick()}>{children}</button>
    )
}
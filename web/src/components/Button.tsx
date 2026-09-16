import type React from "react";

interface ButtonProps {
    children: React.ReactNode
    handleClick: () => void
    isDisable: boolean
    style?: string
}

export default function Button ({children, handleClick, isDisable = false, style}: ButtonProps) {
    return (
        <button className={style} disabled={isDisable} onClick={() => handleClick()}>{children}</button>
    )
}
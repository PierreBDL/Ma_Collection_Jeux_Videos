import Button from './Button'
import React from 'react'

import {UseTheme} from '../hooks/Theme'

interface FormProps {
    title: string
    setters: {
        setEmail: (value: string) => void
        setPassword: (value: string) => void
    }
    getters: {
        email: string
        password: string
    }
    action: () => void
    error?: string

    // Pour le nom
    isRegisterPage: boolean
    name?: {
        valueName: string
        setValueName: (value: string) => void
    }
}

export default function Form ({title, setters, getters, action, error, isRegisterPage, name}: FormProps) {
    
    // Hook Theme
    const { theme, ToggleTheme } = UseTheme()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        action()
    }

    return (
        <div className={`w-full max-w-sm p-6 rounded-lg border ${theme === "light" ? "border-black bg-white text-gray-800" : "border-white bg-slate-600 text-white" }`}>
            <h1 className="text-xl font-semibold text-center mb-4">{title}</h1>
            <form onSubmit={handleSubmit} className="flex flex-col font-medium gap-4">

                {isRegisterPage && (
                    <div className="flex flex-col font-medium gap-4">
                        <label>Name :</label>
                        <input className={`${theme === "dark" ? "border-black bg-white text-gray-800" : "border-white bg-slate-600 text-white"} p-1 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm`} type="text" value={name?.valueName} onChange={(e) => name?.setValueName(e.target.value)} required />    
                    </div>
                )}

                <label>Email :</label>
                <input className="p-1 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" type="email" value={getters.email} onChange={(e) => setters.setEmail(e.target.value)} required />
                
                <label>Mot de passe :</label>
                <input className="p-1 border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" type="password" value={getters.password} onChange={(e) => setters.setPassword(e.target.value)} required />

                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Button style="rounded-lg mt-2 p-2 bg-blue-500 hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer" isDisable={false} handleClick={() => {}}>{title}</Button>
            </form>
        </div>
    )
}
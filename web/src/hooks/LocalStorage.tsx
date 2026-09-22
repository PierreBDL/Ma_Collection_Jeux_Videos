import {useState, useEffect} from 'react'

export function useLocalStorage<T>(key: string, InitialValue: T): [T, (v: T) => void] {
    const [value, setValue] = useState(() => {
        try {
            const result = localStorage.getItem(key)
            return result ? (JSON.parse(result) as T) : InitialValue
        } catch {
            return InitialValue
        }
    })

    useEffect(() => {
    try { 
      localStorage.setItem(key, JSON.stringify(value)); 
    }
    catch {}
  }, [key, value]);

  return [value, setValue];
}
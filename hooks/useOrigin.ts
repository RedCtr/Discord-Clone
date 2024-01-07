"use client"

import { useEffect, useState } from "react"

const useOrigin = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : ""

    if (!isMounted) return ""

    return origin


}

export default useOrigin
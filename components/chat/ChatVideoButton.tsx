"use client"
import React from 'react'
import ActionTooltip from '../ActionTooltip'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import queryString from 'query-string'
import { Video, VideoOff } from 'lucide-react'

const ChatVideoButton = () => {
    const pathname = usePathname()
    const searchParam = useSearchParams()
    const router = useRouter()
    const isVideo = searchParam?.get("video")

    const Icon = isVideo ? VideoOff : Video
    const tooltipLabel = isVideo ? "End video call" : "Start video call"

    const onClick = () => {
        const url = queryString.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideo ? undefined : true 
            }
        },{skipNull: true})

        router.push(url)
    }
    
  return (
    <ActionTooltip side='bottom' label={tooltipLabel}>
        <button
        onClick={onClick}
        className='hover:opacity-75 transition mr-4'
        >
            <Icon className='w-6 h-6 text-zinc-500 dark:text-zinc-400' />

        </button>
    </ActionTooltip>
  )
}

export default ChatVideoButton
import { useSocket } from "@/components/providers/SocketProvider"
import { useInfiniteQuery } from "@tanstack/react-query"
import queryString from "query-string"

type ChatQueryType = {
    queryKey: string,
    apiUrl: string,
    paramKey: "channelId" | "conversationId",
    paramValue: string
}
const useChatQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue
}: ChatQueryType) => {

    const { isConnected } = useSocket()

    const fetchMessages = async ({ pageParam = undefined }) => {
        const url = queryString.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue,
            }
        }, { skipNull: true })

        const res = await fetch(url)
        return res.json()
    }

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        // if we're not connected to socket the query will pull the messages every 1s
        refetchInterval: isConnected ? false : 1000,
    })

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    }

}

export default useChatQuery
import { Channel, ChannelType, Server } from "@prisma/client"
import { create } from "zustand"
export type ModalType = "createServer" | "invite" | "editServer"
    | "members" | "createChannel" | "leaveServer" | "deleteServer"
    | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage"

type ServerData = {
    server?: Server,
    channel?: Channel
    channelType?: ChannelType,
    apiUrl?: string,
    query?: Record<string, any>
}
type ModalStore = {
    data: ServerData,
    type: ModalType | null,
    isOpen: boolean,
    onOpen: (type: ModalType, data?: ServerData) => void
    onClose: () => void
}

const useModalStore = create<ModalStore>((set) => ({
    data: {},
    type: null,
    isOpen: false,
    onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
    onClose: () => set({ isOpen: false, type: null })

}))

export default useModalStore
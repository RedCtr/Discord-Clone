import { create } from "zustand"
export type ModalType = "createServer"

type ModalStore = {
    type: ModalType | null,
    isOpen: boolean,
    onOpen: (type: ModalType) => void
    onClose: () => void
}

const useModalStore = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    onOpen: (type) => set({ isOpen: true, type }),
    onClose: () => set({ isOpen: false, type: null })

}))

export default useModalStore
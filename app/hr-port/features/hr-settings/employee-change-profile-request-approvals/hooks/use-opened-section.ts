import { create } from "zustand"

export type UseOpenedSection = {
  openedSectionId: string
  openSection: (id: string | number) => void
}

const useOpenedSection = create<UseOpenedSection>((set) => ({
  openedSectionId: "",
  openSection: (id) => set({ openedSectionId: id.toString() }),
}))

export default useOpenedSection

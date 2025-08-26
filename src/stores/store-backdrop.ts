import { create } from "zustand";

type StoreBackdrop = {
    show: 'visible'|'invisible';
    toggle: (show: 'visible'|'invisible') => void;

};

export const useStoreBackdrop = create<StoreBackdrop>((set) => ({
    show: "invisible",
    toggle: (show) => set({ show })
}));
import { create } from "zustand";
import { persist } from "zustand/middleware";

type StoreLocale = {
    locale:string;
    setLocale:(locale:string) => void;

}

export const useStoreLocale = create<StoreLocale>()(
    persist((set) => ({
        locale:"en",
        setLocale:(locale) => set({locale})
    }),{
        name:"locale"
    })
)
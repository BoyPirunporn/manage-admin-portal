// stores/useMenuStore.ts
import { MenuModel } from "@/model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type MenuState = {
    menus: MenuModel[] | null;
    loading: boolean;
    setMenus: (menus: MenuModel[]) => void;
    clear: () => void;
};

export const useStoreMenu = create<MenuState>()(
    persist(
        (set) => ({
            menus: null,
            loading: false,
            setMenus: (menus) => set({ menus }),
            clear: () => set({ menus: null }),
        }),
        { name: "app-menus" } // localStorage key
    )
);

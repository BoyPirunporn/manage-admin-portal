'use client';
import Backdrop from '@/components/backdrop';
import { useStoreBackdrop } from '@/stores/store-backdrop';

const BackdropProvider = () => {
    const { show } = useStoreBackdrop();
    return show === "visible" ? <Backdrop /> : null;
};

export default BackdropProvider;
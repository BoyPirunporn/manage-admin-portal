"use client";
import { Button } from '@/components/ui/button';
import { useActivityLog } from '@/hooks/use-activity-log';
import { useStoreMenu } from '@/stores/store-menu';
import useStoreModal from '@/stores/store-model';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

const ProtectRoute = ({
    children
}:{
    children:React.ReactElement
}) => {
    const { data: session } = useSession();

    React.useEffect(() => {

        if (session?.error || session?.error === "RefreshAccessTokenError") {
            signOut({ redirect:false});
            useStoreMenu.getState().clear()
            useActivityLog().log("SIGNOUT", "TOKEN:EXPIRED")
            useStoreModal.getState().openModal({
                title: "UnAuthorization",
                showCloseButton: false,
                onInteractOutside:false,
                content: (
                    <div className='flex flex-col gap-3'>
                        <p>{session.error}</p>
                        <Button className='ml-auto' onClick={() => window.location.href = "/auth"}>OK</Button>
                    </div>
                )
            });
        }
    }, [session]);
   
    return children;
};

export default ProtectRoute;
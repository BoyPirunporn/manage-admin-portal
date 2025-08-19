"use client";

import { Button } from "@/components/ui/button";
import { useActivityLog } from "@/hooks/use-activity-log";
import { useStoreMenu } from "@/stores/store-menu";
import useStoreModal from "@/stores/store-model";
import { useStoreUser } from "@/stores/store-user";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const ProtectRoute = ({ children }: { children: React.ReactElement; }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { user: session } = useStoreUser();
    const { log } = useActivityLog();

    // helper: clear session + menu
    const clearSession = React.useCallback(() => {
        useStoreMenu.getState().clear();
        useStoreUser.getState().clearUser();
    }, []);

    // helper: handle expired token
    const handleTokenExpired = React.useCallback(() => {
        signOut({ redirect: false });
        clearSession();
        log("SIGNOUT", "TOKEN:EXPIRED");

        useStoreModal.getState().openModal({
            title: "UnAuthorization",
            showCloseButton: false,
            onInteractOutside: false,
            content: (
                <div className="flex flex-col gap-3">
                    <p>{session?.error}</p>
                    <Button className="ml-auto" onClick={() => (window.location.href = "/auth")}>
                        OK
                    </Button>
                </div>
            ),
        });

        setTimeout(() => {
            window.location.href = "/auth";
        }, 15 * 1000);
    }, [clearSession, log, session?.error]);

    React.useEffect(() => {
        if (!session) return;

        if (session.error === "RefreshAccessTokenError") {
            handleTokenExpired();
            return;
        }

        
    }, [session, pathname, handleTokenExpired,router]);

    return !session ? null :children;
};

export default ProtectRoute;

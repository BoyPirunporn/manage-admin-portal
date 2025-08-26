"use client";

import { Button } from "@/components/ui/button";
import { useActivityLog } from "@/hooks/use-activity-log";
import report from "@/lib/report";
import { useStoreMenu } from "@/stores/store-menu";
import useStoreModal from "@/stores/store-model";
import { useStoreUser } from "@/stores/store-user";
import { signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const ProtectRoute = ({ children }: { children: React.ReactElement; }) => {
    const pathname = usePathname();
    const locale = useLocale();
    const router = useRouter();
    const { user: session } = useStoreUser();
    const { log } = useActivityLog();

    // helper: clear session + menu
    const clearSession = React.useCallback(() => {
        useStoreMenu.getState().clear();
        useStoreUser.getState().clearUser();
    }, []);

    // helper: handle expired token
    const handleTokenExpired = React.useCallback(async () => {
        try {
            // await handleClearSession();
            await signOut({ redirect: false });
            clearSession();
            log("SIGNOUT", "TOKEN:EXPIRED");
            useStoreModal.getState().openModal({
                title: "UnAuthorization",
                showCloseButton: false,
                onInteractOutside: false,
                content: (
                    <div className="flex flex-col gap-3">
                        <p>Session Timeout!</p>
                        <Button className="ml-auto" onClick={() => {
                            useStoreModal.getState().closeAllModals();
                            router.replace(`/${locale}/auth`);
                        }}>
                            OK
                        </Button>
                    </div>
                ),
            });

            setTimeout(() => {
                router.replace(`/${locale}/auth`);
                useStoreModal.getState().closeAllModals();
            }, 15 * 1000);
        } catch (error) {
            report(error);
            return;
        }
    }, [clearSession, log, session?.error]);

    React.useEffect(() => {
        if (!session) return;

        if (session.error === "RefreshAccessTokenError") {
            handleTokenExpired();
            return;
        }


    }, [session, pathname, handleTokenExpired, router]);

    return !session ? null : children;
};

export default ProtectRoute;

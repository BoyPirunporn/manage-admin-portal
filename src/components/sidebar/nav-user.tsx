"use client";

import {
    ChevronsUpDown,
    KeyRound,
    LogOut,
    User2
} from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useActivityLog } from "@/hooks/use-activity-log";
import { useStoreMenu } from "@/stores/store-menu";
import { useStoreUser } from "@/stores/store-user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { handleClearSession } from "@/lib/auth/auth";

export function NavUser() {
    const { isMobile } = useSidebar();
    const { user: session } = useStoreUser();
    const router = useRouter();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild className="cursor-pointer">
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={"https://github.com/shadcn.png"} alt={session?.user?.name!} />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{session?.user?.firstName}</span>
                                <span className="truncate text-xs">{session?.user?.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={"https://github.com/shadcn.png"} alt={session?.user?.name!} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate text-xs">{session?.user?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href={"/settings/profile"} onClick={() => useActivityLog().log("CLICK_MENU", "USER:PROFILE", { form: "menu-user" })}>
                                    <User2 />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={"/settings/change-password"} onClick={() => useActivityLog().log("CLICK_MENU", "USER:CHANGE_PASSWORD", { form: "menu-user" })}>
                                    <KeyRound />
                                    Change password
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={async () => {
                            await useActivityLog().log("SIGNOUT", "USER:SIGNOUT", { form: "menu-user" });
                            await handleClearSession();
                            await signOut({ redirect: false });
                            useStoreMenu.getState().clear();
                            useStoreUser.getState().clearUser();
                            router.push("/auth");
                        }}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

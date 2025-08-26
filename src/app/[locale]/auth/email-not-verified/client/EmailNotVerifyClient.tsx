'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import { useEffect } from "react";


const EmailNotVerifyClient = ({
    message = "Please check your email to verify your account."
}: {
    message: string;
}) => {
    useEffect(() => {
        signOut({ redirect: false });
        const timeout = setTimeout(() => {
            window.location.href = "/auth"
        }, 2 * 60 * 1000); // ไม่มีการกด logout ภายใน2 จะทำการ logout ให้อัตโนมัต ไม่ค้างในระบบ

        return () => {
            clearTimeout(timeout);
        };
    }, []);
    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-lg font-bold">
                    Oops! Your account is not verified.
                </CardTitle>
            </CardHeader>
            <CardContent>
                <h1 className="text-base">{message}</h1>
            </CardContent>
            {/* <CardFooter className="flex-col gap-2">
                <Button onClick={() => signOut({ redirect: true, callbackUrl: "/auth?not-verification-email" })} type="button" className="w-full">
                    LogOut
                </Button>
            </CardFooter> */}
        </Card>
    );
};

export default EmailNotVerifyClient;
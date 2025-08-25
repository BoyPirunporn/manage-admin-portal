'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "next-auth/react";

const VerifyEmailPage = () => {
  return (
    <div className="flex m-auto justify-center items-center min-h-screen relative">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Oops! Your account is not verified.
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h1 className="text-base">Please check your email to verify your account.</h1>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button onClick={() => signOut({ redirect: true, callbackUrl: "/auth" })} type="button" className="w-full">
            LogOut
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
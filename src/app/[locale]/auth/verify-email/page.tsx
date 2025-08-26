import { redirect } from "next/navigation";
import VerifyEmailClient from "./client/VerifyEmailClient";

interface VerifyEmailPageProps {
    searchParams: Promise<{
        token: string;
    }>;
}
const VerifyEmailPage = async ({
    searchParams
}: VerifyEmailPageProps) => {
    const { token } = await searchParams;
    console.log({token})
    if (!token) {
        return redirect("/auth/email-not-verified?message=Invalid Token");
    }
    return (
        <VerifyEmailClient token={token} />
    );
};

export default VerifyEmailPage;
import { redirect } from "next/navigation";
import { verifyToken } from "./action";
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
    if (!token) {
        return redirect("/auth/email-not-verified?message=Invalid Token");
    }
    const response = await verifyToken(token);
    if (!response.isValid) {
        return redirect("/auth/email-not-verified?message=Invalid Token");
    }
    return (
       <VerifyEmailClient token={token} />
    );
};

export default VerifyEmailPage;
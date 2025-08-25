import Backdrop from "@/components/backdrop";

interface VerifyEmailPageProps {
    searchParams: Promise<{
        referenceId: string;
        token: string;
    }>;
}
const VerifyEmailPage = async ({
    searchParams
}: VerifyEmailPageProps) => {
    const { token, referenceId } = await searchParams;
    // if (!token || !referenceId) {
    //     return notFound();
    // }
    return (
        <Backdrop />
    );
};

export default VerifyEmailPage;
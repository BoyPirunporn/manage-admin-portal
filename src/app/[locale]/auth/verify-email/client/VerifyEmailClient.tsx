'use client';
import Backdrop from '@/components/backdrop';
import logger from '@/lib/logger';
import { ResponseApi } from '@/model';
import useStoreModal from '@/stores/store-model';
import axios, { isAxiosError } from 'axios';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const VerifyEmailClient = ({
    token
}: {
    token: string;
}) => {
    const router = useRouter();
    const locale = useLocale();
    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                router.replace("/auth/email-not-verified?message=Invalid Token Or Expired Token");
                return;
            }

            try {
                // 🔹 เรียก API verify token
                const { data } = await axios.post<ResponseApi>("/api/verify-email", { token });

                logger.debug({ data });
                // 🔹 สำเร็จ -> redirect ไปหน้า success
                useStoreModal.getState().openModal({
                    title: "Verify Email",
                    content: `${data.message}, Please waiting we taking you to the login page`,
                    showCloseButton:false,
                });
                setTimeout(() => {
                    useStoreModal.getState().closeModal();
                    router.replace(`/${locale}/auth`);
                }, 2000);
            } catch (error) {
                if (isAxiosError<ResponseApi>(error)) {
                    logger.debug(error.response?.data.message);
                    router.replace(`/${locale}/auth/email-not-verified?message=` + (error.response?.data.message ?? ""));
                    return;
                }
                router.replace(`/${locale}/auth/email-not-verified?message=Invalid Token Or Token Expired`);
                return;
            } 
        };
        verifyEmail();
    }, [token, router]);
    return (
        <Backdrop />
    );
};

export default VerifyEmailClient;
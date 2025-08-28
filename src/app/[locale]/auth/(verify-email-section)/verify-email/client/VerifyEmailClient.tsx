'use client';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormInputField } from '@/components/ui/form-input';
import { useRouter } from '@/i18n/navigation';
import logger from '@/lib/logger';
import report from '@/lib/report';
import { ResponseApi } from '@/model';
import useStoreModal from '@/stores/store-model';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { isAxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const getVerifyEmailSchema = (t: (key: string, values?: Record<string, string>) => string) => z.object({
    token: z.string(),
    password: z.string(t("validators.required.password", {
        label: t("common.password")
    })).regex(pwdRegex, t("validators.invalid.password", { label: t("common.password") })),
    confirmPassword: z.string(t("validators.required.password", { label: t("common.confirmPassword") })).regex(pwdRegex, t("validators.invalid.password", { label: t("common.password") }))
}).superRefine((data, context) => {
    if (!data.confirmPassword || data.password !== data.confirmPassword) {
        context.addIssue({
            code: "custom",
            message: t("validators.notMatching.password", {
                label: t("common.password")
            }),
            path: ["Password"]
        });

        context.addIssue({
            code: "custom",
            message: t("validators.notMatching.password", {
                label: t("common.password")
            }),
            path: ["confirmPassword"]
        });

    }
});

type VerifyEmailSchema = z.infer<ReturnType<typeof getVerifyEmailSchema>>;

const VerifyEmailClient = ({
    token
}: {
    token: string;
}) => {
    const t = useTranslations();


    const verifySchema = useMemo(() => getVerifyEmailSchema(t), [t]);

    const router = useRouter();
    const modal = useStoreModal();
    const form = useForm<VerifyEmailSchema>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            token,
            password: "",
            confirmPassword: ""
        }
    });

    const handleSubmit = async (data: VerifyEmailSchema) => {
        if (!token) {
            router.replace("/auth/email-not-verified?message=Invalid Token Or Expired Token");
            return;
        }

        try {
            // 🔹 เรียก API verify token
            const { data:response } = await axios.post<ResponseApi>("/api/verify-email", data);

            logger.debug({ response });
            // 🔹 สำเร็จ -> redirect ไปหน้า success
            modal.openModal({
                title: "Verify Email",
                content: `${response.message}, Please waiting we taking you to the login page`,
                showCloseButton: false,
            });

        } catch (error) {
            if (isAxiosError<ResponseApi>(error)) {
                logger.debug(error.response?.data.message);
                modal.openModal({
                    title: "Error",
                    content: `${report(error)}`,
                    showCloseButton: false,
                });
                return;
            }
            router.replace(`/auth/email-not-verified?message=Invalid Token Or Token Expired`);
            return;
        } finally {
            setTimeout(() => {
                modal.closeAllModals();
                router.replace(`/auth`);
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center ">
            <div className="w-md max-w-md border border-primary p-10 rounded-sm flex flex-col">
                <div className="m-auto mb-7">
                    <Heading title={t("common.verifyEmailHeading")} />
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-5 '>
                        <FormInputField type="password" control={form.control} name='password' label={t("common.password")} />
                        <FormInputField type="password" control={form.control} name='confirmPassword' label={t("common.confirmPassword")} />
                        <Button>{t("common.btnSubmit")}</Button>
                    </form>
                </Form>
            </div>
        </div>
        // <Backdrop />
    );
};

export default VerifyEmailClient;
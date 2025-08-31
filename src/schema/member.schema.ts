import { z } from 'zod';
export const getMemberSchema = (t: (key: string, values?: Record<string, string>) => string) => z.object({
    id: z.string().nullable(),
    email: z.string().min(1, t("validators.required.text", { field: t("common.email") })),
    firstName: z.string().min(1, t("validators.required.text", { field: t("member.firstName") })),
    lastName: z.string().min(1, t("validators.required.text", { field: t("member.lastName") })),
    roleId: z.string().min(1, t("validators.required.text", { field: t("member.role") })),
});


export type MemberSchema = z.infer<ReturnType<typeof getMemberSchema>>;

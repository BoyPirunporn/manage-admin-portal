export const PATH = {
    DASHBOARD: "/dashboard",
    SETTINGS: {
        MEMBER: {
            LIST: "/settings/member",
            CREATE: "/settings/member/create",
            VIEW: (id: string) => `/settings/member/${id}/view`,
            UPDATE: (id: string) => `/settings/member/${id}/update`
        },
        ROLE:{
            LIST: "/settings/roles",
            CREATE: "/settings/roles/create",
            VIEW: (id: string) => `/settings/roles/${id}/view`,
            UPDATE: (id: string) => `/settings/roles/${id}/update`
        },
        ACTIVITY_LOGS:{
            LIST: "/settings/activity-logs",
            CREATE: "/settings/activity-logs/create",
            VIEW: (id: string) => `/settings/activity-logs/${id}/view`,
            UPDATE: (id: string) => `/settings/activity-logs/${id}/update`
        }
    }
};
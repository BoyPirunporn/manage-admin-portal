export const RouteBuilder = (locale: string) => {
   
    return ({
        DASHBOARD: `/${locale}/dashboard`,
        SETTINGS: {
            MEMBER: {
                LIST: `/${locale}/settings/members`,
                CREATE: `/${locale}/settings/members/create`,
                VIEW: (id: string) => `/${locale}/settings/members/${id}/view`,
                UPDATE: (id: string) => `/${locale}/settings/members/${id}/update`
            },
            ROLE: {
                LIST: `/${locale}/settings/roles`,
                CREATE: `/${locale}/settings/roles/create`,
                VIEW: (id: string) => `/${locale}/settings/roles/${id}/view`,
                UPDATE: (id: string) => `/${locale}/settings/roles/${id}/update`
            },
            ACTIVITY_LOGS: {
                LIST: `/${locale}/settings/activity-logs`,
                CREATE: `/${locale}/settings/activity-logs/create`,
                VIEW: (id: string) => `/${locale}/settings/activity-logs/${id}/view`,
                UPDATE: (id: string) => `/${locale}/settings/activity-logs/${id}/update`
            }
        }
    });
};
import GlobalDataTable from "@/components/datatable/global-datatable";
import PermissionGuard from "@/components/guard/PermissionGuard";
import { PATH } from "@/lib/path";

const ActivityLogsPage = () => {
    return (
        <PermissionGuard action={"view"} path={PATH.SETTINGS.ACTIVITY_LOGS.LIST}>
            <GlobalDataTable columns={[
                {
                    accessorKey: "action",
                    header: "Action"
                },
                {
                    accessorKey: "target",
                    header: "Target"
                },
                {
                    accessorKey: "metadata",
                    header: "Metadata",
                    maxSize: 200,
                    minSize: 200
                },
                {
                    accessorKey: "createdAt",
                    header: "Created At"
                },
                {
                    accessorKey: "updatedAt",
                    header: "Updated At"
                },

            ]}
                queryKey='activity-logs-datatable'
                apiUrl={'/api/activity-log/datatable'}
            />
        </PermissionGuard>
    );
};

export default ActivityLogsPage;
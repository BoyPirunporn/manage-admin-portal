import GlobalDataTable from "@/components/datatable/global-datatable";
import PermissionGuard from "@/components/guard/PermissionGuard";
import Heading from "@/components/heading";
import { RouteBuilder } from "@/lib/path";
import { GlobalPropsWithParams } from "@/model";

const ActivityLogsPage = async ({params}:GlobalPropsWithParams) => {
    const {locale} = await params;
    return (
        <PermissionGuard action={"view"} path={RouteBuilder.SETTINGS.ACTIVITY_LOGS.LIST}>
            <div className='mb-5 flex'>
                <Heading title={'Activity Logs'} description='Monitor member actions and system events in real-time.' />
            </div>
            <GlobalDataTable columns={[
                {
                    accessorKey: "action",
                    header: "Action"
                },
                {
                    accessorKey: "target",
                    header: "Target",
                    maxSize: 300,
                    minSize: 300,
                },
                {
                    accessorKey: "metadata",
                    header: "Metadata",
                    maxSize: 300,
                    minSize: 300
                },
                {
                    accessorKey: "actionBy",
                    header: "Action By",
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
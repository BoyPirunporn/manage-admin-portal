"use client"
import GlobalDataTable from '@/components/datatable/global-datatable';
import React from 'react'

const ActivityLogsPage = () => {
  return (
    <div>
        <GlobalDataTable columns={[
            {
                accessorKey:"action",
                header:"Action"
            },
            {
                accessorKey:"target",
                header:"Target"
            },
            {
                accessorKey:"metadata",
                header:"Metadata",
                maxSize:200,
                minSize:200
            },
            {
                accessorKey:"createdAt",
                header:"Created At"
            },
            {
                accessorKey:"updatedAt",
                header:"Updated At"
            },
            
        ]}
        queryKey='activity-logs-datatable'
        apiUrl={'/api/activity-log/datatable'}        
        />
    </div>
  )
}

export default ActivityLogsPage
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const page = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 sm:grid-col-1  md:grid-col-2 xl:grid-cols-3">
        <Skeleton className="bg-muted/50 aspect-video rounded-xl" />
        <Skeleton className="bg-muted/50 aspect-video rounded-xl" />
        <Skeleton className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
};

export default page;
import React from 'react';
import { Button } from './ui/button';
import { Edit, Eye } from 'lucide-react';
import { useActivityLog } from '@/hooks/use-activity-log';

const ColumnAction = ({
    handleEdit,
    handleView
}: Readonly<{
    handleEdit: () => void;
    handleView: () => void;
}>) => {
    return (
        <div className="flex justify-center">
            <Button variant={"ghost"} onClick={() => {
                handleEdit()
            }}>
                <Edit className="w-4 h-4" />
            </Button>
            <Button variant={"ghost"} onClick={handleView}>
                <Eye className="w-4 h-4" />
            </Button>
        </div>
    );
};

export default ColumnAction;
import { withAuth } from "@/app/api/_utils/with-auth";
import { NextRequest } from "next/server";
import { handleDataTableRequest } from "../../../_utils/handle-datatable-request";

export const GET = withAuth( async (req: NextRequest) => handleDataTableRequest(req,"/api/v1/activity-logs/dataTable"));
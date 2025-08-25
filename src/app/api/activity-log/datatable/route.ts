import { NextRequest } from "next/server";
import { handleDataTableRequest } from "../../_utils/handle-datatable-request";

export const GET = async (req: NextRequest) => handleDataTableRequest(req,"/api/v1/activity-logs/dataTable");
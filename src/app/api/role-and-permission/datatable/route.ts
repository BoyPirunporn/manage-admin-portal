import { NextRequest } from "next/server";
import { handleDataTableRequest } from "../../_utils/handle-datatable-request";

export const POST = async (req: NextRequest) => handleDataTableRequest<any[]>(req, "/api/v1/role-permission/datatable");
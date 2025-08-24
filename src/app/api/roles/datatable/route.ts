import { NextRequest } from "next/server";
import { handleDataTableRequest } from "../../_utils/handle-datatable-request";
import { RoleModel } from "@/model";

export const GET = async (req: NextRequest) => handleDataTableRequest<RoleModel[]>(req, "/api/v1/roles/dataTable");
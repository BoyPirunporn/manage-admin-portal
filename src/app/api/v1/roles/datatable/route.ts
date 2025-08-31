import { withAuth } from "@/app/api/_utils/with-auth";
import { RoleModel } from "@/model";
import { NextRequest } from "next/server";
import { handleDataTableRequest } from "../../../_utils/handle-datatable-request";

export const GET = withAuth(async (req: NextRequest) => handleDataTableRequest<RoleModel[]>(req, "/api/v1/roles/dataTable"));
import { UserModel } from "@/model";
import { NextRequest } from "next/server";
import { handleDataTableRequest } from "../../_utils/handle-datatable-request";
import { withAuth } from "../../_utils/with-auth";


export const GET = withAuth(async (req: NextRequest) => handleDataTableRequest<UserModel[]>(req,"/api/v1/users"));
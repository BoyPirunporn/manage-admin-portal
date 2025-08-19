import { UserModel } from "@/model";
import { NextRequest } from "next/server";
import { handleDataTableRequest } from "../_utils/handle-datatable-request";


export const POST = async (req: NextRequest) => handleDataTableRequest<UserModel[]>(req,"/api/v1/user-management/datatable");
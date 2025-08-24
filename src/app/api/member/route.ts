import { UserModel } from "@/model";
import { NextRequest } from "next/server";
import { handleDataTableRequest } from "../_utils/handle-datatable-request";


export const GET = async (req: NextRequest) => handleDataTableRequest<UserModel[]>(req,"/api/v1/users");
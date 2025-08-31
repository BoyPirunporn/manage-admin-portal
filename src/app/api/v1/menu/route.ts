import { MenuModel } from "@/model";
import { NextRequest } from "next/server";
import { handleDataTableRequest } from "../../_utils/handle-datatable-request";

export const POST = async (req: NextRequest) => handleDataTableRequest<MenuModel[]>(req, "/api/v1/menu/datatable");

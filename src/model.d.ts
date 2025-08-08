import * as Icons from "lucide-react";

interface DataTablesOutput<T> {
    draw: number,
    recordsTotal: number,
    recordsFiltered: number,
    data: T[],
    searchPanes?: any,
    error?: string;
}

export interface MenuModel {
    id?: number | null;
    title: string;
    url?: string | null;
    icon?: keyof typeof Icons | null;
    visible: boolean;
    items?: MenuModel[];
    parent?: MenuModel | null;
    isGroup: boolean;
}

interface BaseResponse {
    status: number;
}
interface ResponseApi extends BaseResponse {
    message: string;
}
interface ResponseApiWithPayload<T> extends BaseResponse {
    payload: T;
}
import {Document} from "../../admin/modal/document";

export class MemoType {
    id: number;
    name: string;
    status: any;
    createdAt: string;
    lastModifiedAt: string;
    version: number;
    documents = Array<Document>();
}

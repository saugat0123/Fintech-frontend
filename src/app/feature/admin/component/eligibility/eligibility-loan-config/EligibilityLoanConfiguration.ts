import {Document} from "../../../modal/document";

export class EligibilityLoanConfiguration {

    name: String;
    nature: String;
    id: number;
    status: any;
    createdAt: string;
    lastModifiedAt: string;
    version: number;
    modifiedBy: number;
    new: boolean;
    documents=Array<Document>();


}

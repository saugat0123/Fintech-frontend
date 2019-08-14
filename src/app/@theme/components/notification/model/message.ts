import {DocAction} from '../../../../feature/loan/model/docAction';

export class Message {
    id: number;
    fromRole: number;
    toRole: number;
    toId: number;
    fromId: number;
    customerId: number;
    loanConfigId: number;
    message: string;
    toUserId: number;
    toRoleId: number;
    status: any;
    date: Date;
    docAction: DocAction;

}

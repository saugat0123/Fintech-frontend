import {Injectable} from '@angular/core';

export class Transfersearch {
    branchIds: string;
    documentStatus: string;
    loanConfigId: string;
    loanNewRenew: string;
    currentStageDate: string;
    currentUserRole: string;
    toUser: string;
    customerName: string;
    committee: string;
    companyName: string;
    docAction: string;
    showShareLoanExcessingLimit: string;
    isInsuranceExpired: string;
    postApprovalAssignStatus: string;
    postApprovalAssignedUser: string;
}

@Injectable({
    providedIn: 'root'
})
export class TransferDocService {

    search: Transfersearch = new Transfersearch();

    constructor() {
    }

}

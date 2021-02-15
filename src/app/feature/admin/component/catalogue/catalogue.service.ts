import {Injectable} from '@angular/core';

export class CatalogueSearch {
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
    users: string;
}

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {

    search: CatalogueSearch = new CatalogueSearch();

    constructor() {
    }

}

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
}

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {

    search: CatalogueSearch = new CatalogueSearch();

    constructor() {
    }

}

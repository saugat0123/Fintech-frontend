import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  search: CatalogueSearch = new CatalogueSearch();

  constructor() {
  }

}

export class CatalogueSearch {
  branchIds: string;
  documentStatus: string;
  loanConfigId: string;
  loanNewRenew: string;
  currentStageDate: string;
  currentUserRole: string;
  toUser: string;
  notify: string;
}

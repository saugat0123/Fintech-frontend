import {Injectable} from '@angular/core';
import {DocStatus} from '../../../loan/model/docStatus';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  search: any = {
    branchIds: undefined,
    documentStatus: DocStatus.value(DocStatus.PENDING),
    loanConfigId: undefined,
    currentStageDate: undefined,
    currentUserRole: undefined,
    toUser: undefined
  };

  constructor() {
  }

}

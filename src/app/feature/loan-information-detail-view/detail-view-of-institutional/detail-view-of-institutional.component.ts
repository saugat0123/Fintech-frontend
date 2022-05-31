import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {FiscalYear} from '../../admin/modal/FiscalYear';
import {Proposal} from '../../admin/modal/proposal';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {ProductUtils} from '../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {SiteVisitDocument} from '../../loan-information-template/security/security-initial-form/fix-asset-collateral/site-visit-document';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CombinedLoanService} from '../../service/combined-loan.service';
import {FiscalYearService} from '../../admin/service/fiscal-year.service';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CombinedLoan} from '../../loan/model/combined-loan';
import {IndividualJsonData} from '../../admin/modal/IndividualJsonData';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {Security} from '../../loan/model/security';
import {ProductPaperChecklistComponent} from '../../loan-information-template/product-paper-checklist/product-paper-checklist.component';

@Component({
  selector: 'app-detail-view-of-institutional',
  templateUrl: './detail-view-of-institutional.component.html',
  styleUrls: ['./detail-view-of-institutional.component.scss']
})
export class DetailViewOfInstitutionalComponent implements OnInit {
  @Input() securityValue: Security;
  @Input() loanHolder;
  @ViewChild('productPaperChecklistComponent', {static: false})
  productPaperChecklistComponent: ProductPaperChecklistComponent;
  checklistData;
  @Input() loanDataHolder: LoanDataHolder;
  loans;
  paperChecklist;
  allId;
  constructor() {
  }

  ngOnInit() {
    this.disable();
  }
  updateChecklist(event) {
    this.checklistData = event;
  }
  disable() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder.paperProductChecklist)) {
      const obj = JSON.parse(this.loanDataHolder.paperProductChecklist);
      this.paperChecklist = obj.view;
      this.allId = obj.id;
      const parserData = new DOMParser().parseFromString(this.paperChecklist, 'text/html');
      this.allId.forEach(d => {
        const input = parserData.getElementById(d);
        const child = input.innerHTML;
        if (!child.includes('checked')) {
          input.innerHTML = `<input type="radio" disabled>`;
        }
      });
      this.paperChecklist = parserData.body.innerHTML;
    }
  }
}

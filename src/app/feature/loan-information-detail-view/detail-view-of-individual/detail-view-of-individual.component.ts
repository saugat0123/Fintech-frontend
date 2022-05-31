import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ProductPaperChecklistComponent} from '../../loan-information-template/product-paper-checklist/product-paper-checklist.component';
import {Security} from '../../loan/model/security';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-detail-view-of-individual',
  templateUrl: './detail-view-of-individual.component.html',
  styleUrls: ['./detail-view-of-individual.component.scss']
})
export class DetailViewOfIndividualComponent implements OnInit {
  @Input() securityValue: Security;
  @ViewChild('productPaperChecklistComponent', {static: false})
  productPaperChecklistComponent: ProductPaperChecklistComponent;
  checklistData;
  @Input() loanDataHolder: LoanDataHolder;
  loans;
  paperChecklist;
  allIds = [];
  allId;

  constructor() { }

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

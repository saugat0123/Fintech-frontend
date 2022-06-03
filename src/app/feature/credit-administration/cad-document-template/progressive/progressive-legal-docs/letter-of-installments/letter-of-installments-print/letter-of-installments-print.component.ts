import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-of-installments-print',
  templateUrl: './letter-of-installments-print.component.html',
  styleUrls: ['./letter-of-installments-print.component.scss']
})
export class LetterOfInstallmentsPrintComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input()
  printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  isIndividual = false;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData)) {
      if (this.cadData.assignedLoan[0].loanHolder.customerType.toString() === 'INDIVIDUAL') {
        this.isIndividual = true;
      } else {
        this.isIndividual = false;
      }
    }
  }

}

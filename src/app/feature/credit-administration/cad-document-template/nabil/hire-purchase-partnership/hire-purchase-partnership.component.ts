import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-hire-purchase-partnership',
  templateUrl: './hire-purchase-partnership.component.html',
  styleUrls: ['./hire-purchase-partnership.component.scss']
})
export class HirePurchasePartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

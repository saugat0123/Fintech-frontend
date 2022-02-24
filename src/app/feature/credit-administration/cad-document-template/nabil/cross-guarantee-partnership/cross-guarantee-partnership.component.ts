import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-cross-guarantee-partnership',
  templateUrl: './cross-guarantee-partnership.component.html',
  styleUrls: ['./cross-guarantee-partnership.component.scss']
})
export class CrossGuaranteePartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

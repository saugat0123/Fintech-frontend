import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-land-sub-ordinate-partnership',
  templateUrl: './land-sub-ordinate-partnership.component.html',
  styleUrls: ['./land-sub-ordinate-partnership.component.scss']
})
export class LandSubOrdinatePartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-power-of-attorney-partnership',
  templateUrl: './power-of-attorney-partnership.component.html',
  styleUrls: ['./power-of-attorney-partnership.component.scss']
})
export class PowerOfAttorneyPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

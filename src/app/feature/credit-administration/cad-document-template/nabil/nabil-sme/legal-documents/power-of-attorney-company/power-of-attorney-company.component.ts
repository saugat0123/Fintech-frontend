import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-power-of-attorney-company',
  templateUrl: './power-of-attorney-company.component.html',
  styleUrls: ['./power-of-attorney-company.component.scss']
})
export class PowerOfAttorneyCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

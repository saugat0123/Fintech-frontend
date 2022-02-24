import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-land-sub-ordinate-company',
  templateUrl: './land-sub-ordinate-company.component.html',
  styleUrls: ['./land-sub-ordinate-company.component.scss']
})
export class LandSubOrdinateCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

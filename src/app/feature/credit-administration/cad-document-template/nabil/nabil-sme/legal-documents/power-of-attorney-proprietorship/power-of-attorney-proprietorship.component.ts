import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-power-of-attorney-proprietorship',
  templateUrl: './power-of-attorney-proprietorship.component.html',
  styleUrls: ['./power-of-attorney-proprietorship.component.scss']
})
export class PowerOfAttorneyProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

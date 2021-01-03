import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-fees-commission',
  templateUrl: './fees-commission.component.html',
  styleUrls: ['./fees-commission.component.scss']
})
export class FeesCommissionComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  constructor() { }

  ngOnInit() {
  }

}

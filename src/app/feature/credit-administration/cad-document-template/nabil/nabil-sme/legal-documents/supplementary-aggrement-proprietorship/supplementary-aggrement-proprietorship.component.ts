import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-supplementary-aggrement-proprietorship',
  templateUrl: './supplementary-aggrement-proprietorship.component.html',
  styleUrls: ['./supplementary-aggrement-proprietorship.component.scss']
})
export class SupplementaryAggrementProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

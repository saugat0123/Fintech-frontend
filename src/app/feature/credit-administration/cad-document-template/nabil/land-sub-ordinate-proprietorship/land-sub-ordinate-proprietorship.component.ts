import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-land-sub-ordinate-proprietorship',
  templateUrl: './land-sub-ordinate-proprietorship.component.html',
  styleUrls: ['./land-sub-ordinate-proprietorship.component.scss']
})
export class LandSubOrdinateProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

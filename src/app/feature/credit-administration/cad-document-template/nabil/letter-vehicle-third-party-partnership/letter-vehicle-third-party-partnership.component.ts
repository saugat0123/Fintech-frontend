import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-vehicle-third-party-partnership',
  templateUrl: './letter-vehicle-third-party-partnership.component.html',
  styleUrls: ['./letter-vehicle-third-party-partnership.component.scss']
})
export class LetterVehicleThirdPartyPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-vehicle-third-party-proprietorship',
  templateUrl: './letter-vehicle-third-party-proprietorship.component.html',
  styleUrls: ['./letter-vehicle-third-party-proprietorship.component.scss']
})
export class LetterVehicleThirdPartyProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

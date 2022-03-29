import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-vehicle-namsari-letter-for-hp-loan-print',
  templateUrl: './vehicle-namsari-letter-for-hp-loan-print.component.html',
  styleUrls: ['./vehicle-namsari-letter-for-hp-loan-print.component.scss']
})
export class VehicleNamsariLetterForHpLoanPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  constructor() { }

  ngOnInit() {
  }

}

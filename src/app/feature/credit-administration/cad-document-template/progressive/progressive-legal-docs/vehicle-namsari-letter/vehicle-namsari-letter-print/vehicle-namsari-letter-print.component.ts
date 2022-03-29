import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-vehicle-namsari-letter-print',
  templateUrl: './vehicle-namsari-letter-print.component.html',
  styleUrls: ['./vehicle-namsari-letter-print.component.scss']
})
export class VehicleNamsariLetterPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  constructor() { }

  ngOnInit() {
  }

}

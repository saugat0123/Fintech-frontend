import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-nrb-kyc-print',
  templateUrl: './nrb-kyc-print.component.html',
  styleUrls: ['./nrb-kyc-print.component.scss']
})
export class NrbKycPrintComponent implements OnInit {

  constructor() { }
@Input() printDocForm;
  ngOnInit() {
  }

}

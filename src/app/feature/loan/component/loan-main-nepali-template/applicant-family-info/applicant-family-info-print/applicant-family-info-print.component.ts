import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-applicant-family-info-print',
  templateUrl: './applicant-family-info-print.component.html',
  styleUrls: ['./applicant-family-info-print.component.scss']
})
export class ApplicantFamilyInfoPrintComponent implements OnInit {

  @Input() familyInfo: any;

  constructor() { }

  ngOnInit() {
  }

}

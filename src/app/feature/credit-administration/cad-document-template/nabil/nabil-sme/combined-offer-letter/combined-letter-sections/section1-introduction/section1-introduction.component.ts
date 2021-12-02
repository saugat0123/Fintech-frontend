import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section1-introduction',
  templateUrl: './section1-introduction.component.html',
  styleUrls: ['./section1-introduction.component.scss']
})
export class Section1IntroductionComponent implements OnInit {
  section1: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }
  buildForm() {
    this.section1 = this.formBuilder.group({
      referenceNumber: [undefined],
      /*securities: this.formBuilder.array([]),
      freeTextVal : [undefined],*/
      dateOfApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateOfApplication: [undefined],
      prevSanctionLetterDate: [undefined],
     firstAdditionalDetails: [undefined],
    });
  }
}

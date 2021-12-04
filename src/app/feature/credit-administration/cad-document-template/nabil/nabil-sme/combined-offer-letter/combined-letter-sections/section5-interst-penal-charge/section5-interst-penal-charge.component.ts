import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section5-interst-penal-charge',
  templateUrl: './section5-interst-penal-charge.component.html',
  styleUrls: ['./section5-interst-penal-charge.component.scss']
})
export class Section5InterstPenalChargeComponent implements OnInit {
  section5: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.section5 = this.formBuilder.group({
      interestRate: [undefined],
      /*securities: this.formBuilder.array([]),
      freeTextVal : [undefined],*/
      serviceChargeInFigure: [undefined],
      serviceChargeInWords: [undefined],
      detailsOfFacility: [undefined],
      serviceChargeInPercentage: [undefined],
    });
  }
}

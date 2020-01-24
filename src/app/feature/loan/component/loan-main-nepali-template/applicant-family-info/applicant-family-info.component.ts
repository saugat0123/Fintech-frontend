import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-applicant-family-info',
  templateUrl: './applicant-family-info.component.html',
  styleUrls: ['./applicant-family-info.component.scss']
})
export class ApplicantFamilyInfoComponent implements OnInit {
  applicantFamilyInfo: FormGroup;
  finalData: string;

  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.applicantFamilyInfo = this.formBuilder.group({

      name1: [undefined],
      address1: [undefined],
      relation1: [undefined],
      occupation1: [undefined],
      worksAt1: [undefined],
      contact1: [undefined],

      name2: [undefined],
      address2: [undefined],
      relation2: [undefined],
      occupation2: [undefined],
      worksAt2: [undefined],
      contact2: [undefined],

      name3: [undefined],
      address3: [undefined],
      relation3: [undefined],
      occupation3: [undefined],
      worksAt3: [undefined],
      contact3: [undefined],

      name4: [undefined],
      address4: [undefined],
      relation4: [undefined],
      occupation4: [undefined],
      worksAt4: [undefined],
      contact4: [undefined],

      name5: [undefined],
      address5: [undefined],
      relation5: [undefined],
      occupation5: [undefined],
      worksAt5: [undefined],
      contact5: [undefined],

      name6: [undefined],
      address6: [undefined],
      relation6: [undefined],
      occupation6: [undefined],
      worksAt6: [undefined],
      contact6: [undefined],

      name7: [undefined],
      address7: [undefined],
      relation7: [undefined],
      occupation7: [undefined],
      worksAt7: [undefined],
      contact7: [undefined],

      name8: [undefined],
      address8: [undefined],
      relation8: [undefined],
      occupation8: [undefined],
      worksAt8: [undefined],
      contact8: [undefined],

      name9: [undefined],
      address9: [undefined],
      relation9: [undefined],
      occupation9: [undefined],
      worksAt9: [undefined],
      contact9: [undefined],

      name10: [undefined],
      address10: [undefined],
      relation10: [undefined],
      occupation10: [undefined],
      worksAt10: [undefined],
      contact10: [undefined],

      signature: [undefined],
      name: [undefined],
      date: [undefined],
    });
}
  onSubmit(): void {
    this.finalData = JSON.stringify(this.applicantFamilyInfo.value);
  }
}

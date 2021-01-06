import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-deed-hypo-of-machinery',
  templateUrl: './deed-hypo-of-machinery.component.html',
  styleUrls: ['./deed-hypo-of-machinery.component.scss']
})
export class DeedHypoOfMachineryComponent implements OnInit {

  deepHypoMachinery: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm(){
    this.deepHypoMachinery = this.formBuilder.group({
      hintNumber: [undefined],
      loanLimitInRupees: [undefined],
      loanLimitInAlphabetical: [undefined],
      interestRateAnnually: [undefined],
      interestRatePercentage: [undefined],
      margin: [undefined],
      debtorName: [undefined],
      debtorAddress: [undefined],
      bankDistrict: [undefined],
      bankMetropolitan: [undefined],
      bankAddress: [undefined],
      bankOffice: [undefined],
      nepalMinistry: [undefined],
      department: [undefined],
      officeRegistrationNo: [undefined],
      date: [undefined],
      registeredDate: [undefined],
      registeredCompany: [undefined],
      moderatorName: [undefined],
      ModeratorGrandsonorGrandDaughter: [undefined],
      mSonorDaghter: [undefined],
      mWife: [undefined],
      mMetropolitan: [undefined],
      mVdc: [undefined],
      mAge: [undefined],
      mrs: [undefined],
      mMetropolitanNo: [undefined],
      mDistrictAdministrationOffice: [undefined],
      loanAmountInFuture: [undefined],
      indebtedMetropolitanName: [undefined],
      indebtedWardNo: [undefined],
      debtorName1: [undefined],
      debtorAddress1: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      documentWrittenWeek: [undefined],
      witnessDistrict: [undefined],
      witnessMetropolitan: [undefined],
      witnessVdc: [undefined],
      witnessAge: [undefined],
      witnessEvidence: [undefined]
    });
  }

  submit() {
    console.log(this.deepHypoMachinery.value);
  }

}

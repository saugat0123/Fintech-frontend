import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-hypo-of-stock',
  templateUrl: './hypo-of-stock.component.html',
  styleUrls: ['./hypo-of-stock.component.scss']
})
export class HypoOfStockComponent implements OnInit {

  hypoOfStock: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.hypoOfStock = this.formBuilder.group({
      hintNumber: [undefined],
      loanLimit: [undefined],
      loanLimitInAlphabetical: [undefined],
      interestRateAnnually: [undefined],
      percentage: [undefined],
      margin: [undefined],
      debtorName: [undefined],
      address: [undefined],
      hypothesisAmountInRupees: [undefined],
      loanAmountInWord: [undefined],
      branchOffice: [undefined],
      ministry: [undefined],
      department: [undefined],
      office: [undefined],
      registrationNo: [undefined],
      date: [undefined],
      registeredDate: [undefined],
      proprietaryPartner: [undefined],
      grandDaughter: [undefined],
      sonOrDaughter: [undefined],
      district: [undefined],
      metropolitan: [undefined],
      vdcName: [undefined],
      age: [undefined],
      mrs: [undefined],
      districtAdministrationOffice: [undefined],
      officeName: [undefined],
      indebtedDistrict: [undefined],
      aIndebtedMetropolitan: [undefined],
      aIndebtedWardNo: [undefined],
      aIndebtedAttached: [undefined],
      indebtedName: [undefined],
      indebtedAddress: [undefined],
      companyYear: [undefined],
      companyMonth: [undefined],
      companyDay: [undefined],
      company: [undefined],
      witnessYear: [undefined],
      witnessSignature: [undefined],
      witnessDistrict: [undefined],
      witnessMetropolitan: [undefined],
      witnessVdc: [undefined],
      witnessAge: [undefined],
      witnessEvidence: [undefined]
    });
  }

  submit() {
    console.log(this.hypoOfStock.value);
  }

}

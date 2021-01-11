import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-trust-receipt-nepali-limit',
  templateUrl: './trust-receipt-nepali-limit.component.html',
  styleUrls: ['./trust-receipt-nepali-limit.component.scss']
})
export class TrustReceiptNepaliLimitComponent implements OnInit {

  trustReceiptNepali: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.trustReceiptNepali = this.formBuilder.group({
      loanApprovalDate: [undefined],
      valueOfGoods: [undefined],
      valueOfGoodsInWord: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      serialNo: [undefined],
      paymentDate: [undefined],
      goodsDetialNo: [undefined],
      noOfPackages: [undefined],
      transporterName: [undefined],
      vehicleNo: [undefined],
      debtorName: [undefined],
      debtorAddress: [undefined],
      authorizedPersonSignature: [undefined],
      authorizedPersonName: [undefined],
      bankStaffName: [undefined],
      witnessDistrict1: [undefined],
      witnessMunicipalityOrVdc1: [undefined],
      witnessWardNo1: [undefined],
      witnessAge1: [undefined],
      witnessName1: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipalityOrVdc2: [undefined],
      witnessWardNo2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDay: [undefined],
      docWrittenWeek: [undefined],
    });
  }

  submit() {
    console.log(this.trustReceiptNepali.value);
  }

}

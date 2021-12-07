import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ObjectUtil} from "../../../../../../../../@core/utils/ObjectUtil";
import {EngToNepaliNumberPipe} from "../../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../../../@core/pipe/currency-formatter.pipe";

@Component({
  selector: 'app-section10-security-documents',
  templateUrl: './section10-security-documents.component.html',
  styleUrls: ['./section10-security-documents.component.scss']
})
export class Section10SecurityDocumentsComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  form: FormGroup;
  loanHolderInfo: any;
  tempData: any;
  guarantorData: any;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  finalName;
  constructor(private formBuilder: FormBuilder,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
      this.guarantorDetails();
      this.fillForm();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      loanAmountInFigure: [undefined],
      nameOfBranch: [undefined],
      additionalGuarantorDetails: [undefined],
      guarantorName: [undefined],
    })
  }

  guarantorDetails() {
    if (this.guarantorData.length == 1) {
      let temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    } else if (this.guarantorData.length == 2) {
      for (let i = 0; i < this.guarantorData.length; i++){
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(" र ");
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length-1; i++){
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(" , ");
      let temp1 = JSON.parse(this.guarantorData[this.guarantorData.length-1].nepData);
      this.finalName =  this.allguarantorNames + " र " + temp1.guarantorName.ct;
    }
  }

  fillForm() {
    const proposalData = this.cadOfferLetterApprovedDoc.assignedLoan[0].proposal;
    const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
    let totalLoanAmount = 0;
    this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
      const val = value.proposal.proposedLimit;
      totalLoanAmount = totalLoanAmount + val;
    });
    this.form.patchValue({
      loanAmountInFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount)),
      nameOfBranch: this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
      guarantorName: this.finalName ? this.finalName : '',
    })
  }
}

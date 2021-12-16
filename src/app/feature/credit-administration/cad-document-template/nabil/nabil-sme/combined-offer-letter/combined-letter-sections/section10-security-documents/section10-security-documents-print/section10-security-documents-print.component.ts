import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';

@Component({
  selector: 'app-section10-security-documents-print',
  templateUrl: './section10-security-documents-print.component.html',
  styleUrls: ['./section10-security-documents-print.component.scss']
})
export class Section10SecurityDocumentsPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;
  guarantorData: any;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  finalName;
  tempData;
  proposedAmount;
  loanHolderInfo;
  branchName;
  plotNumber;
  nameOfPropertyOwner;

  constructor( private engToNepNumberPipe: EngToNepaliNumberPipe,
               private currencyFormatPipe: CurrencyFormatterPipe) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.guarantorData = this.customerApprovedDoc.assignedLoan[0].taggedGuarantors;
      this.loanHolderInfo = JSON.parse(this.customerApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      this.branchName = this.loanHolderInfo.branch.ct;
      console.log('Branch Name:', this.loanHolderInfo.branch.ct);
      this.guarantorDetails();
    }
    const securities = this.tempData.securities;
    this.plotNumber = securities.primarySecurity.securityOwnersKittaNo ? securities.primarySecurity.securityOwnersKittaNo : ''
    || securities.secondarySecurity.securityOwnersKittaNo ? securities.secondarySecurity.securityOwnersKittaNo : '',
    this.nameOfPropertyOwner = securities.primarySecurity.securityOwnersName || securities.secondarySecurity.securityOwnersName;
    const proposalData = this.customerApprovedDoc.assignedLoan[0].proposal;
    const loanAmount = this.engToNepNumberPipe.transform(proposalData.proposedLimit);
    let totalLoanAmount = 0;
    this.customerApprovedDoc.assignedLoan.forEach(value => {
      const val = value.proposal.proposedLimit;
      totalLoanAmount = totalLoanAmount + val;
    });
    this.proposedAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoanAmount));
  }

  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      const temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
      }
      this.allguarantorNames = this.guarantorNames.join(' , ');
      const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
    }
  }

}

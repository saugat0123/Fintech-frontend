import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NabilOfferLetterConst} from "../../../../nabil-offer-letter-const";
import {NepaliCurrencyWordPipe} from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../@core/pipe/currency-formatter.pipe";
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";


@Component({
    selector: 'app-retail-mortgage-loan-print',
    templateUrl: './retail-mortgage-loan-print.component.html',
    styleUrls: ['./retail-mortgage-loan-print.component.scss']
})
export class RetailMortgageLoanPrintComponent implements OnInit {
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() letter: any;
    @Input() offerData;
    @Input() security;
    @Input() loanLimit;
    @Input() preview = false;
    loanHolderInfo;
    guarantorName;
    guarantorData;
    branchName;
    proposedAmount;
    customerAddress;
    tempData;
    finalName;
    selectedSecurity;
    loanLimitVal;
    offerLetterConst = NabilOfferLetterConst;
    offerDocumentDetails;
    autoRefNum;
    approvalDate;
    applicationDate;
    guarantorNames: Array<String> = [];
    allguarantorNames;
    nepaliBranchName;

    constructor(public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                public engToNepNumberPipe: EngToNepaliNumberPipe,
                public currencyFormatPipe: CurrencyFormatterPipe,
                private datePipe: DatePipe,
                private engNepDatePipe: EngNepDatePipe) { }

    ngOnInit() {
        this.selectedSecurity = this.security;
        this.loanLimitVal = this.loanLimit;
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.nepaliBranchName = this.cadOfferLetterApprovedDoc.loanHolder.branch.nepaliName + 'मा';
            let totalLoanAmount = 0;
            this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
                const val = value.proposal.proposedLimit;
                totalLoanAmount = totalLoanAmount + val;
            });
            this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
            this.proposedAmount = totalLoanAmount;
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
            if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
                this.customerAddress =  ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality) &&
                        !ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality.ct)) ?
                        this.loanHolderInfo.permanentMunicipality.ct : '') +
                    ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard) &&
                        !ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard.ct)) ?
                        '-' + this.loanHolderInfo.permanentWard.ct : '') +
                    ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict) &&
                        !ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict.ct)) ?
                        ', ' + this.loanHolderInfo.permanentDistrict.ct : '') +
                    ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince) &&
                        !ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince.ct)) ?
                        ' ,' + this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ' : '');
            }
            if (!ObjectUtil.isEmpty(this.guarantorData)) {
                this.guarantorName = this.guarantorParse(this.guarantorData[0].nepData, 'guarantorName');
            }
            this.branchName = this.loanHolderInfo.branch.ct;
        }
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
            // tslint:disable-next-line:max-line-length
            this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
        }
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
            this.autoRefNum = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
        }
        const dateOfApprovalType = this.letter.dateOfApprovalType ?
            this.letter.dateOfApprovalType.en : '';
        if (dateOfApprovalType === 'AD') {
            const tempApprDate = this.letter.dateOfApproval ?
                this.engNepDatePipe.transform(this.datePipe.transform(this.letter.dateOfApproval.en), true) :
                '';
            this.approvalDate = tempApprDate ? tempApprDate : '';
        } else {
            const tempApprNepali = this.letter.dateOfApprovalNepali ?
                this.letter.dateOfApprovalNepali.en.nDate : '';
            this.approvalDate = tempApprNepali ? tempApprNepali : '';
        }

        // For Date of application
        const dateOfApplicationType = this.letter.dateofApplicationType ?
            this.letter.dateofApplicationType.en : '';
        if (dateOfApplicationType === 'AD') {
            const tempAppDate = this.letter.dateofApplication ?
                this.engNepDatePipe.transform(this.datePipe.transform(this.letter.dateofApplication.en), true) :
                '';
            this.applicationDate = tempAppDate ? tempAppDate : '';
        } else {
            const tempAppNep = this.letter.dateofApplicationNepali ?
                this.letter.dateofApplicationNepali.en.nDate : '';
            this.applicationDate = tempAppNep ? tempAppNep : '';
        }
        this.guarantorDetails();
    }
    guarantorParse(nepData, key, trans?) {
        const data = JSON.parse(nepData);
        if (ObjectUtil.isEmpty(trans)) {
            return data[key].ct;
        } else {
            return data[key].en;
        }
    }

    guarantorDetails() {
        if (this.guarantorData.length === 1) {
            let temp = JSON.parse(this.guarantorData[0].nepData);
            this.finalName =  temp.guarantorName.ct;
        } else if (this.guarantorData.length === 2) {
            for (let i = 0; i < this.guarantorData.length; i++) {
                let temp = JSON.parse(this.guarantorData[i].nepData);
                this.guarantorNames.push(temp.guarantorName.ct);
                // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
            }
            // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
            this.allguarantorNames = this.guarantorNames.join(' र ');
            this.finalName = this.allguarantorNames;
        } else {
            for (let i = 0; i < this.guarantorData.length - 1 ; i++) {
                let temp = JSON.parse(this.guarantorData[i].nepData);
                this.guarantorNames.push(temp.guarantorName.ct);
                // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
            }
            // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
            this.allguarantorNames = this.guarantorNames.join(' , ');
            let temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
            this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
        }
    }
}

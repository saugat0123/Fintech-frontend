import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NabilOfferLetterConst} from "../../../../nabil-offer-letter-const";
import {NepaliCurrencyWordPipe} from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../@core/pipe/currency-formatter.pipe";


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

    constructor(public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                public engToNepNumberPipe: EngToNepaliNumberPipe,
                public currencyFormatPipe: CurrencyFormatterPipe) { }

    ngOnInit() {
        console.log('Letter Data:', this.letter);
        this.selectedSecurity = this.security;
        this.loanLimitVal = this.loanLimit;
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            let totalLoanAmount = 0;
            this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
                const val = value.proposal.proposedLimit;
                totalLoanAmount = totalLoanAmount + val;
            });
            this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
            this.proposedAmount = totalLoanAmount;
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
            this.customerAddress =  this.loanHolderInfo.permanentMunicipality.ct + '-' +
                this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct +
                ' ,' + this.loanHolderInfo.permanentProvince.ct;
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
    }
    guarantorParse(nepData, key, trans?) {
        const data = JSON.parse(nepData);
        if (ObjectUtil.isEmpty(trans)) {
            return data[key].ct;
        } else {
            return data[key].en;
        }
    }
}

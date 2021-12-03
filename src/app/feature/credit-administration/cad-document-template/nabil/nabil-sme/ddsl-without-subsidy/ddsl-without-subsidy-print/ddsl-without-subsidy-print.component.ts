import {Component, Input, OnInit} from '@angular/core';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-ddsl-without-subsidy-print',
    templateUrl: './ddsl-without-subsidy-print.component.html',
    styleUrls: ['./ddsl-without-subsidy-print.component.scss']
})
export class DdslWithoutSubsidyPrintComponent implements OnInit {
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
    customerType;
    loanOptions;
    mortgageOptions;
    selectedSecurity;
    offerLetterConst = NabilOfferLetterConst;
    offerDocumentDetails;
    autoRefNum;
    sanctionDate;
    freeInformation;
    previousSanctionDate1;
    applicationDate;
    guarantorNames: Array<String> = [];
    allguarantorNames;
    nepaliBranchName;

    constructor(public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                public engToNepNumberPipe: EngToNepaliNumberPipe,
                public currencyFormatPipe: CurrencyFormatterPipe,
                private datePipe: DatePipe,
                private engNepDatePipe: EngNepDatePipe) {
    }

    ngOnInit() {
        // this.selectedSecurity = this.security;
        // this.loanLimitVal = this.loanLimit;
        this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
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
            this.customerAddress = this.loanHolderInfo.permanentMunicipality.ct + '-' +
                this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct +
                ' ,' + this.loanHolderInfo.permanentProvince.ct;
            if (!ObjectUtil.isEmpty(this.guarantorData)) {
                this.guarantorName = this.guarantorParse(this.guarantorData[0].nepData, 'guarantorName');
            }
            this.branchName = this.loanHolderInfo.branch.ct;
            this.loanOptions = this.tempData.loanOption.ct;
            this.selectedSecurity = this.tempData.securityType.ct;
            this.customerType = this.loanHolderInfo.clientType.en;
            this.mortgageOptions = this.tempData.mortgageType.ct;
        }
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
            // tslint:disable-next-line:max-line-length
            this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
        }
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
            this.autoRefNum = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
        }
        // date of Approval
        const dateOfApprovalType = this.letter.sanctionLetterDateType ?
            this.letter.sanctionLetterDateType.en : '';
        if (dateOfApprovalType === 'AD') {
            const tempApprDate = this.letter.sanctionLetterDate ?
                this.engNepDatePipe.transform(this.datePipe.transform(this.letter.sanctionLetterDate.en), true) :
                '';
            this.sanctionDate = tempApprDate ? tempApprDate : '';
        } else {
            const tempApprNepali = this.letter.sanctionLetterDateNepali ?
                this.letter.sanctionLetterDateNepali.en : '';
            this.sanctionDate = tempApprNepali ? tempApprNepali : '';
        }

        // For Date of application
        const dateOfApplicationType = this.letter.dateOfApplicationType ?
            this.letter.dateOfApplicationType.en : '';
        if (dateOfApplicationType === 'AD') {
            const tempAppDate = this.letter.dateOfApplication ?
                this.engNepDatePipe.transform(this.datePipe.transform(this.letter.dateOfApplication.en), true) :
                '';
            this.applicationDate = tempAppDate ? tempAppDate : '';
        } else {
            const tempAppNep = this.letter.dateOfApplicationNepali ?
                this.letter.dateOfApplicationNepali.en : '';
            this.applicationDate = tempAppNep ? tempAppNep : '';
        }
        // For Previous Sanction Date
        const previousSanctionType = this.letter.previousSanctionType ?
            this.letter.previousSanctionType.en : '';
        if (previousSanctionType === 'AD') {
            const tempPAppDate = this.letter.previousSanctionDate ?
                this.engNepDatePipe.transform(this.datePipe.transform(this.letter.previousSanctionDate.en), true) :
                '';
            this.previousSanctionDate1 = tempPAppDate ? tempPAppDate : '';
        } else {
            const tempPAppNep = this.letter.previousSanctionDateNepali ?
                this.letter.previousSanctionDateNepali.en : '';
            this.previousSanctionDate1 = tempPAppNep ? tempPAppNep : '';
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
            const temp = JSON.parse(this.guarantorData[0].nepData);
            this.finalName = temp.guarantorName.ct;
        } else if (this.guarantorData.length === 2) {
            for (let i = 0; i < this.guarantorData.length; i++) {
                const temp = JSON.parse(this.guarantorData[i].nepData);
                this.guarantorNames.push(temp.guarantorName.ct);
                // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
            }
            // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
            this.allguarantorNames = this.guarantorNames.join(' र ');
            this.finalName = this.allguarantorNames;
        } else {
            for (let i = 0; i < this.guarantorData.length - 1; i++) {
                const temp = JSON.parse(this.guarantorData[i].nepData);
                this.guarantorNames.push(temp.guarantorName.ct);
                // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
            }
            // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
            this.allguarantorNames = this.guarantorNames.join(' , ');
            const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
            this.finalName = this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
        }
    }

}

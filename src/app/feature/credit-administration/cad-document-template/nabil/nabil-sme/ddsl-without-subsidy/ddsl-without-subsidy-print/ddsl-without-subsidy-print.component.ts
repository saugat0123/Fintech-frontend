import {
    Component,
    Input,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {
    NabilOfferLetterConst
} from '../../../../../nabil-offer-letter-const';
import {
    CustomerApprovedLoanCadDocumentation
} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {
    NepaliCurrencyWordPipe
} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {
    EngToNepaliNumberPipe
} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {
    CurrencyFormatterPipe
} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {
    DatePipe
} from '@angular/common';
import {
    EngNepDatePipe
} from 'nepali-patro';
import {
    ObjectUtil
} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-ddsl-without-subsidy-print',
    templateUrl: './ddsl-without-subsidy-print.component.html',
    styleUrls: ['./ddsl-without-subsidy-print.component.scss' ],

})
export class DdslWithoutSubsidyPrintComponent implements OnInit {
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() letter;
    @Input() offerData;
    @Input() security;
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
    sanctionLetterDate;
    freeInformation;
    previousSanctionDate1;
    applicationDate;
    guarantorNames: Array < String > = [];
    allguarantorNames;
    nepaliBranchName;
    personalGuarantorsName: Array < any > = new Array < any > ();
    guarantorParsed: Array < any > = new Array < any > ();
    tempPersonalGuarantors;
    temp2;
    finalPersonalName;
    securityDetails: any;
    tempLandBuilding;
    securityTypeCondition = false;
    securityTypeConditionFixedAssests = false;
    securityTypeConditionStock = false;
    securityTypeConditionAssestsPlants = false;
    securityTypeConditionDocuments = false;
    tempSecondaryLandBuilding;
    securityTypeSecondaryCondition = false;
    securityTypeSecondaryConditionFixedAssests = false;
    securityTypeSecondaryConditionStock = false;
    securityTypeSecondaryConditionAssestsPlants = false;
    securityTypeSecondaryConditionDocuments = false;
    securityTypeConditionLandAndBuilding = false;
    securityTypeConditionLandAndBuildingSecondary = false;
    kittaNumbers: Array < any > = new Array < any > ();
    plotNumber;
    guarantorAmount;
    guarantorAmountWords

    constructor(public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        public engToNepNumberPipe: EngToNepaliNumberPipe,
        public currencyFormatPipe: CurrencyFormatterPipe,
        private datePipe: DatePipe,
        private engNepDatePipe: EngNepDatePipe) {}

    ngOnInit() {
        // this.selectedSecurity = this.security;
        // this.loanLimitVal = this.loanLimit;
        
        this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
            this.securityDetails = this.letter.securities;
        }
        this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.nepaliBranchName = this.cadOfferLetterApprovedDoc.loanHolder.branch.nepaliName + 'मा';
            let totalLoanAmount = 0;
            this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
                const val = value.proposal.proposedLimit;
                totalLoanAmount = totalLoanAmount + val;
            });
            this.proposedAmount = totalLoanAmount;
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
            this.customerAddress = this.loanHolderInfo.registeredMunicipality.ct + '-' +
            this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ' ,' +
            this.loanHolderInfo.registeredProvince.ct;
            this.branchName = this.loanHolderInfo.branch.ct;
            this.loanOptions = this.tempData.loanOption.ct;
            this.selectedSecurity = this.tempData.securityType.ct;
            this.customerType = this.loanHolderInfo.clientType.en;
            this.mortgageOptions = this.tempData.mortgageType.ct;
            this.plotNumber = this.kittaNumbers;
        }
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
            // tslint:disable-next-line:max-line-length
            this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
        }
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
            this.autoRefNum = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
        }
        // date of Approval
        const dateOfApproval = this.letter.sanctionLetterDateType ? this.letter.sanctionLetterDateType.en : '';
        if (dateOfApproval === 'AD') {
            const tempApprDate = this.letter.sanctionLetterDate ?
                this.engNepDatePipe.transform(this.datePipe.transform(this.letter.sanctionLetterDate.en), true) :
                '';
            this.sanctionLetterDate = tempApprDate ? tempApprDate : '';
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
        this.guarantorData.forEach(any => {
            this.guarantorParsed.push(JSON.parse(any.nepData));
        });
        this.guarantorAmount = this.guarantorParse(this.guarantorData[0].nepData, 'gurantedAmount');
        this.guarantorAmountWords = this.nepaliCurrencyWordPipe.transform(this.guarantorParse(this.guarantorData[0].nepData, 'gurantedAmount', 'en'));
        this.guarantorDetails();
        this.checkPrimaryConditions();
        this.checkSecondaryConditions();
        const securities = this.tempData.securities;
        securities.primarySecurity.forEach(pd => {
            pd.propertyDetails.forEach(p => {
                if (!ObjectUtil.isEmpty(p.securityOwnersKittaNoCT)) {
                    this.kittaNumbers.push(p.securityOwnersKittaNoCT);
                }
            });
        });
        securities.secondarySecurity.forEach(pd => {
            pd.propertyDetails.forEach(p => {
                if (!ObjectUtil.isEmpty(p.securityOwnersKittaNoCT)) {
                    this.kittaNumbers.push(p.securityOwnersKittaNoCT);
                }
            });
        });
    }
    getKittaNumbers(plotNumber, kittaNumbers) {
        if (plotNumber.length === 1) {
            kittaNumbers = plotNumber[0];
        }
        if (plotNumber.length === 2) {
            kittaNumbers = plotNumber.join(' र ');
        }
        if (plotNumber.length > 2) {
            for (let i = 0; i < plotNumber.length - 1; i++) {
                this.temp2 = plotNumber.join(' , ');
            }
            const temp1 = plotNumber[plotNumber.length - 1];
            kittaNumbers = this.temp2 + ' र ' + temp1;
        }
        return kittaNumbers ? kittaNumbers : '';
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
        this.tempPersonalGuarantors = this.guarantorParsed.filter(val =>
            val.guarantorType.en === 'Personal Guarantor');
    }

    commonGuarantorDetails(guarantorName, finalName) {
        if (guarantorName.length === 1) {
            finalName = guarantorName[0];
        }
        if (guarantorName.length === 2) {
            finalName = guarantorName.join(' र ');
        }
        if (guarantorName.length > 2) {
            for (let i = 0; i < guarantorName.length - 1; i++) {
                this.temp2 = guarantorName.join(' , ');
            }
            const temp1 = guarantorName[guarantorName.length - 1];
            finalName = this.temp2 + ' र ' + temp1;
        }
        return finalName ? finalName : '';
    }
    checkPrimaryConditions() {
        this.tempLandBuilding = this.securityDetails.primarySecurity.filter(val =>
            val.securityTypeCT === 'LAND' || val.securityTypeCT === 'LAND_AND_BUILDING');
        if (this.securityDetails.primarySecurity.length > 0) {
            this.securityDetails.primarySecurity.forEach(i => {
                if (i.securityTypeCT === 'LAND' || i.securityTypeCT === 'LAND_AND_BUILDING') {
                    this.securityTypeCondition = true;
                }
                if (i.securityTypeCT === 'LAND_AND_BUILDING') {
                    this.securityTypeConditionLandAndBuilding = true;
                }
            });
        }
        if (this.securityDetails.primarySecurity.some(s => s.securityTypeCT === 'FIXED_ASSETS')) {
            this.securityTypeConditionFixedAssests = true;
        }
        if (this.securityDetails.primarySecurity.some(s => s.securityTypeCT === 'STOCK')) {
            this.securityTypeConditionStock = true;
        }
        if (this.securityDetails.primarySecurity.some(s => s.securityTypeCT === 'ASSETS_PLANTS_MACHINERY_AND_OTHER_EQUIPMENTS')) {
            this.securityTypeConditionAssestsPlants = true;
        }
        if (this.securityDetails.primarySecurity.some(s => s.securityTypeCT === 'DOCUMENTS')) {
            this.securityTypeConditionDocuments = true;
        }
    }
    checkSecondaryConditions() {
        this.tempSecondaryLandBuilding = this.securityDetails.secondarySecurity.filter(val =>
            val.securityTypeCT === 'LAND' || val.securityTypeCT === 'LAND_AND_BUILDING');
        if (this.securityDetails.secondarySecurity.length > 0) {
            this.securityDetails.secondarySecurity.forEach(i => {
                if (i.securityTypeCT === 'LAND' || i.securityTypeCT === 'LAND_AND_BUILDING') {
                    this.securityTypeSecondaryCondition = true;
                }
                if (i.securityTypeCT === 'LAND_AND_BUILDING') {
                    this.securityTypeConditionLandAndBuildingSecondary = true;
                }
            });
        }
        if (this.securityDetails.secondarySecurity.some(s => s.securityTypeCT === 'FIXED_ASSETS')) {
            this.securityTypeSecondaryConditionFixedAssests = true;
        }
        if (this.securityDetails.secondarySecurity.some(s => s.securityTypeCT === 'STOCK')) {
            this.securityTypeSecondaryConditionStock = true;
        }
        if (this.securityDetails.secondarySecurity.some(s => s.securityTypeCT === 'ASSETS_PLANTS_MACHINERY_AND_OTHER_EQUIPMENTS')) {
            this.securityTypeSecondaryConditionAssestsPlants = true;
        }
        if (this.securityDetails.secondarySecurity.some(s => s.securityTypeCT === 'DOCUMENTS')) {
            this.securityTypeSecondaryConditionDocuments = true;
        }
    }
}

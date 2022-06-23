import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {NepaliToEngNumberPipe} from '../../../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
    selector: 'app-section4-security-collateral',
    templateUrl: './section4-security-collateral.component.html',
    styleUrls: ['./section4-security-collateral.component.scss']
})
export class Section4SecurityCollateralComponent implements OnInit {
    @Input() cadData;
    form: FormGroup;
    section4Data;
    isPrimaryLandAndBuilding: boolean;
    isPrimary: boolean;
    isSecondaryLandAndBuilding: boolean;
    isSecondary: boolean;
    isTakeOver: boolean;
    isPrimaryAutoLoan: boolean;
    isSecondaryAutoLoan: boolean;
    isPrimaryEducationLoan: boolean;
    isSecondaryEducationLoan: boolean;
    isPrimaryMortgageNew: boolean;
    isPrimaryRemortgage: boolean;
    isPrimaryEnhancement: boolean;
    isPrimaryExisting: boolean;
    isPrimaryShared: boolean;
    isPrimaryEnhancementShared: boolean;
    isPrimaryGuarantee: boolean;
    isPrimarySharedSecurity: boolean;
    isSecondaryMortgageNew: boolean;
    isSecondaryRemortgage: boolean;
    isSecondaryEnhancement: boolean;
    isSecondaryExisting: boolean;
    isSecondaryShared: boolean;
    isSecondaryEnhancementShared: boolean;
    isSecondaryGuarantee: boolean;
    isSecondarySharedSecurity: boolean;
    primaryCollateral: Array<any> = new Array<any>();
    primarySharedSecurity: Array<any> = new Array<any>();
    secondarySharedSecurity: Array<any> = new Array<any>();
    secondaryCollateral: Array<any> = new Array<any>();
    loanName: Array<any> = new Array<any>();
    primaryEdu: Array<any> = new Array<any>();
    secondaryEdu: Array<any> = new Array<any>();
    primaryShare: Array<any> = new Array<any>();
    secondaryShare: Array<any> = new Array<any>();
    loanHolderData;
    clientName1;
    allClientNames;
    clientNames: Array<String> = [];
    clientName2;
    allClientNames2;
    clientNames2: Array<String> = [];
    guarantorData: Array<any> = new Array<any>();
    tempLandBuilding;
    tempSecondaryLandBuilding;

    constructor(private formBuilder: FormBuilder,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            this.section4Data = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
        }
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.loanHolder)) {
            if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
                this.loanHolderData = JSON.parse(this.cadData.loanHolder.nepData);
            }
        }
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
            this.cadData.assignedLoan.forEach(val => {
                this.loanName.push(val.loan.name);
            });
            if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0]) &&
                !ObjectUtil.isEmpty(this.cadData.assignedLoan[0].taggedGuarantors)) {
                this.cadData.assignedLoan[0].taggedGuarantors.forEach(val => {
                    const tempGuarantor = JSON.parse(val.nepData);
                    this.guarantorData.push(tempGuarantor);
                });
            }
        }
        this.buildForm();
        this.checkCondition();
        if (this.primaryShare.length > 0) {
            this.primaryDetails();
        } if (this.secondaryShare.length > 0) {
            this.secondaryDetails();
        }
        this.fillForm();
    }

    checkCondition() {
        this.tempLandBuilding = this.section4Data.securities.primarySecurity.filter(val =>
            val.securityTypeCT === 'LAND' || val.securityTypeCT === 'LAND_AND_BUILDING');
        this.section4Data.securities.primarySecurity.forEach(val => {
            if (!ObjectUtil.isEmpty(val.securityType)) {
                if (val.securityType === 'LAND_AND_BUILDING' || val.securityType === 'LAND') {
                    this.isPrimaryLandAndBuilding = true;
                    this.primaryCollateral.push(val);
                    if (val.mortgageType === 'New') {
                        this.isPrimaryMortgageNew = true;
                    }
                    if (val.mortgageType === 'Remortgage') {
                        this.isPrimaryRemortgage = true;
                    }
                    if (val.mortgageType === 'Enhancement') {
                        this.isPrimaryEnhancement = true;
                    }
                    if (val.mortgageType === 'Existing') {
                        this.isPrimaryExisting = true;
                    }
                    if (val.collateralShare === 'YES') {
                        this.primaryShare.push(val);
                        this.isPrimaryShared = true;
                        if (val.mortgageType === 'Enhancement') {
                            this.isPrimaryEnhancementShared = true;
                        }
                    }
                }
                if (val.securityType === 'AUTO LOAN') {
                    this.isPrimaryAutoLoan = true;
                }
                if (val.securityType === 'TD') {
                    this.isPrimaryEducationLoan = true;
                    this.primaryEdu.push(val);
                }
                if (val.securityType === 'PERSONAL GUARANTEE') {
                    this.isPrimaryGuarantee = true;
                }
                if (val.securityType === 'SHARE SECURITY') {
                    this.primarySharedSecurity.push(val);
                    this.isPrimarySharedSecurity = true;
                }
                this.isPrimary = true;
            }
        });
        this.tempSecondaryLandBuilding = this.section4Data.securities.secondarySecurity.filter(val =>
            val.securityTypeCT === 'LAND' || val.securityTypeCT === 'LAND_AND_BUILDING');
        this.section4Data.securities.secondarySecurity.forEach(val => {
            if (!ObjectUtil.isEmpty(val.securityType)) {
                if (val.securityType === 'LAND_AND_BUILDING' || val.securityType === 'LAND') {
                    this.isSecondaryLandAndBuilding = true;
                    this.secondaryCollateral.push(val);
                    if (val.mortgageType === 'New') {
                        this.isSecondaryMortgageNew = true;
                    }
                    if (val.mortgageType === 'Remortgage') {
                        this.isSecondaryRemortgage = true;
                    }
                    if (val.mortgageType === 'Enhancement') {
                        this.isSecondaryEnhancement = true;
                    }
                    if (val.mortgageType === 'Existing') {
                        this.isSecondaryExisting = true;
                    }
                    if (val.collateralShare === 'YES') {
                        this.secondaryShare.push(val);
                        this.isSecondaryShared = true;
                        if (val.mortgageType === 'Enhancement') {
                            this.isSecondaryEnhancementShared = true;
                        }
                    }
                }
                if (val.securityType === 'AUTO LOAN') {
                    this.isSecondaryAutoLoan = true;
                }
                if (val.securityType === 'TD') {
                    this.isSecondaryEducationLoan = true;
                    this.secondaryEdu.push(val);
                }
                if (val.securityType === 'PERSONAL GUARANTEE') {
                    this.isSecondaryGuarantee = true;
                }
                if (val.securityType === 'SHARE SECURITY') {
                    this.secondarySharedSecurity.push(val);
                    this.isSecondarySharedSecurity = true;
                }
                this.isSecondary = true;
            }
        });
        this.loanName.forEach(val => {
            if (val === 'HOME LOAN COMBINED') {
                if (!ObjectUtil.isEmpty(this.section4Data) && !ObjectUtil.isEmpty(this.section4Data.homeLoanCombinedForm)
                    && !ObjectUtil.isEmpty(this.section4Data.homeLoanCombinedForm.homeLoanCombinedFormArray)) {
                    this.section4Data.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach(value => {
                        if (value.homeLoanCase === 'TAKEOVER') {
                            this.isTakeOver = true;
                        }
                    });
                }
            }
        });
        if (this.guarantorData.length > 0) {
            this.patchGuarantor(this.guarantorData);
        }
        if (this.primaryEdu.length > 0) {
            this.patchPrimaryDetails(this.primaryEdu);
        }
        if (this.secondaryEdu.length > 0) {
            this.patchSecondaryDetails(this.secondaryEdu);
        }
    }

    buildForm() {
        return this.form = this.formBuilder.group({
            // Primary Security
            nameOfClient: [undefined],

            // Secondary Security
            nameOfClient2: [undefined],

            TDPrimaryDetails: this.formBuilder.array([]),
            TDSecondaryDetails: this.formBuilder.array([]),
            guarantorDetails: this.formBuilder.array([]),
        });
        if (this.guarantorData.length < 0) {
            this.addGuarantorDetail();
        }
        if (this.primaryEdu.length < 0) {
            this.addTDPrimaryDetail();
        }
        if (this.secondaryEdu.length < 0) {
            this.addTDSecondaryDetail();
        }
    }

    addGuarantorDetail() {
        (this.form.get('guarantorDetails') as FormArray).push(this.setGuarantorDetailsArr());
    }

    addTDPrimaryDetail() {
        (this.form.get('TDPrimaryDetails') as FormArray).push(this.setTDPrimaryDetailsArr());
    }

    addTDSecondaryDetail() {
        (this.form.get('TDSecondaryDetails') as FormArray).push(this.setTDSecondaryDetailsArr());
    }

    setGuarantorDetailsArr() {
        return this.formBuilder.group({
            nameOfGuarantor: [undefined],
            loanAmountInFigure: [undefined],
            loanAmountInWords: [undefined],
        });
    }

    setTDPrimaryDetailsArr() {
        return this.formBuilder.group({
            tenureOfFixedDeposit: [undefined],
            fixedDepositHolderName: [undefined],
            amountOfDeposit: [undefined],
            amountOfDepositInWords: [undefined],
            expiryDate: [undefined],
            receiptNum: [undefined]
        });
    }

    setTDSecondaryDetailsArr() {
        return this.formBuilder.group({
            tenureOfFixedDeposit2: [undefined],
            fixedDepositHolderName2: [undefined],
            amountOfDeposit2: [undefined],
            amountOfDepositInWords2: [undefined],
            expiryDate2: [undefined],
            receiptNum2: [undefined],
        });
    }

    patchPrimaryDetails(data) {
        const formArray = this.form.get('TDPrimaryDetails') as FormArray;
        data.forEach(val => {
            let tempDate;
            if (val.FDExpiryDateType === 'BS') {
                tempDate = !ObjectUtil.isEmpty(val.FDExpiryDateNepaliCT) ? val.FDExpiryDateNepaliCT : '';
            } else {
                tempDate = !ObjectUtil.isEmpty(val.FDExpiryDateCT) ? val.FDExpiryDateCT : '';
            }
            formArray.push(
                this.formBuilder.group({
                    tenureOfFixedDeposit: [!ObjectUtil.isEmpty(val.tenureOfFixedDepositCT) ? val.tenureOfFixedDepositCT : ''],
                    fixedDepositHolderName: [!ObjectUtil.isEmpty(val.fixedDepositHolderNameCT) ? val.fixedDepositHolderNameCT : ''],
                    amountOfDeposit: [!ObjectUtil.isEmpty(val.FDAmountInFigureCT) ? val.FDAmountInFigureCT : ''],
                    amountOfDepositInWords: [!ObjectUtil.isEmpty(val.FDAmountInWordsCT) ? val.FDAmountInWordsCT : ''],
                    receiptNum: [!ObjectUtil.isEmpty(val.FDReceiptNumberCT) ? val.FDReceiptNumberCT : ''],
                    expiryDate: [tempDate ? tempDate : '']
                })
            );
        });
    }

    patchSecondaryDetails(data) {
        const formArray = this.form.get('TDSecondaryDetails') as FormArray;
        data.forEach(val => {
            let tempDate;
            if (val.FDExpiryDateType === 'BS') {
                tempDate = !ObjectUtil.isEmpty(val.FDExpiryDateNepaliCT) ? val.FDExpiryDateNepaliCT : '';
            } else {
                tempDate = !ObjectUtil.isEmpty(val.FDExpiryDateCT) ? val.FDExpiryDateCT : '';
            }
            formArray.push(
                this.formBuilder.group({
                    tenureOfFixedDeposit2: [!ObjectUtil.isEmpty(val.tenureOfFixedDepositCT) ? val.tenureOfFixedDepositCT : ''],
                    fixedDepositHolderName2: [!ObjectUtil.isEmpty(val.fixedDepositHolderNameCT) ? val.fixedDepositHolderNameCT : ''],
                    amountOfDeposit2: [!ObjectUtil.isEmpty(val.FDAmountInFigureCT) ? val.FDAmountInFigureCT : ''],
                    amountOfDepositInWords2: [!ObjectUtil.isEmpty(val.FDAmountInWordsCT) ? val.FDAmountInWordsCT : ''],
                    receiptNum2: [!ObjectUtil.isEmpty(val.FDReceiptNumberCT) ? val.FDReceiptNumberCT : ''],
                    expiryDate2: [tempDate ? tempDate : '']
                })
            );
        });
    }

    fillForm() {
        this.form.patchValue({
            // Primary Security
            nameOfClient: !ObjectUtil.isEmpty(this.clientName1) ? this.clientName1 : '',

            // Secondary Security
            nameOfClient2: !ObjectUtil.isEmpty(this.clientName2) ? this.clientName2 : '',
        });
    }

    primaryDetails() {
        if (!ObjectUtil.isEmpty(this.primaryShare)) {
            if (this.primaryShare.length === 1) {
                this.clientName1 = this.primaryShare[0].nameOfBorrowingClientCT;
            } else if (this.primaryShare.length === 2) {
                for (let i = 0; i < this.primaryShare.length; i++) {
                    this.clientName1 = this.primaryShare[i].nameOfBorrowingClientCT;
                }
                this.allClientNames = this.clientNames.join(' र ');
                this.clientName1 = this.allClientNames;
            } else {
                for (let i = 0; i < this.primaryShare.length - 1; i++) {
                    this.clientName1 = this.primaryShare[i].nameOfBorrowingClientCT;
                }
                this.allClientNames = this.clientNames.join(' , ');
                const temp1 = this.primaryShare[this.primaryShare.length - 1];
                this.clientName1 = this.allClientNames + ' र ' + temp1.nameOfBorrowingClientCT;
            }
        }
    }

    secondaryDetails() {
        if (!ObjectUtil.isEmpty(this.secondaryShare)) {
            if (this.secondaryShare.length === 1) {
                this.clientName2 = this.secondaryShare[0].nameOfBorrowingClientCT;
            } else if (this.secondaryShare.length === 2) {
                for (let i = 0; i < this.secondaryShare.length; i++) {
                    this.clientName2 = this.secondaryShare[i].nameOfBorrowingClientCT;
                }
                this.allClientNames2 = this.clientNames2.join(' र ');
                this.clientName2 = this.allClientNames2;
            } else {
                for (let i = 0; i < this.secondaryShare.length - 1; i++) {
                    this.clientName2 = this.secondaryShare[i].nameOfBorrowingClientCT;
                }
                this.allClientNames2 = this.clientNames2.join(' , ');
                const temp1 = this.secondaryShare[this.secondaryShare.length - 1];
                this.clientName2 = this.allClientNames2 + ' र ' + temp1.nameOfBorrowingClientCT;
            }
        }
    }

    patchGuarantor(data) {
        const formArray = this.form.get('guarantorDetails') as FormArray;
        data.forEach(val => {
            formArray.push(
                this.formBuilder.group({
                    nameOfGuarantor: val.guarantorName ? val.guarantorName.ct : '',
                    loanAmountInFigure: val.gurantedAmount ? val.gurantedAmount.ct : '',
                    loanAmountInWords: this.nepaliCurrencyWordPipe.transform(val.gurantedAmount ? val.gurantedAmount.en : 0)
                })
            );
        });
    }
}

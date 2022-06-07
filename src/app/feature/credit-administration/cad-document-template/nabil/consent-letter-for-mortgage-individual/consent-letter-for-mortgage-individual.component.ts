import {Component, Input, OnInit, Optional} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
    selector: 'app-consent-letter-for-mortgage-individual',
    templateUrl: './consent-letter-for-mortgage-individual.component.html',
    styleUrls: ['./consent-letter-for-mortgage-individual.component.scss']
})
export class ConsentLetterForMortgageIndividualComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    form: FormGroup;
    supportedInfo;
    spinner = false;
    individualData;
    initialInfo;
    primarySecurityTypeCheck = false;
    secondarySecurityTypeCheck = false;
    eduSecurityTypeCheck = false;
    homeSecurityTypeCheck = false;
    finalAmount;
    loanAmountWord;
    sanctionDate;
    tempPrimarySecurity: any = [];
    tempSecondarySecurity: any = [];
    borrowerFreeText: Array<any> = new Array<any>();
    borrowerFreeText1: Array<any> = new Array<any>();
    freeTextVal: Array<any> = new Array<any>();
    borrowerDetailsVal: Array<any> = new Array<any>();
    securityOwnerFreeTxt: Array<any> = new Array<any>();
    primarySecurityData: any[] = [];
    secondarySecurityData: any[] = [];

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                @Optional() private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private englishNepaliDatePipe: EngNepDatePipe,
                private datePipe: DatePipe) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData) && (!ObjectUtil.isEmpty(this.cadData.cadFileList))) {
            this.cadData.cadFileList.forEach(individualCadFile => {
                if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
                    this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
            if (!ObjectUtil.isEmpty(this.initialInfo.securities.primarySecurity)) {
                this.initialInfo.securities.primarySecurity.forEach(val => {
                    if (val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING') {
                        this.secondarySecurityTypeCheck = true;
                        if (val.collateralShare === 'YES') {
                            this.primarySecurityData.push(val ? val.nameOfBorrowingClientCT : '');
                        }
                    }
                });
            }
            if (!ObjectUtil.isEmpty(this.initialInfo.securities.secondarySecurity)) {
                this.initialInfo.securities.secondarySecurity.forEach(val => {
                    if (val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING') {
                        this.secondarySecurityTypeCheck = true;
                        if (val.collateralShare === 'YES') {
                            this.secondarySecurityData.push(val ? val.nameOfBorrowingClientCT : '');
                        }
                    }
                });
            }
        }
        if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy' ||
            this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter' ||
            this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
            this.primarySecurityCheck();
            this.secondarySecurityCheck();
        }
        if (this.cadData.offerDocumentList[0].docName === 'Home Loan') {
            this.homeSecurityCheck();
        }
        if (this.cadData.offerDocumentList[0].docName === 'Educational Loan' ||
            this.cadData.offerDocumentList[0].docName === 'Personal Overdraft' ||
            this.cadData.offerDocumentList[0].docName === 'Mortage Loan') {
            this.eduSecurityCheck();
        }
        this.setTotalAmount();
        this.setIssuedDate();
        this.fillForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            freeDate: [undefined],
            nameOfBranch: [undefined],
            nameOfMalpot: [undefined],
            dateOfMortgageProperty: [undefined],
            mortgageNo: [undefined],
            totalMortgageAmount: [undefined],
            totalAmount: [undefined],
            borrowerNameArray: this.formBuilder.array([]),
            borrowerNameArray1: this.formBuilder.array([]),
            nameFreeText: this.formBuilder.array([]),
            borrowerDetails: this.formBuilder.array([]),
            ownerDetails: this.formBuilder.array([]),
            // Witness Fields
            witnessDistrict1: [undefined],
            witnessMuni1: [undefined],
            witnessWard1: [undefined],
            witnessAge1: [undefined],
            witnessName1: [undefined],
            witnessDistrict2: [undefined],
            witnessMuni2: [undefined],
            witnessWard2: [undefined],
            witnessAge2: [undefined],
            witnessName2: [undefined],
            karmachariName: [undefined],
        });
    }

    borrowerFree() {
        return this.formBuilder.group({
            freeSanctionDate: [undefined],
            freeAmount: [undefined],
        });
    }

    borrowerNameFree() {
        return this.formBuilder.group({
            borrowerName: [undefined],
        });
    }

    borrowerDetailsFree() {
        return this.formBuilder.group({
            borrowerName1: [undefined],
            freeSanctionDate2: [undefined],
            freeAmount2: [undefined],
        });
    }

    ownerDetailsFree() {
        return this.formBuilder.group({
            landOwnerName: [undefined],
            fatherHusbandName: [undefined],
            grandFatherInLawName: [undefined],
            landOwnerAddress: [undefined],
            citizenshipNo: [undefined],
            citizenIssueDate: [undefined],
            citizenIssueDistrict: [undefined]
        });
    }

    addBorrowerFreeText() {
        (this.form.get('borrowerNameArray') as FormArray).push(this.borrowerFree());
    }

    addBorrowerDetailsFreeText() {
        (this.form.get('borrowerDetails') as FormArray).push(this.borrowerDetailsFree());
    }

    addBorrowerNameFreeText() {
        (this.form.get('nameFreeText') as FormArray).push(this.borrowerNameFree());
    }

    addSecurityOwnerFreeText() {
        (this.form.get('ownerDetails') as FormArray).push(this.ownerDetailsFree());
    }

    removeAtIndex(i: number) {
        (this.form.get('nameFreeText') as FormArray).removeAt(i);
    }
    removePrimary(i: number) {
        this.primarySecurityData.splice(i, 1);
    }
    removeSecondary(i: number) {
        this.secondarySecurityData.splice(i, 1);
    }
    removeBorrowerNameIndex(ii: number) {
        (this.form.get('borrowerNameArray') as FormArray).removeAt(ii);
    }
    removeSecurityAtIndex(ii: number) {
        (this.form.get('borrowerNameArray1') as FormArray).removeAt(ii);
    }
    removeSecurityOwnerIndex(ii: number) {
        (this.form.get('ownerDetails') as FormArray).removeAt(ii);
    }
    removeBorrowerAtIndex(ii: number) {
        (this.form.get('borrowerDetails') as FormArray).removeAt(ii);
    }

    borrowerFree1() {
        return this.formBuilder.group({
            freeSanctionDate1: [undefined],
            freeAmount1: [undefined],
        });
    }

    addBorrowerFreeText1() {
        (this.form.get('borrowerNameArray1') as FormArray).push(this.borrowerFree1());
    }

    primarySecurityCheck() {
        this.initialInfo.securities.primarySecurity.forEach(val => {
            let name;
            if (val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING') {
                this.primarySecurityTypeCheck = true;
                if (val.collateralShare === 'YES') {
                    name = {
                        borrowerName: val ? val.nameOfBorrowingClientCT : ''
                    };
                    this.tempPrimarySecurity.push(
                        name
                    );
                    this.addBorrowerFreeText();
                }
                this.addSecurityOwnerFreeText();
            }
        });
    }

    secondarySecurityCheck() {
        this.initialInfo.securities.secondarySecurity.forEach(val => {
            let name;
            if (val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING') {
                this.secondarySecurityTypeCheck = true;
                if (val.collateralShare === 'YES') {
                    name = {
                        borrowerName: val ? val.nameOfBorrowingClientCT : ''
                    };
                    this.tempSecondarySecurity.push(
                        name
                    );
                    this.addBorrowerFreeText1();
                }
                this.addSecurityOwnerFreeText();
            }
        });
    }

    homeSecurityCheck() {
        if (this.initialInfo.loan.securities !== null && this.initialInfo.loan.securities[0].securityOwnersName !== null) {
            this.homeSecurityTypeCheck = true;
        }
    }
    eduSecurityCheck() {
        if (this.initialInfo.securityDetails !== null && this.initialInfo.securityDetails[0].securities[0] !== null &&
            this.initialInfo.securityDetails[0].securities[0].securityOwnersName !== null) {
            this.eduSecurityTypeCheck = true;
        }
    }

    setTotalAmount() {
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
                this.finalAmount = (this.initialInfo.retailGlobalForm && this.initialInfo.retailGlobalForm.totalLimitInFigureCT) ?
                    this.initialInfo.retailGlobalForm.totalLimitInFigureCT : '';
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Educational Loan') {
                const proposedLimit = this.cadData.assignedLoan[0] ?
                    this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
                this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal Loan') {
                const proposedLimit = this.cadData.assignedLoan[0] ?
                    this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
                this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal Overdraft') {
                const proposedLimit = this.cadData.assignedLoan[0] ?
                    this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
                this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
            }if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal loan and personal overdraft') {
                const proposedLimit = this.cadData.assignedLoan[0] ?
                    this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
                this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Home Loan') {
                const proposedLimit = this.cadData.assignedLoan[0] ?
                    this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
                this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Mortage Loan') {
                const proposedLimit = this.cadData.assignedLoan[0] ?
                    this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
                this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
                this.finalAmount = (this.initialInfo && this.initialInfo.loanLimitAmountFigure) ?
                    this.initialInfo.loanLimitAmountFigure.ct : '';
                // tslint:disable-next-line:max-line-length
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
                this.finalAmount = (this.initialInfo && this.initialInfo.totalLimitFigure) ?
                    this.initialInfo.totalLimitFigure.ct : '';
            }
        }
    }

    setIssuedDate() {
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
            const dateOfApprovalType = this.initialInfo.retailGlobalForm ?
                this.initialInfo.retailGlobalForm.sanctionLetterDateType : '';
            if (dateOfApprovalType === 'AD') {
                const templateDateApproval = this.initialInfo.retailGlobalForm.sanctionLetterDate ?
                    this.initialInfo.retailGlobalForm.sanctionLetterDateCT : '';
                this.sanctionDate = templateDateApproval;
            } else {
                const templateDateApproval = this.initialInfo.retailGlobalForm.sanctionLetterDateNepali ?
                    this.initialInfo.retailGlobalForm.sanctionLetterDateNepaliCT : '';
                this.sanctionDate = templateDateApproval ? templateDateApproval : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Educational Loan') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal Loan') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal Overdraft') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Personal loan and personal overdraft') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.dateofApprovalNepali.en ? this.initialInfo.dateofApprovalNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Home Loan') {
            const dateOfApprovalType = this.initialInfo.loan ? this.initialInfo.loan.dateType : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.loan.dateOfApproval ? this.initialInfo.loan.dateOfApproval : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.loan.nepaliDateOfApproval ? this.initialInfo.loan.nepaliDateOfApproval.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Mortage Loan') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const approvedDateFinal = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.en : '';
                this.sanctionDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
            } else {
                this.sanctionDate = this.initialInfo.dateOfApprovalNepali.en ? this.initialInfo.dateOfApprovalNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
            const dateOfApproval = this.initialInfo.sanctionLetterDateType ? this.initialInfo.sanctionLetterDateType.en : '';
            if (dateOfApproval === 'AD') {
                this.sanctionDate = this.initialInfo.sanctionLetterDate ? this.initialInfo.sanctionLetterDate.ct : '';
            } else {
                this.sanctionDate = this.initialInfo.sanctionLetterDateNepali ? this.initialInfo.sanctionLetterDateNepali.ct : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
            const dateOfApprovalType = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
            if (dateOfApprovalType === 'AD') {
                const templateDateApproval = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.ct : '';
                this.sanctionDate = templateDateApproval;
            } else {
                const templateDateApproval = this.initialInfo.dateOfApprovalNepali ? this.initialInfo.dateOfApprovalNepali.en : '';
                this.sanctionDate = templateDateApproval ? templateDateApproval.nDate : '';
            }
        }
    }

    setFreeText() {
        for (let i = 0; i < this.tempPrimarySecurity.length; i++) {
            const tempFreeText = {
                freeSanctionDate: this.form.get(['borrowerNameArray', i, 'freeSanctionDate']) ? this.form.get(['borrowerNameArray', i, 'freeSanctionDate']).value : '',
                // tslint:disable-next-line:max-line-length
                freeAmount: this.form.get(['borrowerNameArray', i, 'freeAmount']) ? this.form.get(['borrowerNameArray', i, 'freeAmount']).value : ''
            };
            this.borrowerFreeText.push(tempFreeText);
        }
        for (let ii = 0; ii < this.tempSecondarySecurity.length; ii++) {
            const tempFreeText1 = {
                freeSanctionDate1: this.form.get(['borrowerNameArray1', ii, 'freeSanctionDate1']) ? this.form.get(['borrowerNameArray1', ii, 'freeSanctionDate1']).value : '',
                // tslint:disable-next-line:max-line-length
                freeAmount1: this.form.get(['borrowerNameArray1', ii, 'freeAmount1']) ? this.form.get(['borrowerNameArray1', ii, 'freeAmount1']).value : ''
            };
            this.borrowerFreeText1.push(tempFreeText1);
        }
        for (let iii = 0; iii < this.form.get('nameFreeText')['length']; iii++) {
            const free = {
                borrowerName: this.form.get(['nameFreeText', iii, 'borrowerName']) ?
                    this.form.get(['nameFreeText', iii, 'borrowerName']).value : '',
            };
            this.freeTextVal.push(free);
        }
        for (let iiii = 0; iiii < this.form.get('borrowerDetails')['length']; iiii++) {
            const freeText = {
                borrowerName1: this.form.get(['borrowerDetails', iiii, 'borrowerName1']) ?
                    this.form.get(['borrowerDetails', iiii, 'borrowerName1']).value : '',
                freeSanctionDate2: this.form.get(['borrowerDetails', iiii, 'freeSanctionDate2']) ?
                    this.form.get(['borrowerDetails', iiii, 'freeSanctionDate2']).value : '',
                freeAmount2: this.form.get(['borrowerDetails', iiii, 'freeAmount2']) ?
                    this.form.get(['borrowerDetails', iiii, 'freeAmount2']).value : '',
            };
            this.borrowerDetailsVal.push(freeText);
        }
        for (let j = 0; j < this.form.get('ownerDetails')['length']; j++) {
            const freeText1 = {
                landOwnerName: this.form.get(['ownerDetails', j, 'landOwnerName']) ?
                    this.form.get(['ownerDetails', j, 'landOwnerName']).value : '',
                fatherHusbandName: this.form.get(['ownerDetails', j, 'fatherHusbandName']) ?
                    this.form.get(['ownerDetails', j, 'fatherHusbandName']).value : '',
                grandFatherInLawName: this.form.get(['ownerDetails', j, 'grandFatherInLawName']) ?
                    this.form.get(['ownerDetails', j, 'grandFatherInLawName']).value : '',
                landOwnerAddress: this.form.get(['ownerDetails', j, 'landOwnerAddress']) ?
                    this.form.get(['ownerDetails', j, 'landOwnerAddress']).value : '',
                citizenshipNo: this.form.get(['ownerDetails', j, 'citizenshipNo']) ?
                    this.form.get(['ownerDetails', j, 'citizenshipNo']).value : '',
                citizenIssueDate: this.form.get(['ownerDetails', j, 'citizenIssueDate']) ?
                    this.form.get(['ownerDetails', j, 'citizenIssueDate']).value : '',
                citizenIssueDistrict: this.form.get(['ownerDetails', j, 'citizenIssueDistrict']) ?
                    this.form.get(['ownerDetails', j, 'citizenIssueDistrict']).value : '',
            };
            this.securityOwnerFreeTxt.push(freeText1);
        }
        const free1 = {
            // for witness
            witnessDistrict1: this.form.get('witnessDistrict1') ? this.form.get('witnessDistrict1').value : '',
            witnessMuni1: this.form.get('witnessMuni1') ? this.form.get('witnessMuni1').value : '',
            witnessWard1: this.form.get('witnessWard1') ? this.form.get('witnessWard1').value : '',
            witnessAge1: this.form.get('witnessAge1') ? this.form.get('witnessAge1').value : '',
            witnessName1: this.form.get('witnessName1') ? this.form.get('witnessName1').value : '',
            witnessDistrict2: this.form.get('witnessDistrict2') ? this.form.get('witnessDistrict2').value : '',
            witnessMuni2: this.form.get('witnessMuni2') ? this.form.get('witnessMuni2').value : '',
            witnessWard2: this.form.get('witnessWard2') ? this.form.get('witnessWard2').value : '',
            witnessAge2: this.form.get('witnessAge2') ? this.form.get('witnessAge2').value : '',
            witnessName2: this.form.get('witnessName2') ? this.form.get('witnessName2').value : '',
            karmachariName: this.form.get('karmachariName') ? this.form.get('karmachariName').value : '',
            freeDate: this.form.get('freeDate') ? this.form.get('freeDate').value : '',
            nameOfMalpot: this.form.get('nameOfMalpot') ? this.form.get('nameOfMalpot').value : '',
            dateOfMortgageProperty: this.form.get('dateOfMortgageProperty') ? this.form.get('dateOfMortgageProperty').value : '',
            mortgageNo: this.form.get('mortgageNo') ? this.form.get('mortgageNo').value : '',
            totalMortgageAmount: this.form.get('totalMortgageAmount') ? this.form.get('totalMortgageAmount').value : '',
            borrowerNameArray: this.borrowerFreeText,
            borrowerNameArray1: this.borrowerFreeText1,
            nameFreeText: this.freeTextVal,
            borrowerDetails: this.borrowerDetailsVal,
            ownerDetails: this.securityOwnerFreeTxt,
            totalAmount: this.form.get('totalAmount') ? this.form.get('totalAmount').value : ''
        };
        return JSON.stringify(free1);
    }

    fillFreeText() {
        for (let i = 0; i < this.tempPrimarySecurity.length ; i++) {
            if (this.cadData.cadFileList.length > 0) {
                this.form.get(['borrowerNameArray', i, 'freeSanctionDate']).patchValue(
                    this.supportedInfo ? this.supportedInfo.borrowerNameArray[i].freeSanctionDate : ''
                );
                this.form.get(['borrowerNameArray', i, 'freeAmount']).patchValue(
                    this.supportedInfo ? this.supportedInfo.borrowerNameArray[i].freeAmount : ''
                );
            }
        }
        for (let ii = 0; ii < this.tempSecondarySecurity.length; ii++) {
            if (this.cadData.cadFileList.length > 0) {
                this.form.get(['borrowerNameArray1', ii, 'freeSanctionDate1']).patchValue(
                    this.supportedInfo ? this.supportedInfo.borrowerNameArray1[ii].freeSanctionDate1 : ''
                );
                this.form.get(['borrowerNameArray1', ii, 'freeAmount1']).patchValue(
                    this.supportedInfo ? this.supportedInfo.borrowerNameArray1[ii].freeAmount1 : ''
                );
            }
        }
        if (!ObjectUtil.isEmpty(this.supportedInfo)) {
            if (!ObjectUtil.isEmpty(this.supportedInfo.nameFreeText)) {
                for (let val = 0; val < this.supportedInfo.nameFreeText.length; val++) {
                    this.addBorrowerNameFreeText();
                }
                for (let iii = 0; iii < this.supportedInfo.nameFreeText.length; iii++) {
                    this.form.get(['nameFreeText', iii, 'borrowerName']).patchValue(this.supportedInfo.nameFreeText ?
                        this.supportedInfo.nameFreeText[iii].borrowerName : '');
                }
            }
        }
        if (!ObjectUtil.isEmpty(this.supportedInfo)) {
            if (!ObjectUtil.isEmpty(this.supportedInfo.borrowerDetails)) {
                for (let val = 0; val < this.supportedInfo.borrowerDetails.length; val++) {
                    this.addBorrowerDetailsFreeText();
                }
                for (let iiii = 0; iiii < this.supportedInfo.borrowerDetails.length; iiii++) {
                    this.form.get(['borrowerDetails', iiii, 'borrowerName1']).patchValue(this.supportedInfo.borrowerDetails ?
                        this.supportedInfo.borrowerDetails[iiii].borrowerName1 : '');
                    this.form.get(['borrowerDetails', iiii, 'freeSanctionDate2']).patchValue(this.supportedInfo.borrowerDetails ?
                        this.supportedInfo.borrowerDetails[iiii].freeSanctionDate2 : '');
                    this.form.get(['borrowerDetails', iiii, 'freeAmount2']).patchValue(this.supportedInfo.borrowerDetails ?
                        this.supportedInfo.borrowerDetails[iiii].freeAmount2 : '');
                }
            }
        }
        if (!ObjectUtil.isEmpty(this.supportedInfo)) {
            if (!ObjectUtil.isEmpty(this.supportedInfo.ownerDetails)) {
                for (let j = 0; j < this.supportedInfo.ownerDetails.length; j++) {
                    this.form.get(['ownerDetails', j, 'landOwnerName']).patchValue(this.supportedInfo.ownerDetails ?
                        this.supportedInfo.ownerDetails[j].landOwnerName : '');
                    this.form.get(['ownerDetails', j, 'fatherHusbandName']).patchValue(this.supportedInfo.ownerDetails ?
                        this.supportedInfo.ownerDetails[j].fatherHusbandName : '');
                    this.form.get(['ownerDetails', j, 'grandFatherInLawName']).patchValue(this.supportedInfo.ownerDetails ?
                        this.supportedInfo.ownerDetails[j].grandFatherInLawName : '');
                    this.form.get(['ownerDetails', j, 'landOwnerAddress']).patchValue(this.supportedInfo.ownerDetails ?
                        this.supportedInfo.ownerDetails[j].landOwnerAddress : '');
                    this.form.get(['ownerDetails', j, 'citizenshipNo']).patchValue(this.supportedInfo.ownerDetails ?
                        this.supportedInfo.ownerDetails[j].citizenshipNo : '');
                    this.form.get(['ownerDetails', j, 'citizenIssueDate']).patchValue(this.supportedInfo.ownerDetails ?
                        this.supportedInfo.ownerDetails[j].citizenIssueDate : '');
                    this.form.get(['ownerDetails', j, 'citizenIssueDistrict']).patchValue(this.supportedInfo.ownerDetails ?
                        this.supportedInfo.ownerDetails[j].citizenIssueDistrict : '');
                }
            }
        }
    }

    fillForm() {
        this.form.patchValue({
            nameOfBranch: this.individualData.branch ? this.individualData.branch.ct : '',
            totalAmount: this.supportedInfo ? this.supportedInfo.totalAmount : '',
            nameOfMalpot: this.supportedInfo ? this.supportedInfo.nameOfMalpot : '',
            dateOfMortgageProperty: this.supportedInfo ? this.supportedInfo.dateOfMortgageProperty : '',
            mortgageNo: this.supportedInfo ? this.supportedInfo.mortgageNo : '',
            totalMortgageAmount: this.supportedInfo ? this.supportedInfo.totalMortgageAmount : '',
            // witness
            witnessDistrict1: this.supportedInfo ? this.supportedInfo.witnessDistrict1 : '',
            witnessMuni1: this.supportedInfo ? this.supportedInfo.witnessMuni1 : '',
            witnessWard1: this.supportedInfo ? this.supportedInfo.witnessWard1 : '',
            witnessAge1: this.supportedInfo ? this.supportedInfo.witnessAge1 : '',
            witnessName1: this.supportedInfo ? this.supportedInfo.witnessName1 : '',
            witnessDistrict2: this.supportedInfo ? this.supportedInfo.witnessDistrict2 : '',
            witnessMuni2: this.supportedInfo ? this.supportedInfo.witnessMuni2 : '',
            witnessWard2: this.supportedInfo ? this.supportedInfo.witnessWard2 : '',
            witnessAge2: this.supportedInfo ? this.supportedInfo.witnessAge2 : '',
            witnessName2: this.supportedInfo ? this.supportedInfo.witnessName2 : '',
            karmachariName: this.supportedInfo ? this.supportedInfo.karmachariName : '',
            freeDate: this.supportedInfo ? this.supportedInfo.freeDate : '',
        });
        this.fillFreeText();
    }

    submit() {
        let flag = true;
        this.spinner = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(individualCadFile => {
                if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    individualCadFile.supportedInformation = this.setFreeText();
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.supportedInformation = this.setFreeText();
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }
        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
            this.dialogRef.close();
            this.spinner = false;
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
            this.dialogRef.close();
            this.spinner = false;
        });
    }

    transformNumber(val) {
        const numberTrans = this.engToNepNumberPipe.transform(this.form.get(val).value, true);
        this.form.get(val).patchValue(numberTrans);
    }
}

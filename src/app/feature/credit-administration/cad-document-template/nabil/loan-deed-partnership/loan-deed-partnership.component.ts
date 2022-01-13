import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {LoanNameConstant} from '../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';

@Component({
    selector: 'app-loan-deed-partnership',
    templateUrl: './loan-deed-partnership.component.html',
    styleUrls: ['./loan-deed-partnership.component.scss']
})
export class LoanDeedPartnershipComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    @Input() nepaliAmount: NepaliNumberAndWords;
    individualData;
    initialInfoPrint;
    offerLetterConst = NabilDocumentChecklist;
    form: FormGroup;
    nepData;
    ckEditorConfig = Editor.CK_CONFIG;
    offerLetterDocument;
    educationalTemplateData;
    offerDocumentChecklist = NabilOfferLetterConst;
    selectiveArr = [];
    companyInfo;
    initialInfo;
    interestRate;
    supportedInfo;
    newOrExisting = false;
    loanData = [];
    purposeOfLoan = 'व्यापार/ व्यवसाय संचालन';
    autoFreeText = 'यस अघी देखी नै तपाई धनी बैंकवाट विभिन्न ऋणकर्जा तथा बैकिङ्ग सुविधाहरु प्राप्त गरी उपभोग गर्दै आएको ठिक सांचो हो । हाल म/हामी ऋणी(हरु)लाई उक्त ऋणकर्जा तथा बैंकिङ्ग सुविधा नवीकरण गर्न एवम् थप तथा अतिरिक्त';
    autoFreeText2 = 'उपरोक्त ऋणकर्जा तथा बैंकिग सुविधाको सुरक्षण वापत देहाय बमोजिमको घरजग्गा तपाई धनी बैंकको नाममा धितो बन्धक पारित गरिदिएका छौं।';
    newTempData: any = [];
    freeText: Array<any> = new Array<any>();
    primarySecurityTypeCheck = false;
    secondarySecurityTypeCheck = false;
    SecurityTypeCheck = false;
    autoCheck = false;
    freeText1Check = false;
    finalAmount;
    loanAmountWord;
    registrationDate;
    sanctionDate;
    actYear;
    dateOfExpirySingle;


    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                public datePipe: DatePipe,
                public engToNepaliDate: EngNepDatePipe,
                private nepToEngNumberPipe: NepaliToEngNumberPipe, ) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0])) {
            this.companyInfo = this.cadData.assignedLoan[0] ? JSON.parse(this.cadData.assignedLoan[0].companyInfo.companyJsonData) : '';
        }
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            this.initialInfo = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
        }
        if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
            this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
        }
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(individualCadFile => {
                if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
                    this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
                }
            });
        }
        if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy' ||
            this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter' ||
            this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
            this.primarySecurityCheck();
            this.secondarySecurityCheck();
        }
        /*this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter' ||*/
        if (this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy' ||
            this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
            this.SecurityCheck();
        }
        if (!ObjectUtil.isEmpty(this.supportedInfo) && !ObjectUtil.isEmpty(this.supportedInfo.freeText1)) {
            this.freeText1Check = true;
        }
        this.getLoanName();
        this.fillForm();
    }

    primarySecurityCheck() {
        this.initialInfo.securities.primarySecurity.forEach(val => {
            if (val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING') {
                this.primarySecurityTypeCheck = true;
            }
        });
    }

    secondarySecurityCheck() {
        this.initialInfo.securities.secondarySecurity.forEach(val => {
            if (val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING') {
                this.secondarySecurityTypeCheck = true;
            }
        });
    }

    SecurityCheck() {
        if (this.initialInfo.securities !== null && this.initialInfo.securities[0].securityOwnersName !== null) {
            this.SecurityTypeCheck = true;
        }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            nameOfBranchLocated: [undefined],
            actName: [undefined],
            yearInFigure: [undefined],
            nameOfAuthorizedBody: [undefined],
            nameOfDepartment: [undefined],
            dateOfRegistration: [undefined],
            registrationNo: [undefined],
            firmName: [undefined],
            purposeOfLoan: [undefined],
            autoFreeText: [this.autoFreeText],
            autoFreeText2: [undefined],
            sanctionLetterIssuedDate: [undefined],
            loanAmountInFigure: [undefined],
            loanAmountInWords: [undefined],
            freeText1: [undefined],
            // other field
            dateOfExpirySingle: [undefined],
            combinedFreeText: this.formBuilder.array([]),
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
            year: [undefined],
            month: [undefined],
            date: [undefined],
            days: [undefined],
            suvam: [undefined],
        });
    }

    combinedFree() {
        return this.formBuilder.group({
            dateOfExpiry: [undefined],
            interestRateCombined: [undefined],
        });
    }

    addCombinedFreeText() {
        (this.form.get('combinedFreeText') as FormArray).push(this.combinedFree());
    }

    setCombinedFreeText() {
        for (let i = 0; i < this.newTempData.length; i++) {
            const tempFreeText = {
                interest: this.form.get(['combinedFreeText', i, 'interestRateCombined']) ? this.form.get(['combinedFreeText', i, 'interestRateCombined']).value : '',
                // tslint:disable-next-line:max-line-length
                dateOfExpiry: this.form.get(['combinedFreeText', i, 'dateOfExpiry']) ? this.form.get(['combinedFreeText', i, 'dateOfExpiry']).value : ''
            };
            this.freeText.push(tempFreeText);
        }
        const free1 = {
            freeText1: this.form.get('freeText1') ? this.form.get('freeText1').value : '',
            dateOfExpirySingle: this.form.get('dateOfExpirySingle') ? this.form.get('dateOfExpirySingle').value : '',
            purposeOfLoan: this.form.get('purposeOfLoan') ? this.form.get('purposeOfLoan').value : '',
            autoFreeText: this.form.get('autoFreeText') ? this.form.get('autoFreeText').value : '',
            autoFreeText2: this.form.get('autoFreeText2') ? this.form.get('autoFreeText2').value : '',
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
            year: this.form.get('year') ? this.form.get('year').value : '',
            month: this.form.get('month') ? this.form.get('month').value : '',
            date: this.form.get('date') ? this.form.get('date').value : '',
            days: this.form.get('days') ? this.form.get('days').value : '',
            suvam: this.form.get('suvam') ? this.form.get('suvam').value : '',
            combinedFreeText: this.freeText
        };
        return JSON.stringify(free1);
    }

    patchFreeText() {
        if (!ObjectUtil.isEmpty(this.cadData) && this.cadData.cadFileList.length > 0) {
            if (!ObjectUtil.isEmpty(this.supportedInfo) && this.purposeOfLoan === this.supportedInfo.purposeOfLoan) {
                this.purposeOfLoan = 'व्यापार/ व्यवसाय संचालन';
            }
            if (!ObjectUtil.isEmpty(this.supportedInfo) && this.supportedInfo.purposeOfLoan !== this.purposeOfLoan) {
                this.purposeOfLoan = this.supportedInfo.purposeOfLoan;
            }
            if (!ObjectUtil.isEmpty(this.supportedInfo) && this.autoFreeText === this.supportedInfo.autoFreeText) {
                this.autoFreeText = 'यस अघी देखी नै तपाई धनी बैंकवाट विभिन्न ऋणकर्जा तथा बैकिङ्ग सुविधाहरु प्राप्त गरी उपभोग गर्दै आएको ठिक सांचो हो । हाल म/हामी ऋणी(हरु)लाई उक्त ऋणकर्जा तथा बैंकिङ्ग सुविधा नवीकरण गर्न एवम् थप तथा अतिरिक्त';
            }
            if (!ObjectUtil.isEmpty(this.supportedInfo) && this.supportedInfo.autoFreeText !== this.autoFreeText) {
                this.autoFreeText = this.supportedInfo.autoFreeText;
            }
            if (!ObjectUtil.isEmpty(this.supportedInfo) && this.autoFreeText2 === this.supportedInfo.autoFreeText2) {
                this.autoFreeText2 = 'उपरोक्त ऋणकर्जा तथा बैंकिग सुविधाको सुरक्षण वापत देहाय बमोजिमको घरजग्गा तपाई धनी बैंकको नाममा धितो बन्धक पारित गरिदिएका छौं।';
            }
            if (!ObjectUtil.isEmpty(this.supportedInfo) && this.supportedInfo.autoFreeText2 !== this.autoFreeText2) {
                this.autoFreeText2 = this.supportedInfo.autoFreeText2;
            }
        }
        this.form.patchValue({
            purposeOfLoan: !ObjectUtil.isEmpty(this.purposeOfLoan) ? this.purposeOfLoan : '',
            autoFreeText: !ObjectUtil.isEmpty(this.autoFreeText) ? this.autoFreeText : '',
            autoFreeText2: !ObjectUtil.isEmpty(this.autoFreeText2) ? this.autoFreeText2 : '',
            freeText1: this.supportedInfo ? this.supportedInfo.freeText1 : '',
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
            year: this.supportedInfo ? this.supportedInfo.year : '',
            month: this.supportedInfo ? this.supportedInfo.month : '',
            date: this.supportedInfo ? this.supportedInfo.date : '',
            days: this.supportedInfo ? this.supportedInfo.days : '',
            suvam: this.supportedInfo ? this.supportedInfo.suvam : '',
        });
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(individualCadFile => {
                if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    individualCadFile.supportedInformation = this.setCombinedFreeText();
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.supportedInformation = this.setCombinedFreeText();
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.form.value);
            this.initialInfoPrint = cadFile.initialInformation;
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
            this.dialogRef.close();
        });
    }

    getLoanName() {
        this.cadData.assignedLoan.forEach(val => {
            const loanName = val.loan.name;
            const loanNepaliName = val.loan.nepaliName;
            const tempLoan = {
                loanName: loanName,
                loanNepaliName: loanNepaliName,
            };
            this.loanData.push(tempLoan);
        });
    }

    fillForm() {
        let totalLoan = 0;
        this.cadData.assignedLoan.forEach(val => {
            const proposedAmount = val.proposal.proposedLimit;
            totalLoan = totalLoan + proposedAmount;
        });
        this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
        this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);

        // for date conversion of registration date
        if (!ObjectUtil.isEmpty(this.individualData.registrationDateOption)) {
            if (this.individualData.registrationDateOption.en === 'AD') {
                this.registrationDate = this.engToNepaliDate.transform(this.individualData.registrationDate ?
                    this.individualData.registrationDate.en : this.individualData.registrationDate.en, true) || '';
            } else {
                this.registrationDate = this.individualData.registrationDate.en ? this.individualData.registrationDate.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy' ||
                this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
                const dateOfApproval = this.initialInfo.sanctionLetterDateType ? this.initialInfo.sanctionLetterDateType.en : '';
                if (dateOfApproval === 'AD') {
                    this.sanctionDate = this.initialInfo.sanctionLetterDate ? this.initialInfo.sanctionLetterDate.ct : '';
                } else {
                    this.sanctionDate = this.initialInfo.sanctionLetterDateNepali ? this.initialInfo.sanctionLetterDateNepali.ct : '';
                }
                if (this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
                    if (this.initialInfo.costumerType.en === 'existingPlainRenewal' ||
                        this.initialInfo.costumerType.en === 'existingRenewalWithEnhancement'
                        || this.initialInfo.costumerType.en === 'existingAdditionalLoan') {
                        this.newOrExisting = true;
                    }
                }
                if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
                    if (this.initialInfo.loanOption.en === 'EXISTING' || this.initialInfo.loanOption.en === 'Existing') {
                        this.newOrExisting = true;
                    }
                }
                this.interestRate = this.initialInfo.interestRate ? this.initialInfo.interestRate.ct : '';
            }
            if (this.cadData.offerDocumentList[0].docName !== 'DDSL Without Subsidy' &&
                this.cadData.offerDocumentList[0].docName !== 'Combined Offer Letter' &&
                this.cadData.offerDocumentList[0].docName !== 'Class A Sanction letter') {
                const dateOfApproval = this.initialInfo.dateOfApprovalType ? this.initialInfo.dateOfApprovalType.en : '';
                if (dateOfApproval === 'AD') {
                    this.sanctionDate = this.initialInfo.dateOfApproval ? this.initialInfo.dateOfApproval.ct : '';
                } else {
                    this.sanctionDate = this.initialInfo.dateOfApprovalNepali ? this.initialInfo.dateOfApprovalNepali.ct : '';
                }
                if (this.initialInfo.loanOption.en === 'EXISTING' || this.initialInfo.loanOption.en === 'Existing' ) {
                    this.newOrExisting = true;
                }
                this.interestRate = this.initialInfo.interestRate ? this.initialInfo.interestRate.ct : '';
            }
            if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
                const dateOfApproval = this.initialInfo.smeGlobalForm.dateOfApprovalType ?
                    this.initialInfo.smeGlobalForm.dateOfApprovalType : '';
                if (dateOfApproval === 'AD') {
                    this.sanctionDate = this.engToNepaliDate.transform(this.initialInfo.smeGlobalForm.dateOfApproval ?
                        this.initialInfo.smeGlobalForm.dateOfApprovalCT : '', true);
                } else {
                    this.sanctionDate = this.initialInfo.smeGlobalForm.dateOfApprovalNepali ?
                        this.initialInfo.smeGlobalForm.dateOfApprovalNepali.nDate : '';
                }
                if (this.initialInfo.smeGlobalForm.loanOption === 'Plain Renewal' || this.initialInfo.smeGlobalForm.loanOption === 'Other'
                    || this.initialInfo.smeGlobalForm.loanOption === 'Renewal with Enhancement or Additional Loan' ||
                    this.initialInfo.smeGlobalForm.loanOption === 'Additional Loan') {
                    this.newOrExisting = true;
                }
                if (this.loanData.length > 0) {
                    this.loanData.forEach((v, index) => {
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.CUSTOMER_ACCEPTANCE_FOR_TIME_LETTER_OF_CREDIT && !ObjectUtil.isEmpty(this.initialInfo.timeLetterCreditForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry;
                            if (this.initialInfo.timeLetterCreditForm.loanOption === 'REGULAR') {
                                const dateOfExpiryType = this.initialInfo.timeLetterCreditForm.dateOfExpiryType ?
                                    this.initialInfo.timeLetterCreditForm.dateOfExpiryType : '';
                                if (dateOfExpiryType === 'AD') {
                                    tempDateOfExpiry = this.engToNepaliDate.transform(this.initialInfo.timeLetterCreditForm.dateOfApproval ?
                                        this.initialInfo.timeLetterCreditForm.dateOfExpiry : '', true);
                                } else {
                                    tempDateOfExpiry = this.initialInfo.timeLetterCreditForm.dateOfExpiryNepali ?
                                        this.initialInfo.timeLetterCreditForm.dateOfExpiryNepali.nDate : '';
                                }
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY && !ObjectUtil.isEmpty(this.initialInfo.letterOfCreditForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry1;
                            if (this.initialInfo.letterOfCreditForm.loanOption === 'REGULAR') {
                                const dateOfExpiryType = this.initialInfo.letterOfCreditForm.dateOfExpiryType ?
                                    this.initialInfo.letterOfCreditForm.dateOfExpiryType : '';
                                if (dateOfExpiryType === 'AD') {
                                    tempDateOfExpiry1 = this.engToNepaliDate.transform(this.initialInfo.letterOfCreditForm.dateOfExpiry ?
                                        this.initialInfo.letterOfCreditForm.dateOfExpiry : '', true);
                                } else {
                                    tempDateOfExpiry1 = this.initialInfo.letterOfCreditForm.dateOfExpiryNepali ?
                                        this.initialInfo.letterOfCreditForm.dateOfExpiryNepali.nDate : '';
                                }
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry1,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.IMPORT_BILLS_DISCOUNTING && !ObjectUtil.isEmpty(this.initialInfo.importBillsDiscountForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry;
                            if (this.initialInfo.importBillsDiscountForm.loanOption === 'REGULAR') {
                                const dateOfExpiryType = this.initialInfo.importBillsDiscountForm.dateOfExpiryType ?
                                    this.initialInfo.importBillsDiscountForm.dateOfExpiryType : '';
                                if (dateOfExpiryType === 'AD') {
                                    // tslint:disable-next-line:max-line-length
                                    tempDateOfExpiry = this.engToNepaliDate.transform(this.initialInfo.importBillsDiscountForm.dateOfApproval ?
                                        this.initialInfo.importBillsDiscountForm.dateOfExpiry : '', true);
                                } else {
                                    tempDateOfExpiry = this.initialInfo.importBillsDiscountForm.dateOfExpiryNepali ?
                                        this.initialInfo.importBillsDiscountForm.dateOfExpiryNepali.nDate : '';
                                }
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN &&
                            !ObjectUtil.isEmpty(this.initialInfo.importLoanTrust)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry;
                            if (this.initialInfo.importLoanTrust.loanOption === 'REGULAR') {
                                const dateOfExpiryType = this.initialInfo.importLoanTrust.dateOfExpiryType ?
                                    this.initialInfo.importLoanTrust.dateOfExpiryType : '';
                                if (dateOfExpiryType === 'AD') {
                                    tempDateOfExpiry = this.engToNepaliDate.transform(this.initialInfo.importLoanTrust.dateOfApproval ?
                                        this.initialInfo.importLoanTrust.dateOfExpiry : '', true);
                                } else {
                                    tempDateOfExpiry = this.initialInfo.importLoanTrust.dateOfExpiryNepali ?
                                        this.initialInfo.importLoanTrust.dateOfExpiryNepali.nDate : '';
                                }
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.SHORT_TERM_LOAN &&
                            !ObjectUtil.isEmpty(this.initialInfo.revolvingShortTermLoan)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry;
                            if (this.initialInfo.revolvingShortTermLoan.loanOption === 'REGULAR') {
                                const dateOfExpiryType = this.initialInfo.revolvingShortTermLoan.dateOfExpiryType ?
                                    this.initialInfo.revolvingShortTermLoan.dateOfExpiryType : '';
                                if (dateOfExpiryType === 'AD') {
                                    // tslint:disable-next-line:max-line-length
                                    tempDateOfExpiry = this.engToNepaliDate.transform(this.initialInfo.revolvingShortTermLoan.dateOfApproval ?
                                        this.initialInfo.revolvingShortTermLoan.dateOfExpiry : '', true);
                                } else {
                                    tempDateOfExpiry = this.initialInfo.revolvingShortTermLoan.dateOfExpiryNepali ?
                                        this.initialInfo.revolvingShortTermLoan.dateOfExpiryNepali.nDate : '';
                                }
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL &&
                            !ObjectUtil.isEmpty(this.initialInfo.demandLoanForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry;
                            const dateOfExpiryType = this.initialInfo.demandLoanForm.dateOfExpiryType ?
                                this.initialInfo.demandLoanForm.dateOfExpiryType : '';
                            if (dateOfExpiryType === 'AD') {
                                tempDateOfExpiry = this.engToNepaliDate.transform(this.initialInfo.demandLoanForm.dateOfApproval ?
                                    this.initialInfo.demandLoanForm.dateOfExpiry : '', true);
                            } else {
                                tempDateOfExpiry = this.initialInfo.demandLoanForm.dateOfExpiryNepali ?
                                    this.initialInfo.demandLoanForm.dateOfExpiryNepali.nDate : '';
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.PRE_EXPORT_LOAN && !ObjectUtil.isEmpty(this.initialInfo.preExportForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            const dateOfExpiryType = this.initialInfo.preExportForm.dateOfExpiryType ?
                                this.initialInfo.preExportForm.dateOfExpiryType : '';
                            if (dateOfExpiryType === 'AD') {
                                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.preExportForm.dateOfExpiry ?
                                    this.initialInfo.preExportForm.dateOfExpiry : '', true);
                            } else {
                                tempDateOfExpiry2 = this.initialInfo.preExportForm.dateOfExpiryNepali ?
                                    this.initialInfo.preExportForm.dateOfExpiryNepali.nDate : '';
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION &&
                            !ObjectUtil.isEmpty(this.initialInfo.documentaryBillPurchase)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            const dateOfExpiryType = this.initialInfo.documentaryBillPurchase.dateOfExpiryType ?
                                this.initialInfo.documentaryBillPurchase.dateOfExpiryType : '';
                            if (dateOfExpiryType === 'AD') {
                                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.documentaryBillPurchase.dateOfExpiry ?
                                    this.initialInfo.documentaryBillPurchase.dateOfExpiry : '', true);
                            } else {
                                tempDateOfExpiry2 = this.initialInfo.documentaryBillPurchase.dateOfExpiryNepali ?
                                    this.initialInfo.documentaryBillPurchase.dateOfExpiryNepali.nDate : '';
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT &&
                            !ObjectUtil.isEmpty(this.initialInfo.overdraftLoanForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            const dateOfExpiryType = this.initialInfo.overdraftLoanForm.dateOfExpiryType ?
                                this.initialInfo.overdraftLoanForm.dateOfExpiryType : '';
                            if (dateOfExpiryType === 'AD') {
                                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.overdraftLoanForm.dateOfExpiry ?
                                    this.initialInfo.overdraftLoanForm.dateOfExpiry : '', true);
                            } else {
                                tempDateOfExpiry2 = this.initialInfo.overdraftLoanForm.dateOfExpiryNepali ?
                                    this.initialInfo.overdraftLoanForm.dateOfExpiryNepali.nDate : '';
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.MORTGAGE_OVERDRAFT ||
                            v.loanName === LoanNameConstant.EQUITY_MORTGAGED_OVERDRAFT &&
                            !ObjectUtil.isEmpty(this.initialInfo.equityMortgaged)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            const dateOfExpiryType = this.initialInfo.equityMortgaged.dateOfExpiryType ?
                                this.initialInfo.equityMortgaged.dateOfExpiryType : '';
                            if (dateOfExpiryType === 'AD') {
                                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.equityMortgaged.dateOfExpiry ?
                                    this.initialInfo.equityMortgaged.dateOfExpiry : '', true);
                            } else {
                                tempDateOfExpiry2 = this.initialInfo.equityMortgaged.dateOfExpiryNepali ?
                                    this.initialInfo.equityMortgaged.dateOfExpiryNepali.nDate : '';
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_FIXED_DEPOSIT || v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_LIEN_ON_DEPOSIT_ACCOUNT ||
                            v.loanName === LoanNameConstant.STL_AGAINST_FIXED_DEPOSIT ||
                            v.loanName === LoanNameConstant.STL_LIEN_ON_DEPOSIT_ACCOUNT ||
                            v.loanName === LoanNameConstant.DL_AGAINST_FIXED_DEPOSIT ||
                            v.loanName === LoanNameConstant.DL_LIEN_ON_DEPOSIT_ACCOUNT &&
                            !ObjectUtil.isEmpty(this.initialInfo.overdraftFixedForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            const dateOfExpiryType = this.initialInfo.overdraftFixedForm.dateOfExpiryType ?
                                this.initialInfo.overdraftFixedForm.dateOfExpiryType : '';
                            if (dateOfExpiryType === 'AD') {
                                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.overdraftFixedForm.dateOfExpiry ?
                                    this.initialInfo.overdraftFixedForm.dateOfExpiry : '', true);
                            } else {
                                tempDateOfExpiry2 = this.initialInfo.overdraftFixedForm.dateOfExpiryNepali ?
                                    this.initialInfo.overdraftFixedForm.dateOfExpiryNepali.nDate : '';
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND || v.loanName === LoanNameConstant.STL_FACILITY_AGAINST_BOND ||
                            v.loanName === LoanNameConstant.DL_FACILITY_AGAINST_BOND &&
                            !ObjectUtil.isEmpty(this.initialInfo.overDraftFacilityForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            const dateOfExpiryType = this.initialInfo.overDraftFacilityForm.dateOfExpiryType ?
                                this.initialInfo.overDraftFacilityForm.dateOfExpiryType : '';
                            if (dateOfExpiryType === 'AD') {
                                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.overDraftFacilityForm.dateOfExpiry ?
                                    this.initialInfo.overDraftFacilityForm.dateOfExpiry : '', true);
                            } else {
                                tempDateOfExpiry2 = this.initialInfo.overDraftFacilityForm.dateOfExpiryNepali ?
                                    this.initialInfo.overDraftFacilityForm.dateOfExpiryNepali.nDate : '';
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.BRIDGE_GAP_LOAN && !ObjectUtil.isEmpty(this.initialInfo.bridgeGapLoan)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            const dateOfExpiryType = this.initialInfo.bridgeGapLoan.dateOfExpiryType ?
                                this.initialInfo.bridgeGapLoan.dateOfExpiryType : '';
                            if (dateOfExpiryType === 'AD') {
                                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.bridgeGapLoan.dateOfExpiry ?
                                    this.initialInfo.bridgeGapLoan.dateOfExpiry : '', true);
                            } else {
                                tempDateOfExpiry2 = this.initialInfo.bridgeGapLoan.dateOfExpiryNepali ?
                                    this.initialInfo.bridgeGapLoan.dateOfExpiryNepali.nDate : '';
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            if (this.initialInfo.termLoanForm.termLoanDetails.length > 0) {
                                const tmpData = this.initialInfo.termLoanForm.termLoanDetails;
                                tmpData.forEach(val => {
                                    if (val.termLoanFor === 'VEHICLE') {
                                        this.autoCheck = true;
                                    }
                                });
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: '',
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.MORTGAGE_TERM_LOAN_EQUITY_MORTGAGE_TERM_LOAN) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: '',
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.AUTO_LOAN) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            this.autoCheck = true;
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: '',
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.BANK_GUARANTEE && !ObjectUtil.isEmpty(this.initialInfo.bankGuarantee)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            const dateOfExpiryType = this.initialInfo.bankGuarantee.dateOfExpiryType ?
                                this.initialInfo.bankGuarantee.dateOfExpiryType : '';
                            if (dateOfExpiryType === 'AD') {
                                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.bankGuarantee.dateOfExpiry ?
                                    this.initialInfo.bankGuarantee.dateOfExpiry : '', true);
                            } else {
                                tempDateOfExpiry2 = this.initialInfo.bankGuarantee.dateOfExpiryNepali ?
                                    this.initialInfo.bankGuarantee.dateOfExpiryNepali.nDate : '';
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.BILLS_PURCHASE && !ObjectUtil.isEmpty(this.initialInfo.billPurchaseForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            const dateOfExpiryType = this.initialInfo.billPurchaseForm.dateOfExpiryType ?
                                this.initialInfo.billPurchaseForm.dateOfExpiryType : '';
                            if (dateOfExpiryType === 'AD') {
                                tempDateOfExpiry2 = this.engToNepaliDate.transform(this.initialInfo.billPurchaseForm.dateOfExpiry ?
                                    this.initialInfo.billPurchaseForm.dateOfExpiry : '', true);
                            } else {
                                tempDateOfExpiry2 = this.initialInfo.billPurchaseForm.dateOfExpiryNepali ?
                                    this.initialInfo.billPurchaseForm.dateOfExpiryNepali.nDate : '';
                            }
                            const newData = {
                                loanNepaliName: v.loanNepaliName,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                newData
                            );
                        }
                        this.addCombinedFreeText();
                        if (this.cadData.cadFileList.length > 0) {
                            this.form.get(['combinedFreeText', index, 'dateOfExpiry']).patchValue(
                                this.supportedInfo ? this.supportedInfo.combinedFreeText[index].dateOfExpiry : ''
                            );
                            this.form.get(['combinedFreeText', index, 'interestRateCombined']).patchValue(
                                this.supportedInfo ? this.supportedInfo.combinedFreeText[index].interest : ''
                            );
                        } else {
                            this.form.get(['combinedFreeText', index, 'dateOfExpiry']).patchValue(
                                this.newTempData[index].dateOfExpiry
                            );
                        }
                    });
                }
            }
        }
        if (!ObjectUtil.isEmpty(this.individualData.radioActYearDate)) {
            if (this.individualData.radioActYearDate.en === 'AD') {
                this.actYear = this.engToNepNumberPipe.transform(this.individualData.actYear ?
                    this.individualData.actYear.en : this.individualData.actYear.en) || '२०२०';
            } else {
                this.actYear = this.individualData.actYear ? this.individualData.actYear.en.nDate : '२०२०';
            }
        }
        if (this.cadData.offerDocumentList[0].docName !== 'Combined Offer Letter') {
            if (this.cadData.cadFileList.length > 0 && !ObjectUtil.isEmpty(this.cadData.cadFileList[0].supportedInformation)) {
                const date = JSON.parse(this.cadData.cadFileList[0].supportedInformation);
                this.dateOfExpirySingle = date ? date.dateOfExpirySingle : '';
            }
        }
        /*this.checkOfferLetterData();*/
        this.form.patchValue({
            nameOfBranchLocated: this.individualData.branch ? this.individualData.branch.ct : '',
            actName: this.individualData.actName ? this.individualData.actName.ct : 'साझेदारी',
            yearInFigure: this.actYear ? this.actYear : '२०२०',
            nameOfAuthorizedBody: this.individualData.authorizedBodyName ? this.individualData.authorizedBodyName.ct : 'नेपाल सरकार',
            nameOfDepartment: this.individualData.registeredWith ? this.individualData.registeredWith.ct : '',
            dateOfRegistration: this.registrationDate ? this.registrationDate : '',
            registrationNo: this.individualData.registrationNo ? this.individualData.registrationNo.ct : '',
            firmName: this.individualData.name ? this.individualData.name.ct : '',
            loanAmountInFigure: this.finalAmount ? this.finalAmount : '',
            loanAmountInWords: this.loanAmountWord ? this.loanAmountWord : '',
            sanctionLetterIssuedDate: this.sanctionDate ? this.sanctionDate : '',
            dateOfExpirySingle: this.dateOfExpirySingle ? this.dateOfExpirySingle : ''
        });
        this.patchFreeText();
    }

    ageCalculation(startDate) {
        startDate = this.datePipe.transform(startDate, 'MMMM d, y, h:mm:ss a z');
        const stDate = new Date(startDate);
        const endDate = new Date();
        let diff = (endDate.getTime() - stDate.getTime()) / 1000;
        diff = diff / (60 * 60 * 24);
        const yr = Math.abs(Math.round(diff / 365.25));
        return this.engToNepNumberPipe.transform(yr.toString());
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

    convertNepaliNumberAmount(value) {
        return this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(value));
    }
}


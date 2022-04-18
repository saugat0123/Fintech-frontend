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
import {document} from 'ionicons/icons';
import {OfferDocument} from '../../../model/OfferDocument';
import {logger} from 'codelyzer/util/logger';

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
    isAutoLoan = false;
    isTermLoan = false;
    newData;
    interestRateExists = false;

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
        this.setTotalAmount();
        this.fillForm();
        // this.checkAutoOrTermLoan();
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

    setTotalAmount() {
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
                this.finalAmount = (this.initialInfo.smeGlobalForm && this.initialInfo.smeGlobalForm.totalLimitInFigureCT) ?
                    this.initialInfo.smeGlobalForm.totalLimitInFigureCT : '';
                this.loanAmountWord = (this.initialInfo.smeGlobalForm && this.initialInfo.smeGlobalForm.totalLimitInWordsCT ) ?
                    this.initialInfo.smeGlobalForm.totalLimitInWordsCT : '';
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
                this.finalAmount = (this.initialInfo && this.initialInfo.loanLimitAmountFigure) ?
                    this.initialInfo.loanLimitAmountFigure.ct : '';
                this.loanAmountWord = (this.initialInfo && this.initialInfo.loanLimitAmountFigureWords) ?
                    this.initialInfo.loanLimitAmountFigureWords.ct : '';
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
                this.finalAmount = (this.initialInfo && this.initialInfo.totalLimitInFigure) ?
                    this.initialInfo.totalLimitInFigure.ct : '';
                this.loanAmountWord = (this.initialInfo && this.initialInfo.totalLimitInWords) ?
                    this.initialInfo.totalLimitInWords.ct : '';
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
                this.finalAmount = (this.initialInfo && this.initialInfo.totalLimitFigure) ?
                    this.initialInfo.totalLimitFigure.ct : '';
                this.loanAmountWord = (this.initialInfo && this.initialInfo.totalLimitWords) ?
                    this.initialInfo.totalLimitWords.ct : '';
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
                const proposedLimit = this.cadData.assignedLoan[0] ?
                    this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
                this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
                this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(proposedLimit ? proposedLimit : '');
            } if (!ObjectUtil.isEmpty(this.initialInfo) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
                this.finalAmount = (this.initialInfo && this.initialInfo.loanAmountFigure) ?
                    this.initialInfo.loanAmountFigure.ct : '';
                this.loanAmountWord = (this.initialInfo && this.initialInfo.loanAmountFigureWords) ?
                    this.initialInfo.loanAmountFigureWords.ct : '';
            }
        }
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
            const proposalId = val.proposal.id;
            const tempLoan = {
                loanName: loanName,
                loanNepaliName: loanNepaliName,
                proposalId: proposalId,
            };
            this.loanData.push(tempLoan);
        });
    }

    fillForm() {
        // for date conversion of registration date
        if (!ObjectUtil.isEmpty(this.individualData.registrationDateOption)) {
            if (this.individualData.registrationDateOption.en === 'AD') {
                this.registrationDate = this.engToNepaliDate.transform(this.individualData.registrationDate ?
                    this.individualData.registrationDate.en : this.individualData.registrationDate.en, true) || '';
            } else {
                this.registrationDate = this.individualData.registrationDateNepali.en ? this.individualData.registrationDateNepali.en.nDate : '';
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
                if (this.initialInfo.loanOption.en === 'EXISTING' || this.initialInfo.loanOption.en === 'Existing') {
                    this.newOrExisting = true;
                }
                this.interestRate = this.initialInfo.interestRate ? this.initialInfo.interestRate.ct : '';
            }
            if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
                    if (!ObjectUtil.isEmpty(this.initialInfo.smeGlobalForm.dateOfApprovalType) && this.initialInfo.smeGlobalForm.dateOfApprovalType === 'AD') {
                        this.sanctionDate = this.initialInfo.smeGlobalForm.dateOfApprovalCT ? this.initialInfo.smeGlobalForm.dateOfApprovalCT : '';
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
                            let tempCommissionRate = '';
                            // timeLetterCreditFormArray
                            for (let val = 0; val < this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray[val].loanId) {
                                    if (this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray[val].loanOption === 'REGULAR') {
                                        const dateOfExpiryType = this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray[val].dateOfExpiryType ?
                                            this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray[val].dateOfExpiryType : '';
                                        if (dateOfExpiryType === 'AD') {
                                            tempDateOfExpiry = this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray[val].dateOfExpiry ?
                                                this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray[val].dateOfExpiryCT : '';
                                        } else {
                                            tempDateOfExpiry = this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray[val].dateOfExpiryNepali ?
                                                this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray[val].dateOfExpiryNepali.nDate : '';
                                        }
                                    }
                                    tempCommissionRate = this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray[val].commissionRate ?
                                        this.initialInfo.timeLetterCreditForm.timeLetterCreditFormArray[val].commissionRateCT : '';
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: false,
                                commissionRate: tempCommissionRate,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY && !ObjectUtil.isEmpty(this.initialInfo.letterOfCreditForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry1;
                            let tempCommissionRate = '';
                            // letterOfCreditFormArray
                            for (let val = 0; val < this.initialInfo.letterOfCreditForm.letterOfCreditFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].loanId) {
                                    if (this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].loanOption === 'REGULAR') {
                                        const dateOfExpiryType = this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].dateOfExpiryType ?
                                            this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].dateOfExpiryType : '';
                                        if (dateOfExpiryType === 'AD') {
                                            tempDateOfExpiry1 = this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].dateOfExpiry ?
                                                this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].dateOfExpiryCT : '';
                                        } else {
                                            tempDateOfExpiry1 = this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].dateOfExpiryNepali ?
                                                this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].dateOfExpiryNepali.nDate : '';
                                        }
                                    } if (this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].commissionType === 'COMMISSION_TYPE_1') {
                                        tempCommissionRate = this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].commissionRate ?
                                            this.initialInfo.letterOfCreditForm.letterOfCreditFormArray[val].commissionRateCT : '';
                                    }
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: false,
                                commissionRate: tempCommissionRate,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry1,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.IMPORT_BILLS_DISCOUNTING && !ObjectUtil.isEmpty(this.initialInfo.importBillsDiscountForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry;
                            // importBillsDiscountFormArray
                            for (let val = 0; val < this.initialInfo.importBillsDiscountForm.importBillsDiscountFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.importBillsDiscountForm.importBillsDiscountFormArray[val].loanId) {
                                    if (this.initialInfo.importBillsDiscountForm.importBillsDiscountFormArray[val].loanOption === 'REGULAR') {
                                        const dateOfExpiryType = this.initialInfo.importBillsDiscountForm.importBillsDiscountFormArray[val].dateOfExpiryType ?
                                            this.initialInfo.importBillsDiscountForm.importBillsDiscountFormArray[val].dateOfExpiryType : '';
                                        if (dateOfExpiryType === 'AD') {
                                            // tslint:disable-next-line:max-line-length
                                            tempDateOfExpiry = this.initialInfo.importBillsDiscountForm.importBillsDiscountFormArray[val].dateOfExpiry ?
                                                this.initialInfo.importBillsDiscountForm.importBillsDiscountFormArray[val].dateOfExpiryCT : '';
                                        } else {
                                            tempDateOfExpiry = this.initialInfo.importBillsDiscountForm.importBillsDiscountFormArray[val].dateOfExpiryNepali ?
                                                this.initialInfo.importBillsDiscountForm.importBillsDiscountFormArray[val].dateOfExpiryNepali.nDate : '';
                                        }
                                    }
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: false,
                                commissionRate: '',
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.IMPORT_LOAN_TRUST_RECEIPT_LOAN &&
                            !ObjectUtil.isEmpty(this.initialInfo.importLoanTrust)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry;
                            // importLoanTrustFormArray
                            let importLoanInterest;
                            for (let val = 0; val < this.initialInfo.importLoanTrust.importLoanTrustFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.importLoanTrust.importLoanTrustFormArray[val].loanId) {
                                    if (this.initialInfo.importLoanTrust.importLoanTrustFormArray[val].loanOption === 'REGULAR') {
                                        const dateOfExpiryType = this.initialInfo.importLoanTrust.importLoanTrustFormArray[val].dateOfExpiryType ?
                                            this.initialInfo.importLoanTrust.importLoanTrustFormArray[val].dateOfExpiryType : '';
                                        if (dateOfExpiryType === 'AD') {
                                            tempDateOfExpiry = this.initialInfo.importLoanTrust.importLoanTrustFormArray[val].dateOfExpiry ?
                                                this.initialInfo.importLoanTrust.importLoanTrustFormArray[val].dateOfExpiryCT : '';
                                        } else {
                                            tempDateOfExpiry = this.initialInfo.importLoanTrust.importLoanTrustFormArray[val].dateOfExpiryNepali ?
                                                this.initialInfo.importLoanTrust.importLoanTrustFormArray[val].dateOfExpiryNepali.nDate : '';
                                        }
                                    }
                                    importLoanInterest = this.initialInfo.importLoanTrust.importLoanTrustFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry,
                                interestRate: importLoanInterest,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.SHORT_TERM_LOAN &&
                            !ObjectUtil.isEmpty(this.initialInfo.revolvingShortTermLoan)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry;
                            let revolving;
                            // revolvingShortTermLoanFormArray
                            for (let val = 0; val < this.initialInfo.revolvingShortTermLoan.revolvingShortTermLoanFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].loanId) {
                                    if (this.initialInfo.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].loanOption === 'REGULAR') {
                                        const dateOfExpiryType = this.initialInfo.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].dateOfExpiryType
                                            ? this.initialInfo.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].dateOfExpiryType : '';
                                        if (dateOfExpiryType === 'AD') {
                                            // tslint:disable-next-line:max-line-length
                                            tempDateOfExpiry = this.initialInfo.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].dateOfExpiry ?
                                                this.initialInfo.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].dateOfExpiryCT : '';
                                        } else {
                                            tempDateOfExpiry = this.initialInfo.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].dateOfExpiryNepali ?
                                                this.initialInfo.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].dateOfExpiryNepali.nDate : '';
                                        }
                                    }
                                    revolving = this.initialInfo.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: revolving,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.DEMAND_LOAN_FOR_WORKING_CAPITAL &&
                            !ObjectUtil.isEmpty(this.initialInfo.demandLoanForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry;
                            // demandLoanFormArray
                            let demandLoanForm;
                            for (let val = 0; val < this.initialInfo.demandLoanForm.demandLoanFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.demandLoanForm.demandLoanFormArray[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.demandLoanForm.demandLoanFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.demandLoanForm.demandLoanFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry = this.initialInfo.demandLoanForm.demandLoanFormArray[val].dateOfExpiry ?
                                            this.initialInfo.demandLoanForm.demandLoanFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry = this.initialInfo.demandLoanForm.demandLoanFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.demandLoanForm.demandLoanFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    demandLoanForm = this.initialInfo.demandLoanForm.demandLoanFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry,
                                interestRate: demandLoanForm
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.PRE_EXPORT_LOAN && !ObjectUtil.isEmpty(this.initialInfo.preExportForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            // termLoanDetails
                            for (let val = 0; val < this.initialInfo.preExportForm.termLoanDetails.length; val++) {
                                if (v.proposalId === this.initialInfo.preExportForm.termLoanDetails[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.preExportForm.termLoanDetails[val].dateOfExpiryType ?
                                        this.initialInfo.preExportForm.termLoanDetails[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.preExportForm.termLoanDetails[val].dateOfExpiry ?
                                            this.initialInfo.preExportForm.termLoanDetails[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 = this.initialInfo.preExportForm.termLoanDetails[val].dateOfExpiryNepali ?
                                            this.initialInfo.preExportForm.termLoanDetails[val].dateOfExpiryNepali.nDate : '';
                                    }
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: false,
                                commissionRate: '',
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.DOCUMENTARY_BILL_PURCHASE_NEGOTIATION &&
                            !ObjectUtil.isEmpty(this.initialInfo.documentaryBillPurchase)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let tempCommissionRate;
                            // documentaryBillPurchaseFormArray
                            for (let val = 0; val < this.initialInfo.documentaryBillPurchase.documentaryBillPurchaseFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].dateOfExpiryType
                                        ? this.initialInfo.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].dateOfExpiry ?
                                            this.initialInfo.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 = this.initialInfo.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].dateOfExpiryNepali
                                            ? this.initialInfo.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    tempCommissionRate = this.initialInfo.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].commission
                                        ? this.initialInfo.documentaryBillPurchase.documentaryBillPurchaseFormArray[val].commissionCT : '';
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: false,
                                commissionRate: tempCommissionRate,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.OVERDRAFT_LOAN_FOR_WORKING_CAPITAL_REQUIREMENT &&
                            !ObjectUtil.isEmpty(this.initialInfo.overdraftLoanForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let overdraftLoanForm;
                            // overdraftLoanFormArray
                            for (let val = 0; val < this.initialInfo.overdraftLoanForm.overdraftLoanFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.overdraftLoanForm.overdraftLoanFormArray[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.overdraftLoanForm.overdraftLoanFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.overdraftLoanForm.overdraftLoanFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.overdraftLoanForm.overdraftLoanFormArray[val].dateOfExpiry ?
                                            this.initialInfo.overdraftLoanForm.overdraftLoanFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 = this.initialInfo.overdraftLoanForm.overdraftLoanFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.overdraftLoanForm.overdraftLoanFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    overdraftLoanForm = this.initialInfo.overdraftLoanForm.overdraftLoanFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                                interestRate: overdraftLoanForm,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.EQUITY_MORTGAGED_OVERDRAFT &&
                            !ObjectUtil.isEmpty(this.initialInfo.equityMortgaged)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let equityMortgaged;
                            // equityMortgagedFormArray
                            for (let val = 0; val < this.initialInfo.equityMortgaged.equityMortgagedFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.equityMortgaged.equityMortgagedFormArray[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.equityMortgaged.equityMortgagedFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.equityMortgaged.equityMortgagedFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.equityMortgaged.equityMortgagedFormArray[val].dateOfExpiry ?
                                            this.initialInfo.equityMortgaged.equityMortgagedFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 = this.initialInfo.equityMortgaged.equityMortgagedFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.equityMortgaged.equityMortgagedFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    equityMortgaged = this.initialInfo.equityMortgaged.equityMortgagedFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: equityMortgaged,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.MORTGAGE_OVERDRAFT &&
                            !ObjectUtil.isEmpty(this.initialInfo.equityMortgaged)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let mortgagedInterest;
                            // mortgageOverdraftFormArray
                            for (let val = 0; val < this.initialInfo.equityMortgaged.mortgageOverdraftFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.equityMortgaged.mortgageOverdraftFormArray[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.equityMortgaged.mortgageOverdraftFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.equityMortgaged.mortgageOverdraftFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.equityMortgaged.mortgageOverdraftFormArray[val].dateOfExpiry ?
                                            this.initialInfo.equityMortgaged.mortgageOverdraftFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 = this.initialInfo.equityMortgaged.mortgageOverdraftFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.equityMortgaged.mortgageOverdraftFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    mortgagedInterest = this.initialInfo.equityMortgaged.mortgageOverdraftFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: mortgagedInterest,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_FIXED_DEPOSIT &&
                            !ObjectUtil.isEmpty(this.initialInfo.overdraftFixedForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let overdraftFixedForm;
                            // odFdFormArray
                            for (let val = 0; val < this.initialInfo.overdraftFixedForm.odFdFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.overdraftFixedForm.odFdFormArray[val].loanId) {
                                    const dateOfExpiryType =  this.initialInfo.overdraftFixedForm.odFdFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.overdraftFixedForm.odFdFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.overdraftFixedForm.odFdFormArray[val].dateOfExpiry ?
                                            this.initialInfo.overdraftFixedForm.odFdFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 =  this.initialInfo.overdraftFixedForm.odFdFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.overdraftFixedForm.odFdFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    overdraftFixedForm = this.initialInfo.overdraftFixedForm.odFdFormArray[val].interestRate ?
                                        this.initialInfo.overdraftFixedForm.odFdFormArray[val].interestRateCT :
                                        (this.initialInfo.overdraftFixedForm.odFdFormArray[val].totalInterestRate ?
                                            this.initialInfo.overdraftFixedForm.odFdFormArray[val].totalInterestRateCT : '');
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: overdraftFixedForm,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_LIEN_ON_DEPOSIT_ACCOUNT &&
                            !ObjectUtil.isEmpty(this.initialInfo.overdraftFixedForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let overdraftFixedForm;
                            // overdraftLienOnDepositFormArray
                            for (let val = 0; val < this.initialInfo.overdraftFixedForm.overdraftLienOnDepositFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.overdraftFixedForm.overdraftLienOnDepositFormArray[val].loanId) {
                                    const dateOfExpiryType =  this.initialInfo.overdraftFixedForm.overdraftLienOnDepositFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.overdraftFixedForm.overdraftLienOnDepositFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.overdraftFixedForm.overdraftLienOnDepositFormArray[val].dateOfExpiry ?
                                            this.initialInfo.overdraftFixedForm.overdraftLienOnDepositFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 =  this.initialInfo.overdraftFixedForm.overdraftLienOnDepositFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.overdraftFixedForm.overdraftLienOnDepositFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    overdraftFixedForm = this.initialInfo.overdraftFixedForm.overdraftLienOnDepositFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: overdraftFixedForm,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.STL_AGAINST_FIXED_DEPOSIT &&
                            !ObjectUtil.isEmpty(this.initialInfo.overdraftFixedForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let overdraftFixedForm;
                            // stlAgainstFixedDepositFormArray
                            for (let val = 0; val < this.initialInfo.overdraftFixedForm.stlAgainstFixedDepositFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.overdraftFixedForm.stlAgainstFixedDepositFormArray[val].loanId) {
                                    const dateOfExpiryType =  this.initialInfo.overdraftFixedForm.stlAgainstFixedDepositFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.overdraftFixedForm.stlAgainstFixedDepositFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.overdraftFixedForm.stlAgainstFixedDepositFormArray[val].dateOfExpiry ?
                                            this.initialInfo.overdraftFixedForm.stlAgainstFixedDepositFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 =  this.initialInfo.overdraftFixedForm.stlAgainstFixedDepositFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.overdraftFixedForm.stlAgainstFixedDepositFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    overdraftFixedForm = this.initialInfo.overdraftFixedForm.stlAgainstFixedDepositFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: overdraftFixedForm,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.STL_LIEN_ON_DEPOSIT_ACCOUNT &&
                            !ObjectUtil.isEmpty(this.initialInfo.overdraftFixedForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let overdraftFixedForm;
                            // stlLienOnDepositFormArray
                            for (let val = 0; val < this.initialInfo.overdraftFixedForm.stlLienOnDepositFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.overdraftFixedForm.stlLienOnDepositFormArray[val].loanId) {
                                    const dateOfExpiryType =  this.initialInfo.overdraftFixedForm.stlLienOnDepositFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.overdraftFixedForm.stlLienOnDepositFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.overdraftFixedForm.stlLienOnDepositFormArray[val].dateOfExpiry ?
                                            this.initialInfo.overdraftFixedForm.stlLienOnDepositFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 =  this.initialInfo.overdraftFixedForm.stlLienOnDepositFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.overdraftFixedForm.stlLienOnDepositFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    overdraftFixedForm = this.initialInfo.overdraftFixedForm.stlLienOnDepositFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: overdraftFixedForm,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.DL_AGAINST_FIXED_DEPOSIT &&
                            !ObjectUtil.isEmpty(this.initialInfo.overdraftFixedForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let overdraftFixedForm;
                            // dlAgainstFixedDepositFormArray
                            for (let val = 0; val < this.initialInfo.overdraftFixedForm.dlAgainstFixedDepositFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.overdraftFixedForm.dlAgainstFixedDepositFormArray[val].loanId) {
                                    const dateOfExpiryType =  this.initialInfo.overdraftFixedForm.dlAgainstFixedDepositFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.overdraftFixedForm.dlAgainstFixedDepositFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.overdraftFixedForm.dlAgainstFixedDepositFormArray[val].dateOfExpiry ?
                                            this.initialInfo.overdraftFixedForm.dlAgainstFixedDepositFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 =  this.initialInfo.overdraftFixedForm.dlAgainstFixedDepositFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.overdraftFixedForm.dlAgainstFixedDepositFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    overdraftFixedForm = this.initialInfo.overdraftFixedForm.dlAgainstFixedDepositFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: overdraftFixedForm,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.DL_LIEN_ON_DEPOSIT_ACCOUNT &&
                            !ObjectUtil.isEmpty(this.initialInfo.overdraftFixedForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let overdraftFixedForm;
                            // dlAgainstLienOnDepositFormArray
                            for (let val = 0; val < this.initialInfo.overdraftFixedForm.dlAgainstLienOnDepositFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.overdraftFixedForm.dlAgainstLienOnDepositFormArray[val].loanId) {
                                    const dateOfExpiryType =  this.initialInfo.overdraftFixedForm.dlAgainstLienOnDepositFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.overdraftFixedForm.dlAgainstLienOnDepositFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.overdraftFixedForm.dlAgainstLienOnDepositFormArray[val].dateOfExpiry ?
                                            this.initialInfo.overdraftFixedForm.dlAgainstLienOnDepositFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 =  this.initialInfo.overdraftFixedForm.dlAgainstLienOnDepositFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.overdraftFixedForm.dlAgainstLienOnDepositFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    overdraftFixedForm = this.initialInfo.overdraftFixedForm.dlAgainstLienOnDepositFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: overdraftFixedForm,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND &&
                            !ObjectUtil.isEmpty(this.initialInfo.overDraftFacilityForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let overDraftFacilityForm;
                            // overdraftFacilityDetails
                            for (let val = 0; val < this.initialInfo.overDraftFacilityForm.overdraftFacilityDetails.length; val++) {
                                if (v.proposalId === this.initialInfo.overDraftFacilityForm.overdraftFacilityDetails[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.overDraftFacilityForm.overdraftFacilityDetails[val].dateOfExpiryType ?
                                        this.initialInfo.overDraftFacilityForm.overdraftFacilityDetails[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.overDraftFacilityForm.overdraftFacilityDetails[val].dateOfExpiry ?
                                            this.initialInfo.overDraftFacilityForm.overdraftFacilityDetails[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 = this.initialInfo.overDraftFacilityForm.overdraftFacilityDetails[val].dateOfExpiryNepali ?
                                            this.initialInfo.overDraftFacilityForm.overdraftFacilityDetails[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    overDraftFacilityForm = this.initialInfo.overDraftFacilityForm.overdraftFacilityDetails[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: overDraftFacilityForm,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.STL_FACILITY_AGAINST_BOND &&
                            !ObjectUtil.isEmpty(this.initialInfo.overDraftFacilityForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let overDraftFacilityForm;
                            // stlAgainstBondFormArray
                            for (let val = 0; val < this.initialInfo.overDraftFacilityForm.stlAgainstBondFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.overDraftFacilityForm.stlAgainstBondFormArray[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.overDraftFacilityForm.stlAgainstBondFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.overDraftFacilityForm.stlAgainstBondFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.overDraftFacilityForm.stlAgainstBondFormArray[val].dateOfExpiry ?
                                            this.initialInfo.overDraftFacilityForm.stlAgainstBondFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 = this.initialInfo.overDraftFacilityForm.stlAgainstBondFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.overDraftFacilityForm.stlAgainstBondFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    overDraftFacilityForm = this.initialInfo.overDraftFacilityForm.stlAgainstBondFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: overDraftFacilityForm,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.DL_FACILITY_AGAINST_BOND &&
                            !ObjectUtil.isEmpty(this.initialInfo.overDraftFacilityForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let overDraftFacilityForm;
                            // dlAgainstBondFormArray
                            for (let val = 0; val < this.initialInfo.overDraftFacilityForm.dlAgainstBondFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.overDraftFacilityForm.dlAgainstBondFormArray[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.overDraftFacilityForm.dlAgainstBondFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.overDraftFacilityForm.dlAgainstBondFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.overDraftFacilityForm.dlAgainstBondFormArray[val].dateOfExpiry ?
                                            this.initialInfo.overDraftFacilityForm.dlAgainstBondFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 = this.initialInfo.overDraftFacilityForm.dlAgainstBondFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.overDraftFacilityForm.dlAgainstBondFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    overDraftFacilityForm = this.initialInfo.overDraftFacilityForm.dlAgainstBondFormArray[val].interestRateCT;
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: overDraftFacilityForm,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.BRIDGE_GAP_LOAN && !ObjectUtil.isEmpty(this.initialInfo.bridgeGapLoan)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let bridgeGapLoan;
                            // bridgeGapDetails
                            for (let val = 0; val < this.initialInfo.bridgeGapLoan.bridgeGapDetails.length; val++) {
                                bridgeGapLoan = this.initialInfo.bridgeGapLoan.bridgeGapDetails[val].interestRateCT;
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: bridgeGapLoan,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: '',
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.TERM_LOAN_TO_FOR_PURCHASE_OF_VEHICLE && !ObjectUtil.isEmpty(this.initialInfo.termLoanForm)) {
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
                            // termLoanDetails
                            let termLoanInterestRateCT;
                            let tempDateOfExpiry2;
                            for (let val = 0; val < this.initialInfo.termLoanForm.termLoanDetails.length; val++) {
                                if (v.proposalId === this.initialInfo.termLoanForm.termLoanDetails[val].loanId) {
                                    termLoanInterestRateCT = this.initialInfo.termLoanForm.termLoanDetails[val].interestRateCT;
                                    if (!ObjectUtil.isEmpty(this.initialInfo.termLoanForm.termLoanDetails[val].dateOfExpiryType)) {
                                        const dateOfExpiryType = this.initialInfo.termLoanForm.termLoanDetails[val].dateOfExpiryType ?
                                            this.initialInfo.termLoanForm.termLoanDetails[val].dateOfExpiryType : '';
                                        if (dateOfExpiryType === 'AD') {
                                            tempDateOfExpiry2 = this.initialInfo.termLoanForm.termLoanDetails[val].dateOfExpiry ?
                                                this.initialInfo.termLoanForm.termLoanDetails[val].dateOfExpiryCT : '';
                                        } else {
                                            tempDateOfExpiry2 = this.initialInfo.termLoanForm.termLoanDetails[val].dateOfExpiryNepali ?
                                                this.initialInfo.termLoanForm.termLoanDetails[val].dateOfExpiryNepali.nDate : '';
                                        }
                                    }
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                                interestRate: termLoanInterestRateCT,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.MORTGAGE_TERM_LOAN && !ObjectUtil.isEmpty(this.initialInfo.mortgageEquityTermForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            // mortgageTermFormArray
                            let termLoanInterestRateCT;
                            let tempDateOfExpiry2;
                            for (let val = 0; val < this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray[val].loanId) {
                                    termLoanInterestRateCT = this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray[val].interestRateCT;
                                    if (!ObjectUtil.isEmpty(this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiryType)) {
                                        const dateOfExpiryType = this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiryType ?
                                            this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiryType : '';
                                        if (dateOfExpiryType === 'AD') {
                                            tempDateOfExpiry2 = this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiry ?
                                                this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiryCT : '';
                                        } else {
                                            tempDateOfExpiry2 = this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiryNepali ?
                                                this.initialInfo.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiryNepali.nDate : '';
                                        }
                                    }
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: termLoanInterestRateCT,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        // tslint:disable-next-line:max-line-length
                        if (v.loanName === LoanNameConstant.EQUITY_MORTGAGE_TERM_LOAN && !ObjectUtil.isEmpty(this.initialInfo.mortgageEquityTermForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let mortgageEquityTermForm;
                            let tempDateOfExpiry1;
                            for (let val = 0; val < this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray[val].loanId) {
                                    mortgageEquityTermForm = this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray[val].interestRateCT;
                                    if (!ObjectUtil.isEmpty(this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiryType)) {
                                        const dateOfExpiryType = this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiryType ?
                                            this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiryType : '';
                                        if (dateOfExpiryType === 'AD') {
                                            tempDateOfExpiry1 = this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiry ?
                                                this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiryCT : '';
                                        } else {
                                            tempDateOfExpiry1 = this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiryNepali ?
                                                this.initialInfo.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiryNepali.nDate : '';
                                        }
                                    }
                                }
                            }
                            // mortgageEquityTermFormArray
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                interestRate: mortgageEquityTermForm,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry1,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.AUTO_LOAN && !ObjectUtil.isEmpty(this.initialInfo.autoLoanMasterForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            this.autoCheck = true;
                            let autoLoanInterestRateCT;
                            let tempDateOfExpiry1;
                            for (let val = 0; val < this.initialInfo.autoLoanMasterForm.autoLoanFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.autoLoanMasterForm.autoLoanFormArray[val].loanId) {
                                    autoLoanInterestRateCT = this.initialInfo.autoLoanMasterForm.autoLoanFormArray[val].interestRateCT;
                                    if (!ObjectUtil.isEmpty(this.initialInfo.autoLoanMasterForm.autoLoanFormArray[val].dateOfExpiryType)) {
                                        const dateOfExpiryType = this.initialInfo.autoLoanMasterForm.autoLoanFormArray[val].dateOfExpiryType ?
                                            this.initialInfo.autoLoanMasterForm.autoLoanFormArray[val].dateOfExpiryType : '';
                                        if (dateOfExpiryType === 'AD') {
                                            // tslint:disable-next-line:max-line-length
                                            tempDateOfExpiry1 = this.initialInfo.autoLoanMasterForm.autoLoanFormArray[val].dateOfExpiry ?
                                                this.initialInfo.autoLoanMasterForm.autoLoanFormArray[val].dateOfExpiryCT : '';
                                        } else {
                                            tempDateOfExpiry1 = this.initialInfo.autoLoanMasterForm.autoLoanFormArray[val].dateOfExpiryNepali ?
                                                this.initialInfo.autoLoanMasterForm.autoLoanFormArray[val].dateOfExpiryNepali.nDate : '';
                                        }
                                    }
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: true,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry1,
                                interestRate: autoLoanInterestRateCT,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.BANK_GUARANTEE && !ObjectUtil.isEmpty(this.initialInfo.bankGuarantee)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            // let tempCommissionRate = '';
                            // bankGuaranteeArray
                            for (let val = 0; val < this.initialInfo.bankGuarantee.bankGuaranteeArray.length; val++) {
                                if (v.proposalId === this.initialInfo.bankGuarantee.bankGuaranteeArray[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.bankGuarantee.bankGuaranteeArray[val].dateOfExpiryType ?
                                        this.initialInfo.bankGuarantee.bankGuaranteeArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.bankGuarantee.bankGuaranteeArray[val].dateOfExpiry ?
                                            this.initialInfo.bankGuarantee.bankGuaranteeArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 = this.initialInfo.bankGuarantee.bankGuaranteeArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.bankGuarantee.bankGuaranteeArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    // if (this.initialInfo.bankGuarantee.bankGuaranteeArray[val].commissionType === 'COMMISSION_TYPE_2') {
                                    //   tempCommissionRate =
                                    //       (!ObjectUtil.isEmpty(this.initialInfo.bankGuarantee.bankGuaranteeArray[val].commissionInPercentageAPG)) ?
                                    //       this.initialInfo.bankGuarantee.bankGuaranteeArray[val].commissionInPercentageAPG : '';
                                    // }
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: false,
                                commissionRate: '',
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
                            );
                        }
                        if (v.loanName === LoanNameConstant.BILLS_PURCHASE && !ObjectUtil.isEmpty(this.initialInfo.billPurchaseForm)) {
                            // tslint:disable-next-line:max-line-length
                            const tempLoanAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.cadData.assignedLoan[index].proposal.proposedLimit));
                            let tempDateOfExpiry2;
                            let tempCommissionRate = '';
                            // billPurchaseFormArray
                            for (let val = 0; val < this.initialInfo.billPurchaseForm.billPurchaseFormArray.length; val++) {
                                if (v.proposalId === this.initialInfo.billPurchaseForm.billPurchaseFormArray[val].loanId) {
                                    const dateOfExpiryType = this.initialInfo.billPurchaseForm.billPurchaseFormArray[val].dateOfExpiryType ?
                                        this.initialInfo.billPurchaseForm.billPurchaseFormArray[val].dateOfExpiryType : '';
                                    if (dateOfExpiryType === 'AD') {
                                        tempDateOfExpiry2 = this.initialInfo.billPurchaseForm.billPurchaseFormArray[val].dateOfExpiry ?
                                            this.initialInfo.billPurchaseForm.billPurchaseFormArray[val].dateOfExpiryCT : '';
                                    } else {
                                        tempDateOfExpiry2 = this.initialInfo.billPurchaseForm.billPurchaseFormArray[val].dateOfExpiryNepali ?
                                            this.initialInfo.billPurchaseForm.billPurchaseFormArray[val].dateOfExpiryNepali.nDate : '';
                                    }
                                    tempCommissionRate = !ObjectUtil.isEmpty(this.initialInfo.billPurchaseForm.billPurchaseFormArray[val].commission) ?
                                        this.initialInfo.billPurchaseForm.billPurchaseFormArray[val].commissionCT : '';
                                }
                            }
                            this.newData = {
                                loanNepaliName: v.loanNepaliName,
                                interestRateExists: false,
                                commissionRate: tempCommissionRate,
                                loanAmount: tempLoanAmount,
                                dateOfExpiry: tempDateOfExpiry2,
                            };
                            this.newTempData.push(
                                this.newData
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
                                this.newTempData ? this.newTempData[index].dateOfExpiry : ''
                            );
                            if (this.newTempData[index].interestRateExists === false) {
                                this.form.get(['combinedFreeText', index, 'interestRateCombined']).patchValue(
                                    this.newTempData ? this.newTempData[index].commissionRate : ''
                                );
                            }
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
                this.actYear = this.individualData.actYear ? this.individualData.actYear.en : '२०२०';
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
        this.check();
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

    // checkAutoOrTermLoan() {
    //     if (this.cadData.offerDocumentList.length > 0) {
    //         let documentName;
    //         this.cadData.offerDocumentList.filter((document: OfferDocument) => {
    //             documentName = document.docName;
    //             this.offerLetterDocument = document;
    //         });
    //         if (documentName === 'Combined Offer Letter') {
    //             if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation)) {
    //                 const vehicleOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
    //                 this.autoLoanInterestRateCT = vehicleOfferData.autoLoanMasterForm.autoLoanFormArray[0].interestRateCT;
    //                 this.isAutoLoan = true;
    //             }
    //         }
    //         if (documentName === 'Combined Offer Letter') {
    //             if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
    //                 const vehicleOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
    //                 this.termLoanInterestRateCT = vehicleOfferData.termLoanForm.termLoanDetails.interestRateCT;
    //                 this.isTermLoan = true;
    //             }
    //         }
    //     }
    // }
    check() {
        for (const x of this.newTempData) {
            if ('interestRate' in x) {
                this.interestRateExists = true;
            }
        }
    }
}


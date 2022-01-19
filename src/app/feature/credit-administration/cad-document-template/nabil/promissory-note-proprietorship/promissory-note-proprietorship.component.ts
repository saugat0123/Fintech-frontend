import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {CustomerService} from '../../../../customer/service/customer.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {OfferDocument} from '../../../model/OfferDocument';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';

@Component({
    selector: 'app-promissory-note-proprietorship',
    templateUrl: './promissory-note-proprietorship.component.html',
    styleUrls: ['./promissory-note-proprietorship.component.scss']
})
export class PromissoryNoteProprietorshipComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    individualData;
    initialInfoPrint;
    offerLetterConst = NabilDocumentChecklist;
    offerDocumentChecklist = NabilOfferLetterConst;
    form: FormGroup;
    nepData;
    companyInfo;
    offerLetterDocument;
    educationalTemplateData;
    initialInfo;
    supportedInfo;
    registrationDate;
    actYear;
    finalAmount;
    loanAmountWord;
    sanctionDate;
    issueDate = [];

    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private routerUtilsService: RouterUtilsService,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                public datePipe: DatePipe,
                public engToNepaliDate: EngNepDatePipe,
                private customerService: CustomerService) {
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
        this.dateConvert();
        this.fillForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            date: [undefined],
            nameOfBranchLocated: [undefined],
            actName: [undefined],
            yearInFigure: [undefined],
            nameOfAuthorizedBody: [undefined],
            nameOfDepartment: [undefined],
            dateOfRegistration: [undefined],
            registrationNo: [undefined],
            // Firm Details
            districtOfFirm: [undefined],
            municipalityOfFirm: [undefined],
            wardNoOfFirm: [undefined],
            addressOfFirm: [undefined],
            firmName: [undefined],
            loanAmountInFigure: [undefined],
            loanAmountInWords: [undefined],
            intRate: [undefined],
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

    dateConvert() {
        let date;
        this.companyInfo.forEach(val => {
            if (val.radioOwnerCitizenshipIssuedDate === 'AD') {
                date = this.engToNepaliDate.transform(val ?
                    val.ownerCitizenshipIssuedDateCT : val.ownerCitizenshipIssuedDateCT, true) || '';
            } else {
                date = val ? val.ownerCitizenshipIssuedDateCT : '';
            }
            const newDate = {
                issueDate: date
            };
            this.issueDate.push(newDate);
        });
    }

    setFreeText() {
        const free1 = {
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
            date: this.form.get('date') ? this.form.get('date').value : '',
        };
        return JSON.stringify(free1);
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
        if (!ObjectUtil.isEmpty(this.individualData.radioActYearDate)) {
            if (this.individualData.radioActYearDate.en === 'AD') {
                this.actYear = this.engToNepNumberPipe.transform(this.individualData.actYear.en ?
                    this.individualData.actYear.en : this.individualData.actYear.en, true) || '' ;
            } else {
                this.actYear = this.individualData.actYear.en ? this.individualData.actYear.en : '';
            }
        }
        // this.checkOfferLetterData();
        this.form.patchValue({
            nameOfBranchLocated: this.individualData.branch ? this.individualData.branch.ct : '',
            actName: this.individualData.actName ? this.individualData.actName.ct : '',
            yearInFigure: this.actYear ? this.actYear : '',
            nameOfAuthorizedBody: this.individualData.authorizedBodyName ? this.individualData.authorizedBodyName.ct : '',
            nameOfDepartment: this.individualData.registeredWith ? this.individualData.registeredWith.ct : '',
            dateOfRegistration: this.registrationDate ? this.registrationDate : '',
            registrationNo: this.individualData.registrationNo ? this.individualData.registrationNo.ct : '',
            districtOfFirm: this.individualData.registeredDistrict ? this.individualData.registeredDistrict.ct : '',
            municipalityOfFirm: this.individualData.registeredMunicipality ? this.individualData.registeredMunicipality.ct : '',
            wardNoOfFirm: this.individualData.permanentWard ? this.individualData.permanentWard.ct : '',
            addressOfFirm: this.individualData.registeredStreetTole ? this.individualData.registeredStreetTole.ct : '',
            firmName: this.individualData.name ? this.individualData.name.ct : '',
            loanAmountInFigure: this.finalAmount ? this.finalAmount : '',
            loanAmountInWords: this.loanAmountWord ? this.loanAmountWord : '',
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
            date: this.supportedInfo ? this.supportedInfo.date : '',
            intRate: (this.educationalTemplateData && this.educationalTemplateData.ct)
                ? (this.educationalTemplateData.ct)
                : ((this.educationalTemplateData) ? (this.educationalTemplateData)
                    : (''))
        });
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

    submit() {
        let flag = true;
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
            cadFile.supportedInformation = this.setFreeText();
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

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

    checkOfferLetterData() {
        if (this.cadData.offerDocumentList.length > 0) {
            let documentName;
            this.cadData.offerDocumentList.filter((document: OfferDocument) => {
                documentName = document.docName;
                this.offerLetterDocument = document;
            });
            if (documentName === 'DDSL Without Subsidy') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.interestRate;
                }
            }
            if (documentName === 'Kisan Karja Subsidy') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.interestRate;
                }
            }
            if (documentName === 'Udyamsil Karja Subsidy') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.interestRate;
                }
            }
            if (documentName === 'Interest subsidy sanction letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.interestRate;
                }
            }
            if (documentName === 'Class A Sanction letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.interestRate;
                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.importLoanTrust.interestRateCT;
                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.revolvingShortTermLoan.interestRateCT;
                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.demandLoanForm.interestRateCT;

                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.overdraftLoanForm.interestRateCT;
                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.equityMortgaged.interestRateCT;
                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.overdraftFixedForm.interestRateCT;
                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.overDraftFacilityForm.interestRateCT;
                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.bridgeGapLoan.interestRateCT;
                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.termLoanForm.termLoanDetails.interestRateCT;
                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.mortgageEquityTermForm.interestRateCT;
                }
            }
            if (documentName === 'Combined Offer Letter') {
                if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                    const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                    this.educationalTemplateData = educationalOfferData.autoLoanMasterForm.autoLoanFormArray.interestRateCT;
                }
            }

            this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString()
                === this.offerDocumentChecklist.value(this.offerDocumentChecklist.EDUCATIONAL).toString())[0];
            if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
                const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
                this.educationalTemplateData = educationalOfferData.interestRate;
            }
        }
    }
}

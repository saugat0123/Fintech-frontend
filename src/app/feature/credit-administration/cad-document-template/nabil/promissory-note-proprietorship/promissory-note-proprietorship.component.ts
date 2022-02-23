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
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {AgeCalculation} from '../../../../../@core/age-calculation';

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
    newTempData: any = [];
    loanData = [];
    ageArray: Array <any> = new Array <any>();
    dateValidityArray: Array <any> = new Array <any>();
    dateArray: Array <any> = new Array <any>();
    issuedPlaceArray: Array <any> = new Array<any>();
    isInstitutional = false;
    tempData;
    spinner = false;

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
                public engToNepaliDate: EngNepDatePipe) {
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
            if (this.cadData.loanHolder.customerType === 'INSTITUTION') {
                this.isInstitutional = true;
            }
            this.cadData.cadFileList.forEach(individualCadFile => {
                if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
                    this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
                }
            });
        }
        // this.dateConvert();
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
        }
        console.log('temp data::', this.tempData);
        console.log('initial Info data::', this.initialInfo);
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

            // passport details
            directorOtherPassportNumber: [undefined],
            directorIndianPassportNumber: [undefined],
            directorIndianAadhaarNumber: [undefined],
            directorIndianEmbassyNumber: [undefined],
            passportValidityDate: [undefined],
            totalPeople: [undefined],
        });
    }

    dateConvert() {
        let date;
        this.companyInfo.forEach(val => {
            if (val.radioOwnerCitizenshipIssuedDate === 'AD') {
                date = this.engToNepaliDate.transform(val ?
                    val.ownerCitizenshipIssuedDateCT : val.ownerCitizenshipIssuedDateCT, true) || '';
            } else {
                date = val ? val.ownerCitizenshipIssuedDateNepali.nDate : '';
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
            intRate: this.form.get('intRate') ? this.form.get('intRate').value : '',
            /*loanAmountInFigure: this.form.get('loanAmountInFigure') ? this.form.get('loanAmountInFigure').value : '',
            loanAmountInWords: this.form.get('loanAmountInWords') ? this.form.get('loanAmountInWords').value : '',*/
        };
        return JSON.stringify(free1);
    }

    fillForm() {
        if (!ObjectUtil.isEmpty(this.supportedInfo)) {
            const tempAmt = this.nepToEngNumberPipe.transform(this.supportedInfo.loanAmountInFigure);
            this.finalAmount = this.engToNepNumberPipe.transform(tempAmt);
            this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(tempAmt);
        } else {
            let totalLoan = 0;
            this.cadData.assignedLoan.forEach(val => {
                const proposedAmount = val.proposal.proposedLimit;
                totalLoan = totalLoan + proposedAmount;
            });
            this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
            this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
        }
        // for date conversion of registration date
        if (!ObjectUtil.isEmpty(this.individualData.registrationDateOption)) {
            if (this.individualData.registrationDateOption.en === 'AD') {
                this.registrationDate = this.engToNepaliDate.transform(this.individualData.registrationDate ?
                    this.individualData.registrationDate.en : this.individualData.registrationDate.en, true) || '';
            } else {
                this.registrationDate = this.individualData.registrationDateNepali ? this.individualData.registrationDateNepali.en.nDate : '';
            }
        }
        if (!ObjectUtil.isEmpty(this.individualData.radioActYearDate)) {
            if (this.individualData.radioActYearDate.en === 'AD') {
                this.actYear = this.individualData.actYear ? this.individualData.actYear.en : this.individualData.actYear.en;
            } else {
                this.actYear = this.individualData.actYear ? this.individualData.actYear.en : '';
            }
        }
        let letAge;
        if (this.isInstitutional) {
            this.companyInfo.forEach((val) => {
                if (!ObjectUtil.isEmpty(val.ownerDobDateType) && this.companyInfo.length > 0) {
                    if (val.ownerDobDateType === 'AD') {
                        letAge = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(val.ownerDob).toString());
                    } else {
                        letAge = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(val.ownerDobNepali.eDate).toString());
                    }
                    this.ageArray.push(letAge);
                }
            });
        }
        let totalPeop = 1;
        if (!ObjectUtil.isEmpty(this.companyInfo)) {
            totalPeop = this.companyInfo.length;
        }
        let totalAmount;
        let totalAmountInWord;
        if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
            if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
                totalAmount = (this.tempData.smeGlobalForm && this.tempData.smeGlobalForm.totalLimitInFigureCT) ?
                    this.tempData.smeGlobalForm.totalLimitInFigureCT : '';
                totalAmountInWord = (this.tempData.smeGlobalForm && this.tempData.smeGlobalForm.totalLimitInWordsCT ) ?
                    this.tempData.smeGlobalForm.totalLimitInWordsCT : '';
            } else {
                totalAmount = (this.tempData && this.tempData.loanLimitAmountFigure) ?
                    this.tempData.loanLimitAmountFigure.ct : '';
                totalAmountInWord = (this.tempData && this.tempData.loanLimitAmountFigureWords) ?
                    this.tempData.loanLimitAmountFigureWords.ct : '';
            }
        }
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
            loanAmountInFigure: totalAmount,
            loanAmountInWords: totalAmountInWord,
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
            intRate: this.supportedInfo ? this.supportedInfo.intRate : '',
            totalPeople: this.engToNepNumberPipe.transform(totalPeop.toString()) ? this.engToNepNumberPipe.transform(totalPeop.toString()) : '',
        });
        if (!ObjectUtil.isEmpty(this.companyInfo)) {
            let tempDate;
            let validityDate = '';
            let tempIssuedPlace;
            this.companyInfo.forEach(val => {
                if (val.ownerNationality === 'Nepali') {
                    if (val.radioOwnerCitizenshipIssuedDate === 'AD') {
                        tempDate = this.engToNepaliDate.transform(val.ownerCitizenshipIssuedDateCT, true);
                    } else {
                        tempDate = val.ownerCitizenshipIssuedDateNepaliCT.nDate;
                    }
                    tempIssuedPlace = val.ownerCitizenshipIssuedDistrictCT ? val.ownerCitizenshipIssuedDistrictCT : '';
                }
                // For Indian National with Passport
                if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Passport') {
                    tempDate = this.engToNepaliDate.transform(val.indianOwnerPassportIssuedDate, true);
                    validityDate = this.engToNepaliDate.transform(val.indianOwnerPassportValidityDateCT, true);
                    tempIssuedPlace = val.indianOwnerPassportIssuedFromCT ? val.indianOwnerPassportIssuedFromCT : '';
                }
                // For Indian National with Aadhaar Card
                if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Adhar Card') {
                    tempDate = this.engToNepaliDate.transform(val.indianOwnerAdharCardIssuedDate, true);
                    tempIssuedPlace = val.indianOwnerAdharCardIssuedFromCT ? val.indianOwnerAdharCardIssuedFromCT : '';
                }
                // For Indian National with Embassy
                if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Embassy Certificate') {
                    tempDate = this.engToNepaliDate.transform(val.indianEmbassyIssuedDate, true);
                    tempIssuedPlace = val.indianEmbassyIssuedFromCT ? val.indianEmbassyIssuedFromCT : '';
                }
                // For Other Nationals
                if (val.ownerNationality === 'Other') {
                    if (val.otherOwnerPassportIssuedDateOption === 'AD') {
                        tempDate = this.engToNepaliDate.transform(val.otherOwnerPassportIssuedDateCT, true);
                    } else {
                        tempDate = val.otherOwnerPassportIssuedDateNepaliCT.nDate;
                    }
                    if (val.otherOwnerPassportValidityDateOption === 'AD') {
                        validityDate = this.engToNepaliDate.transform(val.otherOwnerPassportValidityDateCT, true);
                    } else {
                        validityDate = val.otherOwnerPassportValidityDateNepaliCT.nDate;
                    }
                    tempIssuedPlace = val.otherOwnerPassportIssuedFromCT ? val.otherOwnerPassportIssuedFromCT : '';
                }
                this.dateArray.push(tempDate);
                this.dateValidityArray.push(validityDate);
                this.issuedPlaceArray.push(tempIssuedPlace);
            });
        }
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
        this.spinner = true;
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
            this.spinner = false;
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
            this.dialogRef.close();
            this.spinner = false;
        });
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

}

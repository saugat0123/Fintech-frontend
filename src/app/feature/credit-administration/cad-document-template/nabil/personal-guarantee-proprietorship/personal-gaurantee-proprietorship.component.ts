import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {ProposalCalculationUtils} from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {LoanNameConstant} from '../../../cad-view/template-data/nabil-sme-template-data/sme-costant/loan-name-constant';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-personal-guarantee-proprietorship',
    templateUrl: './personal-guarantee-proprietorship.component.html',
    styleUrls: ['./personal-guarantee-proprietorship.component.scss']
})
export class PersonalGuaranteeProprietorshipComponent implements OnInit {
    personalGuaranteeProprietorship: FormGroup;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() documentId: number;
    @Input() customerLoanId: number;
    @Input() nepaliAmount: NepaliNumberAndWords;
    nepData;
    guarantorData;
    submitted = false;
    offerLetterConst = NabilDocumentChecklist;
    taggedGuarantorsDetailsInLoan = [];
    loanHolderNepData: any;
    offerDocumentDetails: any;
    nepaliNumber = new NepaliNumberAndWords();
    loanPurpose = 'व्यापार / व्यवसाय संचालन';
    tempData;
    nameOfAuthorizedBody = 'नेपाल सरकार';
    individualGuarantorNepDataArray: Array<any> = new Array<any>();
    constructor(private formBuilder: FormBuilder,
                private administrationService: CreditAdministrationService,
                private toastService: ToastService,
                private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
                private nepToEngNumberPipe: NepaliToEngNumberPipe,
                private englishNepaliDatePipe: EngNepDatePipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatPipe: CurrencyFormatterPipe,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private routerUtilsService: RouterUtilsService,
                private datePipe: DatePipe) {
    }

    ngOnInit() {
        this.loadPersonalGuarantorData();
        this.buildForm();
    }

    loadPersonalGuarantorData() {
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
            this.loanHolderNepData = this.cadData.loanHolder.nepData
                ? JSON.parse(this.cadData.loanHolder.nepData)
                : this.cadData.loanHolder.nepData;
            this.cadData.assignedLoan.map((value) => {
                value.taggedGuarantors.forEach((val) => {
                    this.taggedGuarantorsDetailsInLoan.push(val);
                });
            });
            if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList) && this.cadData.offerDocumentList.length !== 0) {
                this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
            }
        }
        this.taggedGuarantorsDetailsInLoan = Array.from(
            new Set(
                this.taggedGuarantorsDetailsInLoan.map((val) => JSON.stringify(val))
            )
        ).map((val) => JSON.parse(val));
    }

    buildForm() {
        this.personalGuaranteeProprietorship = this.formBuilder.group({
          guaranteeProprietorship: this.formBuilder.array([]),
        });
        this.calulation();
        this.taggedPersonalGuarantorsDetailsForm();
    }

    initIndividualGuarantors() {
        return this.formBuilder.group({});
    }

    taggedPersonalGuarantorsDetailsForm() {
        // get today's date
        let todayDate: any = this.englishNepaliDatePipe.transform(new Date(), true);
        todayDate = todayDate.replace(',', '').split(' ');
        const daysInNumber = new Date().getDay();
        if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
            this.taggedGuarantorsDetailsInLoan.forEach((val) => {
                const individualGuarantorNepData = val.nepData
                    ? JSON.parse(val.nepData)
                    : val.nepData;
              this.individualGuarantorNepDataArray.push(individualGuarantorNepData);
                if (ObjectUtil.isEmpty(individualGuarantorNepData)) {
                    return;
                }
                (this.personalGuaranteeProprietorship.get('guaranteeProprietorship') as FormArray).push(
                    this.formBuilder.group({
                        branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
                        actDetails: [this.loanHolderNepData.actName.ct ? this.loanHolderNepData.actName.ct : ''],
                        actYearInFigure: [this.setActYear()],
                        // tslint:disable-next-line:max-line-length
                        headDepartment: [!ObjectUtil.isEmpty(this.loanHolderNepData.authorizedBodyName) ? this.loanHolderNepData.authorizedBodyName.ct : this.nameOfAuthorizedBody],
                        registrationDate: [this.setRegistrationDate()],
                        registrationNo: [this.loanHolderNepData.registrationNo.ct ? this.loanHolderNepData.registrationNo.ct : ''],
                        registeredDistrict: [this.loanHolderNepData.registeredDistrict.ct ? this.loanHolderNepData.registeredDistrict.ct : ''],
                        // tslint:disable-next-line:max-line-length
                        municipalityOfFirm: [this.loanHolderNepData.registeredMunicipality.ct ? this.loanHolderNepData.registeredMunicipality.ct : ''],
                        wardNumOfFirm: [this.loanHolderNepData.permanentWard.ct ? this.loanHolderNepData.permanentWard.ct : ''],
                        // tslint:disable-next-line:max-line-length
                        addressOfFirm: [this.loanHolderNepData.registeredStreetTole.ct ? this.loanHolderNepData.registeredStreetTole.ct : ''],
                        loaneeName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
                        loanPurpose: [this.setLoanPurpose()],
                        letterIssuedDate: [this.setIssuedDate()],
                        loanAmount: [this.nepaliNumber.numberNepali],
                        loanAmountInWord: [this.nepaliNumber.nepaliWords],
                        // tslint:disable-next-line:max-line-length
                        approvedLoanAmount: [this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(individualGuarantorNepData.gurantedAmount.en))],
                        approvedLoanAmountInWord: [this.nepaliCurrencyWordPipe.transform(individualGuarantorNepData.gurantedAmount.en)],
                        freeText: [undefined],
                        guarantorName: [individualGuarantorNepData.guarantorName ? individualGuarantorNepData.guarantorName.ct : ''],
                        // tslint:disable-next-line:max-line-length
                        guarantorFatherOrHusbandName: [individualGuarantorNepData.fatherName ? individualGuarantorNepData.fatherName.ct : individualGuarantorNepData.husbandName ? individualGuarantorNepData.husbandName.ct : ''],
                        // tslint:disable-next-line:max-line-length
                        grandFatherOrFatherInLaw: [individualGuarantorNepData.grandFatherName ? individualGuarantorNepData.grandFatherName.ct : individualGuarantorNepData.fatherInLawName ? individualGuarantorNepData.fatherInLawName.ct : ''],
                        permanentDistrict: [individualGuarantorNepData.permanentDistrict ? individualGuarantorNepData.permanentDistrict.ct : ''],
                        // tslint:disable-next-line:max-line-length
                        permanentMunicipalities: [individualGuarantorNepData.permanentMunicipality ? individualGuarantorNepData.permanentMunicipality.ct : ''],
                        permanentWard: [individualGuarantorNepData.permanentWard ? individualGuarantorNepData.permanentWard.ct : ''],
                        guarantorForeignAddress: [!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorOtherAddress) ? individualGuarantorNepData.guarantorOtherAddress.ct : ''],
                        temporaryDistrict: [individualGuarantorNepData.temporaryDistrict ? individualGuarantorNepData.temporaryDistrict.ct : ''],
                        // tslint:disable-next-line:max-line-length
                        temporaryMunicipalities: [individualGuarantorNepData.temporaryMunicipality ? individualGuarantorNepData.temporaryMunicipality.ct : ''],
                        temporaryWard: [individualGuarantorNepData.temporaryWard ? individualGuarantorNepData.temporaryWard.ct : ''],
                        guarantorTempForeignAddress: [!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorOtherAddressTemp) ? individualGuarantorNepData.guarantorOtherAddressTemp.ct : ''],
                        citizenshipNo: [this.setIdentityNo(individualGuarantorNepData)],
                        issuedBy: [this.setIdentityIssuedPlace(individualGuarantorNepData)],
                        // tslint:disable-next-line:max-line-length
                        issuedDate: [this.setIdentityIssuedDate(individualGuarantorNepData)],
                        passportExpiryDate: [this.setValidityDate(individualGuarantorNepData)],
                        year: [todayDate[2]],
                        month: [todayDate[1]],
                        day: [todayDate[0]],
                        date: [this.engToNepNumberPipe.transform(String(daysInNumber + 1))],

                    })
                );
            });
        }
    }

    calulation() {
        if (ObjectUtil.isEmpty(this.cadData.nepData)) {
            const number = ProposalCalculationUtils.calculateTotalFromProposalListKey(this.cadData.assignedLoan);
            this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
            this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
            this.nepaliNumber.engNumber = number;
        } else {
            this.nepaliNumber = JSON.parse(this.cadData.nepData);
        }

    }

    setLoanPurpose() {
      let loanKoPurpose = '';
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        loanKoPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.mortgageEquityTermForm) {
        loanKoPurpose = this.offerDocumentDetails.mortgageEquityTermForm.purposeOfLoanCT;
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.autoLoanMasterForm) {
        loanKoPurpose = this.offerDocumentDetails.autoLoanMasterForm.purposeOfLoanCT;
      }
      return loanKoPurpose ? loanKoPurpose : this.loanPurpose;
    }

    submit() {
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                    flag = false;
                    singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
                document.id = this.documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = this.customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.initialInformation = JSON.stringify(this.personalGuaranteeProprietorship.value);
            document.id = this.documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = this.customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
            this.dialogRef.close();
            this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
            this.dialogRef.close();
        });
    }
  setActYear() {
    let yearOfAct = '';
      if (!ObjectUtil.isEmpty(this.loanHolderNepData.radioActYearDate.np) && (this.loanHolderNepData.radioActYearDate.np === 'BS')) {
          yearOfAct = this.loanHolderNepData.actYear.np ? this.loanHolderNepData.actYear.np : '';
      } else {
        yearOfAct = this.loanHolderNepData.actYear.en ? this.loanHolderNepData.actYear.en : '' ;
      }
    return yearOfAct ? yearOfAct : '';
  }

  setRegistrationDate() {
    let regDate = '';
    if (this.loanHolderNepData.registrationDateOption.en === 'AD') {
      regDate = this.englishNepaliDatePipe.transform(this.loanHolderNepData.registrationDate.en ? this.loanHolderNepData.registrationDate.en : this.loanHolderNepData.registrationDate.en, true) || '' ;
    } else {
      regDate = this.loanHolderNepData.registrationDate.en.nDate ? this.loanHolderNepData.registrationDate.en.nDate : '';
    }
    return regDate ? regDate : '';
  }
  setIssuedDate() {
    let issuedDate = '';
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        const dateOfApproval = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
        if (dateOfApproval === 'AD') {
            issuedDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.ct : '';
        } else {
            issuedDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.ct : '';
        }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
        if (dateOfApprovalType === 'AD') {
            issuedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
        } else {
            issuedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
        }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        issuedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
        const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
        if (dateOfApprovalType === 'AD') {
            const templateDateApproval = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.en : '';
            issuedDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateApproval), true);
        } else {
            const templateDateApproval = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.en : '';
            issuedDate = templateDateApproval ? templateDateApproval.nDate : '';
        }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        const sanctionLetterDate = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
        if (sanctionLetterDate === 'AD') {
            const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.en : '';
            issuedDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateSanctionDate), true);
        } else {
            const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.en : '';
            issuedDate = templateDateSanctionDate ? templateDateSanctionDate.nDate : '';
        }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.smeGlobalForm) {
        const dateOfApprovalType = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType ?
            this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType : '';
        if (dateOfApprovalType === 'AD') {
            const templateDateApproval = this.offerDocumentDetails.smeGlobalForm.dateOfApproval ?
                this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT : '';
            issuedDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateApproval), true);
        } else {
            const templateDateApproval = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali ?
                this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali : '';
            issuedDate = templateDateApproval ? templateDateApproval.nDate : '';
        }
    }
    return issuedDate ? issuedDate : '';
  }

  setIdentityNo(individualGuarantorNepData) {
    let identityNumber = '';
    if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorNationality)) {
      if (individualGuarantorNepData.guarantorNationality === 'Nepali') {
        identityNumber = !ObjectUtil.isEmpty(individualGuarantorNepData.citizenNumber) ? individualGuarantorNepData.citizenNumber.ct : '';
      }
      if (individualGuarantorNepData.guarantorNationality === 'Indian') {
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Embassy Certificate') {
          identityNumber = !ObjectUtil.isEmpty(individualGuarantorNepData.embassyNo) ? individualGuarantorNepData.embassyNo.ct : '';

        } else if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Adhar Card') {
          identityNumber = !ObjectUtil.isEmpty(individualGuarantorNepData.adharCardNo) ? individualGuarantorNepData.adharCardNo.ct : '';
        } else {
          identityNumber = !ObjectUtil.isEmpty(individualGuarantorNepData.passportNo) ? individualGuarantorNepData.passportNo.ct : '';
        }
      }
      if (individualGuarantorNepData.guarantorNationality === 'Other') {
        identityNumber = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportNo) ? individualGuarantorNepData.otherGuarantorPassportNo.ct : '';
      }
      return identityNumber ? identityNumber : '';
    }
  }
  setIdentityIssuedPlace(individualGuarantorNepData) {
    let identityIssuedPlace = '';
    if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorNationality)) {
      if (individualGuarantorNepData.guarantorNationality === 'Nepali') {
        identityIssuedPlace = !ObjectUtil.isEmpty(individualGuarantorNepData.issuedPlace) ? individualGuarantorNepData.issuedPlace.ct : '';
      }
      if (individualGuarantorNepData.guarantorNationality === 'Indian') {
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Embassy Certificate') {
          identityIssuedPlace = !ObjectUtil.isEmpty(individualGuarantorNepData.embassyIssuedFrom) ? individualGuarantorNepData.embassyIssuedFrom.ct : '';

        } else if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Adhar Card') {
          identityIssuedPlace = !ObjectUtil.isEmpty(individualGuarantorNepData.adharCardIssuedFrom) ? individualGuarantorNepData.adharCardIssuedFrom.ct : '';
        } else {
          identityIssuedPlace = !ObjectUtil.isEmpty(individualGuarantorNepData.passportIssuedFrom) ? individualGuarantorNepData.passportIssuedFrom.ct : '';
        }
      }
      if (individualGuarantorNepData.guarantorNationality === 'Other') {
        identityIssuedPlace = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportIssuedFrom) ? individualGuarantorNepData.otherGuarantorPassportIssuedFrom.ct : '';
      }
      return identityIssuedPlace ? identityIssuedPlace : '';
    }
  }
    setIdentityIssuedDate(individualGuarantorNepData) {
        let identityIssuedDate = '';
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorNationality)) {
            if (individualGuarantorNepData.guarantorNationality === 'Nepali') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.radioCitizenIssuedDate) && (individualGuarantorNepData.radioCitizenIssuedDate === 'AD')) {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.citizenIssuedDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.citizenIssuedDate.en) ? (individualGuarantorNepData.citizenIssuedDate.en) : (individualGuarantorNepData.citizenIssuedDate.en), true) : '' || '';
                } else {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.citizenIssuedDateNepali) ? individualGuarantorNepData.citizenIssuedDateNepali.en.nDate : '';
                }
            }
            if (individualGuarantorNepData.guarantorNationality === 'Indian') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Embassy Certificate') {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.embassyIssuedDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.embassyIssuedDate.en) ? (individualGuarantorNepData.embassyIssuedDate.en) : (individualGuarantorNepData.embassyIssuedDate.en), true) : '' || '';

                } else if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Adhar Card') {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.adharCardIssuedDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.adharCardIssuedDate.en) ? (individualGuarantorNepData.adharCardIssuedDate.en) : (individualGuarantorNepData.adharCardIssuedDate.en), true) : '' || '';
                } else {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.passportIssuedDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.passportIssuedDate.en) ? (individualGuarantorNepData.passportIssuedDate.en) : (individualGuarantorNepData.passportIssuedDate.en), true) : '' || '';
                }
            }
            if (individualGuarantorNepData.guarantorNationality === 'Other') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportIssuedDateOption) && (individualGuarantorNepData.otherGuarantorPassportIssuedDateOption === 'AD')) {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportIssuedDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.otherGuarantorPassportIssuedDate.en) ? (individualGuarantorNepData.otherGuarantorPassportIssuedDate.en) : (individualGuarantorNepData.otherGuarantorPassportIssuedDate.en), true) : '' || '';
                } else {
                    identityIssuedDate = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportIssuedDateNepali) ? individualGuarantorNepData.otherGuarantorPassportIssuedDateNepali.en.nDate : '';
                }
            }
            return identityIssuedDate ? identityIssuedDate : '';
        }
    }

    setValidityDate(individualGuarantorNepData) {
        let passportValidityDate = '';
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorNationality)) {
            if (individualGuarantorNepData.guarantorNationality === 'Indian') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.indianGuarantorDetailOption) && individualGuarantorNepData.indianGuarantorDetailOption.en === 'Passport') {
                    passportValidityDate = !ObjectUtil.isEmpty(individualGuarantorNepData.passportValidityDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.passportValidityDate.en) ? (individualGuarantorNepData.passportValidityDate.en) : (individualGuarantorNepData.passportValidityDate.en), true) : '' || '';
                }
            }
            if (individualGuarantorNepData.guarantorNationality === 'Other') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportValidityDateOption) && individualGuarantorNepData.otherGuarantorPassportValidityDateOption === 'AD') {
                    passportValidityDate = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportValidityDate) ? this.englishNepaliDatePipe.transform((individualGuarantorNepData.otherGuarantorPassportValidityDate.en) ? (individualGuarantorNepData.otherGuarantorPassportValidityDate.en) : (individualGuarantorNepData.otherGuarantorPassportValidityDate.en), true) : '' || '';
                } else {
                    passportValidityDate = !ObjectUtil.isEmpty(individualGuarantorNepData.otherGuarantorPassportValidityDateNepali.en) ? individualGuarantorNepData.otherGuarantorPassportValidityDateNepali.en.nDate : '';
                }
            }
            return passportValidityDate ? passportValidityDate : '';
        }
    }
}

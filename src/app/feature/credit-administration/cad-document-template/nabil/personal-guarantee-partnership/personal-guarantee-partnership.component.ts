import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {Router} from '@angular/router';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';
import {ProposalCalculationUtils} from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-personal-guarantee-partnership',
  templateUrl: './personal-guarantee-partnership.component.html',
  styleUrls: ['./personal-guarantee-partnership.component.scss']
})
export class PersonalGuaranteePartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;
  form: FormGroup;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  nepaliNumber = new NepaliNumberAndWords();
  loanHolderNepData: any;
  offerDocumentDetails: any;
  taggedGuarantorsDetailsInLoan = [];
  loanPurpose = 'व्यापार/ व्यवसाय संचालन';
  nameOfAct = 'साझेदारी';
  actYear = '२०२०';
  nameOfAuthorizedBody = 'नेपाल सरकार';
  cadInitialInfo;
  individualGuarantorNepDataArray: Array<any> = new Array<any>();
  freeText: Array<any> = new Array<any>();
  finalAmount;
  loanAmountWord;
  spinner = false;
  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private toastService: ToastService,
      private routerUtilService: RouterUtilsService,
      private administrationService: CreditAdministrationService,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private englishNepaliDatePipe: EngNepDatePipe,
      private nepPercentWordPipe: NepaliPercentWordPipe,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
      private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.loadPersonalGuarantorData();
    this.setTotalAmount();
    this.buildForm();
    this.fillGuarantee();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      guarantorsPartnership: this.formBuilder.array([]),
    });
    this.calulation();
    this.taggedPersonalGuarantorsDetailsForm();
  }
  removeIndividualGuarantors(i) {
    (this.form.get('guarantorsPartnership') as FormArray).removeAt(i);
  }
  setFreeText() {
    const free = this.form.value;
    for (let val = 0; val < free.guarantorsPartnership.length; val++) {
      const tempFreeText = {
        year: this.form.get(['guarantorsPartnership', val, 'year']).value ?
            this.form.get(['guarantorsPartnership', val, 'year']).value : '',
        month: this.form.get(['guarantorsPartnership', val, 'month']).value ?
            this.form.get(['guarantorsPartnership', val, 'month']).value : '',
        date: this.form.get(['guarantorsPartnership', val, 'date']).value ?
            this.form.get(['guarantorsPartnership', val, 'date']).value : '',
        day: this.form.get(['guarantorsPartnership', val, 'day']).value ?
            this.form.get(['guarantorsPartnership', val, 'day']).value : '',
        freeText1: this.form.get(['guarantorsPartnership', val, 'freeText1']).value ?
            this.form.get(['guarantorsPartnership', val, 'freeText1']).value : '',
        bankStaff: this.form.get(['guarantorsPartnership', val, 'bankStaff']).value ?
            this.form.get(['guarantorsPartnership', val, 'bankStaff']).value : '',
        witnessDistrict: this.form.get(['guarantorsPartnership', val, 'witnessDistrict']).value ?
            this.form.get(['guarantorsPartnership', val, 'witnessDistrict']).value : '',
        witnessMunicipality: this.form.get(
            ['guarantorsPartnership', val, 'witnessMunicipality']).value ?
            this.form.get(['guarantorsPartnership', val, 'witnessMunicipality']).value : '',
        WitnessWardNumber: this.form.get(['guarantorsPartnership', val, 'WitnessWardNumber']).value ?
            this.form.get(['guarantorsPartnership', val, 'WitnessWardNumber']).value : '',
        witnessAge: this.form.get(['guarantorsPartnership', val, 'witnessAge']).value ?
            this.form.get(['guarantorsPartnership', val, 'witnessAge']).value : '',
        witnessName: this.form.get(['guarantorsPartnership', val, 'witnessName']).value ?
            this.form.get(['guarantorsPartnership', val, 'witnessName']).value : '',
        witnessDistrict2: this.form.get(['guarantorsPartnership', val, 'witnessDistrict2']).value ?
            this.form.get(['guarantorsPartnership', val, 'witnessDistrict2']).value : '',
        witnessMunicipality2: this.form.get(
            ['guarantorsPartnership', val, 'witnessMunicipality2']).value ?
            this.form.get(['guarantorsPartnership', val, 'witnessMunicipality2']).value : '',
        WitnessWardNumber2: this.form.get(['guarantorsPartnership', val, 'WitnessWardNumber2']).value ?
            this.form.get(['guarantorsPartnership', val, 'WitnessWardNumber2']).value : '',
        witnessAge2: this.form.get(['guarantorsPartnership', val, 'witnessAge2']).value ?
            this.form.get(['guarantorsPartnership', val, 'witnessAge2']).value : '',
        witnessName2: this.form.get(['guarantorsPartnership', val, 'witnessName2']).value ?
            this.form.get(['guarantorsPartnership', val, 'witnessName2']).value : '',
      };
      this.freeText.push(tempFreeText);
    }
    return JSON.stringify(this.freeText);
  }

  fillGuarantee() {
    if (this.cadData.cadFileList.length > 0) {
      if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            this.cadInitialInfo = JSON.parse(singleCadFile.supportedInformation);
          }
        });
        const free = this.form.value;
        if (this.cadInitialInfo !== null) {
          for (let val = 0; val < free.guarantorsPartnership.length; val++) {
            this.form.get(['guarantorsPartnership', val, 'year']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].year : '');
            this.form.get(['guarantorsPartnership', val, 'month']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].month : '');
            this.form.get(['guarantorsPartnership', val, 'date']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].date : '');
            this.form.get(['guarantorsPartnership', val, 'day']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].day : '');
            this.form.get(['guarantorsPartnership', val, 'freeText1']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].freeText1 : '');
            this.form.get(['guarantorsPartnership', val, 'witnessDistrict']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].witnessDistrict : '');
            this.form.get(['guarantorsPartnership', val, 'witnessMunicipality']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].witnessMunicipality : '');
            this.form.get(['guarantorsPartnership', val, 'WitnessWardNumber']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].WitnessWardNumber : '');
            this.form.get(['guarantorsPartnership', val, 'witnessAge']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].witnessAge : '');
            this.form.get(['guarantorsPartnership', val, 'witnessName']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].witnessName : '');
            this.form.get(['guarantorsPartnership', val, 'witnessDistrict2']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].witnessDistrict2 : '');
            this.form.get(['guarantorsPartnership', val, 'witnessMunicipality2']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].witnessMunicipality2 : '');
            this.form.get(['guarantorsPartnership', val, 'WitnessWardNumber2']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].WitnessWardNumber2 : '');
            this.form.get(['guarantorsPartnership', val, 'witnessAge2']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].witnessAge2 : '');
            this.form.get(['guarantorsPartnership', val, 'witnessName2']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].witnessName2 : '');
            this.form.get(['guarantorsPartnership', val, 'bankStaff']).patchValue(
                this.cadInitialInfo ?
                    this.cadInitialInfo[val].bankStaff : '');
          }
        }
      }
    }
  }

  setTotalAmount() {
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
        this.finalAmount = (this.offerDocumentDetails.smeGlobalForm && this.offerDocumentDetails.smeGlobalForm.totalLimitInFigureCT) ?
            this.offerDocumentDetails.smeGlobalForm.totalLimitInFigureCT : '';
        this.loanAmountWord = (this.offerDocumentDetails.smeGlobalForm && this.offerDocumentDetails.smeGlobalForm.totalLimitInWordsCT ) ?
            this.offerDocumentDetails.smeGlobalForm.totalLimitInWordsCT : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.loanLimitAmountFigure) ?
            this.offerDocumentDetails.loanLimitAmountFigure.ct : '';
        this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.loanLimitAmountFigureWords) ?
            this.offerDocumentDetails.loanLimitAmountFigureWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitInFigure) ?
            this.offerDocumentDetails.totalLimitInFigure.ct : '';
        this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitInWords) ?
            this.offerDocumentDetails.totalLimitInWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
        this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitFigure) ?
            this.offerDocumentDetails.totalLimitFigure.ct : '';
        this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitWords) ?
            this.offerDocumentDetails.totalLimitWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        const proposedLimit = this.cadData.assignedLoan[0] ?
            this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
        this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
        this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(proposedLimit ? proposedLimit : '');
      } if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.loanAmountFigure) ?
            this.offerDocumentDetails.loanAmountFigure.ct : '';
        this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.loanAmountFigureWords) ?
            this.offerDocumentDetails.loanAmountFigureWords.ct : '';
      }
    }
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
  submit() {
    let flag = true;
    this.spinner = true;
    if (
        !ObjectUtil.isEmpty(this.cadData) &&
        !ObjectUtil.isEmpty(this.cadData.cadFileList)
    ) {
      this.cadData.cadFileList.forEach((singleCadFile) => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          // singleCadFile.initialInformation = JSON.stringify(this.form.value);
          singleCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        // cadFile.initialInformation = JSON.stringify(this.form.value);
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      // cadFile.initialInformation = JSON.stringify(this.form.value);
      cadFile.supportedInformation = this.setFreeText();
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(
        () => {
          this.toastService.show(
              new Alert(AlertType.SUCCESS, 'Successfully saved')
          );
          this.spinner = false;
          this.dialogRef.close();
          this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
        },
        (error) => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save'));
          this.spinner = false;
          this.dialogRef.close();
        }
    );
  }
  initIndividualGuarantors() {
    return this.formBuilder.group({
      branchName: [undefined],
      actDetails: [undefined],
      actYearInFigure: [undefined],
      authorizedBodyName: [undefined],
      headDepartment: [undefined],
      registrationDate: [undefined],
      registrationNo: [undefined],
      location: [undefined],
      loaneeName: [undefined],
      loanPurpose: [undefined],
      letterIssuedDate: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      approvedLoanAmountInWord: [undefined],
      approvedLoanAmount: [undefined],
      guarantorName: [undefined],
      guarantorFatherOrHusbandName: [undefined],
      guarantorGrandFatherName: [undefined],
      guarantorPermanentDistrict: [undefined],
      guarantorPermanentMunicipality: [undefined],
      guarantorPermanentWard: [undefined],
      guarantorForeignAddress: [undefined],
      guarantorTemporaryDistrict: [undefined],
      guarantorTemporaryMunicipality: [undefined],
      guarantorTemporaryWard: [undefined],
      guarantorTempForeignAddress: [undefined],
      guarantorCitizenNumber: [undefined],
      guarantorCitizenIssuedPlace: [undefined],
      guarantorCitizenIssuedDate: [undefined],
      passportExpiryDate: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      date: [undefined],
      freeText1: [undefined]
    });
  }
  taggedPersonalGuarantorsDetailsForm() {
    if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
      this.taggedGuarantorsDetailsInLoan.forEach((val) => {
        if (JSON.parse(val.nepData).guarantorType.en === 'Personal Guarantor') {
          const individualGuarantorNepData = val.nepData
              ? JSON.parse(val.nepData)
              : val.nepData;
          if (ObjectUtil.isEmpty(individualGuarantorNepData)) {
            return;
          }
          let fatherName;
          let grandFatherName;
          if (!ObjectUtil.isEmpty(individualGuarantorNepData)) {
            if (!ObjectUtil.isEmpty(individualGuarantorNepData.gender) &&
                !ObjectUtil.isEmpty(individualGuarantorNepData.gender.en)) {
              if (individualGuarantorNepData.gender.en === 'MALE') {
                fatherName = individualGuarantorNepData.fatherName ? individualGuarantorNepData.fatherName.ct : '';
                grandFatherName = individualGuarantorNepData.grandFatherName ? individualGuarantorNepData.grandFatherName.ct : '';
              }
              if (individualGuarantorNepData.gender.en === 'FEMALE') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus) &&
                    !ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus.en)) {
                  if (individualGuarantorNepData.guarantorMaritalStatus.en === 'Married') {
                    if (!ObjectUtil.isEmpty(individualGuarantorNepData.relationMedium.en) &&
                        individualGuarantorNepData.relationMedium.en === '1') {
                      fatherName = individualGuarantorNepData.fatherName ? individualGuarantorNepData.fatherName.ct : '';
                      grandFatherName = individualGuarantorNepData.grandFatherName ?
                          individualGuarantorNepData.grandFatherName.ct : '';
                    } else {
                      fatherName = individualGuarantorNepData.husbandName ? individualGuarantorNepData.husbandName.ct : '';
                      grandFatherName = individualGuarantorNepData.fatherInLawName ?
                          individualGuarantorNepData.fatherInLawName.ct : '';
                    }
                  }
                  if (individualGuarantorNepData.guarantorMaritalStatus.en === 'Unmarried') {
                    fatherName = individualGuarantorNepData.fatherName ? individualGuarantorNepData.fatherName.ct : '';
                    grandFatherName = individualGuarantorNepData.grandFatherName ?
                        individualGuarantorNepData.grandFatherName.ct : '';
                  }
                }
              }
            }
          }
          this.individualGuarantorNepDataArray.push(individualGuarantorNepData);
          (this.form.get('guarantorsPartnership') as FormArray).push(
              this.formBuilder.group({
                branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
                actDetails: [!ObjectUtil.isEmpty(this.loanHolderNepData.actName) ? this.loanHolderNepData.actName.ct : this.nameOfAct],
                actYearInFigure: [this.setActYear()],
                authorizedBodyName: [this.loanHolderNepData.authorizedBodyName ? this.loanHolderNepData.authorizedBodyName.ct : 'नेपाल सरकार'],
                headDepartment: [this.loanHolderNepData.registeredWith &&
                this.loanHolderNepData.registeredWith.ct ? this.loanHolderNepData.registeredWith.ct : ''],
                registrationDate: [this.setRegistrationDate()],
                registrationNo: [this.loanHolderNepData.registrationNo ? this.loanHolderNepData.registrationNo.ct : ''],
                registeredDistrict: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
                municipalityOfFirm: [this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : ''],
                wardNumOfFirm: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
                addressOfFirm: [this.loanHolderNepData.registeredStreetTole ? this.loanHolderNepData.registeredStreetTole.ct : ''],
                loaneeName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
                loanPurpose: [this.setLoanPurpose()],
                letterIssuedDate: [this.setIssuedDate()],
                loanAmount: [this.finalAmount],
                loanAmountInWord: [this.loanAmountWord],
                approvedLoanAmountInWord: [this.nepaliCurrencyWordPipe.transform(individualGuarantorNepData.gurantedAmount.en)],
                approvedLoanAmount: [this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(individualGuarantorNepData.gurantedAmount.en))],
                guarantorName: [individualGuarantorNepData.guarantorName ? individualGuarantorNepData.guarantorName.ct : ''],
                guarantorFatherOrHusbandName: [fatherName ? fatherName : ''],
                guarantorGrandFatherName: [grandFatherName ? grandFatherName : ''],
                guarantorPermanentDistrict: [individualGuarantorNepData.permanentDistrict ? individualGuarantorNepData.permanentDistrict.ct : ''],
                guarantorPermanentMunicipality: [individualGuarantorNepData.permanentMunicipality ? individualGuarantorNepData.permanentMunicipality.ct : ''],
                guarantorPermanentWard: [individualGuarantorNepData.permanentWard ? individualGuarantorNepData.permanentWard.ct : ''],
                guarantorForeignAddress: [!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorOtherAddress) ? individualGuarantorNepData.guarantorOtherAddress.ct : ''],
                guarantorTemporaryDistrict: [individualGuarantorNepData.temporaryDistrict ? individualGuarantorNepData.temporaryDistrict.ct : ''],
                guarantorTemporaryMunicipality: [individualGuarantorNepData.temporaryMunicipality ? individualGuarantorNepData.temporaryMunicipality.ct : ''],
                guarantorTemporaryWard: [individualGuarantorNepData.temporaryWard ? individualGuarantorNepData.temporaryWard.ct : ''],
                guarantorTempForeignAddress: [!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorOtherAddressTemp) ? individualGuarantorNepData.guarantorOtherAddressTemp.ct : ''],
                guarantorCitizenNumber: [this.setIdentityNo(individualGuarantorNepData)],
                guarantorCitizenIssuedPlace: [this.setIdentityIssuedPlace(individualGuarantorNepData)],
                guarantorCitizenIssuedDate: [this.setIdentityIssuedDate(individualGuarantorNepData)],
                passportExpiryDate: [this.setValidityDate(individualGuarantorNepData)],
                year: [undefined],
                month: [undefined],
                day: [undefined],
                date: [undefined],
                freeText1: [undefined],
                bankStaff: [undefined],
                witnessDistrict: [undefined],
                witnessMunicipality: [undefined],
                WitnessWardNumber: [undefined],
                witnessAge: [undefined],
                witnessName: [undefined],
                witnessDistrict2: [undefined],
                witnessMunicipality2: [undefined],
                WitnessWardNumber2: [undefined],
                witnessAge2: [undefined],
                witnessName2: [undefined],
              })
          );
        }
      });
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
  setActYear() {
    let yearOfAct = '';
    if (!ObjectUtil.isEmpty(this.loanHolderNepData.radioActYearDate)) {
      if (this.loanHolderNepData.radioActYearDate.np === 'BS') {
        yearOfAct = this.loanHolderNepData.actYear ? this.loanHolderNepData.actYear.en : '';
      } else {
        yearOfAct = this.loanHolderNepData.actYear ? this.loanHolderNepData.actYear.en : '';
      }
    }
    return yearOfAct ? yearOfAct : '';
  }
  setRegistrationDate() {
    let regDate = '';
    if (!ObjectUtil.isEmpty(this.loanHolderNepData.registrationDateOption)) {
      if (this.loanHolderNepData.registrationDateOption.en === 'AD') {
        regDate = this.englishNepaliDatePipe.transform(this.loanHolderNepData.registrationDate ?
            this.loanHolderNepData.registrationDate.en : this.loanHolderNepData.registrationDate.en, true) || '';
      } else {
        regDate = this.loanHolderNepData.registrationDateNepali.en ? this.loanHolderNepData.registrationDateNepali.en.nDate : '';
      }
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
      const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        issuedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
      } else {
        issuedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails.dateOfApprovalType) && this.offerDocumentDetails.dateOfApprovalType.en === 'AD') {
        issuedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
      } else {
        issuedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
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
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType) && this.offerDocumentDetails.smeGlobalForm.dateOfApprovalType === 'AD') {
        issuedDate = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT ? this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT : '';
      } else {
        issuedDate = this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali ?
            this.offerDocumentDetails.smeGlobalForm.dateOfApprovalNepali.nDate : '';
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

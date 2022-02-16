import {Component, Input, OnInit} from '@angular/core';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AgeCalculation} from '../../../../../@core/age-calculation';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {CustomerType} from '../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {CustomerService} from '../../../../customer/service/customer.service';
import { OfferDocument } from '../../../model/OfferDocument';
@Component({
  selector: 'app-promissory-note-partnership',
  templateUrl: './promissory-note-partnership.component.html',
  styleUrls: ['./promissory-note-partnership.component.scss']
})
export class PromissoryNotePartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: number;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  offerDocumentChecklist = NabilOfferLetterConst;
  form: FormGroup;
  nepData;
  clientType;
  customerType = CustomerType;
  customerSubType = CustomerSubType;
  jointInfoData;
  selectiveArr = [];
  offerLetterDocument;
  educationalTemplateData;
  individualData;
  loanHolderNepData: any;
  tempProprietor;
  isInstitutional = false;
  genderArr;
  grandFatherName;
  nameOfFather;
  district;
  vdc;
  wardNumber;
  age;
  nameOfPartner;
  directorCitizenshipNumber;
  citizenshipIssueDate;
  citizenshipIssueDistrict;
  foreignAddress;
  isForeignAddress = true;
  tempPro;
  ageArray: Array <any> = new Array <any>();
  dateArray: Array <any> = new Array <any>();
  dateValidityArray: Array <any> = new Array <any>();
  issuedPlaceArray: Array <any> = new Array<any>();
  spinner = false;
  tempData;

  constructor(
      private formBuilder: FormBuilder,
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
      private customerService: CustomerService,
  ) { }

  async ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.loanHolder.customerType === 'INSTITUTION') {
        this.isInstitutional = true;
      }
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.form.patchValue(initialInfo);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
      this.clientType = this.cadData.loanHolder['customerSubType'];

      this.loanHolderNepData = this.cadData.loanHolder.nepData ?
        JSON.parse(this.cadData.loanHolder.nepData) :
        this.cadData.loanHolder.nepData;
    }
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.tempData = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    this.fillform();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      loanamountinFigure: [undefined],
      loanamountinWords: [undefined],
      actDetails: [undefined],
      actYearInFigure: [undefined],
      nameOfHead: [undefined],
      dateOfRegistration: [undefined],
      registrationNumber: [undefined],
      districtOfFirm: [undefined],
      vdcOfFirm: [undefined],
      wardNumberOfFirm: [undefined],
      addressOfFirm: [undefined],
      nameOfFirm: [undefined],
      interestPerApprovedCFR: [undefined],
      nameOfBranch: [undefined],
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
      totalPeople: [undefined],
      partnerDetails: this.formBuilder.array([]),
    });
    this.setPartners();
  }
  setPartners() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0]) &&
        !ObjectUtil.isEmpty(this.cadData.assignedLoan[0].companyInfo) &&
        !ObjectUtil.isEmpty(this.cadData.assignedLoan[0].companyInfo.companyJsonData)) {
      const partners = this.cadData.assignedLoan[0].companyInfo.companyJsonData;
      if (!ObjectUtil.isEmpty(partners)) {
        this.tempPro = JSON.parse(partners);
        /*const tem = JSON.parse(partners);
        this.tempPro = tem.filter(val => val.isAuthorizedPerson === 'Partner Only' || val.isAuthorizedPerson === 'Both');*/
      }
      this.tempPro.forEach(val => {
        (this.form.get('partnerDetails') as FormArray).push(this.setAuthorDetailsForm());
      });
    }
  }
  setAuthorDetailsForm() {
    return this.formBuilder.group({
      nameOfGrandfather: [undefined],
      nameOfFather: [undefined],
      foreignAddress: [undefined],
      district: [undefined],
      vdc: [undefined],
      wardNumber: [undefined],
      age: [undefined],
      nameOfPartner: [undefined],
      directorCitizenshipNumber: [undefined],
      citizenshipIssueDate: [undefined],
      citizenshipIssueDistrict: [undefined],
      passportValidityDate: [undefined],
      directorOtherPassportNumber: [undefined],
      directorIndianPassportNumber: [undefined],
      directorIndianAadhaarNumber: [undefined],
      directorIndianEmbassyNumber: [undefined]
    });
  }
  fillform() {
    const proprietor = this.cadData.assignedLoan[0].companyInfo.companyJsonData;
    // let tempProprietor;
    if (!ObjectUtil.isEmpty(proprietor)) {
      this.tempProprietor = JSON.parse(proprietor);
      /*const tempo =  JSON.parse(proprietor);
      this.tempProprietor = tempo.filter(val => val.isAuthorizedPerson === 'Partner Only' || val.isAuthorizedPerson === 'Both');*/
    }
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    const finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    const loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
    let letAge;
    if (!this.isInstitutional) {
      if (!ObjectUtil.isEmpty(this.individualData.dob) && !ObjectUtil.isEmpty(this.individualData.dob.en.eDate)) {
        const calAge = AgeCalculation.calculateAge(this.individualData.dob.en.eDate);
        // age = this.engToNepNumberPipe.transform(String(calAge));
        letAge = this.ageCalculation(this.individualData.dob.en.eDate);
      } else {
        // const calAge = AgeCalculation.calculateAge(this.individualData.dob.en);
        // age = this.engToNepNumberPipe.transform(String(calAge));
        letAge = this.ageCalculation(this.individualData.dob.en);
      }
    }
    if (this.isInstitutional) {
      this.tempProprietor.forEach((val) => {
        if (!ObjectUtil.isEmpty(val.ownerDobDateType) && this.tempProprietor.length > 0) {
          if (val.ownerDobDateType === 'AD') {
            letAge = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(val.ownerDob).toString());
          } else {
            letAge = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(val.ownerDobNepali.eDate).toString());
          }
          this.ageArray.push(letAge);
        }
      });
    }


    let length = 1;
    if (!ObjectUtil.isEmpty(this.jointInfoData)) {
      length = this.jointInfoData.length;
      this.jointInfoData.forEach(value => {
        if (!ObjectUtil.isEmpty(value.nepData)) {
          const nep = JSON.parse(value.nepData);
          this.selectiveArr.push(nep);
        }
      });
    }
    this.checkOfferLetterData();
    this.forPrint();
    let totalPeop = 1;
    if (!ObjectUtil.isEmpty(this.tempProprietor)) {
      totalPeop = this.tempProprietor.length;
    }
    this.form.patchValue({
      actDetails: [this.loanHolderNepData.actName ? this.loanHolderNepData.actName.ct : ''],
      actYearInFigure: [this.setActYear()],
      nameOfHead: [this.loanHolderNepData.authorizedBodyName ? this.loanHolderNepData.authorizedBodyName.ct : ''],
      dateOfRegistration: [this.setRegistrationDate()],
      registrationNumber: [this.loanHolderNepData.registrationNo ? this.loanHolderNepData.registrationNo.ct : ''],
      districtOfFirm: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
      wardNumberOfFirm: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
      addressOfFirm: [this.loanHolderNepData.registeredStreetTole ? this.loanHolderNepData.registeredStreetTole.ct : ''],
      vdcOfFirm: this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : '',
      nameOfFirm: this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : '',
      loanamountinFigure: (this.tempData.smeGlobalForm && this.tempData.smeGlobalForm.totalLimitInFigureCT ) ?
          this.tempData.smeGlobalForm.totalLimitInFigureCT : '',
      loanamountinWords: (this.tempData.smeGlobalForm && this.tempData.smeGlobalForm.totalLimitInWordsCT ) ?
          this.tempData.smeGlobalForm.totalLimitInWordsCT : '',
      loanAmountinFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(finalAmount)),
      loanAmountInWords: this.nepaliCurrencyWordPipe.transform(loanAmountWord),
      nameOfBranch: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
      /*interestPerApprovedCFR: (this.educationalTemplateData && this.educationalTemplateData.ct)
          ? (this.educationalTemplateData.ct)
          : ((this.educationalTemplateData) ? (this.educationalTemplateData)
              : ('')),*/
      totalPeople: this.engToNepNumberPipe.transform(totalPeop.toString()) ? this.engToNepNumberPipe.transform(totalPeop.toString()) : '',
    });
    this.fillPartnerDetails(this.tempProprietor);
  }
  fillPartnerDetails(data) {
    if (this.tempProprietor.length > 0 && !ObjectUtil.isEmpty(data)) {
      for (let val = 0; val < this.tempProprietor.length; val++) {
        this.form.get(['partnerDetails', val, 'nameOfGrandfather']).patchValue(
            this.tempProprietor[val] &&
            ((this.tempProprietor[val].ownerGender === 'MALE') || (this.tempProprietor[val].ownerGender === 'OTHERS') ||
                (this.tempProprietor[val].ownerGender === 'FEMALE' && this.tempProprietor[val].ownerRelationMedium === '1')) ?
                this.tempProprietor[val].ownerGrandFatherNameCT :
                (this.tempProprietor[val].ownerGender === 'FEMALE' && this.tempProprietor[val].ownerRelationMedium === '0') ?
                    this.tempProprietor[val].ownerFatherInLawNameCT : '');
        this.form.get(['partnerDetails', val, 'nameOfFather']).patchValue(
            this.tempProprietor[val] &&
            ((this.tempProprietor[val].ownerGender === 'MALE') || (this.tempProprietor[val].ownerGender === 'OTHERS') ||
                (this.tempProprietor[val].ownerGender === 'FEMALE' && this.tempProprietor[val].ownerRelationMedium === '1')) ?
                this.tempProprietor[val].ownerFatherNameCT :
                (this.tempProprietor[val].ownerGender === 'FEMALE' && this.tempProprietor[val].ownerRelationMedium === '0') ?
                    this.tempProprietor[val].ownerHusbandNameCT : '');
        this.form.get(['partnerDetails', val, 'foreignAddress']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerOtherAddressCT : '');
        this.form.get(['partnerDetails', val, 'district']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerPermanentDistrictCT : '');
        this.form.get(['partnerDetails', val, 'vdc']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerPermanentMunicipalityCT : '');
        this.form.get(['partnerDetails', val, 'wardNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerPermanentWardNoCT : '');
        this.form.get(['partnerDetails', val, 'age']).patchValue(
            this.ageArray[val] ? this.ageArray[val] : '');
        this.form.get(['partnerDetails', val, 'nameOfPartner']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerNameCT : '');
        this.form.get(['partnerDetails', val, 'directorCitizenshipNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerCitizenshipNoCT : '');
        this.form.get(['partnerDetails', val, 'citizenshipIssueDate']).patchValue(
            this.dateArray[val] ? this.dateArray[val] : '');
        this.form.get(['partnerDetails', val, 'citizenshipIssueDistrict']).patchValue(
            this.issuedPlaceArray[val] ? this.issuedPlaceArray[val] : '');
        this.form.get(['partnerDetails', val, 'passportValidityDate']).patchValue(
            this.dateValidityArray[val] ? this.dateValidityArray[val] : '');
        this.form.get(['partnerDetails', val, 'directorOtherPassportNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].otherOwnerPassportNoCT : '');
        this.form.get(['partnerDetails', val, 'directorIndianPassportNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].indianOwnerPassportNoCT : '');
        this.form.get(['partnerDetails', val, 'directorIndianAadhaarNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].indianOwnerAdharCardNoCT : '');
        this.form.get(['partnerDetails', val, 'directorIndianEmbassyNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].indianEmbassyNoCT : '');
      }
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
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);
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
  checkOfferLetterData() {
    if (this.cadData.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString()
          === this.offerDocumentChecklist.value(this.offerDocumentChecklist.EDUCATIONAL).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
        this.educationalTemplateData = educationalOfferData.interestRate;
      }
      let documentName;
      this.cadData.offerDocumentList.filter((document: OfferDocument) => {
        documentName = document.docName;
        this.offerLetterDocument = document;
      });
      if (documentName === 'DDSL Without Subsidy') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRate)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Kisan Karja Subsidy') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRate)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Udyamsil Karja Subsidy') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRate)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Interest subsidy sanction letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRate)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Class A Sanction letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRate)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.interestRate;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.importLoanTrust.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.revolvingShortTermLoan.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.demandLoanForm.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.overdraftLoanForm.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.equityMortgaged.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.overdraftFixedForm.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.overDraftFacilityForm.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.bridgeGapLoan.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.termLoanForm.termLoanDetails.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.mortgageEquityTermForm.interestRateCT;
        }
      }
      if (documentName === 'Combined Offer Letter') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument.initialInformation.interestRateCT)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData.autoLoanMasterForm.autoLoanFormArray.interestRateCT;
        }
      }
      if (!ObjectUtil.isEmpty(this.tempProprietor)) {
        let tempDate;
        let validityDate = '';
        let tempIssuedPlace;
        this.tempProprietor.forEach(val => {
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
  }
  forPrint() {
    for (const i of this.tempProprietor) {
      this.grandFatherName = i.ownerGrandFatherNameCT;
      this.nameOfFather = i.ownerFatherNameCT;
      this.district = i.ownerPermanentDistrictCT;
      this.vdc = i.ownerPermanentMunicipalityCT;
      this.wardNumber = i.ownerPermanentWardNoCT;
      this.age = i.ownerDobCT;
      this.nameOfPartner = i.ownerNameCT;
      this.directorCitizenshipNumber = i.ownerCitizenshipNoCT;
      if (!ObjectUtil.isEmpty(i.ownerOtherAddress)) {
        this.foreignAddress = i.ownerOtherAddressCT;
        this.isForeignAddress = true;
      }

      if (i.radioOwnerCitizenshipIssuedDate === 'AD') {
        this.citizenshipIssueDate = this.engToNepaliDate.transform(i.ownerCitizenshipIssuedDateCT, true);
      } else {
        this.citizenshipIssueDate = i.ownerCitizenshipIssuedDateCT;
      }

      this.citizenshipIssueDistrict = i.ownerCitizenshipIssuedDistrictCT;
     }
  }

  setRegistrationDate() {
    let regDate = '';
    if (this.loanHolderNepData.registrationDateOption.en === 'AD') {
      regDate = this.engToNepaliDate.transform(this.loanHolderNepData.registrationDate.en ? this.loanHolderNepData.registrationDate.en : this.loanHolderNepData.registrationDate.en, true) || '' ;
    } else {
      regDate = this.loanHolderNepData.registrationDateNepali ? this.loanHolderNepData.registrationDateNepali.en.nDate : '';
    }
    return regDate ? regDate : '';
  }

  // setActYear() {
  //   let yearOfAct = '';
  //   if (!ObjectUtil.isEmpty(this.loanHolderNepData.radioActYearDate.en === 'AD')) {
  //     yearOfAct = this.engToNepaliDate.transform(this.loanHolderNepData.actYear.en ? this.loanHolderNepData.actYear.en : this.loanHolderNepData.actYear.en, true) || '' ;
  //   } else {
  //     yearOfAct = this.loanHolderNepData.actYear.en ? this.loanHolderNepData.actYear.en : '';
  //   }
  //   return yearOfAct ? yearOfAct : '';
  // }
  setActYear() {
    let yearOfAct = '';
    if (!ObjectUtil.isEmpty(this.loanHolderNepData.radioActYearDate.np) && (this.loanHolderNepData.radioActYearDate.np === 'BS')) {
      yearOfAct = this.loanHolderNepData.actYear.np ? this.loanHolderNepData.actYear.np : '';
    } else {
      yearOfAct = this.loanHolderNepData.actYear.en ? this.loanHolderNepData.actYear.en : '' ;
    }
    return yearOfAct ? yearOfAct : '';
  }
}

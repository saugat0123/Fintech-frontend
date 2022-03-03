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
  totalAmount;
  totalAmountInWord;
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
    this.setTotalAmount();
    this.fillform();
  }
  setTotalAmount() {
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
        this.totalAmount = (this.tempData.smeGlobalForm && this.tempData.smeGlobalForm.totalLimitInFigureCT) ?
            this.tempData.smeGlobalForm.totalLimitInFigureCT : '';
        this.totalAmountInWord = (this.tempData.smeGlobalForm && this.tempData.smeGlobalForm.totalLimitInWordsCT ) ?
            this.tempData.smeGlobalForm.totalLimitInWordsCT : '';
      } if (!ObjectUtil.isEmpty(this.tempData) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        this.totalAmount = (this.tempData && this.tempData.loanLimitAmountFigure) ?
            this.tempData.loanLimitAmountFigure.ct : '';
        this.totalAmountInWord = (this.tempData && this.tempData.loanLimitAmountFigureWords) ?
            this.tempData.loanLimitAmountFigureWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.tempData) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        this.totalAmount = (this.tempData && this.tempData.totalLimitInFigure) ?
            this.tempData.totalLimitInFigure.ct : '';
        this.totalAmountInWord = (this.tempData && this.tempData.totalLimitInWords) ?
            this.tempData.totalLimitInWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.tempData) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
        this.totalAmount = (this.tempData && this.tempData.totalLimitFigure) ?
            this.tempData.totalLimitFigure.ct : '';
        this.totalAmountInWord = (this.tempData && this.tempData.totalLimitWords) ?
            this.tempData.totalLimitWords.ct : '';
      } if (!ObjectUtil.isEmpty(this.tempData) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        const proposedLimit = this.cadData.assignedLoan[0] ?
            this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
        this.totalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
        this.totalAmountInWord = this.nepaliCurrencyWordPipe.transform(proposedLimit ? proposedLimit : '');
      } if (!ObjectUtil.isEmpty(this.tempData) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
        this.totalAmount = (this.tempData && this.tempData.loanAmountFigure) ?
            this.tempData.loanAmountFigure.ct : '';
        this.totalAmountInWord = (this.tempData && this.tempData.loanAmountFigureWords) ?
            this.tempData.loanAmountFigureWords.ct : '';
      }
    }
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
    /*let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    const finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    const loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);*/
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
    // let totalAmount;
    // let totalAmountInWord;
    // if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
    //   if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
    //     totalAmount = (this.tempData.smeGlobalForm && this.tempData.smeGlobalForm.totalLimitInFigureCT) ?
    //         this.tempData.smeGlobalForm.totalLimitInFigureCT : '';
    //     totalAmountInWord = (this.tempData.smeGlobalForm && this.tempData.smeGlobalForm.totalLimitInWordsCT ) ?
    //         this.tempData.smeGlobalForm.totalLimitInWordsCT : '';
    //   } else {
    //     totalAmount = (this.tempData && this.tempData.loanLimitAmountFigure) ?
    //         this.tempData.loanLimitAmountFigure.ct : '';
    //     totalAmountInWord = (this.tempData && this.tempData.loanLimitAmountFigureWords) ?
    //         this.tempData.loanLimitAmountFigureWords.ct : '';
    //   }
    // }
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
      loanamountinFigure: this.totalAmount ? this.totalAmount : '',
      loanamountinWords: this.totalAmountInWord ? this.totalAmountInWord : '',
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
          let indianOwnerPPIssuedDate;
          let indianOwnerPassportValidityDate;
          if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Passport') {
            // Issue Date
            // tslint:disable-next-line:max-line-length
            indianOwnerPPIssuedDate = this.datePipe.transform(val.indianOwnerPassportIssuedDate ? val.indianOwnerPassportIssuedDate : '');
            tempDate = this.transformEnglishDate(indianOwnerPPIssuedDate ? indianOwnerPPIssuedDate : '');
            // validity date
            // tslint:disable-next-line:max-line-length
            indianOwnerPassportValidityDate = this.datePipe.transform(val.indianOwnerPassportValidityDateCT ? val.indianOwnerPassportValidityDateCT : '');
            validityDate = this.transformEnglishDate(indianOwnerPassportValidityDate ? indianOwnerPassportValidityDate : '');
            // place
            tempIssuedPlace = val.indianOwnerPassportIssuedFromCT ? val.indianOwnerPassportIssuedFromCT : '';
          }
          let indianOwnerAdharCardIssuedDate;
          // For Indian National with Aadhaar Card
          if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Adhar Card') {
            // tslint:disable-next-line:max-line-length
            indianOwnerAdharCardIssuedDate = this.datePipe.transform(val.indianOwnerAdharCardIssuedDate ? val.indianOwnerAdharCardIssuedDate : '');
            tempDate = this.transformEnglishDate(indianOwnerAdharCardIssuedDate ? indianOwnerAdharCardIssuedDate : '');
            tempIssuedPlace = val.indianOwnerAdharCardIssuedFromCT ? val.indianOwnerAdharCardIssuedFromCT : '';
          }
          // For Indian National with Embassy
          let indianEmbassyIssuedDate;
          if (val.ownerNationality === 'Indian' && val.indianOwnerDetailOption === 'Embassy Certificate') {
            indianEmbassyIssuedDate = this.datePipe.transform(val.indianEmbassyIssuedDate ? val.indianEmbassyIssuedDate : '');
            tempDate = this.transformEnglishDate(indianEmbassyIssuedDate ? indianEmbassyIssuedDate : '');
            tempIssuedPlace = val.indianEmbassyIssuedFromCT ? val.indianEmbassyIssuedFromCT : '';
          }
          // For Other Nationals
          let ppIssueDate;
          let valDate;
          if (val.ownerNationality === 'Other') {
            if (val.otherOwnerPassportIssuedDateOption === 'AD') {
              ppIssueDate = this.datePipe.transform(val.otherOwnerPassportIssuedDateCT ? val.otherOwnerPassportIssuedDateCT : '');
              tempDate = this.transformEnglishDate(ppIssueDate);
            } else {
              tempDate = val.otherOwnerPassportIssuedDateNepaliCT.nDate;
            }
            if (val.otherOwnerPassportValidityDateOption === 'AD') {
              valDate = this.datePipe.transform(val.otherOwnerPassportValidityDateCT ? val.otherOwnerPassportValidityDateCT : '');
              validityDate = this.transformEnglishDate(valDate);
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

  transformEnglishDate(date) {
    let transformedDate;
    let monthName;
    const dateArray1 = [];
    const splittedDate = date.split(' ');
    if (splittedDate[0] === 'Jan') {
      monthName = 'जनवरी';
    } else if (splittedDate[0] === 'Feb') {
      monthName = 'फेब्रुअरी';
    } else if (splittedDate[0] === 'Mar') {
      monthName = 'मार्च';
    } else if (splittedDate[0] === 'Apr') {
      monthName = 'अप्रिल';
    } else if (splittedDate[0] === 'May') {
      monthName = 'मे';
    } else if (splittedDate[0] === 'Jun') {
      monthName = 'जुन';
    } else if (splittedDate[0] === 'Jul') {
      monthName = 'जुलाई';
    } else if (splittedDate[0] === 'Aug') {
      monthName = 'अगष्ट';
    } else if (splittedDate[0] === 'Sep') {
      monthName = 'सेप्टेम्बर';
    } else if (splittedDate[0] === 'Oct') {
      monthName = 'अक्टुबर';
    } else if (splittedDate[0] === 'Nov') {
      monthName = 'नोभेम्बर';
    } else {
      monthName = 'डिसेम्बर';
    }
    dateArray1.push(this.engToNepNumberPipe.transform(splittedDate[1].slice(0, -1)));
    dateArray1.push(monthName + ',');
    dateArray1.push(this.engToNepNumberPipe.transform(splittedDate[2]));
    transformedDate = dateArray1.join(' ');
    return transformedDate;
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

  setActYear() {
    let yearOfAct = '';
    if (!ObjectUtil.isEmpty(this.loanHolderNepData.radioActYearDate)) {
      if (this.loanHolderNepData.radioActYearDate.np === 'BS') {
        yearOfAct = this.loanHolderNepData.actYear.np ? this.loanHolderNepData.actYear.np : '';
      } else {
        yearOfAct = this.loanHolderNepData.actYear ? this.loanHolderNepData.actYear.en : this.loanHolderNepData.actYear.en || '';
      }
    }
    return yearOfAct ? yearOfAct : '';
  }
}

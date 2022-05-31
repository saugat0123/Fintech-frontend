import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
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
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {CustomerService} from '../../../../admin/service/customer.service';
import {CustomerType} from '../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {EngNepDatePipe} from 'nepali-patro';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {AgeCalculation} from '../../../../../@core/age-calculation';
import { OfferDocument } from '../../../model/OfferDocument';

@Component({
  selector: 'app-promissory-note-company',
  templateUrl: './promissory-note-company.component.html',
  styleUrls: ['./promissory-note-company.component.scss']
})
export class PromissoryNoteCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: number;
  initialInfoPrint;
  form: FormGroup;
  promissoryConst = NabilDocumentChecklist;
  offerDocumentChecklist = NabilOfferLetterConst;
  isInstitutional = false;
  individualData;
  clientType;
  loanHolderNepData: any;
  customerType = CustomerType;
  customerSubType = CustomerSubType;
  jointInfoData;
  tempProprietor;
  offerLetterDocument;
  educationalTemplateData;
  totalAmount;
  totalAmountInWord;
  selectiveArr = [];
  isForeignAddress = false;
  ageArray: Array <any> = new Array <any>();
  dateArray: Array <any> = new Array <any>();
  dateValidityArray: Array <any> = new Array <any>();
  issuedPlaceArray: Array <any> = new Array<any>();
  tempPro;
  spinner = false;
  tempData;

  constructor(private formBuilder: FormBuilder,
    private administrationService: CreditAdministrationService,
    private toastService: ToastService,
    private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
    private nepToEngNumberPipe: NepaliToEngNumberPipe,
    private dialogRef: NbDialogRef < CadOfferLetterModalComponent > ,
    private routerUtilsService: RouterUtilsService,
    public engToNepaliDate: EngNepDatePipe,
    private customerService: CustomerService,
    private engToNepNumberPipe: EngToNepaliNumberPipe,
    public datePipe: DatePipe,
    private currencyFormatPipe: CurrencyFormatterPipe, ) {}

  ngOnInit() {
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
    const proprietor = this.cadData.assignedLoan[0].companyInfo.companyJsonData;
    // let tempProprietor;
    if (!ObjectUtil.isEmpty(proprietor)) {
      const tempo =  JSON.parse(proprietor);
      this.tempProprietor = tempo.filter(val => val.isAuthorizedPerson === 'Authorized Person Only' || val.isAuthorizedPerson === 'Both');
    }
    for (const x of this.tempProprietor) {
      if (!ObjectUtil.isEmpty(x.ownerOtherAddressCT)) {
        this.isForeignAddress = true;
      }
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
      actDate: [undefined],
      headName: [undefined],
      registrationDate: [undefined],
      registrationNumber: [undefined],
      firmDistrict: [undefined],
      companyVDCMunci: [undefined],
      firmWardNumber: [undefined],
      firmAddress: [undefined],
      companyName: [undefined],
      interest: [undefined],
      branchName: [undefined],
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
      authorDetails: this.formBuilder.array([]),
    });
    this.setAuthorDetails();
  }
  setAuthorDetails() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0]) &&
        !ObjectUtil.isEmpty(this.cadData.assignedLoan[0].companyInfo) &&
        !ObjectUtil.isEmpty(this.cadData.assignedLoan[0].companyInfo.companyJsonData)) {
      const proprietor = this.cadData.assignedLoan[0].companyInfo.companyJsonData;
      if (!ObjectUtil.isEmpty(proprietor)) {
        const tem = JSON.parse(proprietor);
        this.tempPro = tem.filter(val => val.isAuthorizedPerson === 'Authorized Person Only' || val.isAuthorizedPerson === 'Both');
      }
      this.tempPro.forEach(val => {
        (this.form.get('authorDetails') as FormArray).push(this.setAuthorDetailsForm());
      });
    }
  }
  setAuthorDetailsForm() {
    return this.formBuilder.group({
      grandfatherName: [undefined],
      fatherName: [undefined],
      district: [undefined],
      foreignAddress: [undefined],
      municipality: [undefined],
      wardNumber: [undefined],
      authorizedPersonAge: [undefined],
      directorName: [undefined],
      directorCitizenshipNumber: [undefined],
      directorCitizenshipIssueDate: [undefined],
      directorCitizenshipIssueDistrict: [undefined],
      passportValidityDate: [undefined],
      directorOtherPassportNumber: [undefined],
      directorIndianPassportNumber: [undefined],
      directorIndianAadhaarNumber: [undefined],
      directorIndianEmbassyNumber: [undefined]
    });
  }

  fillform() {
    let totalLoan = 0;
    this.cadData.assignedLoan.forEach(val => {
      const proposedAmount = val.proposal.proposedLimit;
      totalLoan = totalLoan + proposedAmount;
    });
    const finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
    const loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
    let citizenshipIssuedDate;
    if (!this.isInstitutional) {
      if (!ObjectUtil.isEmpty(this.individualData.citizenshipIssueDate.en.nDate)) {
        citizenshipIssuedDate = this.individualData.citizenshipIssueDate.en.nDate;
      } else {
        const convertedDate = this.datePipe.transform(this.individualData.citizenshipIssueDate.en);
        citizenshipIssuedDate = this.engToNepaliDate.transform(convertedDate, true);
      }
    }
    let age;
    if (!this.isInstitutional) {
      if (!ObjectUtil.isEmpty(this.individualData.dob) && !ObjectUtil.isEmpty(this.individualData.dob.en.eDate)) {
        const calAge = AgeCalculation.calculateAge(this.individualData.dob.en.eDate);
        age = this.ageCalculation(this.individualData.dob.en.eDate);
      } else {
        age = this.ageCalculation(this.individualData.dob.en);
      }
    }
    if (this.isInstitutional) {
      this.tempProprietor.forEach((val) => {
        if (!ObjectUtil.isEmpty(val.ownerDobDateType) && this.tempProprietor.length > 0) {
          if (val.ownerDobDateType === 'AD') {
            age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(val.ownerDob).toString());
          } else {
            age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(val.ownerDobNepali.eDate).toString());
          }
          this.ageArray.push(age);
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
    this.checkOfferLetterData();
    this.form.patchValue({
      nameofBranchLocated: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
      actDetails: [this.loanHolderNepData.actName ? this.loanHolderNepData.actName.ct : ''],
      actDate: [this.setActYear()],
      headName: [this.loanHolderNepData.authorizedBodyName ? this.loanHolderNepData.authorizedBodyName.ct : ''],
      registrationNumber: [this.loanHolderNepData.registrationNo ? this.loanHolderNepData.registrationNo.np : ''],
      firmDistrict: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
      firmWardNumber: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
      firmAddress: [this.loanHolderNepData.registeredStreetTole ? this.loanHolderNepData.registeredStreetTole.ct : ''],
      companyVDCMunci: this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : '',
      companyName: this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : '',
      loanamountinFigure: this.totalAmount,
      loanamountinWords: this.totalAmountInWord,
      /*loanAmountinFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(finalAmount)),
      loanAmountInWords: this.nepaliCurrencyWordPipe.transform(loanAmountWord),*/
      branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
      totalPeople: this.engToNepNumberPipe.transform(totalPeop.toString()) ? this.engToNepNumberPipe.transform(totalPeop.toString()) : '',
    });
    this.fillAutorizedDetails(this.tempProprietor);
  }
  fillAutorizedDetails(data) {
    if (this.tempProprietor.length > 0 && !ObjectUtil.isEmpty(data)) {
      for (let val = 0; val < this.tempProprietor.length; val++) {
        this.form.get(['authorDetails', val, 'grandfatherName']).patchValue(
            this.tempProprietor[val] &&
            ((this.tempProprietor[val].ownerGender === 'MALE') || (this.tempProprietor[val].ownerGender === 'OTHERS') ||
                (this.tempProprietor[val].ownerGender === 'FEMALE' && this.tempProprietor[val].ownerRelationMedium === '1')) ?
                this.tempProprietor[val].ownerGrandFatherNameCT :
                (this.tempProprietor[val].ownerGender === 'FEMALE' && this.tempProprietor[val].ownerRelationMedium === '0') ?
                    this.tempProprietor[val].ownerFatherInLawNameCT : '');
        this.form.get(['authorDetails', val, 'fatherName']).patchValue(
            this.tempProprietor[val] &&
            ((this.tempProprietor[val].ownerGender === 'MALE') || (this.tempProprietor[val].ownerGender === 'OTHERS') ||
                (this.tempProprietor[val].ownerGender === 'FEMALE' && this.tempProprietor[val].ownerRelationMedium === '1')) ?
                this.tempProprietor[val].ownerFatherNameCT :
                (this.tempProprietor[val].ownerGender === 'FEMALE' && this.tempProprietor[val].ownerRelationMedium === '0') ?
                    this.tempProprietor[val].ownerHusbandNameCT : '');
        this.form.get(['authorDetails', val, 'foreignAddress']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerOtherAddressCT : '');
        this.form.get(['authorDetails', val, 'district']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerPermanentDistrictCT : '');
        this.form.get(['authorDetails', val, 'municipality']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerPermanentMunicipalityCT : '');
        this.form.get(['authorDetails', val, 'wardNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerPermanentWardNoCT : '');
        this.form.get(['authorDetails', val, 'authorizedPersonAge']).patchValue(
            this.ageArray[val] ? this.ageArray[val] : '');
        this.form.get(['authorDetails', val, 'directorName']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerNameCT : '');
        this.form.get(['authorDetails', val, 'directorCitizenshipNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerCitizenshipNoCT : '');
        this.form.get(['authorDetails', val, 'directorCitizenshipIssueDate']).patchValue(
            this.dateArray[val] ? this.dateArray[val] : '');
        this.form.get(['authorDetails', val, 'directorCitizenshipIssueDistrict']).patchValue(
            this.issuedPlaceArray[val] ? this.issuedPlaceArray[val] : '');
        this.form.get(['authorDetails', val, 'passportValidityDate']).patchValue(
            this.dateValidityArray[val] ? this.dateValidityArray[val] : '');
        this.form.get(['authorDetails', val, 'directorOtherPassportNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].otherOwnerPassportNoCT : '');
        this.form.get(['authorDetails', val, 'directorIndianPassportNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].indianOwnerPassportNoCT : '');
        this.form.get(['authorDetails', val, 'directorIndianAadhaarNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].indianOwnerAdharCardNoCT : '');
        this.form.get(['authorDetails', val, 'directorIndianEmbassyNumber']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].indianEmbassyNoCT : '');
      }
    }
  }
  checkOfferLetterData() {
    if (this.cadData.offerDocumentList.length > 0) {
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
      if (this.loanHolderNepData.registrationDateOption.en === 'AD') {
        this.form.get('registrationDate').patchValue(this.engToNepaliDate.transform(this.loanHolderNepData.registrationDate.en, true));
      } else {
        this.form.get('registrationDate').patchValue(this.loanHolderNepData.registrationDateNepali.en.nDate);
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
            indianOwnerPPIssuedDate = this.datePipe.transform(val.indianOwnerPassportIssuedDate ? val.indianOwnerPassportIssuedDate : '');
            tempDate = this.transformEnglishDate(indianOwnerPPIssuedDate ? indianOwnerPPIssuedDate : '');
            // validity date
            // tslint:disable-next-line:max-line-length
            indianOwnerPassportValidityDate = this.datePipe.transform(val.indianOwnerPassportValidityDateCT ? val.indianOwnerPassportValidityDateCT : '');
            validityDate = this.transformEnglishDate(indianOwnerPassportValidityDate ? indianOwnerPassportValidityDate : '');
            tempIssuedPlace = val.indianOwnerPassportIssuedFromCT ? val.indianOwnerPassportIssuedFromCT : '';
          }
          // For Indian National with Aadhaar Card
          let indianOwnerAdharCardIssuedDate;
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
              tempDate = this.transformEnglishDate(ppIssueDate ? ppIssueDate : '');
            } else {
              tempDate = val.otherOwnerPassportIssuedDateNepaliCT.nDate;
            }
            if (val.otherOwnerPassportValidityDateOption === 'AD') {
              valDate = this.datePipe.transform(val.otherOwnerPassportValidityDateCT ? val.otherOwnerPassportValidityDateCT : '');
              validityDate = this.transformEnglishDate(valDate ? valDate : '');
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

  setActYear() {
    let yearOfAct: string;
    if (!ObjectUtil.isEmpty(this.loanHolderNepData.radioActYearDate)) {
      if (this.loanHolderNepData.radioActYearDate.np === 'BS') {
        yearOfAct = this.loanHolderNepData.actYear.np ? this.loanHolderNepData.actYear.np : '';
      } else {
        yearOfAct = this.loanHolderNepData.actYear ? this.loanHolderNepData.actYear.en : this.loanHolderNepData.actYear.en;
      }
    }
    return yearOfAct ? yearOfAct : '';
  }
}

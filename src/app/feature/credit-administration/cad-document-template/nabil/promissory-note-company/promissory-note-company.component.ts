import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {
  CustomerApprovedLoanCadDocumentation
} from '../../../model/customerApprovedLoanCadDocumentation';
import {
  CreditAdministrationService
} from '../../../service/credit-administration.service';
import {
  ToastService
} from '../../../../../@core/utils';
import {
  NbDialogRef
} from '@nebular/theme';
import {
  CadOfferLetterModalComponent
} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {
  RouterUtilsService
} from '../../../utils/router-utils.service';
import {
  ObjectUtil
} from '../../../../../@core/utils/ObjectUtil';
import {
  CadFile
} from '../../../model/CadFile';
import {
  Document
} from '../../../../admin/modal/document';
import {
  Alert,
  AlertType
} from '../../../../../@theme/model/Alert';
import {
  NabilDocumentChecklist
} from '../../../../admin/modal/nabil-document-checklist.enum';
import {
  NepaliCurrencyWordPipe
} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {
  NepaliToEngNumberPipe
} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {
  CustomerService
} from '../../../../admin/service/customer.service';
import {
  CustomerType
} from '../../../../customer/model/customerType';
import {
  CustomerSubType
} from '../../../../customer/model/customerSubType';
import {
  NabilOfferLetterConst
} from '../../../nabil-offer-letter-const';
import {
  EngNepDatePipe
} from 'nepali-patro';
import {
  EngToNepaliNumberPipe
} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {
  CurrencyFormatterPipe
} from '../../../../../@core/pipe/currency-formatter.pipe';
import {
  DatePipe
} from '@angular/common';
import {
  AgeCalculation
} from '../../../../../@core/age-calculation';
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
  selectiveArr = [];
  isForeignAddress = false;
  ageArray: Array <any> = new Array <any>();
  dateArray: Array <any> = new Array <any>();
  dateValidityArray: Array <any> = new Array <any>();
  issuedPlaceArray: Array <any> = new Array<any>();
  tempPro;

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
      this.tempProprietor = JSON.parse(proprietor);
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
    this.fillform();
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
        this.tempPro = JSON.parse(proprietor);
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
          if (val.ownerDobDateType === undefined) {
            age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(val.ownerDob).toString());
          } else {
            age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(val.ownerDob).toString());
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
      loanamountinFigure: finalAmount,
      loanamountinWords: loanAmountWord,
      loanAmountinFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(finalAmount)),
      loanAmountInWords: this.nepaliCurrencyWordPipe.transform(loanAmountWord),
      /*grandfatherName: this.tempProprietor[0] ? this.tempProprietor[0].ownerGrandFatherNameCT : '',
      fatherName: this.tempProprietor[0] ? this.tempProprietor[0].ownerFatherNameCT : '',
      district: this.tempProprietor[0] ? this.tempProprietor[0].ownerPermanentDistrictCT : '',
      foreignAddress: this.tempProprietor[0] ? this.tempProprietor[0].ownerOtherAddressCT : '',
      municipality: this.tempProprietor[0] ? this.tempProprietor[0].ownerPermanentMunicipalityCT : '',
      wardNumber: this.tempProprietor[0] ? this.tempProprietor[0].ownerPermanentWardNoCT : '',
      directorName: this.tempProprietor[0] ? this.tempProprietor[0].ownerNameCT : '',
      directorCitizenshipNumber: this.tempProprietor[0] ? this.tempProprietor[0].ownerCitizenshipNoCT : '',
      directorCitizenshipIssueDistrict: this.tempProprietor[0] ? this.tempProprietor[0].ownerCitizenshipIssuedDistrictCT : '',*/
      branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
      // authorizedPersonAge: [undefined],
      totalPeople: this.engToNepNumberPipe.transform(totalPeop.toString()) ? this.engToNepNumberPipe.transform(totalPeop.toString()) : '',
    });
    this.fillAutorizedDetails(this.tempProprietor);
  }
  fillAutorizedDetails(data) {
    if (this.tempProprietor.length > 0 && !ObjectUtil.isEmpty(data)) {
      for (let val = 0; val < this.tempProprietor.length; val++) {
        this.form.get(['authorDetails', val, 'grandfatherName']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerGrandFatherNameCT : '');
        this.form.get(['authorDetails', val, 'fatherName']).patchValue(
            this.tempProprietor[val] ? this.tempProprietor[val].ownerFatherNameCT : '');
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
        this.form.get('registrationDate').patchValue(this.loanHolderNepData.registrationDate.np);
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
              tempDate = val.ownerCitizenshipIssuedDateCT;
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
              tempDate = val.otherOwnerPassportIssuedDateCT.nDate;
            }
            if (val.otherOwnerPassportValidityDateOption === 'AD') {
              validityDate = this.engToNepaliDate.transform(val.otherOwnerPassportValidityDateCT, true);
            } else {
              validityDate = val.otherOwnerPassportValidityDateCT;
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

  setActYear() {
    let yearOfAct: string;
    if (!ObjectUtil.isEmpty(this.loanHolderNepData.radioActYearDate.np) && (this.loanHolderNepData.radioActYearDate.np === 'BS')) {
      yearOfAct = this.loanHolderNepData.actYear.np ? this.loanHolderNepData.actYear.np : '';
    } else {
      yearOfAct = this.loanHolderNepData.actYear.en ? this.loanHolderNepData.actYear.en : '' ;
    }
    return yearOfAct ? yearOfAct : '';
  }
}

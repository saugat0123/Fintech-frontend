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
  isForeignAddress: boolean = true;


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
      private customerService: CustomerService
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
      nameOfGrandfather: [undefined],
      nameOfFather: [undefined],
      district: [undefined],
      vdc: [undefined],
      wardNumber: [undefined],
      age: [undefined],
      nameOfPartner: [undefined],
      directorCitizenshipNumber: [undefined],
      citizenshipIssueDate: [undefined],
      citizenshipIssueDistrict: [undefined],
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
    });
  }
  fillform() {
    const proprietor = this.cadData.assignedLoan[0].companyInfo.companyJsonData;
    // let tempProprietor;
    if (!ObjectUtil.isEmpty(proprietor)) {
      this.tempProprietor = JSON.parse(proprietor);
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
      if (!ObjectUtil.isEmpty(this.tempProprietor[0].ownerDobDateType) && this.tempProprietor.length > 0) {
        if (this.tempProprietor[0].ownerDobDateType === undefined) {
          letAge = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.tempProprietor[0].ownerDob).toString());
        } else {
          letAge = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.tempProprietor[0].ownerDob).toString());
        }
      }
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
      loanamountinFigure: finalAmount,
      loanamountinWords: loanAmountWord,
      loanAmountinFigure: this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(finalAmount)),
      loanAmountInWords: this.nepaliCurrencyWordPipe.transform(loanAmountWord),
      nameOfBranch: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
      interestPerApprovedCFR: (this.educationalTemplateData && this.educationalTemplateData.ct)
          ? (this.educationalTemplateData.ct)
          : ((this.educationalTemplateData) ? (this.educationalTemplateData)
              : ('')),
      nameOfGrandfather: this.grandFatherName ? this.grandFatherName : '',
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
      for (const i of this.tempProprietor) {
        if (i.radioOwnerCitizenshipIssuedDate === 'AD') {
          this.form.get('citizenshipIssueDate').patchValue(this.engToNepaliDate.transform(i.ownerCitizenshipIssuedDateCT, true));
        } else {
          this.form.get('citizenshipIssueDate').patchValue(i.ownerCitizenshipIssuedDateCT);
        }
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
      
      if (!ObjectUtil.isEmpty(i.ownerOtherAddress)){
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
      regDate = this.loanHolderNepData.registrationDate.en.nDate ? this.loanHolderNepData.registrationDate.en.nDate : '';
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

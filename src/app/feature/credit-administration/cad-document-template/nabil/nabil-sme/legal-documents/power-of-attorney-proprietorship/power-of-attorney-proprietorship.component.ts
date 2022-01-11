import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../../../admin/modal/nabil-document-checklist.enum';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerType} from '../../../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../../../customer/model/customerSubType';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {CustomerService} from '../../../../../../customer/service/customer.service';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {AgeCalculation} from '../../../../../../../@core/age-calculation';
import {CadFile} from '../../../../../model/CadFile';
import {Document} from '../../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {OfferDocument} from '../../../../../model/OfferDocument';

@Component({
  selector: 'app-power-of-attorney-proprietorship',
  templateUrl: './power-of-attorney-proprietorship.component.html',
  styleUrls: ['./power-of-attorney-proprietorship.component.scss']
})
export class PowerOfAttorneyProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  guarantorData;
  individualData;
  initialInfoPrint;
  customerAddress;
  offerLetterConst = NabilDocumentChecklist;
  offerDocumentChecklist = NabilOfferLetterConst;
  form: FormGroup;
  guarantorNames: Array<String> = [];
  nepData;
  clientType;
  customerType = CustomerType;
  customerSubType = CustomerSubType;
  jointInfoData;
  selectiveArr = [];
  offerLetterDocument;
  educationalTemplateData;
  companyInfo;
  loanHolderNepData: any;
  isInstitutional = false;
  tempProprietor;
  offerDocumentDetails: any;

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
    console.log('Offer Letter Details for Home Loan', this.cadData);
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.loanHolder.customerType === 'INSTITUTION') {
        this.isInstitutional = true;
      }
      if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0])) {
        this.companyInfo = this.cadData.assignedLoan[0] ? JSON.parse(this.cadData.assignedLoan[0].companyInfo.companyJsonData) : '';
      }
      this.guarantorData = this.cadData.assignedLoan[0].taggedGuarantors;
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(individualCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.form.patchValue(initialInfo);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
      this.clientType = this.cadData.loanHolder['customerSubType'];

      this.loanHolderNepData = this.cadData.loanHolder.nepData
          ? JSON.parse(this.cadData.loanHolder.nepData)
          : this.cadData.loanHolder.nepData;

      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList) && this.cadData.offerDocumentList.length !== 0) {
        this.offerDocumentDetails = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
      }
      // this.customerAddress = this.tempProprietor[0].ownerPermanentProvinceCT + '-' +
      //     this.tempProprietor[0].ownerPermanentWardNoCT + ', ' + this.tempProprietor[0].ownerPermanentDistrictCT + ' ,' +
      //     this.tempProprietor[0].ownerPermanentProvinceCT;
    }
    console.log('loanHolderNepData: ', this.loanHolderNepData);
    console.log('initial info', this.initialInfoPrint);
    console.log('form', this.form);
    this.getJointInfoData();
    this.fillform();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      districtOfFirm: [undefined],
      municipalityOfFirm: [undefined],
      wardNoOfFirm: [undefined],
      addressOfFirm: [undefined],
      nameOfBorrower: [undefined],
      distrcitOfPropreitor: [undefined],
      municipalityOfPropreitor: [undefined],
      wardNoOfPropreitor: [undefined],
      nameOfPropreitor: [undefined],
      citizenshipNo: [undefined],
      dateOfIssue: [undefined],
      nameOfIdentityIssuedDistrict: [undefined],
      nameOfBranchLocated: [undefined],
      sanctionLetterIssuedDate: [undefined],
      branchName: [undefined],
      nameOfBorrowerFirm: [undefined],
      addressOfBorrowerFirm: [undefined],
      nameOfProprietor: [undefined],
      district: [undefined],
      municipality: [undefined],
      age: [undefined],
      nameOfWitness: [undefined],
      wardNo: [undefined],
    });
  }

  fillform() {
    const proprietor = this.cadData.assignedLoan[0].companyInfo.companyJsonData;
    // let tempProprietor;
    if (!ObjectUtil.isEmpty(proprietor)) {
      this.tempProprietor = JSON.parse(proprietor);
      console.log('DATA::::::', this.tempProprietor);
    }
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
      if (!ObjectUtil.isEmpty(this.tempProprietor[0].ownerDobDateType) && this.tempProprietor.length > 0) {
        if (this.tempProprietor[0].ownerDobDateType === undefined) {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.tempProprietor[0].ownerDob).toString());
        } else {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.tempProprietor[0].ownerDob).toString());
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
    this.form.patchValue(
        {
          nameofBranchLocated: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
          districtOfFirm: [this.loanHolderNepData.registeredDistrict ? this.loanHolderNepData.registeredDistrict.ct : ''],
          municipalityOfFirm: [this.loanHolderNepData.registeredMunicipality ? this.loanHolderNepData.registeredMunicipality.ct : ''],
          wardNoOfFirm: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
          regNo: [this.loanHolderNepData.registrationNo ? this.loanHolderNepData.registrationNo.np : ''],
          nameOfBranchLocated: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
          addressOfFirm: [this.loanHolderNepData.currentStreetTole ? this.loanHolderNepData.currentStreetTole.ct : ''],
          loanAmountInFigure: finalAmount,
          loanAmountInWords: loanAmountWord,
          fatherNameOfPro: this.tempProprietor[0] ? this.tempProprietor[0].ownerFatherNameCT : '',
          nameOfBorrower: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
          grandNameOfPro: this.tempProprietor[0] ? this.tempProprietor[0].ownerGrandFatherNameCT : '',
          distrcitOfPropreitor: this.tempProprietor[0] ? this.tempProprietor[0].ownerPermanentDistrictCT : '',
          municipalityOfPropreitor: this.tempProprietor[0] ? this.tempProprietor[0].ownerPermanentMunicipalityCT : '',
          wardNoOfPropreitor: this.tempProprietor[0] ? this.tempProprietor[0].ownerPermanentWardNoCT : '',
          nameOfPropreitor: this.tempProprietor[0] ? this.tempProprietor[0].ownerNameCT : '',
          citizenshipNo: this.tempProprietor[0] ? this.tempProprietor[0].ownerCitizenshipNoCT : '',
          nameOfIdentityIssuedDistrict: this.tempProprietor[0] ? this.tempProprietor[0].ownerCitizenshipIssuedDistrictCT : '',
          intRate: this.tempProprietor[0] ? this.tempProprietor[0].ownerSharePercentageCT : '',
          nameOfFirm: [this.loanHolderNepData.currentMunicipality ? this.loanHolderNepData.currentMunicipality.ct : ''],
          wardNo: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
          vdc: [this.loanHolderNepData.municipalityVdc ? this.loanHolderNepData.municipalityVdc.ct : ''],
          distictOfFirm: [this.loanHolderNepData.issuingDistrict ? this.loanHolderNepData.issuingDistrict.ct : ''],
          ageOfPro: age ? age : '',
          sanctionLetterIssuedDate: [this.setApprovalDate()],
        }
    );
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

  setApprovalDate() {
    let approvalDate;
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
      const dateOfApproval = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (dateOfApproval === 'AD') {
        approvalDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.ct : '';
      } else {
        approvalDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
      const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        approvalDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
      } else {
        approvalDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
      approvalDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
      const dateOfApprovalType = this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        const templateDateApproval = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.en : '';
        approvalDate = this.engToNepNumberPipe.transform(this.datePipe.transform(templateDateApproval), true);
      } else {
        const templateDateApproval = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.en : '';
        approvalDate = templateDateApproval ? templateDateApproval.nDate : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.offerDocumentDetails.smeGlobalForm) {
      approvalDate = this.engToNepNumberPipe.transform(this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT ?
          this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT :
          this.offerDocumentDetails.smeGlobalForm.dateOfApprovalCT, true);
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
      const sanctionLetterDate = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (sanctionLetterDate === 'AD') {
        const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.en : '';
        approvalDate = this.engToNepNumberPipe.transform(this.datePipe.transform(templateDateSanctionDate), true);
      } else {
        const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.en : '';
        approvalDate = templateDateSanctionDate ? templateDateSanctionDate.nDate : '';
      }
    }
    return approvalDate ? approvalDate : '';
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
  checkOfferLetterData() {
    console.log('CHeck:');
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
      console.log('loanholder nepdata:', this.loanHolderNepData);
      // if (this.loanHolderNepData.registrationDateOption.en === 'AD') {
      //   this.form.get('dateOfReg').patchValue(this.engToNepaliDate.transform(this.loanHolderNepData.registrationDate.en, true));
      // } else {
      //   this.form.get('dateOfReg').patchValue(this.loanHolderNepData.registrationDate.np);
      // }
      if (this.tempProprietor[0].radioOwnerCitizenshipIssuedDate === 'AD') {
        this.form.get('dateOfIssue').patchValue(this.engToNepaliDate.transform(this.tempProprietor[0].ownerCitizenshipIssuedDateCT, true));
      } else {
        this.form.get('dateOfIssue').patchValue(this.tempProprietor[0].ownerCitizenshipIssuedDateCT);
      }
    }
  }

  async getJointInfoData() {
    if (this.cadData.loanHolder.customerType === this.customerType.INDIVIDUAL
        && this.clientType === this.customerSubType.JOINT.toUpperCase()) {
      const associateId = this.cadData.loanHolder.associateId;
      await this.customerService.getJointInfoDetails(associateId).toPromise().then((res: any) => {
        this.jointInfoData = JSON.parse(res.detail.jointInfo);
      }, error => {
        console.log(error);
      });
    }
  }
}


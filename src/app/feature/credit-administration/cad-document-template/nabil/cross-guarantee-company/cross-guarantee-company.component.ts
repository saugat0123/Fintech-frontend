import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ToastService} from '../../../../../@core/utils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {AgeCalculation} from '../../../../../@core/age-calculation';

@Component({
  selector: 'app-cross-guarantee-company',
  templateUrl: './cross-guarantee-company.component.html',
  styleUrls: ['./cross-guarantee-company.component.scss']
})
export class CrossGuaranteeCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  crossGuaranteeConst = NabilDocumentChecklist;
  form: FormGroup;
  loanHolderNepData: any;
  spinner = false;
  taggedGuarantorsDetailsInLoan = [];
  offerDocumentDetails: any;
  freeText: Array<any> = new Array<any>();
  finalAmount;
  loanAmountWord;
  individualGuarantorNepDataArray: Array<any> = new Array<any>();
  nameOfAct = 'साझेदारी';
  nameOfAuthorizedBody = 'नेपाल सरकार';
  cadInitialInfo;
  customerType;
  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private englishNepaliDatePipe: EngNepDatePipe,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData)) {
      if (!ObjectUtil.isEmpty(this.cadData.loanHolder) &&
          !ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
        this.loanHolderNepData = JSON.parse(this.cadData.loanHolder.nepData);
        this.customerType = this.cadData.loanHolder.customerSubType;
      }
    }
    this.loadPersonalGuarantorData();
    this.setTotalAmount();
    this.buildForm();
    this.fillGuarantee();
  }


  buildForm() {
    this.form = this.formBuilder.group({
      crossGuaranteeCompany: this.formBuilder.array([]),
    });
    this.taggedPersonalGuarantorsDetailsForm();
  }

  taggedPersonalGuarantorsDetailsForm() {
    if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
      this.taggedGuarantorsDetailsInLoan.forEach((val) => {
        if (JSON.parse(val.nepData).guarantorType.en === 'Cross Guarantor' ||
            JSON.parse(val.nepData).guarantorType.en === 'Corporate Guarantor') {
          const individualGuarantorNepData = val.nepData
              ? JSON.parse(val.nepData)
              : val.nepData;
          if (ObjectUtil.isEmpty(individualGuarantorNepData)) {
            return;
          }
          this.individualGuarantorNepDataArray.push(individualGuarantorNepData);
          (this.form.get('crossGuaranteeCompany') as FormArray).push(
              this.formBuilder.group({
                branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
                issuedDate: [this.setIssuedDate()],
                sisterConcerned: [individualGuarantorNepData.guaranteeProviderName ?
                    individualGuarantorNepData.guaranteeProviderName.ct : ''],
                actName: [!ObjectUtil.isEmpty(this.loanHolderNepData.actName) ?
                    this.loanHolderNepData.actName.ct : ''],
                actYear: [this.setActYear()],
                authorizedBody: [!ObjectUtil.isEmpty(this.loanHolderNepData.authorizedBodyName) ?
                    this.loanHolderNepData.authorizedBodyName.ct : this.nameOfAuthorizedBody],
                registeredWith: [individualGuarantorNepData.guarantorRegisteredWith ?
                    individualGuarantorNepData.guarantorRegisteredWith.ct : ''],
                dateOfRegistration: [this.setRegistrationDate()],
                registrationNumber: [this.loanHolderNepData.registrationNo ?
                    this.loanHolderNepData.registrationNo.ct : ''],
                district: [this.loanHolderNepData.registeredDistrict ?
                    this.loanHolderNepData.registeredDistrict.ct : ''],
                municipalityVdc: [this.loanHolderNepData.registeredMunicipality ?
                    this.loanHolderNepData.registeredMunicipality.ct : ''],
                wardNumber: [this.loanHolderNepData.permanentWard ?
                    this.loanHolderNepData.permanentWard.ct : ''],
                borrowerName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
                // Guarantor Details
                grandfatherName: [this.getGrandFatherName(individualGuarantorNepData)],
                fatherName: [this.getFatherName(individualGuarantorNepData)],
                authorizedPersonDistrict: [individualGuarantorNepData.permanentDistrict ?
                    individualGuarantorNepData.permanentDistrict.ct : ''],
                authorizedPersonMunicipality: [individualGuarantorNepData.permanentMunicipality ?
                    individualGuarantorNepData.permanentMunicipality.ct : ''],
                authorizedPersonWard: [individualGuarantorNepData.permanentWard ?
                    individualGuarantorNepData.permanentWard.ct : ''],
                authorizedPersonAge: [this.engToNepNumberPipe.transform(this.calculateAge(individualGuarantorNepData))],
                authorizedPersonName: [individualGuarantorNepData.authorizedPersonName ?
                    individualGuarantorNepData.authorizedPersonName.ct : ''],
                crossGuaranteeProviderName: [individualGuarantorNepData.guaranteeProviderName ?
                    individualGuarantorNepData.guaranteeProviderName.ct : ''],
                loanAmountInFigure: [this.finalAmount],
                loanAmountInWords: [this.loanAmountWord],
                // free Text
                date: [undefined],
                sanchaalakFreeText: [';~rfns÷k|aGw ;~rfns÷k|d\'v sfo{sf/L clws[t÷'],
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
                bankStaff: [undefined],
              })
          );
        }
      });
    }
  }
  calculateAge(data) {
    let age;
    if (data.authorizedDobDateType === 'AD') {
      if (!ObjectUtil.isEmpty(data.authorizedDob)) {
        age = AgeCalculation.calculateAge(data.authorizedDob.en).toString();
      }
    } else {
      if (!ObjectUtil.isEmpty(data.authorizedDobNepali)) {
        age = AgeCalculation.calculateAge(data.authorizedDobNepali.ct.eDate).toString();
      }
    }
    return age;
  }
  getFatherName(data) {
    let fatherName;
    if (!ObjectUtil.isEmpty(data)) {
      if (data.gender.en === 'MALE' || data.gender.en === 'OTHERS' ||
          (data.gender.en === 'FEMALE' && data.guarantorMaritalStatus.en === 'Unmarried')) {
        fatherName = data.fatherName.ct;
      }
      if (data.gender.en === 'FEMALE' && data.guarantorMaritalStatus.en === 'Married') {
        fatherName = data.husbandName.ct;
      }
    }
    return fatherName;
  }
  getGrandFatherName(data) {
    let grandFatherName;
    if (!ObjectUtil.isEmpty(data)) {
      if (data.gender.en === 'MALE' || data.gender.en === 'OTHERS' ||
          (data.gender.en === 'FEMALE' && data.guarantorMaritalStatus.en === 'Unmarried')) {
        grandFatherName = data.grandFatherName ? data.grandFatherName.ct : '';
      }
      if (data.gender.en === 'FEMALE' && data.guarantorMaritalStatus.en === 'Married') {
        grandFatherName = data.fatherInLawName ? data.fatherInLawName.ct : '';
      }
    }
    return grandFatherName;
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
          for (let val = 0; val < free.crossGuaranteeCompany.length; val++) {
            this.form.get(['crossGuaranteeCompany', val, 'sanchaalakFreeText']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].sanchaalakFreeText : '');
            this.form.get(['crossGuaranteeCompany', val, 'date']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].date : '');
            this.form.get(['crossGuaranteeCompany', val, 'witnessDistrict']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].witnessDistrict : '');
            this.form.get(['crossGuaranteeCompany', val, 'witnessMunicipality']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].witnessMunicipality : '');
            this.form.get(['crossGuaranteeCompany', val, 'WitnessWardNumber']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].WitnessWardNumber : '');
            this.form.get(['crossGuaranteeCompany', val, 'witnessAge']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].witnessAge : '');
            this.form.get(['crossGuaranteeCompany', val, 'witnessName']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].witnessName : '');
            this.form.get(['crossGuaranteeCompany', val, 'witnessDistrict2']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].witnessDistrict2 : '');
            this.form.get(['crossGuaranteeCompany', val, 'witnessMunicipality2']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].witnessMunicipality2 : '');
            this.form.get(['crossGuaranteeCompany', val, 'WitnessWardNumber2']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].WitnessWardNumber2 : '');
            this.form.get(['crossGuaranteeCompany', val, 'witnessAge2']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].witnessAge2 : '');
            this.form.get(['crossGuaranteeCompany', val, 'witnessName2']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].witnessName2 : '');
            this.form.get(['crossGuaranteeCompany', val, 'bankStaff']).patchValue(this.cadInitialInfo ?
                this.cadInitialInfo[val].bankStaff : '');
          }
        }
      }
    }
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

  setTotalAmount() {
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
        this.finalAmount = (this.offerDocumentDetails.smeGlobalForm &&
            this.offerDocumentDetails.smeGlobalForm.totalLimitInFigureCT) ?
            this.offerDocumentDetails.smeGlobalForm.totalLimitInFigureCT : '';
        this.loanAmountWord = (this.offerDocumentDetails.smeGlobalForm &&
            this.offerDocumentDetails.smeGlobalForm.totalLimitInWordsCT) ?
            this.offerDocumentDetails.smeGlobalForm.totalLimitInWordsCT : '';
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
        this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.loanLimitAmountFigure) ?
            this.offerDocumentDetails.loanLimitAmountFigure.ct : '';
        this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.loanLimitAmountFigureWords) ?
            this.offerDocumentDetails.loanLimitAmountFigureWords.ct : '';
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
        this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitInFigure) ?
            this.offerDocumentDetails.totalLimitInFigure.ct : '';
        this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitInWords) ?
            this.offerDocumentDetails.totalLimitInWords.ct : '';
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) &&
          this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
        this.finalAmount = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitFigure) ?
            this.offerDocumentDetails.totalLimitFigure.ct : '';
        this.loanAmountWord = (this.offerDocumentDetails && this.offerDocumentDetails.totalLimitWords) ?
            this.offerDocumentDetails.totalLimitWords.ct : '';
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Kisan Karja Subsidy') {
        const proposedLimit = this.cadData.assignedLoan[0] ?
            this.cadData.assignedLoan[0].proposal.proposedLimit : 0;
        this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(proposedLimit ? proposedLimit : 0));
        this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(proposedLimit ? proposedLimit : '');
      }
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
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

  setIssuedDate() {
    let issuedDate = '';
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
      const dateOfApproval = this.offerDocumentDetails.sanctionLetterDateType ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (dateOfApproval === 'AD') {
        issuedDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.ct : '';
      } else {
        issuedDate = this.offerDocumentDetails.sanctionLetterDateNepali ?
            this.offerDocumentDetails.sanctionLetterDateNepali.ct : '';
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
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) &&
        this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails.dateOfApprovalType) && this.offerDocumentDetails.dateOfApprovalType.en === 'AD') {
        issuedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
      } else {
        issuedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Class A Sanction letter') {
      const sanctionLetterDate = this.offerDocumentDetails.sanctionLetterDateType ?
          this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (sanctionLetterDate === 'AD') {
        const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDate ?
            this.offerDocumentDetails.sanctionLetterDate.en : '';
        issuedDate = this.englishNepaliDatePipe.transform(this.datePipe.transform(templateDateSanctionDate), true);
      } else {
        const templateDateSanctionDate = this.offerDocumentDetails.sanctionLetterDateNepali ?
            this.offerDocumentDetails.sanctionLetterDateNepali.en : '';
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
  setFreeText() {
    const free = this.form.value;
    for (let val = 0; val < free.crossGuaranteeCompany.length; val++) {
      const tempFreeText = {
        sanchaalakFreeText: this.form.get(['crossGuaranteeCompany', val, 'sanchaalakFreeText']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'sanchaalakFreeText']).value : '',
        date: this.form.get(['crossGuaranteeCompany', val, 'date']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'date']).value : '',
        witnessDistrict: this.form.get(['crossGuaranteeCompany', val, 'witnessDistrict']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'witnessDistrict']).value : '',
        witnessMunicipality: this.form.get(['crossGuaranteeCompany', val, 'witnessMunicipality']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'witnessMunicipality']).value : '',
        WitnessWardNumber: this.form.get(['crossGuaranteeCompany', val, 'WitnessWardNumber']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'WitnessWardNumber']).value : '',
        witnessAge: this.form.get(['crossGuaranteeCompany', val, 'witnessAge']).value ? this.form.get(['crossGuaranteeCompany', val, 'witnessAge']).value : '',
        witnessName: this.form.get(['crossGuaranteeCompany', val, 'witnessName']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'witnessName']).value : '',
        witnessDistrict2: this.form.get(['crossGuaranteeCompany', val, 'witnessDistrict2']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'witnessDistrict2']).value : '',
        witnessMunicipality2: this.form.get(['crossGuaranteeCompany', val, 'witnessMunicipality2']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'witnessMunicipality2']).value : '',
        WitnessWardNumber2: this.form.get(['crossGuaranteeCompany', val, 'WitnessWardNumber2']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'WitnessWardNumber2']).value : '',
        witnessAge2: this.form.get(['crossGuaranteeCompany', val, 'witnessAge2']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'witnessAge2']).value : '',
        witnessName2: this.form.get(['crossGuaranteeCompany', val, 'witnessName2']).value ?
            this.form.get(['crossGuaranteeCompany', val, 'witnessName2']).value : '',
        bankStaff: this.form.get(['crossGuaranteeCompany', val, 'bankStaff']).value ? this.form.get(['crossGuaranteeCompany', val, 'bankStaff']).value : '',
      };
      this.freeText.push(tempFreeText);
    }
    return JSON.stringify(this.freeText);
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

}

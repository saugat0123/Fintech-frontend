import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../../@core/utils';
import { RouterUtilsService } from '../../../utils/router-utils.service';
import { CreditAdministrationService } from '../../../service/credit-administration.service';
import { NepaliCurrencyWordPipe } from '../../../../../@core/pipe/nepali-currency-word.pipe';
import { EngToNepaliNumberPipe } from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import { CurrencyFormatterPipe } from '../../../../../@core/pipe/currency-formatter.pipe';
import { NepaliToEngNumberPipe } from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import { NepaliPercentWordPipe } from '../../../../../@core/pipe/nepali-percent-word.pipe';
import { CustomerApprovedLoanCadDocumentation } from '../../../model/customerApprovedLoanCadDocumentation';
import { NepaliNumberAndWords } from '../../../model/nepaliNumberAndWords';
import { NabilDocumentChecklist } from '../../../../admin/modal/nabil-document-checklist.enum';
import { ObjectUtil } from '../../../../../@core/utils/ObjectUtil';
import { CadFile } from '../../../model/CadFile';
import { Document } from '../../../../admin/modal/document';
import { Alert, AlertType } from '../../../../../@theme/model/Alert';
import { NbDialogRef } from '@nebular/theme';
import { CadOfferLetterModalComponent } from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import { EngNepDatePipe } from 'nepali-patro';
import { ProposalCalculationUtils } from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
import { LoanDataKey } from '../../../../../@core/utils/constants/loan-data-key';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-personal-guarantee-individual',
  templateUrl: './personal-guarantee-individual.component.html',
  styleUrls: ['./personal-guarantee-individual.component.scss'],
})
export class PersonalGuaranteeIndividualComponent implements OnInit, OnChanges {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;
  guarantorindividualGroup: FormGroup;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  individualData;
  taggedGuarantorsDetailsInLoan = [];
  loanHolderNepData: any;
  offerDocumentDetails: any;
  nepaliNumber = new NepaliNumberAndWords();
  guarantorsNepData = [];
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  docName: any;
  offerLoanType;
  loanPurposeArray: Array<any> = new Array<any>();
  spinner = false;
  cadInitialInfo: any;
  freeText: Array<any> = new Array<any>();
  loanPurpose: any;
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
    private datePipe: DatePipe,
  ) {}

  ngOnChanges() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanHolderNepData = this.cadData.loanHolder.nepData
        ? JSON.parse(this.cadData.loanHolder.nepData)
        : this.cadData.loanHolder.nepData;
      this.cadData.assignedLoan.map((value) => {
        value.taggedGuarantors.forEach((val) => {
          this.taggedGuarantorsDetailsInLoan.push(val);
        });
      });
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
        this.offerDocumentDetails = this.cadData.offerDocumentList ? JSON.parse(this.cadData.offerDocumentList[0].initialInformation) : '';
      }
    }
    this.taggedGuarantorsDetailsInLoan = Array.from(
      new Set(
        this.taggedGuarantorsDetailsInLoan.map((val) => JSON.stringify(val))
      )
    ).map((val) => JSON.parse(val));
  }

  ngOnInit() {
    this.buildForm();
    this.fillGuarantee();
    // if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
    //   this.cadData.cadFileList.forEach(individualCadFile => {
    //     if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
    //       const initialInfo = JSON.parse(individualCadFile.initialInformation);
    //       this.initialInfoPrint = initialInfo;
    //       this.guarantorindividualGroup.patchValue(initialInfo);
    //     }
    //   });
    // }
    // if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
    //   this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
    // }
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanHolderNepData = this.cadData.loanHolder.nepData
        ? JSON.parse(this.cadData.loanHolder.nepData)
        : this.cadData.loanHolder.nepData;
      this.individualData = this.cadData.loanHolder;
      this.cadData.assignedLoan.map((value) => {
        value.taggedGuarantors.forEach((val) => {
          this.taggedGuarantorsDetailsInLoan.push(val);
        });
      });
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
        this.offerDocumentDetails = this.cadData.offerDocumentList[0] ? JSON.parse(this.cadData.offerDocumentList[0].initialInformation) : '';
      }
    }
    this.taggedGuarantorsDetailsInLoan = Array.from(
      new Set(
        this.taggedGuarantorsDetailsInLoan.map((val) => JSON.stringify(val))
      )
    ).map((val) => JSON.parse(val));
  }

  buildForm() {
    this.guarantorindividualGroup = this.formBuilder.group({
      individualGuarantors: this.formBuilder.array([]),
    });
    this.taggedGuarantorsDetailsForm();
    this.calulation();
  }

  removeIndividualGuarantors(i) {
    (
      this.guarantorindividualGroup.get('individualGuarantors') as FormArray
    ).removeAt(i);
  }

  refreshGuarantors() {
    this.buildForm();
  }

  addIndividualGuarantorsForm() {
    (
      this.guarantorindividualGroup.get('individualGuarantors') as FormArray
    ).push(this.initIndividualGuarantors());
  }

  initIndividualGuarantors() {
    return this.formBuilder.group({
      branchName: [undefined],
      grandFatherName: [undefined],
      father_husbandName: [undefined],
      district: [undefined],
      VDCMunicipality: [undefined],
      ward: [undefined],
      temporarydistrict: [undefined],
      temporaryVDCMunicipality: [undefined],
      temporaryward: [undefined],
      borrowerName: [undefined],
      loanPurpose: [undefined],
      nameOfBank: [undefined],
      dateOfApproval: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      guarantorName: [undefined],
      guarantorFatherOrHusbandName: [undefined],
      guarantorGrandFatherName: [undefined],

      guarantorPermanentDistrict: [undefined],
      guarantorPermanentMunicipality: [undefined],
      guarantorPermanentWard: [undefined],

      guarantorTemporaryDistrict: [undefined],
      guarantorTemporaryMunicipality: [undefined],
      guarantorTemporaryWard: [undefined],

      guarantorCitizenNumber: [undefined],
      guarantorCitzenIssuedPlace: [undefined],
      guarantorCitzenIssuedDate: [undefined],
      gurantedAmount: [undefined],

      year: [undefined],
      month: [undefined],
      day: [undefined],
      date: [undefined],
      freeText: [undefined],
    });
  }

  taggedGuarantorsDetailsForm() {
      let todayDate: any = this.englishNepaliDatePipe.transform(new Date(), true);
    todayDate = todayDate.replace(',', '').split(' ');
    const daysInNumber = new Date().getDay();

    this.loanPurpose = this.getloanPurpose();
    if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
      this.taggedGuarantorsDetailsInLoan.forEach((val) => {
        const individualGuarantorNepData = val.nepData
          ? JSON.parse(val.nepData)
          : val.nepData;
        this.guarantorsNepData.push(individualGuarantorNepData);
        if (ObjectUtil.isEmpty(individualGuarantorNepData)) {
          return;
        }
        let approvedDate: any;
        let homeapprovedDate: any;
        let homeBankName: any;
        let combinedApprovalDate: any;
        this.docName = this.cadData.offerDocumentList ? this.cadData.offerDocumentList[0].docName : '';
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails)) {
              if (!ObjectUtil.isEmpty(this.offerDocumentDetails.retailGlobalForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.retailGlobalForm.sanctionLetterDateType)) {
                  if (this.offerDocumentDetails.retailGlobalForm.sanctionLetterDateType === 'AD') {
                      if (!ObjectUtil.isEmpty(this.offerDocumentDetails.retailGlobalForm.sanctionLetterDateCT)) {
                          combinedApprovalDate = 'ई. स. ' + this.offerDocumentDetails.retailGlobalForm.sanctionLetterDateCT;
                      }
                  }
                  if (this.offerDocumentDetails.retailGlobalForm.sanctionLetterDateType === 'BS') {
                      if (!ObjectUtil.isEmpty(this.offerDocumentDetails.retailGlobalForm.sanctionLetterDateNepaliCT)) {
                          combinedApprovalDate = 'वि.स ' + this.offerDocumentDetails.retailGlobalForm.sanctionLetterDateNepaliCT;
                      }
                  }
              }
              // tslint:disable-next-line:max-line-length
              // approvedDate = (this.offerDocumentDetails.dateOfApproval && this.offerDocumentDetails.dateOfApproval.en.eDate) ? (this.offerDocumentDetails.dateOfApproval.en.eDate) : (this.offerDocumentDetails.dateOfApproval && this.offerDocumentDetails.dateOfApproval.en) ? (this.offerDocumentDetails.dateOfApproval.en) : ((this.offerDocumentDetails.loan.nepaliDateOfApproval && this.offerDocumentDetails.loan.nepaliDateOfApproval.eDate) ? (this.offerDocumentDetails.loan.nepaliDateOfApproval.eDate) : (''));
              if ((this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '') === 'AD' ||
                  (this.offerDocumentDetails.dateofApprovalType ? this.offerDocumentDetails.dateofApprovalType.en : '') === 'AD') {
                  // tslint:disable-next-line:max-line-length
                  homeapprovedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.en : this.offerDocumentDetails.dateofApproval ? this.offerDocumentDetails.dateofApproval.en : '';
                  approvedDate = this.englishNepaliDatePipe.transform(homeapprovedDate || '', true);
              } else if (this.docName === 'Home Loan') {
                  if (this.offerDocumentDetails.loan.dateType === 'AD') {
                      homeapprovedDate = this.offerDocumentDetails.loan.dateOfApproval ? this.offerDocumentDetails.loan.dateOfApproval : '';
                      approvedDate = this.englishNepaliDatePipe.transform(homeapprovedDate || '', true);
                  }
                  if (this.offerDocumentDetails.loan.dateType === 'BS') {
                      approvedDate = this.offerDocumentDetails.loan.nepaliDateOfApproval.eDate;
                  }
                  this.offerLoanType = this.offerDocumentDetails.loanType ? this.offerDocumentDetails.loanType : '';
                  homeBankName = this.offerDocumentDetails.loan.nameOfBankCT ? this.offerDocumentDetails.loan.nameOfBankCT : '';
              } else {
                  // tslint:disable-next-line:max-line-length
                  approvedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.en.eDate : this.offerDocumentDetails.dateofApprovalNepali ? this.offerDocumentDetails.dateofApprovalNepali.en.eDate : '';
              }
              if (this.docName === 'DDSL Without Subsidy') {
                  const dateOfApproval = this.offerDocumentDetails.sanctionLetterDateType ?
                      this.offerDocumentDetails.sanctionLetterDateType.en : '';
                  if (dateOfApproval === 'AD') {
                      approvedDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.ct : '';
                  } else {
                      approvedDate = this.offerDocumentDetails.sanctionLetterDateNepali ?
                          this.offerDocumentDetails.sanctionLetterDateNepali.ct : '';
                  }
              }
              if (this.docName === 'Interest subsidy sanction letter') {
                  const dateOfApproval = this.offerDocumentDetails.dateOfApprovalType ?
                      this.offerDocumentDetails.dateOfApprovalType.en : '';
                  if (dateOfApproval === 'AD') {
                      approvedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
                  } else {
                      approvedDate = this.offerDocumentDetails.dateOfApprovalNepali ?
                          this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
                  }
              }
          }
        let citznIssuedDate: any;
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.citizenIssuedDate) &&
            individualGuarantorNepData.radioCitizenIssuedDate === 'AD') {
            citznIssuedDate = individualGuarantorNepData.citizenIssuedDate ? this.englishNepaliDatePipe.transform(individualGuarantorNepData.citizenIssuedDate.en || '', true) : '';
        }
        if (!ObjectUtil.isEmpty(individualGuarantorNepData.citizenIssuedDateNepali) &&
            individualGuarantorNepData.radioCitizenIssuedDate === 'BS') {
            citznIssuedDate = individualGuarantorNepData.citizenIssuedDateNepali ? individualGuarantorNepData.citizenIssuedDateNepali.en.nDate : '';
        }
          console.log('Individual Guarantor', individualGuarantorNepData);
          (
              this.guarantorindividualGroup.get('individualGuarantors') as FormArray
          ).push(
              this.formBuilder.group({
                  branchName: [this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : ''],
                  grandFatherName: [this.getGrandFatherName()],
                  father_husbandName: [this.getFatherName()],
                  district: [this.loanHolderNepData.permanentDistrict ? this.loanHolderNepData.permanentDistrict.ct : ''],
                  VDCMunicipality: [
                      this.loanHolderNepData.permanentMunicipality ? this.loanHolderNepData.permanentMunicipality.ct : '',
                  ],
                  ward: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
                  temporarydistrict: [undefined],
                  temporaryVDCMunicipality: [undefined],
                  temporaryward: [undefined],
                  borrowerName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
                  loanPurpose: [!ObjectUtil.isEmpty(this.loanPurpose) ? this.loanPurpose : ''],
                  nameOfBank: [homeBankName ? homeBankName : ''],
                  dateOfApproval: [!ObjectUtil.isEmpty(approvedDate) ? approvedDate : !ObjectUtil.isEmpty(combinedApprovalDate) ? combinedApprovalDate : ''],
                  loanAmount: [undefined],
                  loanAmountWords: [undefined],
                  guaranteAmountInWord: [this.nepaliCurrencyWordPipe.transform(individualGuarantorNepData.gurantedAmount.en)],
                  guarantorName: [individualGuarantorNepData.guarantorName ? individualGuarantorNepData.guarantorName.ct : ''],
                  guarantorFatherOrHusbandName: [this.getGuarantorFatherName(individualGuarantorNepData)],
                  guarantorGrandFatherName: [this.getGuarantorGrandFatherName(individualGuarantorNepData)],
                  guarantorPermanentDistrict: [
                      individualGuarantorNepData.permanentDistrict ? individualGuarantorNepData.permanentDistrict.ct : '',
                  ],
                  guarantorPermanentMunicipality: [
                      individualGuarantorNepData.permanentMunicipality ? individualGuarantorNepData.permanentMunicipality.ct : '',
                  ],
                  guarantorPermanentWard: [
                      individualGuarantorNepData.permanentWard ? individualGuarantorNepData.permanentWard.ct : '',
                  ],

                  guarantorTemporaryDistrict: [
                      individualGuarantorNepData.temporaryDistrict ? individualGuarantorNepData.temporaryDistrict.ct : '',
                  ],
                  guarantorTemporaryMunicipality: [
                      individualGuarantorNepData.temporaryMunicipality ? individualGuarantorNepData.temporaryMunicipality.ct : '',
                  ],
                  guarantorTemporaryWard: [
                      individualGuarantorNepData.temporaryWard ? individualGuarantorNepData.temporaryWard.ct : '',
                  ],

                  guarantorCitizenNumber: [
                      individualGuarantorNepData.citizenNumber ? individualGuarantorNepData.citizenNumber.ct : '',
                  ],
                  guarantorCitzenIssuedPlace: [
                      individualGuarantorNepData.issuedPlace ? individualGuarantorNepData.issuedPlace.ct : '',
                  ],
                  guarantorCitzenIssuedDate: [citznIssuedDate],
                  gurantedAmount: [this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(individualGuarantorNepData.gurantedAmount ? individualGuarantorNepData.gurantedAmount.en : ''))],
                  year: [undefined],
                  month: [undefined],
                  day: [undefined],
                  // date: [this.engToNepNumberPipe.transform(String(daysInNumber + 1))],
                  date: [undefined],
                  freeText: [undefined],
                  sakshiDistrict1: [undefined],
                  sakshiMunicipality1: [undefined],
                  sakshiWard1: [undefined],
                  sakshiAge1: [undefined],
                  sakshiName1: [undefined],
                  sakshiDistrict2: [undefined],
                  sakshiMunicipality2: [undefined],
                  sakshiWard2: [undefined],
                  sakshiAge2: [undefined],
                  sakshiName2: [undefined],
                  nameOfBankStaff: [undefined],
              })
          );
      });
    }
  }
    getGuarantorGrandFatherName(individualGuarantorNepData) {
        let grandFatherName;
        if (!ObjectUtil.isEmpty(individualGuarantorNepData) && !ObjectUtil.isEmpty(individualGuarantorNepData.gender) &&
            !ObjectUtil.isEmpty(individualGuarantorNepData.gender.en)) {
            if (individualGuarantorNepData.gender.en === 'MALE') {
                grandFatherName = !ObjectUtil.isEmpty(individualGuarantorNepData.grandFatherName) &&
                !ObjectUtil.isEmpty(individualGuarantorNepData.grandFatherName.ct) ? individualGuarantorNepData.grandFatherName.ct : '';
            }
            if (!ObjectUtil.isEmpty(individualGuarantorNepData.gender.en === 'FEMALE')) {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus) &&
                    !ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus.en)) {
                    if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus.en === 'Unmarried')) {
                        grandFatherName = !ObjectUtil.isEmpty(individualGuarantorNepData.grandFatherName) &&
                        !ObjectUtil.isEmpty(individualGuarantorNepData.grandFatherName.ct) ? individualGuarantorNepData.grandFatherName.ct : '';
                    }
                    if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus.en === 'Married')) {
                        if (!ObjectUtil.isEmpty(individualGuarantorNepData.relationMedium) &&
                            !ObjectUtil.isEmpty(individualGuarantorNepData.relationMedium.en)) {
                            if (individualGuarantorNepData.relationMedium.en === '0') {
                                grandFatherName = !ObjectUtil.isEmpty(individualGuarantorNepData.fatherInLawName) &&
                                !ObjectUtil.isEmpty(individualGuarantorNepData.fatherInLawName.ct) ?
                                    individualGuarantorNepData.fatherInLawName.ct : '';
                            }
                            if (individualGuarantorNepData.relationMedium.en === '1') {
                                grandFatherName = !ObjectUtil.isEmpty(individualGuarantorNepData.grandFatherName) &&
                                !ObjectUtil.isEmpty(individualGuarantorNepData.grandFatherName.ct) ?
                                    individualGuarantorNepData.grandFatherName.ct : '';
                            }
                        }
                    }
                }
            }
        }
        return grandFatherName;
    }
    getGuarantorFatherName(individualGuarantorNepData) {
        let fatherName;
        if (!ObjectUtil.isEmpty(individualGuarantorNepData) &&
            !ObjectUtil.isEmpty(individualGuarantorNepData.gender) &&
            !ObjectUtil.isEmpty(individualGuarantorNepData.gender.en)) {
            if (individualGuarantorNepData.gender.en === 'MALE') {
                fatherName = !ObjectUtil.isEmpty(individualGuarantorNepData.fatherName) &&
                !ObjectUtil.isEmpty(individualGuarantorNepData.fatherName.ct) ? individualGuarantorNepData.fatherName.ct : '';
            }
            if (individualGuarantorNepData.gender.en === 'FEMALE') {
                if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus) &&
                    !ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus.en)) {
                    if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus.en === 'Unmarried')) {
                        fatherName = !ObjectUtil.isEmpty(individualGuarantorNepData.fatherName) &&
                        !ObjectUtil.isEmpty(individualGuarantorNepData.fatherName.ct) ? individualGuarantorNepData.fatherName.ct : '';
                    }
                    if (!ObjectUtil.isEmpty(individualGuarantorNepData.guarantorMaritalStatus.en === 'Married')) {
                        if (!ObjectUtil.isEmpty(individualGuarantorNepData.relationMedium) &&
                            !ObjectUtil.isEmpty(individualGuarantorNepData.relationMedium.en)) {
                            if (individualGuarantorNepData.relationMedium.en === '0') {
                                fatherName = !ObjectUtil.isEmpty(individualGuarantorNepData.husbandName) &&
                                !ObjectUtil.isEmpty(individualGuarantorNepData.husbandName.ct) ? individualGuarantorNepData.husbandName.ct : '';
                            }
                            if (individualGuarantorNepData.relationMedium.en === '1') {
                                fatherName = !ObjectUtil.isEmpty(individualGuarantorNepData.fatherName) &&
                                !ObjectUtil.isEmpty(individualGuarantorNepData.fatherName.ct) ? individualGuarantorNepData.fatherName.ct : '';
                            }
                        }
                    }
                }
            }
        }
        return fatherName;
    }
    getloanPurpose() {
      let loanPurpose: any;
      let loanCombinedPurpose: any;
      if (!ObjectUtil.isEmpty(this.offerDocumentDetails)) {
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.loanPurpose) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.loanPurpose.ct)) {
              loanPurpose = this.offerDocumentDetails.loanPurpose.ct;
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.purposeofLoan) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.purposeofLoan.ct)) {
              loanPurpose = this.offerDocumentDetails.purposeofLoan.ct;
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.purposeOfLoan) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.purposeOfLoan.ct)) {
              loanPurpose = this.offerDocumentDetails.purposeOfLoan.ct;
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.vehicleName) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.vehicleName.ct)) {
              loanPurpose = this.offerDocumentDetails.vehicleName.ct + ' नामको सवारी साधन एक थान व्यक्तिगत प्रयोजनका लागि खरिद';
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.loan) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.loan.purposeOfLoanCT)) {
              loanPurpose = this.offerDocumentDetails.loan.purposeOfLoanCT;
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.existingLoanForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.existingLoanForm.existingLoanFormArray)) {
              this.offerDocumentDetails.existingLoanForm.existingLoanFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.existingLoanForm.existingLoanFormArray[i].purposeOfLoanCT);
              });
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.educationLoanForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.educationLoanForm.educationLoanCombinedFormArray)) {
              this.offerDocumentDetails.educationLoanForm.educationLoanCombinedFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.educationLoanForm.educationLoanCombinedFormArray[i].purposeOfLoanCT);
              });
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.personalOverdraftCombinedForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray)) {
              this.offerDocumentDetails.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray[i].purposeOfLoanCT);
              });
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.mortgageCombineForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.mortgageCombineForm.mortgageCombineLoanFormArray)) {
              this.offerDocumentDetails.mortgageCombineForm.mortgageCombineLoanFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.mortgageCombineForm.mortgageCombineLoanFormArray[i].purposeOfLoanCT);
              });
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.personalLoanCombinedForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
              this.offerDocumentDetails.personalLoanCombinedForm.personalLoanCombinedFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.personalLoanCombinedForm.personalLoanCombinedFormArray[i].purposeOfLoanCT);
              });
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.autoLoanCombinedForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.autoLoanCombinedForm.autoLoanCombinedFormArray)) {
              this.offerDocumentDetails.autoLoanCombinedForm.autoLoanCombinedFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.autoLoanCombinedForm.autoLoanCombinedFormArray[i].purposeOfLoanCT);
              });
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.homeLoanCombinedForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.homeLoanCombinedForm.homeLoanCombinedFormArray)) {
              this.offerDocumentDetails.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.homeLoanCombinedForm.homeLoanCombinedFormArray[i].purposeOfLoanCT);
              });
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.personalOverDraftWithoutCollateralCombinedForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray)) {
              this.offerDocumentDetails.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray[i].purposeOfLoanCT);
              });
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.nabilSahayatriCombinedForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray)) {
              this.offerDocumentDetails.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray[i].purposeOfLoanCT);
              });
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.nabilShareLoanPODForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.nabilShareLoanPODForm.nabilShareLoanPODFormArray)) {
              this.offerDocumentDetails.nabilShareLoanPODForm.nabilShareLoanPODFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.nabilShareLoanPODForm.nabilShareLoanPODFormArray[i].purposeOfLoanCT);
              });
          }
          if (!ObjectUtil.isEmpty(this.offerDocumentDetails.shareLoanDemandCombinedForm) &&
              !ObjectUtil.isEmpty(this.offerDocumentDetails.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
              this.offerDocumentDetails.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.forEach((val, i) => {
                  this.loanPurposeArray.push(this.offerDocumentDetails.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray[i].purposeOfLoanCT);
              });
          }
      }
      if (!ObjectUtil.isEmpty(this.loanPurposeArray)) {
          loanCombinedPurpose = this.loanPurposeArray.join(',');
      }
      if (!ObjectUtil.isEmpty(loanPurpose)) {
          return loanPurpose;
      } else if (!ObjectUtil.isEmpty(loanCombinedPurpose)) {
          return loanCombinedPurpose;
      } else {
          return '';
      }
    }

    getGrandFatherName() {
        let grandFatherName;
        if (!ObjectUtil.isEmpty(this.loanHolderNepData) && !ObjectUtil.isEmpty(this.loanHolderNepData.gender) &&
            !ObjectUtil.isEmpty(this.loanHolderNepData.gender.en)) {
            if (this.loanHolderNepData.gender.en === 'MALE') {
                if (!ObjectUtil.isEmpty(this.loanHolderNepData.grandFatherName)) {
                    grandFatherName = !ObjectUtil.isEmpty(this.loanHolderNepData.grandFatherName) &&
                    !ObjectUtil.isEmpty(this.loanHolderNepData.grandFatherName.ct) ? this.loanHolderNepData.grandFatherName.ct : '';
                }
            }
            if (!ObjectUtil.isEmpty(this.loanHolderNepData.relationMedium) && !ObjectUtil.isEmpty(this.loanHolderNepData.relationMedium.en)) {
                if (this.loanHolderNepData.gender.en === 'FEMALE' && this.loanHolderNepData.relationMedium.en === '0') {
                    grandFatherName = !ObjectUtil.isEmpty(this.loanHolderNepData.fatherInLawName) &&
                    !ObjectUtil.isEmpty(this.loanHolderNepData.fatherInLawName.ct) ? this.loanHolderNepData.fatherInLawName.ct : '';
                }
                if (this.loanHolderNepData.gender.en === 'FEMALE' && this.loanHolderNepData.relationMedium.en === '1') {
                    grandFatherName = !ObjectUtil.isEmpty(this.loanHolderNepData.grandFatherName) &&
                    !ObjectUtil.isEmpty(this.loanHolderNepData.grandFatherName.ct) ? this.loanHolderNepData.grandFatherName.ct : '';
                }
            }
        }
        return grandFatherName;
    }

    getFatherName() {
        let fatherName;
        if (!ObjectUtil.isEmpty(this.loanHolderNepData) &&
            !ObjectUtil.isEmpty(this.loanHolderNepData.gender) &&
            !ObjectUtil.isEmpty(this.loanHolderNepData.gender.en)) {
            if (this.loanHolderNepData.gender.en === 'MALE') {
                fatherName = !ObjectUtil.isEmpty(this.loanHolderNepData.fatherName) &&
                !ObjectUtil.isEmpty(this.loanHolderNepData.fatherName.ct) ? this.loanHolderNepData.fatherName.ct : '';
            }
            if (this.loanHolderNepData.gender.en === 'FEMALE') {
                if (!ObjectUtil.isEmpty(this.loanHolderNepData.relationMedium) && !ObjectUtil.isEmpty(this.loanHolderNepData.relationMedium.en)) {
                    if (this.loanHolderNepData.relationMedium.en === '0') {
                        fatherName = !ObjectUtil.isEmpty(this.loanHolderNepData.husbandName) &&
                        !ObjectUtil.isEmpty(this.loanHolderNepData.husbandName.ct) ? this.loanHolderNepData.husbandName.ct : '';
                    }
                    if (this.loanHolderNepData.relationMedium.en === '1') {
                        fatherName = !ObjectUtil.isEmpty(this.loanHolderNepData.fatherName) &&
                        !ObjectUtil.isEmpty(this.loanHolderNepData.fatherName.ct) ? this.loanHolderNepData.fatherName.ct : '';
                    }
                }
            }
        }
        return fatherName;
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

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(
      this.guarantorindividualGroup.get(numLabel).value
    );
      const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
      this.guarantorindividualGroup.get(wordLabel).patchValue(returnVal);
  }

    setFreeText() {
        const free = this.guarantorindividualGroup.value;
        for (let val = 0; val < free.individualGuarantors.length; val++) {
            const tempFreeText = {
                freeText: this.guarantorindividualGroup.get(['individualGuarantors', val, 'freeText']) ? this.guarantorindividualGroup.get(['individualGuarantors', val, 'freeText']).value : '',
                sakshiDistrict1: this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiDistrict1']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiDistrict1']).value : '',
                sakshiDistrict2: this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiDistrict2']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiDistrict2']).value : '',
                sakshiMunicipality1: this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiMunicipality1']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiMunicipality1']).value : '',
                sakshiMunicipality2: this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiMunicipality2']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiMunicipality2']).value : '',
                sakshiWard1: this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiWard1']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiWard1']).value : '',
                sakshiWard2: this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiWard2']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiWard2']).value : '',
                sakshiAge1: this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiAge1']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiAge1']).value : '',
                sakshiAge2: this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiAge2']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiAge2']).value : '',
                sakshiName1: this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiName1']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiName1']).value : '',
                sakshiName2: this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiName2']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiName2']).value : '',
                nameOfBankStaff: this.guarantorindividualGroup.get(['individualGuarantors', val, 'nameOfBankStaff']).value ?
                    this.guarantorindividualGroup.get(['individualGuarantors', val, 'nameOfBankStaff']).value : '',
                year: this.guarantorindividualGroup.get(['individualGuarantors', val, 'year']).value ? this.guarantorindividualGroup.get(['individualGuarantors', val, 'year']).value : '',
                month: this.guarantorindividualGroup.get(['individualGuarantors', val, 'month']).value ? this.guarantorindividualGroup.get(['individualGuarantors', val, 'month']).value : '',
                date: this.guarantorindividualGroup.get(['individualGuarantors', val, 'date']).value ? this.guarantorindividualGroup.get(['individualGuarantors', val, 'date']).value : '',
                day: this.guarantorindividualGroup.get(['individualGuarantors', val, 'day']).value ? this.guarantorindividualGroup.get(['individualGuarantors', val, 'day']).value : '',
            };
            this.freeText.push(tempFreeText);
        }
        return JSON.stringify(this.freeText);
    }

  submit() {
      this.spinner = true;
      let flag = true;
      if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
          this.cadData.cadFileList.forEach(singleCadFile => {
              if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                  flag = false;
                  singleCadFile.supportedInformation = this.setFreeText();
              }
          });
          if (flag) {
              const cadFile = new CadFile();
              const document = new Document();
              // cadFile.initialInformation = JSON.stringify(this.guarantorindividualGroup.value);
              cadFile.supportedInformation = this.setFreeText();
              document.id = this.documentId;
              cadFile.cadDocument = document;
              cadFile.customerLoanId = this.customerLoanId;
              this.cadData.cadFileList.push(cadFile);
          }
      } else {
          const cadFile = new CadFile();
          const document = new Document();
          // cadFile.initialInformation = JSON.stringify(this.guarantorindividualGroup.value);
          cadFile.supportedInformation = this.setFreeText();
          document.id = this.documentId;
          cadFile.cadDocument = document;
          cadFile.customerLoanId = this.customerLoanId;
          this.cadData.cadFileList.push(cadFile);
      }

      this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
          this.dialogRef.close();
          this.spinner = false;
          this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
      }, error => {
          console.error(error);
          this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
          this.dialogRef.close();
          this.spinner = false;
      });
  }

  fillGuarantee() {
      if (this.cadData.cadFileList.length > 0) {
          if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
              this.cadData.cadFileList.forEach(singleCadFile => {
                  if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
                      this.cadInitialInfo = JSON.parse(singleCadFile.supportedInformation);
                  }
              });
              const free = this.guarantorindividualGroup.value;
              if (this.cadInitialInfo !== null) {
                  for (let val = 0; val < free.individualGuarantors.length; val++) {
                      // tslint:disable-next-line:max-line-length
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'freeText']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].freeText : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiDistrict1']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].sakshiDistrict1 : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiDistrict2']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].sakshiDistrict2 : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiMunicipality1']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].sakshiMunicipality1 : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiMunicipality2']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].sakshiMunicipality2 : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiAge1']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].sakshiAge1 : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiAge2']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].sakshiAge2 : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiWard1']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].sakshiWard1 : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiWard2']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].sakshiWard2 : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiName1']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].sakshiName1 : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'sakshiName2']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].sakshiName2 : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'nameOfBankStaff']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].nameOfBankStaff : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'year']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].year : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'month']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].month : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'date']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].date : '' : '');
                      this.guarantorindividualGroup.get(['individualGuarantors', val, 'day']).patchValue(
                          !ObjectUtil.isEmpty(this.cadInitialInfo) ? !ObjectUtil.isEmpty(this.cadInitialInfo[val]) ?
                              this.cadInitialInfo[val].day : '' : '');
                  }
              }
          }
      }
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {CustomerType} from '../../../../customer/model/customerType';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {District} from '../../../../admin/modal/district';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {ProposalCalculationUtils} from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {AgeCalculation} from '../../../../../@core/age-calculation';
import {DatePipe} from '@angular/common';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {CustomerService} from '../../../../customer/service/customer.service';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';

@Component({
  selector: 'app-letter-of-set-off',
  templateUrl: './letter-of-set-off.component.html',
  styleUrls: ['./letter-of-set-off.component.scss']
})
export class LetterOfSetOffComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() preview;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() nepaliAmount: NepaliNumberAndWords;
  offerDocument: Array<OfferDocument>;
  initialInformation: any;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  offerDocumentChecklist = NabilOfferLetterConst;
  letterOfSetOff: FormGroup;
  nepData;
  clientType;
  customerType = CustomerType;
  customerSubType = CustomerSubType;
  jointInfoData;
  selectiveArr = [];
  offerLetterDocument;
  educationalTemplateData;
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  freeText: any;
  cadInitialInfo: any;
  spinner = false;
  documentName;
  loanPurposeArray: Array<any> = new Array<any>();
  loanPurpose: any;

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
              private customerService: CustomerService) { }

  async ngOnInit() {
    this.buildForm();
    this.checkOfferLetterData();
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.offerDocument = this.cadData.offerDocumentList;
      this.offerDocument.forEach(offerDocument => {
        this.initialInformation = JSON.parse(offerDocument.initialInformation);
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
      this.clientType = this.cadData.loanHolder['customerSubType'];
    }
    await this.getJointInfoData();
    this.fillform();
  }


  buildForm() {
    this.letterOfSetOff = this.formBuilder.group({
      date: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      district: [undefined],
      vdc: [undefined],
      wardNo: [undefined],
      age: [undefined],
      daughterName: [undefined],
      nameOfCustomer: [undefined],
      citizenshipNo: [undefined],
      dateOfIssue: [undefined],
      identifyIssuedDistrictName: [undefined],
      actDetails: [undefined],
      actYearFigure: [undefined],
      nameOfDepartment: [undefined],
      dateOfRegistration: [undefined],
      registrationNo: [undefined],
      nameOfUnit:  [undefined],
      grandDaughterName: [undefined],
      nameOfWife: [undefined],
      grandSonName: [undefined],
      sonName: [undefined],
      nameOfSon: [undefined],
      nameOfBorrower: [undefined],
      nameOfBranch: [undefined],
      sanctionLetterIssuedDate: [undefined],
      loanAmountFigure: [undefined],
      loanAmountWord: [undefined],
      accountNo: [undefined],
      nameOfTd: [undefined],
      fixedDeposit: [undefined],
      purposeOfLoan: [undefined],
      numberOfPerson: [undefined],
      sakshiDistrict1: [undefined],
      sakshiDistrict2: [undefined],
      sakshiMunicipality1: [undefined],
      sakshiMunicipality2: [undefined],
      sakshiWard1: [undefined],
      sakshiWard2: [undefined],
      sakshiAge1: [undefined],
      sakshiAge2: [undefined],
      sakshiName1: [undefined],
      sakshiName2: [undefined],
      nameOfBankStaff: [undefined],
      jointDetailsArr: this.formBuilder.array([]),
      tdHolderDetailsArray: this.formBuilder.array([]),
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
    if (!ObjectUtil.isEmpty(this.individualData) &&
        !ObjectUtil.isEmpty(this.individualData.issuedDate) &&
        !ObjectUtil.isEmpty(this.individualData.issuedDate.en)) {
      if (this.individualData.issuedDate.en === 'AD') {
        if (!ObjectUtil.isEmpty(this.individualData.citizenshipIssueDate)) {
          const convertedDate = this.datePipe.transform(this.individualData.citizenshipIssueDate.en);
          citizenshipIssuedDate = this.engToNepaliDate.transform(convertedDate, true);
        }
      } else {
        if (!ObjectUtil.isEmpty(this.individualData.citizenshipIssueDateNepali)) {
          citizenshipIssuedDate = this.individualData.citizenshipIssueDateNepali.en.nDate;
        }
      }
    }
    let age;
    if (!ObjectUtil.isEmpty(this.individualData) &&
        !ObjectUtil.isEmpty(this.individualData.dobDateType) &&
        !ObjectUtil.isEmpty(this.individualData.dobDateType.en)) {
      if (this.individualData.dobDateType.en === 'AD') {
        if (!ObjectUtil.isEmpty(this.individualData.dob)) {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.individualData.dob.en).toString());
        }
      } else {
        if (!ObjectUtil.isEmpty(this.individualData.dobNepali)) {
          age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(this.individualData.dobNepali.en.eDate).toString());
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
      this.setJointDetailsArr(this.selectiveArr);
    }
    this.checkOfferLetterData();
    let dateOfApproval;
    let combinedApprovalDate: any;
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      if (!ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm.sanctionLetterDateType)) {
        if (this.initialInformation.retailGlobalForm.sanctionLetterDateType === 'AD') {
          if (!ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm.sanctionLetterDateCT)) {
            combinedApprovalDate = 'ई. स. ' + this.initialInformation.retailGlobalForm.sanctionLetterDateCT;
          }
        }
        if (this.initialInformation.retailGlobalForm.sanctionLetterDateType === 'BS') {
          if (!ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm.sanctionLetterDateNepaliCT)) {
            combinedApprovalDate = 'वि.स ' + this.initialInformation.retailGlobalForm.sanctionLetterDateNepaliCT;
          }
        }
      }
      if (!ObjectUtil.isEmpty(this.educationalTemplateData)) {
        const selectedDateType = this.educationalTemplateData.dateOfApprovalType ? this.educationalTemplateData.dateOfApprovalType.en : '';
        if (selectedDateType === 'AD') {
          const tempData = this.datePipe.transform(this.educationalTemplateData.dateOfApproval.en);
          dateOfApproval = this.engToNepaliDate.transform(tempData, true);
        } else {
          dateOfApproval = this.educationalTemplateData.dateOfApprovalNepali.en.nDate;
        }
      }
    }
    if (!ObjectUtil.isEmpty(this.initialInformation.accountNumber)) {
      this.letterOfSetOff.get('accountNo').patchValue(this.initialInformation.accountNumber.ct);
    }
    if (!ObjectUtil.isEmpty(this.initialInformation.bankName)) {
      this.letterOfSetOff.get('nameOfTd').patchValue(this.initialInformation.bankName.ct);
    }
    if (!ObjectUtil.isEmpty(this.initialInformation.tenureDepositReceiptNumber)) {
      this.letterOfSetOff.get('fixedDeposit').patchValue(this.initialInformation.tenureDepositReceiptNumber.ct);
    }
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.offerDocumentList) &&
    !ObjectUtil.isEmpty(this.cadData.offerDocumentList[0])) {
      if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList[0].docName)) {
        this.documentName = this.cadData.offerDocumentList[0].docName;
      }
    }
    this.loanPurpose = this.getloanPurpose();
    this.letterOfSetOff.patchValue(
        {
          nameOfBranch: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.branch) &&
              !ObjectUtil.isEmpty(this.individualData.branch.ct)) ?
              this.individualData.branch.ct : '',
          grandFatherName: this.getGrandFatherName(),
          fatherName: this.getFatherName(),
          identifyIssuedDistrictName: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipIssueDistrict) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipIssueDistrict.ct)) ?
              this.individualData.citizenshipIssueDistrict.ct : '',
          dateOfIssue: citizenshipIssuedDate ? citizenshipIssuedDate : '',
          citizenshipNo: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipNo) &&
              !ObjectUtil.isEmpty(this.individualData.citizenshipNo.ct)) ?
              this.individualData.citizenshipNo.ct : '',
          wardNo: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.permanentWard) &&
              !ObjectUtil.isEmpty(this.individualData.permanentWard.ct)) ?
              this.individualData.permanentWard.ct : '',
          vdc: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.permanentMunicipality) &&
              !ObjectUtil.isEmpty(this.individualData.permanentMunicipality.ct)) ?
              this.individualData.permanentMunicipality.ct : '',
          district: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.permanentDistrict) &&
              !ObjectUtil.isEmpty(this.individualData.permanentDistrict.ct)) ?
              this.individualData.permanentDistrict.ct : '',
          nameOfCustomer: (!ObjectUtil.isEmpty(this.individualData) &&
              !ObjectUtil.isEmpty(this.individualData.name) &&
              !ObjectUtil.isEmpty(this.individualData.name.ct)) ?
              this.individualData.name.ct : '',
          age: age ? age : '',
          numberOfPerson: this.engToNepNumberPipe.transform(length.toString()) ? this.engToNepNumberPipe.transform(length.toString()) : '',
          loanAmountFigure: finalAmount,
          loanAmountWord: loanAmountWord,
          purposeOfLoan: (!ObjectUtil.isEmpty(this.documentName) && this.documentName === 'Combined Offer Letter' && !ObjectUtil.isEmpty(this.loanPurpose)) ?
              this.loanPurpose : this.educationalTemplateData ?
              this.educationalTemplateData.purposeOfLoan ?
                  this.educationalTemplateData.purposeOfLoan.ct : this.educationalTemplateData.purposeOfLoan.np : '',
          sanctionLetterIssuedDate: !ObjectUtil.isEmpty(dateOfApproval) ? dateOfApproval : !ObjectUtil.isEmpty(combinedApprovalDate) ? combinedApprovalDate : '',
        }
    );
    this.fillTDSakshiDetails();
  }
  getloanPurpose() {
    let loanPurpose: any;
    let loanCombinedPurpose: any;
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      if (!ObjectUtil.isEmpty(this.initialInformation.loanPurpose) &&
          !ObjectUtil.isEmpty(this.initialInformation.loanPurpose.ct)) {
        loanPurpose = this.initialInformation.loanPurpose.ct;
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.purposeofLoan) &&
          !ObjectUtil.isEmpty(this.initialInformation.purposeofLoan.ct)) {
        loanPurpose = this.initialInformation.purposeofLoan.ct;
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.purposeOfLoan) &&
          !ObjectUtil.isEmpty(this.initialInformation.purposeOfLoan.ct)) {
        loanPurpose = this.initialInformation.purposeOfLoan.ct;
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.vehicleName) &&
          !ObjectUtil.isEmpty(this.initialInformation.vehicleName.ct)) {
        loanPurpose = this.initialInformation.vehicleName.ct + ' नामको सवारी साधन एक थान व्यक्तिगत प्रयोजनका लागि खरिद';
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.loan) &&
          !ObjectUtil.isEmpty(this.initialInformation.loan.purposeOfLoanCT)) {
        loanPurpose = this.initialInformation.loan.purposeOfLoanCT;
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.existingLoanForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.existingLoanForm.existingLoanFormArray)) {
        this.initialInformation.existingLoanForm.existingLoanFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.existingLoanForm.existingLoanFormArray[i].purposeOfLoanCT);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.educationLoanForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.educationLoanForm.educationLoanCombinedFormArray)) {
        this.initialInformation.educationLoanForm.educationLoanCombinedFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.educationLoanForm.educationLoanCombinedFormArray[i].purposeOfLoanCT);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.personalOverdraftCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray)) {
        this.initialInformation.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray[i].purposeOfLoanCT);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.mortgageCombineForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.mortgageCombineForm.mortgageCombineLoanFormArray)) {
        this.initialInformation.mortgageCombineForm.mortgageCombineLoanFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.mortgageCombineForm.mortgageCombineLoanFormArray[i].purposeOfLoanCT);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.personalLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.personalLoanCombinedForm.personalLoanCombinedFormArray)) {
        this.initialInformation.personalLoanCombinedForm.personalLoanCombinedFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.personalLoanCombinedForm.personalLoanCombinedFormArray[i].purposeOfLoanCT);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.autoLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.autoLoanCombinedForm.autoLoanCombinedFormArray)) {
        this.initialInformation.autoLoanCombinedForm.autoLoanCombinedFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.autoLoanCombinedForm.autoLoanCombinedFormArray[i].purposeOfLoanCT);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.homeLoanCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.homeLoanCombinedForm.homeLoanCombinedFormArray)) {
        this.initialInformation.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.homeLoanCombinedForm.homeLoanCombinedFormArray[i].purposeOfLoanCT);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.personalOverDraftWithoutCollateralCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray)) {
        this.initialInformation.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray[i].purposeOfLoanCT);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.nabilSahayatriCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray)) {
        this.initialInformation.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray[i].purposeOfLoanCT);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.nabilShareLoanPODForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.nabilShareLoanPODForm.nabilShareLoanPODFormArray)) {
        this.initialInformation.nabilShareLoanPODForm.nabilShareLoanPODFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.nabilShareLoanPODForm.nabilShareLoanPODFormArray[i].purposeOfLoanCT);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation.shareLoanDemandCombinedForm) &&
          !ObjectUtil.isEmpty(this.initialInformation.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray)) {
        this.initialInformation.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.forEach((val, i) => {
          this.loanPurposeArray.push(this.initialInformation.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray[i].purposeOfLoanCT);
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
  fillTDSakshiDetails() {
    if (this.cadData.cadFileList.length > 0) {
      if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            this.cadInitialInfo = JSON.parse(singleCadFile.supportedInformation);
          }
        });
        const free = this.letterOfSetOff.value;
        if (!ObjectUtil.isEmpty(this.cadInitialInfo)) {
          if (!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText)) {
            this.letterOfSetOff.get('date').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.date) ?
                this.cadInitialInfo.sakshiFreeText.date : '');
            this.letterOfSetOff.get('fixedDeposit').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.fixedDeposit) ?
                this.cadInitialInfo.sakshiFreeText.fixedDeposit : '');
            this.letterOfSetOff.get('accountNo').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.accountNo) ?
                this.cadInitialInfo.sakshiFreeText.accountNo : '');
            this.letterOfSetOff.get('nameOfTd').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.nameOfTd) ?
                this.cadInitialInfo.sakshiFreeText.nameOfTd : '');
            this.letterOfSetOff.get('sakshiDistrict1').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.sakshiDistrict1) ?
                this.cadInitialInfo.sakshiFreeText.sakshiDistrict1 : '');
            this.letterOfSetOff.get('sakshiDistrict2').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.sakshiDistrict2) ?
                this.cadInitialInfo.sakshiFreeText.sakshiDistrict2 : '');
            this.letterOfSetOff.get('sakshiMunicipality1').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.sakshiMunicipality1) ?
                this.cadInitialInfo.sakshiFreeText.sakshiMunicipality1 : '');
            this.letterOfSetOff.get('sakshiMunicipality2').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.sakshiMunicipality2) ?
                this.cadInitialInfo.sakshiFreeText.sakshiMunicipality2 : '');
            this.letterOfSetOff.get('sakshiAge1').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.sakshiAge1) ?
                this.cadInitialInfo.sakshiFreeText.sakshiAge1 : '');
            this.letterOfSetOff.get('sakshiAge2').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.sakshiAge2) ?
                this.cadInitialInfo.sakshiFreeText.sakshiAge2 : '');
            this.letterOfSetOff.get('sakshiWard1').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.sakshiWard1) ?
                this.cadInitialInfo.sakshiFreeText.sakshiWard1 : '');
            this.letterOfSetOff.get('sakshiWard2').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.sakshiWard2) ?
                this.cadInitialInfo.sakshiFreeText.sakshiWard2 : '');
            this.letterOfSetOff.get('sakshiName1').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.sakshiName1) ?
                this.cadInitialInfo.sakshiFreeText.sakshiName1 : '');
            this.letterOfSetOff.get('sakshiName2').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.sakshiName2) ?
                this.cadInitialInfo.sakshiFreeText.sakshiName2 : '');
            this.letterOfSetOff.get('nameOfBankStaff').patchValue(!ObjectUtil.isEmpty(this.cadInitialInfo.sakshiFreeText.nameOfBankStaff) ?
                this.cadInitialInfo.sakshiFreeText.nameOfBankStaff : '');
          }
          if (!ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails) &&
          this.cadInitialInfo.tdDetails.length > 0) {
            for (let i = 0; i < this.cadInitialInfo.tdDetails.length; i ++) {
              this.setTdHolderArray();
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'grandFatherName']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].grandFatherName) ?
                  this.cadInitialInfo.tdDetails[i].grandFatherName : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'grandRelation']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].grandRelation) ?
                  this.cadInitialInfo.tdDetails[i].grandRelation : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'fatherName']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].fatherName) ?
                  this.cadInitialInfo.tdDetails[i].fatherName : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'fatherRelation']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].fatherRelation) ?
                  this.cadInitialInfo.tdDetails[i].fatherRelation : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'vdcMunicipalityOption']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].vdcMunicipalityOption) ?
                  this.cadInitialInfo.tdDetails[i].vdcMunicipalityOption : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'district']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].district) ?
                  this.cadInitialInfo.tdDetails[i].district : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'municipality']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].municipality) ?
                  this.cadInitialInfo.tdDetails[i].municipality : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'wardNumber']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].wardNumber) ?
                  this.cadInitialInfo.tdDetails[i].wardNumber : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'age']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].age) ?
                  this.cadInitialInfo.tdDetails[i].age : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'customerType']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].customerType) ?
                  this.cadInitialInfo.tdDetails[i].customerType : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'nameOfPerson']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].nameOfPerson) ?
                  this.cadInitialInfo.tdDetails[i].nameOfPerson : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'citizenshipNumber']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].citizenshipNumber) ?
                  this.cadInitialInfo.tdDetails[i].citizenshipNumber : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'issueDate']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].issueDate) ?
                  this.cadInitialInfo.tdDetails[i].issueDate : '');
              this.letterOfSetOff.get(['tdHolderDetailsArray', i, 'issuedDistrict']).patchValue(
                  !ObjectUtil.isEmpty(this.cadInitialInfo.tdDetails[i].issuedDistrict) ?
                  this.cadInitialInfo.tdDetails[i].issuedDistrict : '');
            }
          }
        }
      }
    }
  }

  getGrandFatherName() {
    let grandFatherName;
    if (!ObjectUtil.isEmpty(this.individualData) && !ObjectUtil.isEmpty(this.individualData.gender) &&
        !ObjectUtil.isEmpty(this.individualData.gender.en)) {
      if (this.individualData.gender.en === 'MALE') {
        if (!ObjectUtil.isEmpty(this.individualData.grandFatherName)) {
          grandFatherName = !ObjectUtil.isEmpty(this.individualData.grandFatherName) &&
          !ObjectUtil.isEmpty(this.individualData.grandFatherName.ct) ? this.individualData.grandFatherName.ct : '';
        }
      }
      if (!ObjectUtil.isEmpty(this.individualData.relationMedium) && !ObjectUtil.isEmpty(this.individualData.relationMedium.en)) {
        if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '0') {
          grandFatherName = !ObjectUtil.isEmpty(this.individualData.fatherInLawName) &&
          !ObjectUtil.isEmpty(this.individualData.fatherInLawName.ct) ? this.individualData.fatherInLawName.ct : '';
        }
        if (this.individualData.gender.en === 'FEMALE' && this.individualData.relationMedium.en === '1') {
          grandFatherName = !ObjectUtil.isEmpty(this.individualData.grandFatherName) &&
          !ObjectUtil.isEmpty(this.individualData.grandFatherName.ct) ? this.individualData.grandFatherName.ct : '';
        }
      }
    }
    return grandFatherName;
  }

  getFatherName() {
    let fatherName;
    if (!ObjectUtil.isEmpty(this.individualData) &&
        !ObjectUtil.isEmpty(this.individualData.gender) &&
        !ObjectUtil.isEmpty(this.individualData.gender.en)) {
      if (this.individualData.gender.en === 'MALE') {
        fatherName = !ObjectUtil.isEmpty(this.individualData.fatherName) &&
        !ObjectUtil.isEmpty(this.individualData.fatherName.ct) ? this.individualData.fatherName.ct : '';
      }
      if (this.individualData.gender.en === 'FEMALE') {
        if (!ObjectUtil.isEmpty(this.individualData.relationMedium) && !ObjectUtil.isEmpty(this.individualData.relationMedium.en)) {
          if (this.individualData.relationMedium.en === '0') {
            fatherName = !ObjectUtil.isEmpty(this.individualData.husbandName) &&
            !ObjectUtil.isEmpty(this.individualData.husbandName.ct) ? this.individualData.husbandName.ct : '';
          }
          if (this.individualData.relationMedium.en === '1') {
            fatherName = !ObjectUtil.isEmpty(this.individualData.fatherName) &&
            !ObjectUtil.isEmpty(this.individualData.fatherName.ct) ? this.individualData.fatherName.ct : '';
          }
        }
      }
    }
    return fatherName;
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
    this.spinner = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        // cadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
        this.initialInfoPrint = cadFile.supportedInformation;
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      // cadFile.initialInformation = JSON.stringify(this.letterOfSetOff.value);
      this.initialInfoPrint = cadFile.supportedInformation;
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.spinner = false;
      this.dialogRef.close();
    });
  }
  setTdHolderArray() {
      (this.letterOfSetOff.get('tdHolderDetailsArray') as FormArray).push(
          this.formBuilder.group({
            grandFatherName: [undefined],
            grandRelation: [undefined],
            fatherName: [undefined],
            fatherRelation: [undefined],
            vdcMunicipalityOption: [undefined],
            district: [undefined],
            municipality: [undefined],
            wardNumber: [undefined],
            age: [undefined],
            customerType: [undefined],
            nameOfPerson: [undefined],
            citizenshipNumber: [undefined],
            issueDateType: [undefined],
            issueDate: [undefined],
            issueDateNepali: [undefined],
            issuedDistrict: [undefined]
          })
      );
  }
  removeAtIndex(i: number) {
    (this.letterOfSetOff.get('tdHolderDetailsArray') as FormArray).removeAt(i);
  }

  setFreeText() {
    let tempFreeText: any;
    const freeArray: any = [];
    const free = this.letterOfSetOff.value;
    for (let val = 0; val < free.tdHolderDetailsArray.length; val++) {
      tempFreeText = {
        grandFatherName: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'grandFatherName']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'grandFatherName']).value : '',
        grandRelation: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'grandRelation']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'grandRelation']).value : '',
        fatherName: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'fatherName']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'fatherName']).value : '',
        fatherRelation: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'fatherRelation']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'fatherRelation']).value : '',
        district: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'district']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'district']).value : '',
        vdcMunicipalityOption: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'vdcMunicipalityOption']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'vdcMunicipalityOption']).value : '',
        municipality: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'municipality']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'municipality']).value : '',
        wardNumber: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'wardNumber']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'wardNumber']).value : '',
        age: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'age']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'age']).value : '',
        customerType: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'customerType']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'customerType']).value : '',
        nameOfPerson: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'nameOfPerson']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'nameOfPerson']).value : '',
        citizenshipNumber: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'citizenshipNumber']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'citizenshipNumber']).value : '',
        issueDateType: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'issueDateType']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'issueDateType']).value : '',
        issueDate: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'issueDate']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'issueDate']).value : '',
        issueDateNepali: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'issueDateNepali']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'issueDateNepali']).value : '',
        issuedDistrict: this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'issuedDistrict']) ?
            this.letterOfSetOff.get(['tdHolderDetailsArray', val, 'issuedDistrict']).value : '',
      };
      freeArray.push(tempFreeText);
    }
      const tempSakshi = {
        date: this.letterOfSetOff.get('date').value ?
            this.letterOfSetOff.get('date').value : '',
        fixedDeposit: this.letterOfSetOff.get('fixedDeposit').value ?
            this.letterOfSetOff.get('fixedDeposit').value : '',
        accountNo: this.letterOfSetOff.get('accountNo').value ?
            this.letterOfSetOff.get('accountNo').value : '',
        nameOfTd: this.letterOfSetOff.get('nameOfTd').value ?
            this.letterOfSetOff.get('nameOfTd').value : '',
        sakshiDistrict1: this.letterOfSetOff.get('sakshiDistrict1').value ?
            this.letterOfSetOff.get('sakshiDistrict1').value : '',
        sakshiDistrict2: this.letterOfSetOff.get('sakshiDistrict2').value ?
            this.letterOfSetOff.get('sakshiDistrict2').value : '',
        sakshiMunicipality1: this.letterOfSetOff.get('sakshiMunicipality1').value ?
            this.letterOfSetOff.get('sakshiMunicipality1').value : '',
        sakshiMunicipality2: this.letterOfSetOff.get('sakshiMunicipality2').value ?
            this.letterOfSetOff.get('sakshiMunicipality2').value : '',
        sakshiWard1: this.letterOfSetOff.get('sakshiWard1').value ?
            this.letterOfSetOff.get('sakshiWard1').value : '',
        sakshiWard2: this.letterOfSetOff.get('sakshiWard2').value ?
            this.letterOfSetOff.get('sakshiWard2').value : '',
        sakshiAge1: this.letterOfSetOff.get('sakshiAge1').value ?
            this.letterOfSetOff.get('sakshiAge1').value : '',
        sakshiAge2: this.letterOfSetOff.get('sakshiAge2').value ?
            this.letterOfSetOff.get('sakshiAge2').value : '',
        sakshiName1: this.letterOfSetOff.get('sakshiName1').value ?
            this.letterOfSetOff.get('sakshiName1').value : '',
        sakshiName2: this.letterOfSetOff.get('sakshiName2').value ?
            this.letterOfSetOff.get('sakshiName2').value : '',
        nameOfBankStaff: this.letterOfSetOff.get('nameOfBankStaff').value ?
            this.letterOfSetOff.get('nameOfBankStaff').value : '',
      };
      const freeTextJson = {
        tdDetails: freeArray ? freeArray : '',
        sakshiFreeText: tempSakshi ? tempSakshi : ''
      };
      this.freeText = freeTextJson;
    return JSON.stringify(this.freeText);
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.letterOfSetOff.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.letterOfSetOff.get(wordLabel).patchValue(returnVal);
  }

  buildJointDetailsArr() {
    return this.formBuilder.group({
      nameofGrandFatherJoint : [undefined],
      nameofFatherJoint : [undefined],
      districtJoint : [undefined],
      vdcJoint : [undefined],
      wardNoJoint : [undefined],
      ageJoint : [undefined],
      nameofPersonJoint : [undefined],
      citizenshipNoJoint : [undefined],
      dateofIssueJoint : [undefined],
      nameofIssuedDistrictJoint : [undefined],
    });
  }

  setJointDetailsArr(data) {
    const formArray = (this.letterOfSetOff.get('jointDetailsArr') as FormArray);
    if (ObjectUtil.isEmpty(data)) {
      return;
    }
    data.forEach(value => {
      const nepData = value;
      let age;
      if (!ObjectUtil.isEmpty(nepData.dob) && !ObjectUtil.isEmpty(nepData.dob.en.eDate)) {
        const calAge = AgeCalculation.calculateAge(nepData.dob.en.eDate);
        age = this.ageCalculation(nepData.dob.en.eDate);
      } else {
        age = this.ageCalculation(nepData.dob.en);
      }
      let citizenshipIssuedDate;
      if (!ObjectUtil.isEmpty(nepData.citizenshipIssueDate.en.nDate)) {
        citizenshipIssuedDate = nepData.citizenshipIssueDate.en.nDate;
      } else {
        const convertedDate = this.datePipe.transform(nepData.citizenshipIssueDate.en);
        citizenshipIssuedDate = this.engToNepaliDate.transform(convertedDate, true);
      }
      formArray.push(this.formBuilder.group({
        nameofGrandFatherJoint : [nepData.grandFatherName ?
            nepData.grandFatherName.ct :
            nepData.fatherInLawName ? nepData.fatherInLawName.ct : ''],
        nameofFatherJoint : [ nepData.fatherName ?
            nepData.fatherName.ct :
            nepData.husbandName ? nepData.husbandName.ct : ''],
        districtJoint : [nepData.permanentDistrict ? nepData.permanentDistrict.ct : ''],
        vdcJoint : [nepData.permanentMunicipality ? nepData.permanentMunicipality.ct : ''],
        wardNoJoint : [nepData.permanentWard ? nepData.permanentWard.ct : ''],
        ageJoint : [age ? age : ''],
        nameofPersonJoint : [nepData.name ? nepData.name.ct : ''],
        citizenshipNoJoint : [nepData.citizenNumber ? nepData.citizenNumber.ct : ''],
        dateofIssueJoint : [citizenshipIssuedDate ? citizenshipIssuedDate : ''],
        nameofIssuedDistrictJoint : [nepData.citizenshipIssueDistrict ? nepData.citizenshipIssueDistrict.en.nepaliName : ''],
      }));
    });
  }

  checkOfferLetterData() {
    if (this.cadData.offerDocumentList.length > 0) {
      let documentName;
      this.cadData.offerDocumentList.filter((document: OfferDocument) => {
        documentName = document.docName;
        this.offerLetterDocument = document;
      });
      if (documentName === 'Educational Loan') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData;
        }
      }
      if (documentName === 'Personal Overdraft') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData;
        }
      }
      if (documentName === 'Personal Loan') {
        if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
          const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
          this.educationalTemplateData = educationalOfferData;
        }
      }
      // this.offerLetterDocument = this.cadData.offerDocumentList.filter(value => value.docName.toString() === this.offerDocumentChecklist.value(this.offerDocumentChecklist.EDUCATIONAL).toString())[0];
      // if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
      //   const educationalOfferData = JSON.parse(this.offerLetterDocument.initialInformation);
      //   this.educationalTemplateData = educationalOfferData;
      // }
    }
  }

  async getJointInfoData() {
    if (this.cadData.loanHolder.customerType === this.customerType.INDIVIDUAL
        && this.clientType === this.customerSubType.JOINT.toUpperCase()) {
      const associateId = this.cadData.loanHolder.associateId;
      await this.customerService.getJointInfoDetails(associateId).toPromise().then((res: any) => {
        this.jointInfoData = JSON.parse(res.detail.jointInfo);
      }, error => {
        console.error(error);
      });
    }
  }
}

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
import {AgeCalculation} from '../../../../../@core/age-calculation';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {ProposalCalculationUtils} from '../../../../loan/component/loan-summary/ProposalCalculationUtils';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliNumberAndWords} from '../../../model/nepaliNumberAndWords';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerType} from '../../../../customer/model/customerType';
import {CustomerSubType} from '../../../../customer/model/customerSubType';
import {CustomerService} from '../../../../customer/service/customer.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-loan-deed-individual',
  templateUrl: './loan-deed-individual.component.html',
  styleUrls: ['./loan-deed-individual.component.scss'],
})
export class LoanDeedIndividualComponent implements OnInit {
  loanDeedIndividual: FormGroup;
  loanHolderNepData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  initialInfoPrint;
  initialInfo;
  supportedInfo;
  loanName: Array<any> = new Array<any>();
  primarySecurityTypeCheck = false;
  secondarySecurityTypeCheck = false;
  eduSecurityTypeCheck = false;
  homeSecurityTypeCheck = false;
  tempPrimarySecurity: any = [];
  tempSecondarySecurity: any = [];
  newData;
  newTempData: Array<any> = new Array<any>();
  offerLetterConst = NabilDocumentChecklist;
  offerDocumentDetails: any;
  nepaliNumber = new NepaliNumberAndWords();
  educationInterestRate: any;
  offerLetterAdminFee: any;
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  initialInformation: any;
  expiryDate: string;
  customerType = CustomerType;
  clientType;
  customerSubType = CustomerSubType;
  spinner = false;
  docName: any;
  jointInfoData;
  selectiveArr = [];
  numberOfJointCustomer;
  purposeOfLoan: any;
  expiryDateOd: string;
  offerLoanType;
  expDate;
  freeText: Array<any> = new Array<any>();

  constructor(
    private formBuilder: FormBuilder,
    private administrationService: CreditAdministrationService,
    private toastService: ToastService,
    private engToNepNumberPipe: EngToNepaliNumberPipe,
    private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
    private routerUtilsService: RouterUtilsService,
    private englishNepaliDatePipe: EngNepDatePipe,
    private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
    private currencyFormatPipe: CurrencyFormatterPipe,
    private customerService: CustomerService,
    public datePipe: DatePipe
  ) {}

  async ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData)) {
      this.cadData.offerDocumentList.forEach((offerDocument: OfferDocument) => {
        this.initialInformation = JSON.parse(offerDocument.initialInformation);
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.loanHolderNepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.clientType = this.cadData.loanHolder['customerSubType'];
    }
    this.getLoanDetails();
    await this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) &&
      !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach((individualCadFile) => {
        if (individualCadFile.customerLoanId === this.customerLoanId &&
          individualCadFile.cadDocument.id === this.documentId && !ObjectUtil.isEmpty(individualCadFile.initialInformation)) {
          const initialInfo = JSON.parse(individualCadFile.initialInformation);
          this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
          this.initialInfoPrint = initialInfo;
          this.loanDeedIndividual.patchValue(initialInfo);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.loanHolderNepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.clientType = this.cadData.loanHolder['customerSubType'];
    }
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
        this.offerDocumentDetails = this.cadData.offerDocumentList[0] ? JSON.parse(this.cadData.offerDocumentList[0].initialInformation) : '';
    }
    if (this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy' ||
        this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter' ||
        this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
      this.primarySecurityCheck();
      this.secondarySecurityCheck();
    }
    if (this.cadData.offerDocumentList[0].docName === 'Home Loan') {
      this.homeSecurityCheck();
    }
    if (this.cadData.offerDocumentList[0].docName === 'Educational Loan' ||
        this.cadData.offerDocumentList[0].docName === 'Personal Overdraft' ||
        this.cadData.offerDocumentList[0].docName === 'Mortage Loan') {
      this.eduSecurityCheck();
    }
    this.calulation();
    if (!ObjectUtil.isEmpty(this.cadData.offerDocumentList.length > 0)) {
      this.setLoanExpiryDate();
    }
  }

  setCombinedFreeText() {
    for (let i = 0; i < this.newTempData.length; i++) {
      const tempFreeText = {
        dateOfExpiry: this.loanDeedIndividual.get(['loanDeedIndividuals', 0, 'combinedFreeText', i, 'dateOfExpiry']) ?
            this.loanDeedIndividual.get(['loanDeedIndividuals', 0, 'combinedFreeText', i, 'dateOfExpiry']).value : ''
      };
      this.freeText.push(tempFreeText);
    }
    const free1 = {
      // dateOfExpirySingle: this.loanDeedIndividual.get('expiryDate') ? this.loanDeedIndividual.get('expiryDate').value : '',
      combinedFreeText: this.freeText
    };
    return JSON.stringify(free1);
  }

  calulation() {
    if (ObjectUtil.isEmpty(this.cadData.nepData)) {
        const number = ProposalCalculationUtils.calculateTotalFromProposalListKey(this.cadData.assignedLoan);
        this.nepaliNumber.numberNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(number));
        this.nepaliNumber.nepaliWords = this.nepaliCurrencyWordPipe.transform(number);
        this.nepaliNumber.engNumber = number;
    }
  }

  async buildForm() {
    this.loanDeedIndividual = this.formBuilder.group({
      loanDeedIndividuals: this.formBuilder.array([]),
    });
    await this.getJointInfoData();
    this.addIndividualLoandeedForm();
  }

  initIndividualLoandeed() {
    let todayDate: any = this.englishNepaliDatePipe.transform(new Date(), true);
    todayDate = todayDate.replace(',', '').split(' ');
    const daysInNumber = new Date().getDay();
    let age: any;
    let ageNepaliNumber: string;
    if (!ObjectUtil.isEmpty(this.loanHolderNepData) &&
        !ObjectUtil.isEmpty(this.loanHolderNepData.dobDateType) &&
        !ObjectUtil.isEmpty(this.loanHolderNepData.dobDateType.en)) {
      if (this.loanHolderNepData.dobDateType.en === 'AD') {
        if (!ObjectUtil.isEmpty(this.loanHolderNepData.dob)) {
          age = AgeCalculation.calculateAge(this.loanHolderNepData.dob.en).toString();
        }
      } else {
        if (!ObjectUtil.isEmpty(this.loanHolderNepData.dobNepali)) {
          age = AgeCalculation.calculateAge(this.loanHolderNepData.dobNepali.en.eDate).toString();
        }
      }
      ageNepaliNumber = this.engToNepNumberPipe.transform(String(age));
    }

    let approvedDate: any;
    let approvedDateFinal: any;
    this.docName = this.cadData.offerDocumentList ? this.cadData.offerDocumentList[0].docName : '';
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && (!ObjectUtil.isEmpty(this.offerDocumentDetails.dateOfApproval) ||
        !ObjectUtil.isEmpty(this.offerDocumentDetails.dateofApproval))) {
      // tslint:disable-next-line:max-line-length
      // approvedDate = this.offerDocumentDetails.dateOfApproval && this.offerDocumentDetails.dateOfApproval.en.eDate ? this.offerDocumentDetails.dateOfApproval.en.eDate : this.offerDocumentDetails.dateOfApproval && this.offerDocumentDetails.dateOfApproval.en ? this.offerDocumentDetails.dateOfApproval.en : '';
      if ((this.offerDocumentDetails.dateOfApprovalType ? this.offerDocumentDetails.dateOfApprovalType.en : '') === 'AD') {
        // tslint:disable-next-line:max-line-length
        approvedDate = this.offerDocumentDetails.dateOfApproval ? this.offerDocumentDetails.dateOfApproval.ct : '';
      } else {
        approvedDate = this.offerDocumentDetails.dateOfApprovalNepali ? this.offerDocumentDetails.dateOfApprovalNepali.ct : '';
      }
    }
    if (this.docName === 'Home Loan') {
      if (this.offerDocumentDetails.loan.dateType === 'AD') {
        approvedDateFinal = this.offerDocumentDetails.loan.dateOfApproval ? this.offerDocumentDetails.loan.dateOfApproval : '';
        approvedDate = this.englishNepaliDatePipe.transform(approvedDateFinal || '', true);
      }
      if (this.offerDocumentDetails.loan.dateType === 'BS') {
        approvedDate = this.offerDocumentDetails.loan.nepaliDateOfApproval.eDate;
      }
    }
    if (this.docName === 'DDSL Without Subsidy') {
      const dateOfApproval = !ObjectUtil.isEmpty(this.offerDocumentDetails.sanctionLetterDateType) ? this.offerDocumentDetails.sanctionLetterDateType.en : '';
      if (dateOfApproval === 'AD') {
        approvedDate = this.offerDocumentDetails.sanctionLetterDate ? this.offerDocumentDetails.sanctionLetterDate.ct : '';
      } else {
        approvedDate = this.offerDocumentDetails.sanctionLetterDateNepali ? this.offerDocumentDetails.sanctionLetterDateNepali.ct : '';
      }
    }
    // tslint:disable-next-line:max-line-length
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Interest subsidy sanction letter') {
      this.purposeOfLoan = this.offerDocumentDetails.purposeOfLoan ? this.offerDocumentDetails.purposeOfLoan.ct : '';
      this.educationInterestRate = this.offerDocumentDetails.interestRate ? this.offerDocumentDetails.interestRate.en : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Educational Loan') {
        this.offerLetterAdminFee = this.offerDocumentDetails.loanAdminFeeFigure ? this.offerDocumentDetails.loanAdminFeeFigure.en : '';
        this.educationInterestRate = this.offerDocumentDetails.interestRate ? this.offerDocumentDetails.interestRate.en : '';
        this.purposeOfLoan = this.offerDocumentDetails.purposeOfLoan.ct ? this.offerDocumentDetails.purposeOfLoan.ct : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Personal Overdraft') {
      this.offerLetterAdminFee = this.offerDocumentDetails.loanadminFee ? this.offerDocumentDetails.loanadminFee.en : '';
      this.educationInterestRate = this.offerDocumentDetails.yearlyInterestRate ? this.offerDocumentDetails.yearlyInterestRate.en : '';
      this.purposeOfLoan = this.offerDocumentDetails.purposeOfLoan.ct ? this.offerDocumentDetails.purposeOfLoan.ct : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Personal Loan') {
      this.offerLetterAdminFee = this.offerDocumentDetails.loanAdminFee ? this.offerDocumentDetails.loanAdminFee.en : '';
      this.educationInterestRate = this.offerDocumentDetails.yearlyFloatingInterestRate ?
          this.offerDocumentDetails.yearlyFloatingInterestRate.en : '';
      this.purposeOfLoan = this.offerDocumentDetails.purposeOfLoan.ct ? this.offerDocumentDetails.purposeOfLoan.ct : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Auto Loan') {
      this.offerLetterAdminFee = this.offerDocumentDetails.loanAdminFee ? this.offerDocumentDetails.loanAdminFee.en : '';
      this.educationInterestRate = this.offerDocumentDetails.yearlyInterestRate ? this.offerDocumentDetails.yearlyInterestRate.en : '';
      this.purposeOfLoan = this.offerDocumentDetails.vehicleName ? this.offerDocumentDetails.vehicleName.ct + 'नामको सवारी साधन एक थान व्यक्तिगत प्रयोजनका लागि खरिद गर्ने' : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Mortage Loan') {
      this.offerLetterAdminFee = this.offerDocumentDetails.loanAdminFeeInFigure ? this.offerDocumentDetails.loanAdminFeeInFigure.en : '';
      this.educationInterestRate = this.offerDocumentDetails.interestRate ? this.offerDocumentDetails.interestRate.en : '';
      this.purposeOfLoan = this.offerDocumentDetails.loanPurpose ? this.offerDocumentDetails.loanPurpose.ct : '';
    }
    let bankName;
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Home Loan') {
      this.offerLetterAdminFee = this.offerDocumentDetails.loan.loanAdminFeeInFigure ? this.offerDocumentDetails.loan.loanAdminFeeInFigure : '';
      this.educationInterestRate = this.offerDocumentDetails.loan.interestRate ? this.offerDocumentDetails.loan.interestRate : '';
      this.purposeOfLoan = this.offerDocumentDetails.loan.purposeOfLoanCT ? this.offerDocumentDetails.loan.purposeOfLoanCT : '';
      this.offerLoanType = this.offerDocumentDetails.loanType ? this.offerDocumentDetails.loanType : '';
      bankName = this.offerDocumentDetails.loan.nameOfBankCT ? this.offerDocumentDetails.loan.nameOfBankCT : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Udyamsil Karja Subsidy') {
      this.offerLetterAdminFee = this.offerDocumentDetails.serviceCharge ? this.offerDocumentDetails.serviceCharge.en : '';
      this.educationInterestRate = this.offerDocumentDetails.interestRate ? this.offerDocumentDetails.interestRate.en : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Personal loan and personal overdraft') {
      this.purposeOfLoan = this.offerDocumentDetails.purposeofLoan.ct ? this.offerDocumentDetails.purposeofLoan.ct : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'Personal overdraft without collateral') {
      this.purposeOfLoan = this.offerDocumentDetails.purposeOfLoan.ct ? this.offerDocumentDetails.purposeOfLoan.ct : '';
      this.offerLetterAdminFee = this.offerDocumentDetails.loanadminFee ? this.offerDocumentDetails.loanadminFee.en : '';
      this.educationInterestRate = this.offerDocumentDetails.yearlyInterestRate ? this.offerDocumentDetails.yearlyInterestRate.en : '';
    }
    if (!ObjectUtil.isEmpty(this.offerDocumentDetails) && this.cadData.offerDocumentList[0].docName === 'DDSL Without Subsidy') {
      this.purposeOfLoan = this.offerDocumentDetails.purposeOfLoan ? this.offerDocumentDetails.purposeOfLoan.ct : '';
      this.educationInterestRate = this.offerDocumentDetails.interestRate ? this.offerDocumentDetails.interestRate.en : '';
    }
    return this.formBuilder.group({
      branchName: [
        this.loanHolderNepData.branch ? this.loanHolderNepData.branch.ct : '',
      ],
      grandFatherName: [this.getGrandFatherName()],
      father_husbandName: [this.getFatherName()],
      district: [
        this.loanHolderNepData.permanentDistrict
          ? this.loanHolderNepData.permanentDistrict.ct
          : '',
      ],
      municipality: [
          this.loanHolderNepData.permanentMunicipality ? this.loanHolderNepData.permanentMunicipality.ct : '',
        ],
      wardNo: [this.loanHolderNepData.permanentWard ? this.loanHolderNepData.permanentWard.ct : ''],
      borrowerName: [this.loanHolderNepData.name ? this.loanHolderNepData.name.ct : ''],
      name: [undefined],
      permanentdistrict: [undefined],
      permanentMunicipality: [undefined],
      placeName: [undefined],
      fatherInLawName: [undefined],
      husbandName: [undefined],
      age: [ageNepaliNumber],
      issueDate: [approvedDate ? approvedDate : ''],
      facilityName: [undefined],
      loanAmount: [undefined],
      Interest: [undefined],
      expiryDate: [undefined],
      expiryDateOd: [undefined],
      totalLoanAmount: [this.nepaliNumber.numberNepali],
      totalLoanAmountWord: ['रु. ' + this.nepaliNumber.nepaliWords],
      propertyOwnerName: [undefined],
      plotNo: [undefined],
      area: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      // time: [this.engToNepNumberPipe.transform(String(daysInNumber + 1))],
      time: [undefined],
      propertyOwnerName1: [undefined],
      district1: [undefined],
      municipality1: [undefined],
      wardNo1: [undefined],
      plotNo1: [undefined],
      area1: [undefined],
      propertyOwnerName2: [undefined],
      district2: [undefined],
      municipality2: [undefined],
      wardNo2: [undefined],
      plotNo2: [undefined],
      area2: [undefined],
      freeText: [undefined],
      totalPeople: [this.numberOfJointCustomer ? this.numberOfJointCustomer : ''],
      purposeOfLoan: [this.purposeOfLoan ? this.purposeOfLoan : ''],
      loanDeedJoint: this.formBuilder.array([]),
      combinedFreeText: this.formBuilder.array([]),
      nameOfBank: [bankName ? bankName : ''],
    });
  }

  combinedFree() {
    return this.formBuilder.group({
      dateOfExpiry: [undefined]
    });
  }

  addCombinedFreeText() {
     const tempArray = (this.loanDeedIndividual.get(['loanDeedIndividuals', 0, 'combinedFreeText']) as FormArray);
     tempArray.push(this.combinedFree());
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

  addIndividualLoandeedForm() {
    this.numberOfJointCustomer = this.engToNepNumberPipe.transform('1');
    (this.loanDeedIndividual.get('loanDeedIndividuals') as FormArray).push(
      this.initIndividualLoandeed()
    );
    this.addIndividualJointData();
  }

  addIndividualJointData() {
    if (!ObjectUtil.isEmpty(this.jointInfoData)) {
      length = this.jointInfoData.length;
      this.jointInfoData.forEach(value => {
        if (!ObjectUtil.isEmpty(value.nepData)) {
          const nep = JSON.parse(value.nepData);
          this.selectiveArr.push(nep);
        }
      });
      this.numberOfJointCustomer = this.engToNepNumberPipe.transform((this.jointInfoData.length).toString());
      this.loanDeedIndividual.get(['loanDeedIndividuals', 0, 'totalPeople']).patchValue(this.numberOfJointCustomer);
      this.setJointDetailsArr(this.selectiveArr);
    }
  }

  convertNepaliNumberAmount(value) {
    return this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(value));
  }

  convertNepaliNumber(value) {
    return this.engToNepNumberPipe.transform(String(value));
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach((individualCadFile) => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
          individualCadFile.supportedInformation = this.setCombinedFreeText();
          individualCadFile.initialInformation = JSON.stringify(
            this.loanDeedIndividual.value
          );
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.supportedInformation = this.setCombinedFreeText();
        cadFile.initialInformation = JSON.stringify(
          this.loanDeedIndividual.value
        );
        this.initialInfoPrint = cadFile.initialInformation;
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(
        this.loanDeedIndividual.value
      );
      this.initialInfoPrint = cadFile.initialInformation;
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(
      () => {
        this.toastService.show(
          new Alert(AlertType.SUCCESS, 'Successfully saved ')
        );
        this.dialogRef.close();
        this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
      },
      (error) => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
        this.dialogRef.close();
      }
    );
  }

  private setLoanExpiryDate(): void {
    this.cadData.offerDocumentList.forEach((offerDocument: OfferDocument, index: number) => {
      const initialInformation = JSON.parse(offerDocument.initialInformation);
      const docName = offerDocument.docName;
      if (docName === 'Personal Loan') {
        this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
            .patchValue('मासिक किस्ता सूरु भएको मितिले ' + initialInformation.loanPeriodInMonth.ct + ' महिना सम्म ।');
        this.expiryDate = 'मासिक किस्ता सूरु भएको मितिले ' + initialInformation.loanPeriodInMonth.ct + ' महिना सम्म ।';
      }
      if (docName === 'Personal Overdraft') {
        if (initialInformation.dateOfExpiryType.en === 'AD') {
          this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
              .patchValue(this.englishNepaliDatePipe.transform(initialInformation.dateofExpiry.en, true));
          this.expiryDate = this.englishNepaliDatePipe.transform(initialInformation.dateofExpiry.en, true);
        } else {
          this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
              .patchValue(initialInformation.dateofExpiryNepali.en);
          this.expiryDate = initialInformation.dateofExpiryNepali.en;
        }
      }
      if (docName === 'Educational Loan' && (initialInformation.selectedSecurity.en === 'LAND' || initialInformation.selectedSecurity.en === 'LAND_AND_BUILDING')) {
        this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
            .patchValue('मासिक किस्ता सूरु भएको मितिले ' + initialInformation.loanPeriodInMonths.ct + ' महिना सम्म ।');
        this.expiryDate = 'मासिक किस्ता सूरु भएको मितिले ' + initialInformation.loanPeriodInMonths.ct + ' महिना सम्म ।';
      }
      if (docName === 'Educational Loan' && (initialInformation.selectedSecurity.en === 'FIXED_DEPOSIT')) {
        if (initialInformation.dateOfExpiryType.en === 'AD') {
          this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
              .patchValue(this.englishNepaliDatePipe.transform(initialInformation.dateofExpiry.en, true));
          this.expiryDate = this.englishNepaliDatePipe.transform(initialInformation.dateofExpiry.en, true);
        } else {
          this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
              .patchValue(initialInformation.dateofExpiryNepali.en.nDate);
          this.expiryDate = initialInformation.dateofExpiryNepali.en.nDate;
        }
      }
      if (docName === 'Home Loan') {
        this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
            .patchValue('मासिक किस्ता सूरु भएको मितिले ' + initialInformation.loan.loanPeriodInMonthsCT + ' महिना सम्म ।');
        this.expiryDate = 'मासिक किस्ता सूरु भएको मितिले ' + initialInformation.loan.loanPeriodInMonthsCT + ' महिना सम्म ।';
      }
      if (docName === 'Auto Loan') {
        this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
            .patchValue('मासिक किस्ता सूरु भएको मितिले ' + initialInformation.numberOfEmi.ct + ' महिना सम्म ।');
        this.expiryDate = 'मासिक किस्ता सूरु भएको मितिले ' + initialInformation.numberOfEmi.ct + ' महिना सम्म ।';
      }
      if (docName === 'Mortage Loan') {
        this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
            .patchValue('मासिक किस्ता सूरु भएको मितिले ' + initialInformation.loanPeriod.ct + ' महिना सम्म ।');
        this.expiryDate = 'मासिक किस्ता सूरु भएको मितिले ' + initialInformation.loanPeriod.ct + ' महिना सम्म ।';
      }
      if (docName === 'Udyamsil Karja Subsidy') {
        const tempTenureOfLoan = initialInformation.totalTenureOfLoan ? initialInformation.totalTenureOfLoan.ct : '';
        this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
            .patchValue('मासिक किस्ता सूरु भएको मितिले ' + tempTenureOfLoan + ' महिना सम्म ।');
        this.expiryDate = 'मासिक किस्ता सूरु भएको मितिले ' + tempTenureOfLoan + ' महिना सम्म ।';
      }
      if (docName === 'Personal loan and personal overdraft') {
        if (initialInformation.loanExpiryDateType.en === 'AD') {
          this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDateOd'])
              .patchValue(this.englishNepaliDatePipe.transform(initialInformation.loanExpiryDate.en, true));
          this.expiryDateOd = this.englishNepaliDatePipe.transform(initialInformation.loanExpiryDate.en, true);
        } else {
          this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDateOd'])
              .patchValue(initialInformation.loanExpiryDateNepali.en.nDate);
          this.expiryDateOd = initialInformation.loanExpiryDateNepali.en.nDate;
        }
        const tempExpiryDate = initialInformation.loanPeriodInMonth ? initialInformation.loanPeriodInMonth.ct : '';
        this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
            .patchValue('मासिक किस्ता सूरु भएको मितिले ' + tempExpiryDate + ' महिना सम्म ।');
        this.expiryDate = 'मासिक किस्ता सूरु भएको मितिले ' + tempExpiryDate + ' महिना सम्म ।';
      }
      if (docName === 'Personal overdraft without collateral') {
        if (initialInformation.dateOfExpiryType.en === 'AD') {
          this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
              .patchValue(this.englishNepaliDatePipe.transform(initialInformation.dateofExpiry.en, true));
          this.expiryDate = this.englishNepaliDatePipe.transform(initialInformation.dateofExpiry.en, true);
        } else {
          this.loanDeedIndividual.get(['loanDeedIndividuals', index , 'expiryDate'])
              .patchValue(initialInformation.dateofExpiryNepali.en);
          this.expiryDate = initialInformation.dateofExpiryNepali.en;
        }
      }
    });
   this.retailCombinedLoanData();
  }

  async getJointInfoData() {
    if (this.cadData.loanHolder.customerType === this.customerType.INDIVIDUAL
        && this.clientType === this.customerSubType.JOINT.toUpperCase()) {
      const associateId = this.cadData.loanHolder.associateId;
      this.spinner = true;
      await this.customerService.getJointInfoDetails(associateId).toPromise().then((res: any) => {
        this.jointInfoData = JSON.parse(res.detail.jointInfo);
        this.spinner = false;
      }, error => {
        console.log(error);
        this.spinner = false;
      });
    }
  }

  setJointDetailsArr(data) {
    const formArray = (this.loanDeedIndividual.get(['loanDeedIndividuals', 0 , 'loanDeedJoint']) as FormArray);
    if (ObjectUtil.isEmpty(data)) {
      return;
    }
    data.forEach(value => {
      const nepData = value;
      let age;
      if (!ObjectUtil.isEmpty(nepData.dob) && !ObjectUtil.isEmpty(nepData.dob.en.eDate)) {
        const calAge = AgeCalculation.calculateAge(nepData.dob.en.eDate);
        age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(nepData.dob.en.eDate).toString());
      } else {
        age = this.engToNepNumberPipe.transform(AgeCalculation.calculateAge(nepData.dob.en).toString());
      }
      let citizenshipIssuedDate;
      if (!ObjectUtil.isEmpty(nepData.citizenshipIssueDate.en.nDate)) {
        citizenshipIssuedDate = nepData.citizenshipIssueDate.en.nDate;
      } else {
        const convertedDate = this.datePipe.transform(nepData.citizenshipIssueDate.en);
        citizenshipIssuedDate = this.englishNepaliDatePipe.transform(convertedDate, true);
      }
      formArray.push(this.formBuilder.group({
        nameofGrandFatherJoint : [nepData.grandFatherName ?
            nepData.grandFatherName.ct :
            nepData.fatherInLawName ? nepData.fatherInLawName.ct : ''],
        nameofFatherJoint : [ nepData.fatherName ?
            nepData.fatherName.ct :
            nepData.husbandName ? nepData.husbandName.ct : ''],
        districtJoint : [nepData.permanentDistrict.ct],
        vdcJoint : [nepData.permanentMunicipality.ct],
        wardNoJoint : [nepData.permanentWard.np || nepData.permanentWard.ct],
        ageJoint : [age ? age : ''],
        nameofPersonJoint : [nepData.name.np || nepData.name.ct],
        citizenshipNoJoint : [nepData.citizenNumber.np || nepData.citizenNumber.ct],
        dateofIssueJoint : [citizenshipIssuedDate ? citizenshipIssuedDate : ''],
        nameofIssuedDistrictJoint : [nepData.citizenshipIssueDistrict.en.nepaliName],
      }));
    });
  }

  primarySecurityCheck() {
    this.offerDocumentDetails.securities.primarySecurity.forEach(val => {
      let name;
      if (val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING') {
        this.primarySecurityTypeCheck = true;
        if (val.collateralShare === 'YES') {
          name = {
            borrowerName: val ? val.nameOfBorrowingClientCT : ''
          };
          this.tempPrimarySecurity.push(
              name
          );
        }
      }
    });
  }

  secondarySecurityCheck() {
    this.offerDocumentDetails.securities.secondarySecurity.forEach(val => {
      let name;
      if (val.securityType === 'LAND' || val.securityType === 'LAND_AND_BUILDING') {
        this.secondarySecurityTypeCheck = true;
        if (val.collateralShare === 'YES') {
          name = {
            borrowerName: val ? val.nameOfBorrowingClientCT : ''
          };
          this.tempSecondarySecurity.push(
              name
          );
        }
      }
    });
  }

  homeSecurityCheck() {
    if (this.offerDocumentDetails.loan.securities !== null && this.offerDocumentDetails.loan.securities[0].securityOwnersName !== null) {
      this.homeSecurityTypeCheck = true;
    }
  }
  eduSecurityCheck() {
    if (this.offerDocumentDetails.securityDetails !== null && this.offerDocumentDetails.securityDetails[0].securities[0] !== null &&
        this.offerDocumentDetails.securityDetails[0].securities[0].securityOwnersName !== null) {
      this.eduSecurityTypeCheck = true;
    }
  }
  getLoanDetails() {
    this.cadData.assignedLoan.forEach(val => {
      const name = val.loan.name ? val.loan.name : '';
      const nepName = val.loan.nepaliName ? val.loan.nepaliName : '';
      const loanAmt = val.proposal ? val.proposal.proposedLimit : '';
      const tempLoan = {
        name: name,
        nepaliName: nepName,
        loamAmount: loanAmt
      };
      this.loanName.push(tempLoan);
    });
  }
  retailCombinedLoanData() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanName.forEach((value, i) => {
        if (value.name === 'EDUCATION LOAN COMBINED') {
          this.offerDocumentDetails.educationLoanForm.educationLoanCombinedFormArray.forEach(val => {
            this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
            if (val.loanExpiryDateType === 'AD') {
              this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
            } else {
              this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
            }
          });
          this.newData = {
            loanNepaliName : value.nepaliName,
            loanAmount: value.loamAmount,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate,
          };
          this.newTempData.push(
              this.newData
          );
        }

       if (value.name === 'AUTO LOAN COMBINED') {
          this.offerDocumentDetails.autoLoanCombinedForm.autoLoanCombinedFormArray.forEach(val => {
            this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
            if (val.loanExpiryDateType === 'AD') {
              this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
            } else {
              this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
            }
          });
          this.newData = {
            loanNepaliName : value.nepaliName,
            loanAmount: value.loamAmount,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate ? this.expiryDate : '',
          };
          this.newTempData.push(
              this.newData
          );
        }
       if (value.name === 'HOME LOAN COMBINED') {
          this.offerDocumentDetails.homeLoanCombinedForm.homeLoanCombinedFormArray.forEach(val => {
            this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
            if (val.loanExpiryDateType === 'AD') {
              this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
            } else {
              this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
            }
          });
          this.newData = {
            loanNepaliName : value.nepaliName,
            loanAmount: value.loamAmount,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate,
          };
          this.newTempData.push(
              this.newData
          );
        }

        if (value.name === 'MORTGAGE LOAN COMBINED') {
          this.offerDocumentDetails.mortgageCombineForm.mortgageCombineLoanFormArray.forEach(val => {
            this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
            if (val.loanExpiryDateType === 'AD') {
              this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
            } else {
              this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
            }
          });
          this.newData = {
            loanNepaliName : value.nepaliName,
            loanAmount: value.loamAmount,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate,
          };
          this.newTempData.push(
              this.newData
          );
        }
        if (value.name === 'NABIL SAHAYATRI KARJA') {
          this.offerDocumentDetails.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray.forEach(val => {
            this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
            if (val.loanExpiryDateType === 'AD') {
              this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
            } else {
              this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
            }
          });
          this.newData = {
            loanNepaliName : value.nepaliName,
            loanAmount: value.loamAmount,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate,
          };
          this.newTempData.push(
              this.newData
          );
        }
        if (value.name === 'NABIL SHARE LOAN POD COMBINED') {
          this.offerDocumentDetails.nabilShareLoanPODForm.nabilShareLoanPODFormArray.forEach(val => {
            this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
            if (val.loanExpiryDateType === 'AD') {
              this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
            } else {
              this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
            }
          });
          this.newData = {
            loanNepaliName : value.nepaliName,
            loanAmount: value.loamAmount,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate,
          };
          this.newTempData.push(
              this.newData
          );
        }
        if (value.name === 'SHARE LOAN DEMAND COMBINED') {
          this.offerDocumentDetails.shareLoanDemandCombinedForm.shareLoanDemandCombinedFormArray.forEach(val => {
            this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
            if (val.loanExpiryDateType === 'AD') {
              this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
            } else {
              this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
            }
          });
          this.newData = {
            loanNepaliName : value.nepaliName,
            loanAmount: value.loamAmount,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate,
          };
          this.newTempData.push(
              this.newData
          );
        }
        if (value.name === 'PERSONAL LOAN COMBINED') {
          this.offerDocumentDetails.personalLoanCombinedForm.personalLoanCombinedFormArray.forEach(val => {
            this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
            if (val.loanExpiryDateType === 'AD') {
              this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
            } else {
              this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
            }
          });
          this.newData = {
            loanNepaliName : value.nepaliName,
            loanAmount: value.loamAmount,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate,
          };
          this.newTempData.push(
              this.newData
          );
        }
        if (value.name === 'PERSONAL OVERDRAFT COMBINED') {
          this.offerDocumentDetails.personalOverdraftCombinedForm.personalOverdraftCombinedFormArray.forEach(val => {
            this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
            if (val.loanExpiryDateType === 'AD') {
              this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
            } else {
              this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
            }
          });
          this.newData = {
            loanNepaliName : value.nepaliName,
            loanAmount: value.loamAmount,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate,
          };
          this.newTempData.push(
              this.newData
          );
        }
        if (value.name === 'PERSONAL OVERDRAFT WITHOUT COLLATERAL COMBINED') {
          // tslint:disable-next-line:max-line-length
          this.offerDocumentDetails.personalOverDraftWithoutCollateralCombinedForm.personalOverDraftWithoutCollateralCombinedFormArray.forEach(val => {
            this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
            if (val.loanExpiryDateType === 'AD') {
              this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
            } else {
              this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
            }
          });
          this.newData = {
            loanNepaliName: value.nepaliName,
            loanAmount: value.loamAmount,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate,
          };
          this.newTempData.push(
              this.newData
          );
        }
        this.addCombinedFreeText();
        if (this.cadData.cadFileList.length > 0) {
          this.loanDeedIndividual.get(['loanDeedIndividuals', 0, 'combinedFreeText', i, 'dateOfExpiry']).patchValue(
              (!ObjectUtil.isEmpty(this.supportedInfo) &&
                  !ObjectUtil.isEmpty(this.supportedInfo.combinedFreeText[i]) &&
                  !ObjectUtil.isEmpty(this.supportedInfo.combinedFreeText[i].dateOfExpiry)) ?
                  this.supportedInfo.combinedFreeText[i].dateOfExpiry : ''
          );
        } else {
            this.loanDeedIndividual.get(['loanDeedIndividuals', 0, 'combinedFreeText', i, 'dateOfExpiry']).patchValue(
                (!ObjectUtil.isEmpty(this.newTempData) &&
                    !ObjectUtil.isEmpty(this.newTempData[i]) &&
                    !ObjectUtil.isEmpty(this.newTempData[i].dateOfExpiry)) ?
                    this.newTempData[i].dateOfExpiry : ''
            );
        }
      });
    }
    if (this.cadData.offerDocumentList[0].docName === 'Combined Offer Letter') {
      if (this.offerDocumentDetails.existingLoanForm.isExistingLoan = true) {
        this.offerDocumentDetails.existingLoanForm.existingLoanFormArray.forEach(val => {
          this.educationInterestRate = val.interestRate ? val.interestRateCT : '';
          if (val.loanExpiryDateType === 'AD') {
            this.expiryDate = val.loanExpiryDate ? val.loanExpiryDateCT : '';
          } else {
            this.expiryDate = val.loanExpiryDateNepali ? val.loanExpiryDateNepali.nDate : '';
          }
          this.newData = {
            loanNepaliName: val.facilityName,
            loanAmount: val.loanAmountInFigure,
            interestRate: this.educationInterestRate,
            dateOfExpiry: this.expiryDate,
          };
          this.newTempData.push(
              this.newData
          );
        });
      }
    }
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerLoanOptions} from '../../../cad-constant/customer-loan-options';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {AddressService} from '../../../../../../@core/service/baseservice/address.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Attributes} from '../../../../../../@core/model/attributes';
import {District} from '../../../../../admin/modal/district';
import {UdyamsilKarjaSubsidyComponent} from '../../../../cad-document-template/nabil/nabil-sme/udyamsil-karja-subsidy/udyamsil-karja-subsidy.component';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-class-a-sanction-letter-template-data',
  templateUrl: './class-a-sanction-letter-template-data.component.html',
  styleUrls: ['./class-a-sanction-letter-template-data.component.scss']
})
export class ClassASanctionLetterTemplateDataComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  form: FormGroup;
  spinner = false;
  customerLoanOptions: Array<String> = new Array<String>();
  isLoanOptionSelected = false;
  isCustomerNew = false;
  isSecurityOptionSelected;
  isSecurityLand = false;
  ADSanctionLetterDate = false;
  BSSanctionLetterDate = false;
  ADApplication = false;
  BSApplication = false;
  ADPrevious = false;
  BSPrevious = false;
  displayNepali: boolean;
  saveEnable = false;
  submitted = false;
  closeEnable = false;
  isPreview = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  loanOptions = CustomerLoanOptions;
  translatedValues: any = {};
  tdVal: any = {};
  translateFormGroup: FormGroup;
  oneForm: FormGroup;
  attributes;
  cadDocStatus;
  municipalityListForSecurities = [];
  allDistrictList = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterDocument: OfferDocument;
  isOverdraftSelected = false;
  isBankGuaranteeSelected = false;
  isIrrevocableSelected = false;
  isSecurity = false;
  isAllLoanSelected = false;
  isSpecificSelected = false;
  isFixedDepositSelected = false;
  isDepositAccountSelected = false;
  isNabilSelected = false;
  isOtherSelected = false;
  isNewSelected = false;
  isExistingSelected = false;
  isCoupenRateFinancingSelected = false;
  isBaseRateFinancingSelected = false;
  is100CashMarginSelected = false;
  is10CashMarginSelected = false;
  isSecuritySelected = false;
  selectedSecurityVal;
  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private translatedService: SbTranslateService,
              private datePipe: DatePipe,
              private engNepDatePipe: EngNepDatePipe,
              private addressService: AddressService,
              private modalService: NgbModal,
              private dialogRef: NbDialogRef<ClassASanctionLetterTemplateDataComponent>,
              private dialogService: NbDialogService,
              private toastService: ToastService,
              private titleCasePipe: TitleCasePipe,
              private administrationService: CreditAdministrationService, ) { }

  ngOnInit() {
    this.buildForm();
    this.getLoanOptionsType();
    this.getAllDistrict();
    // getting key from cad doc status:
    this.cadDocStatus = CadDocStatus.key();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      loanAmountFigure: [undefined],
      loanAmountFigureWords: [undefined],
      nameOfBranchManager: [undefined],
      nameOfRelationalManager: [undefined],
      totalLimitInFigure: [undefined],
      totalLimitInWords: [undefined],
      TdHolding: [undefined],
      serviceChargeFigure: [undefined],
      serviceChargeWords: [undefined],
      detailOfFacility: [undefined],
      serviceChargeInPerc: [undefined],
      TdHolder: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      expiryDate: [undefined],
      holderName: [undefined],
      accountNumber: [undefined],
      comissionRate: [undefined],
      miniumComissionAmount: [undefined],
      comissionRateFirstQuarter: [undefined],
      comissionRateOthersQuarter: [undefined],
      minimumComissionAmount: [undefined],
      sanctionLetterDateTrans: [undefined],
      sanctionLetterDateType: [undefined],
      sanctionLetterDateNepali: [undefined],
      sanctionLetterDate: [undefined],
      dateOfApplicationType: [undefined],
      dateOfApplicationNepali: [undefined],
      dateOfApplication: [undefined],
      previousSanctionType: [undefined],
      previousSanctionDate: [undefined],
      tenureFacility: [undefined],
      securities: this.formBuilder.array([]),
      loanOption: [undefined],
      securityType: [undefined],
      serviceCharges: [undefined],
      overdraft: [undefined],
      BankGuarantee: [undefined],

      // FIELDS FOR TRANSLATED FIELDS (TRANS):
      loanAmountFigureTrans: [undefined],
      loanAmountFigureWordsTrans: [undefined],
      nameOfBranchManagerTrans: [undefined],
      nameOfRelationalManagerTrans: [undefined],
      totalLimitInFigureTrans: [undefined],
      totalLimitInWordsTrans: [undefined],
      TdHoldingTrans: [undefined],
      serviceChargeFigureTrans: [undefined],
      serviceChargeWordsTrans: [undefined],
      detailOfFacilityTrans: [undefined],
      serviceChargeInPercTrans: [undefined],
      TdHolderTrans: [undefined],
      drawingPowerTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      expiryDateTrans: [undefined],
      holderNameTrans: [undefined],
      accountNumberTrans: [undefined],
      comissionRateTrans: [undefined],
      miniumComissionAmountTrans: [undefined],
      comissionRateFirstQuarterTrans: [undefined],
      comissionRateOthersQuarterTrans: [undefined],
      minimumComissionAmountTrans: [undefined],
      tenureFacilityTrans: [undefined],
      previousSanctionDateTrans: [undefined],
      previousSanctionDateNepaliTrans: [undefined],
      dateOfApplicationTrans: [undefined],
      loanOptionTrans: [undefined],
      securityTypeTrans: [undefined],
      serviceChargesTrans: [undefined],
      overdraftTrans: [undefined],
      BankGuaranteeTrans: [undefined],
      // FIELDS FOR CT VALUES:
      sanctionLetterDateNepaliCT: [undefined],
      sanctionLetterDateCT: [undefined],
      dateOfApplicationNepaliCT: [undefined],
      dateOfApplicationCT: [undefined],
      previousSanctionDateNepaliCT: [undefined, Validators.required],
      previousSanctionDateCT: [undefined, Validators.required],
      loanAmountFigureCT: [undefined],
      loanAmountFigureWordsCT: [undefined, Validators.required],
      nameOfBranchManagerCT: [undefined, Validators.required],
      nameOfRelationalManagerCT: [undefined],
      totalLimitInFigureCT: [undefined, Validators.required],
      totalLimitInWordsCT: [undefined, Validators.required],
      TdHoldingCT: [undefined, Validators.required],
      serviceChargeFigureCT: [undefined, Validators.required],
      serviceChargeWordsCT: [undefined, Validators.required],
      detailOfFacilityCT: [undefined, Validators.required],
      serviceChargeInPercCT: [undefined, Validators.required],
      TdHolderCT: [undefined, Validators.required],
      drawingPowerCT: [undefined, Validators.required],
      baseRateCT: [undefined, Validators.required],
      premiumRateCT: [undefined, Validators.required],
      interestRateCT: [undefined, Validators.required],
      expiryDateCT: [undefined, Validators.required],
      holderNameCT: [undefined, Validators.required],
      accountNumberCT: [undefined, Validators.required],
      comissionRateCT: [undefined, Validators.required],
      miniumComissionAmountCT: [undefined, Validators.required],
      comissionRateFirstQuarterCT: [undefined, Validators.required],
      comissionRateOthersQuarterCT: [undefined, Validators.required],
      minimumComissionAmountCT: [undefined, Validators.required],
      tenureFacilityCT: [undefined, Validators.required],
      loanOptionCT: [undefined],
      securityTypeCT: [undefined],
      serviceChargesCT: [undefined],
      overdraftCT: [undefined],
      BankGuaranteeCT: [undefined],
    });
    this.addDefaultSecurity();
  }
  get FormControls() {
    return this.form.controls;
  }

  public sanctionLetterDate(value): void {
    this.ADSanctionLetterDate = value === 'AD';
    this.BSSanctionLetterDate = value === 'BS';
  }

  public dateOfApplication(value): void {
    this.ADApplication = value === 'AD';
    this.BSApplication = value === 'BS';
  }

  public previousSanctionDate(value): void {
    this.ADPrevious = value === 'AD';
    this.BSPrevious = value === 'BS';
  }

  getLoanOptionsType() {
    CustomerLoanOptions.enumObject().forEach(val => {
      this.customerLoanOptions.push(val);
    });
  }

  transferValue(val) {
    this.isLoanOptionSelected = !ObjectUtil.isEmpty(val);
    this.isCustomerNew = val === 'NEW';
  }

  checkLoanType() {
    console.log('Im here');
    const tempSelectedLoanType = this.form.get('securityType').value;
    this.isBankGuaranteeSelected = tempSelectedLoanType === 'BankGuarantee';
    this.isOverdraftSelected = tempSelectedLoanType === 'Overdraft';
    this.isIrrevocableSelected = tempSelectedLoanType === 'Irrevocable Letter of Credit Facility';
  }
  checkLoanType1() {
    const tempSelectedLoanType = this.form.get('serviceCharges').value;
    this.isAllLoanSelected = tempSelectedLoanType === 'For_All_Loan';
    this.isSpecificSelected = tempSelectedLoanType === 'For Specific Loan Only';
  }
  checkOD() {
    const tempSelectedLoanType = this.form.get('overdraft').value;
    this.isFixedDepositSelected = tempSelectedLoanType === 'Fixed_Deposit';
    this.isDepositAccountSelected = tempSelectedLoanType === 'Deposit_Account';
  }
  checkTD() {
    const tempSelectedLoanType = this.form.get('overdraft').value;
    this.isNabilSelected = tempSelectedLoanType === 'Nabil';
    this.isOtherSelected = tempSelectedLoanType === 'Other';
  }
  checkLetterSet() {
    const tempSelectedLoanType = this.form.get('overdraft').value;
    this.isNewSelected = tempSelectedLoanType === 'New';
    this.isExistingSelected = tempSelectedLoanType === 'Existing';
  }
  checkBaseType() {
    const tempSelectedLoanType = this.form.get('overdraft').value;
    this.isCoupenRateFinancingSelected = tempSelectedLoanType === 'Coupen Rate Financing';
    this.isBaseRateFinancingSelected = tempSelectedLoanType === 'Base Rate Financing';
  }
  checkCashMarginType() {
    const tempSelectedLoanType = this.form.get('BankGuarantee').value;
    this.is100CashMarginSelected = tempSelectedLoanType === '100% Cash Margin';
    this.is10CashMarginSelected = tempSelectedLoanType === '10% Cash Margin';
  }
  serviceCheck(data) {
    this.isSecurity = data;
    console.log('selected?', this.isSecurity);
  }

  securityValue() {
    const security = this.form.get('securityType').value;
    if (!ObjectUtil.isEmpty(security)) {
      this.isSecurityOptionSelected = security;
    }

  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.form.get(numLabel).value);
    this.form.get(wordLabel).patchValue(transformValue);
  }

  translateNumber(source, target, currencyFormat?) {
    const formVal = this.form.get(source).value;
    if (!ObjectUtil.isEmpty(formVal)) {
      let formattedVal;
      if (!ObjectUtil.isEmpty(currencyFormat)) {
        formattedVal = this.currencyFormatterPipe.transform(this.form.get(source).value.toString());
      } else {
        formattedVal = this.form.get(source).value.toString();
      }
      const wordLabelVar = this.engToNepaliNumberPipe.transform(formattedVal);
      this.form.get(target).patchValue(wordLabelVar);
    }
  }

  calInterestRate() {
    const baseRate = this.form.get('baseRate').value;
    const premiumRate = this.form.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.form.get('interestRate').patchValue(sum);
    // Converting value from existed pipe:
    this.translateNumber('baseRate', 'baseRateTrans');
    this.translateNumber('premiumRate', 'premiumRateTrans');
    this.translateNumber('interestRate', 'interestRateTrans');
  }

  convertNumbersToNepali(val, type: boolean) {
    let finalConvertedVal;
    if (!ObjectUtil.isEmpty(val)) {
      if (type) {
        finalConvertedVal = this.engToNepaliNumberPipe.transform(
            this.currencyFormatterPipe.transform(val.toString())
        );
      } else {
        finalConvertedVal = this.engToNepaliNumberPipe.transform(val.toString());
      }
    }
    return finalConvertedVal;
  }

  setTranslatedData(data) {
    // SET TRANSLATED DATA:
    this.form.get('purposeOfLoanTrans').patchValue(this.translatedValues.purposeOfLoan);
    this.form.get('nameOfStaffTrans').patchValue(this.translatedValues.nameOfStaff);
    this.form.get('nameOfFacilityTrans').patchValue(this.translatedValues.nameOfFacility);
    this.form.get('nameOfBranchManagerTrans').patchValue(this.translatedValues.nameOfBranchManager);
    this.form.get('sanctionLetterDateTypeTrans').patchValue(this.translatedValues.sanctionLetterDateType);
    this.form.get('dateOfApplicationTypeTrans').patchValue(this.translatedValues.dateOfApplicationType);
    this.form.get('previousSanctionTypeTrans').patchValue(this.translatedValues.previousSanctionType);
  }

  async translate(form) {
    this.spinner = true;
    const translatedData = await this.translatedService.translateForm(form);
    this.spinner = false;
    return translatedData;
  }

  mappedData() {
    Object.keys(this.form.controls).forEach(key => {
      if (key.indexOf('Trans') > -1 || key === 'municipalityOrVdc' || key === 'securities' || key.indexOf('CT') > -1) {
        return;
      }
      this.attributes = new Attributes();
      this.attributes.en = this.form.get(key).value;
      this.attributes.np = this.form.get(key + 'Trans').value;
      this.attributes.ct = this.form.get(key + 'CT').value;
      this.tdVal[key] = this.attributes;
    });
    console.log('This is Attributes', this.tdVal);
  }

  async translateAndSetValue() {
    this.spinner = true;
    // Translation Data
    this.form.get('loanOptionTrans').patchValue(this.form.get('loanOption').value);
    this.form.get('securityTypeTrans').patchValue(this.form.get('securityType').value);
    // Set Translated Sanction letter Date:
    const sanctionType = this.form.get('sanctionLetterDateType').value;
    let approvalDateTrans;
    if (sanctionType === 'AD') {
      const approvalForm = this.form.get('sanctionLetterDate').value;
      approvalDateTrans = !ObjectUtil.isEmpty(approvalForm) ?
          this.datePipe.transform(approvalForm) : '';
      this.form.get('sanctionLetterDateTrans').patchValue(approvalDateTrans);
    } else {
      const approvalNepali = this.form.get('sanctionLetterDateNepali').value;
      approvalDateTrans = !ObjectUtil.isEmpty(approvalNepali) ?
          approvalNepali.nDate : '';
      this.form.get('sanctionLetterDateNepaliTrans').patchValue(approvalDateTrans);
    }
    // Set Translated Application Date:
    const applicationType = this.form.get('dateOfApplicationType').value;
    let applicationDateTrans;
    if (applicationType === 'AD') {
      const applicationForm = this.form.get('dateOfApplication').value;
      applicationDateTrans = !ObjectUtil.isEmpty(applicationForm) ?
          this.datePipe.transform(applicationForm) : '';
      this.form.get('dateOfApplicationTrans').patchValue(applicationDateTrans);
    } else {
      const applicationNepali = this.form.get('dateOfApplicationNepali').value;
      applicationDateTrans = !ObjectUtil.isEmpty(applicationNepali) ?
          applicationNepali.nDate : '';
      this.form.get('dateOfApplicationNepaliTrans').patchValue(applicationDateTrans);
    }
    // Set Translation Date of Previous Sanction letter:
    const previousSanctionType = this.form.get('previousSanctionType').value;
    let previousSanctionTrans;
    if (previousSanctionType === 'AD') {
      const previousSanctionForm = this.form.get('previousSanctionDate').value;
      previousSanctionTrans = !ObjectUtil.isEmpty(previousSanctionForm) ?
          this.datePipe.transform(previousSanctionForm) : '';
      this.form.get('previousSanctionDateTrans').patchValue(previousSanctionTrans);
    } else {
      const previousSanctionNepali = this.form.get('previousSanctionDateNepali').value;
      previousSanctionTrans = !ObjectUtil.isEmpty(previousSanctionNepali) ?
          previousSanctionNepali.nDate : '';
      this.form.get('previousSanctionDateNepaliTrans').patchValue(previousSanctionTrans);
    }
    // For Existed Pipe Value :
    const loanAmountData = this.form.get('loanAmountFigure').value;
    if (!ObjectUtil.isEmpty(loanAmountData)) {
      const changeNumber = this.convertNumbersToNepali(loanAmountData, true);
      this.form.get('loanAmountFigureTrans').patchValue(changeNumber);
    }
    const loanAmountFigData = this.form.get('loanAmountFigureWords').value;
    if (!ObjectUtil.isEmpty(loanAmountFigData)) {
      this.form.get('loanAmountFigureWordsTrans').patchValue(loanAmountFigData);
    }
    const marginNum = this.form.get('marginInPercentage').value;
    if (!ObjectUtil.isEmpty(marginNum)) {
      const convertedMarginNum = this.convertNumbersToNepali(marginNum, false);
      this.form.get('marginInPercentageTrans').patchValue(convertedMarginNum);
    }
    const serviceChargeNum = this.form.get('serviceCharge').value;
    if (!ObjectUtil.isEmpty(serviceChargeNum)) {
      const convertServiceCharge = this.convertNumbersToNepali(serviceChargeNum, false);
      this.form.get('serviceChargeTrans').patchValue(convertServiceCharge);
    }
    const totalInstallmentFigureNum = this.form.get('totalInstallmentFigure').value;
    if (!ObjectUtil.isEmpty(totalInstallmentFigureNum)) {
      const convertTotalInstallmentFigure = this.convertNumbersToNepali(totalInstallmentFigureNum, false);
      this.form.get('totalInstallmentFigureTrans').patchValue(convertTotalInstallmentFigure);
    }
    const tenureData = this.form.get('totalTenureOfLoan').value;
    if (!ObjectUtil.isEmpty(tenureData)) {
      const convertTenureData = this.convertNumbersToNepali(tenureData, false);
      this.form.get('totalTenureOfLoanTrans').patchValue(convertTenureData);
    }
    const commitmentData = this.form.get('commitmentFee').value;
    if (!ObjectUtil.isEmpty(commitmentData)) {
      const convertCommitment = this.convertNumbersToNepali(commitmentData, false);
      this.form.get('commitmentFeeTrans').patchValue(convertCommitment);
    }
    const EMIAmountFigureData = this.form.get('EMIAmountFigure').value;
    if (!ObjectUtil.isEmpty(EMIAmountFigureData)) {
      const convertEMIAmountFigure = this.convertNumbersToNepali(EMIAmountFigureData, true);
      this.form.get('EMIAmountFigureTrans').patchValue(convertEMIAmountFigure);
    }
    const EMIAmountWordData = this.form.get('EMIAmountWord').value;
    if (!ObjectUtil.isEmpty(EMIAmountWordData)) {
      this.form.get('EMIAmountWordTrans').patchValue(EMIAmountWordData);
    }
    // For Required Translation Data:
    this.translateFormGroup = this.formBuilder.group({
      purposeOfLoan: this.form.get('purposeOfLoan').value,
      nameOfStaff: this.form.get('nameOfStaff').value,
      nameOfFacility: this.form.get('nameOfFacility').value,
      nameOfBranchManager: this.form.get('nameOfBranchManager').value,
      sanctionLetterDateType: this.form.get('sanctionLetterDateType').value,
      dateOfApplicationType: this.form.get('dateOfApplicationType').value,
      previousSanctionType: this.form.get('previousSanctionType').value,
    });
    this.translatedValues = await this.translate(this.translateFormGroup);
    this.setTranslatedData(this.translatedValues);
    this.setCTValuesAfterTranslation();
    this.mappedData();
    this.spinner = false;
    this.saveEnable = true;
  }

  setCTValuesAfterTranslation() {
    // Set CT values
    this.form.get('loanOptionCT').patchValue(this.form.get('loanOption').value);
    this.form.get('securityTypeCT').patchValue(this.form.get('securityType').value);
    // set CT value of Sanction Letter Date
    this.form.get('sanctionLetterDateTypeCT').patchValue(this.form.get('sanctionLetterDateType').value);
    if (this.ADSanctionLetterDate) {
      const transDate = this.form.get('sanctionLetterDateTrans').value;
      const convertDate = !ObjectUtil.isEmpty(transDate) ? this.engNepDatePipe.transform(transDate, true) : '';
      this.form.get('sanctionLetterDateCT').patchValue(convertDate);
    }
    if (this.BSSanctionLetterDate) {
      this.form.get('sanctionLetterDateNepaliCT').patchValue(this.form.get('sanctionLetterDateNepaliTrans').value);
    }
    // Set CT Value of Date of Application
    this.form.get('dateOfApplicationTypeCT').patchValue(this.form.get('dateOfApplicationType').value);
    if (this.ADApplication) {
      const transDate = this.form.get('dateOfApplicationTrans').value;
      const convertAppDate = !ObjectUtil.isEmpty(transDate) ? this.engNepDatePipe.transform(transDate, true) : '';
      this.form.get('dateOfApplicationCT').patchValue(convertAppDate);
    }
    if (this.BSApplication) {
      this.form.get('dateOfApplicationNepaliCT').patchValue(this.form.get('dateOfApplicationNepaliTrans').value);
    }
    // Set of CT value of Previous Sanction Letter Date
    this.form.get('previousSanctionTypeCT').patchValue(this.form.get('previousSanctionType').value);
    if (this.ADPrevious) {
      const transPreviousDate = this.form.get('previousSanctionDateTrans').value;
      const convertPreviousDate = !ObjectUtil.isEmpty(transPreviousDate) ?
          this.engNepDatePipe.transform(transPreviousDate, true) : '';
      this.form.get('previousSanctionDateCT').patchValue(convertPreviousDate);
    }
    if (this.BSPrevious) {
      this.form.get('previousSanctionDateNepaliCT').patchValue(
          this.form.get('previousSanctionDateNepaliTrans').value);
    }
    this.form.get('purposeOfLoanCT').patchValue(this.form.get('purposeOfLoanTrans').value);
    this.form.get('loanAmountFigureCT').patchValue(this.form.get('loanAmountFigureTrans').value);
    this.form.get('loanAmountFigureWordsCT').patchValue(this.form.get('loanAmountFigureWordsTrans').value);
    this.form.get('marginInPercentageCT').patchValue(this.form.get('marginInPercentageTrans').value);
    this.form.get('baseRateCT').patchValue(this.form.get('baseRateTrans').value);
    this.form.get('premiumRateCT').patchValue(this.form.get('premiumRateTrans').value);
    this.form.get('interestRateCT').patchValue(this.form.get('interestRateTrans').value);
    this.form.get('serviceChargeCT').patchValue(this.form.get('serviceChargeTrans').value);
    this.form.get('totalInstallmentFigureCT').patchValue(this.form.get('totalInstallmentFigureTrans').value);
    this.form.get('totalTenureOfLoanCT').patchValue(this.form.get('totalTenureOfLoanTrans').value);
    this.form.get('commitmentFeeCT').patchValue(this.form.get('commitmentFeeTrans').value);
    this.form.get('nameOfStaffCT').patchValue(this.form.get('nameOfStaffTrans').value);
    this.form.get('nameOfFacilityCT').patchValue(this.form.get('nameOfFacilityTrans').value);
    this.form.get('nameOfBranchManagerCT').patchValue(this.form.get('nameOfBranchManagerTrans').value);
    this.form.get('EMIAmountFigureCT').patchValue(this.form.get('EMIAmountFigureTrans').value);
    this.form.get('EMIAmountWordCT').patchValue(this.form.get('EMIAmountWordTrans').value);
  }

  buildSecurityForm() {
    return this.formBuilder.group({
      securityOwnersName: [undefined],
      securityOwnersMunicipalityOrVdc: [undefined],
      securityOwnersMunicipality: [undefined],
      securityOwnersDistrict: [undefined],
      securityOwnersWardNo: [undefined],
      securityOwnersPlotNo: [undefined],
      securityOwnersLandArea: [undefined],
      securityOwnersSheetNo: [undefined],
      // TRANSLATION FIELD OF SECURITY:
      securityOwnersNameTrans: [undefined],
      securityOwnersDistrictTrans: [undefined],
      securityOwnersMunicipalityTrans: [undefined],
      securityOwnersWardNoTrans: [undefined],
      securityOwnersPlotNoTrans: [undefined],
      securityOwnersLandAreaTrans: [undefined],
      securityOwnersSheetNoTrans: [undefined],
      // CT FIELDS OF SECURITY
      securityOwnersNameCT: [undefined],
      securityOwnersDistrictCT: [undefined],
      securityOwnersMunicipalityCT: [undefined],
      securityOwnersWardNoCT: [undefined],
      securityOwnersPlotNoCT: [undefined],
      securityOwnersLandAreaCT: [undefined],
      securityOwnersSheetNoCT: [undefined],
    });
  }

  addDefaultSecurity() {
    (this.form.get('securities') as FormArray).push(
        this.buildSecurityForm()
    );
  }

  async onChangeTranslateSecurity(arrName, source, index, target) {
    this.oneForm = this.formBuilder.group({
      securityOwnersName: this.form.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translatedService.translateForm(this.oneForm);
    this.form.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }

  public getAllDistrict(): void {
    this.addressService.getAllDistrict().subscribe((response: any) => {
      this.allDistrictList = response.detail;
    });
  }

  public getMunicipalityByDistrict(data, event, index): void {
    const district = new District();
    district.id = data;
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalityListForSecurities[index] = response.detail;
          this.municipalityListForSecurities[index].sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.form.get(['securities', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
          }
        }
    );
  }

  clearSecurityMunType(controlName, index, formArrayName) {
    const tempVal = this.form.get([formArrayName, index, 'securityOwnersMunicipalityOrVdc']).value;
    if (tempVal === 'VDC') {
      this.form.get([formArrayName, index, controlName]).setValue(null);
    }
  }

  setDefaultNepaliResponse(arrName, source, index, target) {
    this.form.get([String(arrName), index, String(target)]).patchValue(
        this.form.get([String(arrName), index, String(source)]).value.nepaliName);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(
        this.form.get([String(arrName), index, String(source)]).value.nepaliName);
  }

  translateSecurityDetailsNumberFields(arrName, source, index, target) {
    const translatedNepaliNum = this.engToNepaliNumberPipe.transform(
        String(this.form.get([String(arrName), index, String(source)]).value));
    this.form.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
  }

  removeSecurityDetails(index) {
    (this.form.get('securities') as FormArray).removeAt(index);
  }

  openCloseTemplate(template) {
    this.modalService.open(template);
  }

  dismiss(template) {
    this.modalService.dismissAll();
  }

  accept() {
    this.modalService.dismissAll();
    this.dialogRef.close();
  }

  openModal() {
    this.dialogService.open(UdyamsilKarjaSubsidyComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: false,
      hasScroll: true,
      dialogClass: 'modal-full',
      context: {}
    });
  }

  clearConditionalValidation() {
    // Clear Validation for Approval Date:
    if (this.BSSanctionLetterDate) {
      this.form.get('sanctionLetterDateCT').clearValidators();
      this.form.get('sanctionLetterDateCT').updateValueAndValidity();
    } else {
      this.form.get('sanctionLetterDateNepaliCT').clearValidators();
      this.form.get('sanctionLetterDateNepaliCT').updateValueAndValidity();
    }
    // Clear Validation for Application Date:
    if (this.BSApplication) {
      this.form.get('dateOfApplicationCT').clearValidators();
      this.form.get('dateOfApplicationCT').updateValueAndValidity();
    } else {
      this.form.get('dateOfApplicationNepaliCT').clearValidators();
      this.form.get('dateOfApplicationNepaliCT').updateValueAndValidity();
    }
    const tempSelectedOption = this.form.get('loanOption').value;
    // Clear Validation for previous Sanction Date:
    if (tempSelectedOption === this.loanOptions.EXISTING) {
      if (this.BSPrevious) {
        this.form.get('previousSanctionDateCT').clearValidators();
        this.form.get('previousSanctionDateCT').updateValueAndValidity();
      } else {
        this.form.get('previousSanctionDateNepaliCT').clearValidators();
        this.form.get('previousSanctionDateNepaliCT').updateValueAndValidity();
      }
    } else {
      this.form.get('previousSanctionDateNepaliCT').clearValidators();
      this.form.get('previousSanctionDateNepaliCT').updateValueAndValidity();
      this.form.get('previousSanctionDateCT').clearValidators();
      this.form.get('previousSanctionDateCT').updateValueAndValidity();
    }
  }

  save() {
    this.submitted = true;
    this.tdVal['securities'] = this.form.get('securities').value;
    this.clearConditionalValidation();
    const invalidControls = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(this.titleCasePipe.transform(name).replace('CT', '').replace('Trans', ''));
      }
    }
    if (this.form.invalid) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Please Check validation For :\n' + invalidControls.filter((
          value, index, self) => self.indexOf(value) === index).join(', ')));
      this.spinner = false;
      return;
    }
    this.spinner = true;
    this.customerApprovedDoc.docStatus = this.cadDocStatus[0];
    if (this.customerApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.CLASS_A_SANCTION_LETTER).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
          if (offerLetterPath.docName.toString() ===
              this.offerLetterConst.value(this.offerLetterConst.CLASS_A_SANCTION_LETTER).toString()) {
            offerLetterPath.initialInformation = JSON.stringify(this.tdVal);
          }
        });
      }
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CLASS_A_SANCTION_LETTER);
      offerDocument.initialInformation = JSON.stringify(this.tdVal);
      this.customerApprovedDoc.offerDocumentList.push(offerDocument);
    }
    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.customerApprovedDoc = res.detail;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.isPreview = this.closeEnable = true;
      this.saveEnable = false;
    }, error => {
      console.log(error);
      this.spinner = false;
      this.isPreview = false;
      this.saveEnable = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
    });
  }
}

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
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ClassASanctionLetterComponent} from '../../../../cad-document-template/nabil/nabil-sme/class-a-sanction-letter/class-a-sanction-letter.component';

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
  ADDateOfExpiry = false;
  BSDateOfExpiry = false;
  ADloanExpiry = false;
  BSloanExpiry = false;
  displayNepali: boolean;
  btnDisable;
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
  existingOfferLetter = false;
  renewal = false;
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
  isQuarterlySelected = false;
  isYearlySelected = false;
  previewBtn = true;
  isCommissionType1Selected = false;
  isCommissionType2Selected = false;
  isRegularSelected = false;
  isOneoffSelected = false;
  ExpiryDateTypeBS2;
  ExpiryDateTypeAD2;
  loanLimit = false;
  tdValues: any = {};
  closed = false;
  translatedData;
  isSecuritySelected = false;
  selectedSecurityVal;
  isNatural = false;
  isNewIsSelected = false;
  isExistingIsSelected = false;
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
      TDAmount : [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      holderName: [undefined],
      accountNumber: [undefined],
      comissionRate: [undefined],
      miniumComissionAmount: [undefined],
      comissionRateFirstQuarter: [undefined],
      comissionRateOthersQuarter: [undefined],
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
      irrevocable: [undefined],
      loanExpiry: [undefined],
      loanExpiryType: [undefined],
      loanExpiryNepali: [undefined],
      previousSanctionDateNepali: [undefined],
      dateOfExpiryType: [undefined],
      dateOfExpiryNepali: [undefined],
      dateOfExpiry: [undefined],
      naturalPersonCheck: [undefined],
      FixedDeposit: [undefined],
      OneOff: [undefined],
      ForAllLoan: [undefined],
      CommissionType1: [undefined],
      CommissionType2: [undefined],
      ForSpecificLoanOnly: [undefined],
      New: [ undefined],
      Existing: [undefined],
      isNewIsSelected: [undefined],
      isExistingIsSelected: [undefined],
      loanType: [undefined],

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
      TDAmountTrans: [undefined],
      drawingPowerTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      holderNameTrans: [undefined],
      accountNumberTrans: [undefined],
      comissionRateTrans: [undefined],
      miniumComissionAmountTrans: [undefined],
      comissionRateFirstQuarterTrans: [undefined],
      comissionRateOthersQuarterTrans: [undefined],
      sanctionLetterDateTypeTrans: [undefined],
      sanctionLetterDateNepaliTrans: [undefined],
      sanctionLetterDateTrans: [undefined],
      dateOfApplicationTypeTrans: [undefined],
      dateOfApplicationNepaliTrans: [undefined],
      dateOfApplicationTrans: [undefined],
      previousSanctionTypeTrans: [undefined],
      previousSanctionDateTrans: [undefined],
      tenureFacilityTrans: [undefined],
      loanOptionTrans: [undefined],
      securityTypeTrans: [undefined],
      serviceChargesTrans: [undefined],
      overdraftTrans: [undefined],
      BankGuaranteeTrans: [undefined],
      irrevocableTrans: [undefined],
      loanExpiryTrans: [undefined],
      loanExpiryTypeTrans: [undefined],
      loanExpiryNepaliTrans: [undefined],
      previousSanctionDateNepaliTrans: [undefined],
      dateOfExpiryTypeTrans: [undefined],
      dateOfExpiryNepaliTrans: [undefined],
      dateOfExpiryTrans: [undefined],
      naturalPersonCheckTrans: [undefined],
      FixedDepositTrans: [undefined],
      OneOffTrans: [undefined],
      ForAllLoanTrans: [undefined],
      ForSpecificLoanOnlyTrans: [undefined],
      NewTrans: [ undefined],
      ExistingTrans: [undefined],
      isNewIsSelectedTrans: [undefined],
      isExistingIsSelectedTrans: [undefined],
      loanTypeTrans: [undefined],
      CommissionType1Trans: [undefined],
      CommissionType2Trans: [undefined],
      // FIELDS FOR CT VALUES:
      sanctionLetterDateNepaliCT: [undefined],
      sanctionLetterDateCT: [undefined],
      sanctionLetterDateTypeCT: [undefined],
      dateOfApplicationNepaliCT: [undefined],
      dateOfApplicationCT: [undefined],
      dateOfApplicationTypeCT: [undefined],
      previousSanctionDateNepaliCT: [undefined],
      previousSanctionDateCT: [undefined],
      previousSanctionTypeCT: [undefined],
      loanAmountFigureCT: [undefined],
      loanAmountFigureWordsCT: [undefined],
      nameOfBranchManagerCT: [undefined],
      nameOfRelationalManagerCT: [undefined],
      totalLimitInFigureCT: [undefined],
      totalLimitInWordsCT: [undefined],
      TdHoldingCT: [undefined],
      serviceChargeFigureCT: [undefined],
      serviceChargeWordsCT: [undefined],
      detailOfFacilityCT: [undefined],
      serviceChargeInPercCT: [undefined],
      TdHolderCT: [undefined],
      TDAmountCT: [undefined],
      drawingPowerCT: [undefined],
      baseRateCT: [undefined],
      premiumRateCT: [undefined],
      interestRateCT: [undefined],
      holderNameCT: [undefined],
      accountNumberCT: [undefined],
      comissionRateCT: [undefined],
      miniumComissionAmountCT: [undefined],
      comissionRateFirstQuarterCT: [undefined],
      comissionRateOthersQuarterCT: [undefined],
      tenureFacilityCT: [undefined],
      loanOptionCT: [undefined],
      securityTypeCT: [undefined],
      serviceChargesCT: [undefined],
      overdraftCT: [undefined],
      BankGuaranteeCT: [undefined],
      irrevocableCT: [undefined],
      loanExpiryCT: [undefined],
      loanExpiryTypeCT: [undefined],
      loanExpiryNepaliCT: [undefined],
      dateOfExpiryTypeCT: [undefined],
      dateOfExpiryNepaliCT: [undefined],
      dateOfExpiryCT: [undefined],
      naturalPersonCheckCT: [undefined],
      FixedDepositCT: [undefined],
      OneOffCT: [undefined],
      ForAllLoanCT: [undefined],
      ForSpecificLoanOnlyCT: [undefined],
      NewCT: [ undefined],
      ExistingCT: [undefined],
      isNewIsSelectedCT: [undefined],
      isExistingIsSelectedCT: [undefined],
      loanTypeCT: [undefined],
      CommissionType1CT: [undefined],
      CommissionType2CT: [undefined],
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
  public dateOfExpiry(value): void {
    this.ADDateOfExpiry = value === 'AD';
    this.BSDateOfExpiry = value === 'BS';
  }
  public loanExpiry(value): void {
    this.ADloanExpiry = value === 'AD';
    this.BSloanExpiry = value === 'BS';
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
    const tempSelectedLoanType = this.form.get('loanType').value;
    this.isBankGuaranteeSelected = tempSelectedLoanType === 'BankGuarantee';
    this.isOverdraftSelected = tempSelectedLoanType === 'Overdraft';
    this.isIrrevocableSelected = tempSelectedLoanType === 'Irrevocable Letter of Credit Facility';
  }
  checkLoanType1() {
    const tempSelectedLoanType = this.form.get('serviceCharges').value;
    this.isAllLoanSelected = tempSelectedLoanType === 'ForAllLoan';
    this.isSpecificSelected = tempSelectedLoanType === 'ForSpecificLoanOnly';
  }
  checkOD() {
    const tempSelectedLoanType = this.form.get('overdraft').value;
    this.isFixedDepositSelected = tempSelectedLoanType === 'FixedDeposit';
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
  counterGuarantee() {
    const tempSelectedLoanType = this.form.get('BankGuarantee').value;
    this.isNewIsSelected = tempSelectedLoanType === 'New';
    this.isExistingIsSelected = tempSelectedLoanType === 'Existing';
  }
  checkComissionType() {
    const tempSelectedLoanType = this.form.get('BankGuarantee').value;
    this.isQuarterlySelected = tempSelectedLoanType === 'Quarterly';
    this.isYearlySelected = tempSelectedLoanType === 'Yearly';
  }
  checkcommisType() {
    const tempSelectedLoanType = this.form.get('irrevocable').value;
    this.isCommissionType1Selected = tempSelectedLoanType === 'CommissionType1';
    this.isCommissionType2Selected = tempSelectedLoanType === 'CommissionType2';
  }
  checkLoanOptionType() {
    const tempSelectedLoanType = this.form.get('irrevocable').value;
    this.isRegularSelected = tempSelectedLoanType === 'Regular';
    this.isOneoffSelected = tempSelectedLoanType === 'OneOff';
  }
  checkIrrevocableType() {
    const tempSelectedLoanType = this.form.get('irrevocable').value;
    this.is100CashMarginSelected = tempSelectedLoanType === '100 % Cash Margin';
    this.is10CashMarginSelected = tempSelectedLoanType === '10% Cash Margin';
  }
  serviceCheck(data) {
    this.isSecurity = data;
    console.log('selected?', this.isSecurity);
  }
  naturalPersonCheck(data) {
    this.isNatural = data;
    console.log('selected?', this.isNatural);
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
    this.form.get('nameOfBranchManagerTrans').patchValue(this.translatedValues.nameOfBranchManager);
    this.form.get('nameOfRelationalManagerTrans').patchValue(this.translatedValues.nameOfRelationalManager);
    this.form.get('TdHolderTrans').patchValue(this.translatedValues.TdHolder);
    this.form.get('TDAmountTrans').patchValue(this.translatedValues.TDAmount);
    this.form.get('TdHoldingTrans').patchValue(this.translatedValues.TdHolding);
    this.form.get('accountNumberTrans').patchValue(this.translatedValues.accountNumber);
    this.form.get('drawingPowerTrans').patchValue(this.translatedValues.drawingPower);
    this.form.get('holderNameTrans').patchValue(this.translatedValues.holderName);
    this.form.get('comissionRateTrans').patchValue(this.translatedValues.comissionRate);
    this.form.get('miniumComissionAmountTrans').patchValue(this.translatedValues.miniumComissionAmount);
    this.form.get('detailOfFacilityTrans').patchValue(this.translatedValues.detailOfFacility);
    this.form.get('serviceChargeInPercTrans').patchValue(this.translatedValues.serviceChargeInPerc);
    this.form.get('comissionRateFirstQuarterTrans').patchValue(this.translatedValues.comissionRateFirstQuarter);
    this.form.get('comissionRateOthersQuarterTrans').patchValue(this.translatedValues.comissionRateOthersQuarter);
    this.form.get('tenureFacilityTrans').patchValue(this.translatedValues.tenureFacility);
    this.form.get('naturalPersonCheckTrans').patchValue(this.isNatural);
    this.form.get('FixedDepositTrans').patchValue(this.isFixedDepositSelected);
    this.form.get('OneOffTrans').patchValue(this.isOneoffSelected);
    this.form.get('ForAllLoanTrans').patchValue(this.isAllLoanSelected);
    this.form.get('CommissionType1Trans').patchValue(this.isCommissionType1Selected);
    this.form.get('CommissionType2Trans').patchValue(this.isCommissionType2Selected);
    this.form.get('ForSpecificLoanOnlyTrans').patchValue(this.isSpecificSelected);
    this.form.get('NewTrans').patchValue(this.isNewIsSelected);
    this.form.get('ExistingTrans').patchValue(this.isExistingIsSelected);
    // this.form.get('expiryDateTrans').patchValue(this.translatedValues.expiryDate);
    //  this.form.get('sanctionLetterDateTypeTrans').patchValue(this.translatedValues.sanctionLetterDateType);
    // this.form.get('dateOfApplicationTypeTrans').patchValue(this.translatedValues.dateOfApplicationType);
    // this.form.get('previousSanctionTypeTrans').patchValue(this.translatedValues.previousSanctionType);
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
    this.form.get('loanTypeTrans').patchValue(this.form.get('loanType').value);

    this.form.get('securityTypeTrans').patchValue(this.form.get('securityType').value);
    // Set Translated Sanction letter Date:
    const sanctionLetterType = this.form.get('sanctionLetterDateType').value;
    let approvalDateTrans;
    if (sanctionLetterType === 'AD') {
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
    // set translated expiry date
    const expiryType = this.form.get('dateOfExpiryType').value;
    let expiryDateTrans;
    if (expiryType === 'AD') {
      const expiryForm = this.form.get('dateOfExpiry').value;
      expiryDateTrans = !ObjectUtil.isEmpty(expiryForm) ?
          this.datePipe.transform(expiryForm) : '';
      this.form.get('dateOfExpiryTrans').patchValue(expiryDateTrans);
    } else {
      const expiryNepali = this.form.get('dateOfExpiryNepali').value;
      expiryDateTrans = !ObjectUtil.isEmpty(expiryNepali) ?
          expiryNepali.nDate : '';
      this.form.get('dateOfExpiryNepaliTrans').patchValue(expiryDateTrans);
    }
    // set translated loan expiry date
    const expiryLoanType = this.form.get('loanExpiryType').value;
    let expiryLoanTrans;
    if (expiryLoanType === 'AD') {
      const expiryLoanForm = this.form.get('loanExpiry').value;
      expiryLoanTrans = !ObjectUtil.isEmpty(expiryLoanForm) ?
          this.datePipe.transform(expiryLoanForm) : '';
      this.form.get('loanExpiryTrans').patchValue(expiryLoanTrans);
    } else {
      const expiryLoanNepali = this.form.get('loanExpiryNepali').value;
      expiryLoanTrans = !ObjectUtil.isEmpty(expiryLoanNepali) ?
          expiryLoanNepali.nDate : '';
      this.form.get('loanExpiryNepaliTrans').patchValue(expiryLoanTrans);
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
    const loanLimit = this.form.get('totalLimitInFigure').value;
    if (!ObjectUtil.isEmpty(loanLimit)) {
      const changeNumber = this.convertNumbersToNepali(loanLimit, true);
      this.form.get('totalLimitInFigureTrans').patchValue(changeNumber);
    }
    const loanLimitFig = this.form.get('totalLimitInWords').value;
    if (!ObjectUtil.isEmpty(loanLimitFig)) {
      this.form.get('totalLimitInWordsTrans').patchValue(loanLimitFig);
    }

    const serviceCharge = this.form.get('serviceChargeFigure').value;
    if (!ObjectUtil.isEmpty(serviceCharge)) {
      const changeNumber = this.convertNumbersToNepali(serviceCharge, false);
      this.form.get('serviceChargeFigureTrans').patchValue(changeNumber);
    }
    const serviceChargeFig = this.form.get('serviceChargeWords').value;
    if (!ObjectUtil.isEmpty(serviceChargeFig)) {
      this.form.get('serviceChargeWordsTrans').patchValue(serviceChargeFig);
    }
    // For Required Translation Data:
    this.translateFormGroup = this.formBuilder.group({
      // purposeOfLoan: this.form.get('purposeOfLoan').value,
      // nameOfStaff: this.form.get('nameOfStaff').value,
      // nameOfFacility: this.form.get('nameOfFacility').value,
      nameOfBranchManager: this.form.get('nameOfBranchManager').value,
      sanctionLetterDateType: this.form.get('sanctionLetterDateType').value,
      dateOfApplicationType: this.form.get('dateOfApplicationType').value,
      previousSanctionType: this.form.get('previousSanctionType').value,
      nameOfRelationalManager: this.form.get('nameOfRelationalManager').value,
      dateOfExpiry: this.form.get('dateOfExpiry').value,
      loanExpiry: this.form.get('loanExpiry').value,
      TdHolder: this.form.get('TdHolder').value,
      TDAmount: this.form.get('TDAmount').value,
      TdHolding: this.form.get('TdHolding').value,
      accountNumber: this.form.get('accountNumber').value,
      drawingPower: this.form.get('drawingPower').value,
      holderName: this.form.get('holderName').value,
      comissionRate: this.form.get('comissionRate').value,
      miniumComissionAmount: this.form.get('miniumComissionAmount').value,
      detailOfFacility: this.form.get('detailOfFacility').value,
      serviceChargeInPerc: this.form.get('serviceChargeInPerc').value,
      comissionRateFirstQuarter: this.form.get('comissionRateFirstQuarter').value,
      comissionRateOthersQuarter: this.form.get('comissionRateOthersQuarter').value,
      tenureFacility: this.form.get('tenureFacility').value,
    });
    this.translatedValues = await this.translate(this.translateFormGroup);
    this.setTranslatedData(this.translatedValues);
    this.setCTValuesAfterTranslation();
    this.mappedData();
    this.spinner = false;
    this.saveEnable = true;
  }

  setCTValuesAfterTranslation() {
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
    // Set CT Value of sanction letter date type
    this.form.get('sanctionLetterDateTypeCT').patchValue(this.form.get('sanctionLetterDateType').value);
    if (this.ADSanctionLetterDate) {
      const transDate = this.form.get('sanctionLetterDateTrans').value;
      const convertAppDate = !ObjectUtil.isEmpty(transDate) ? this.engNepDatePipe.transform(transDate, true) : '';
      this.form.get('sanctionLetterDateCT').patchValue(convertAppDate);
    }
    if (this.BSApplication) {
      this.form.get('sanctionLetterDateNepaliCT').patchValue(this.form.get('sanctionLetterDateNepaliTrans').value);
    }
    // Set CT Value of Date of Expiry
    this.form.get('dateOfExpiryTypeCT').patchValue(this.form.get('dateOfExpiryType').value);
    if (this.ADDateOfExpiry) {
      const transDate = this.form.get('dateOfExpiryTrans').value;
      const convertExpDate = !ObjectUtil.isEmpty(transDate) ? this.engNepDatePipe.transform(transDate, true) : '';
      this.form.get('dateOfExpiryCT').patchValue(convertExpDate);
    }
    if (this.BSDateOfExpiry) {
      this.form.get('dateOfExpiryNepaliCT').patchValue(this.form.get('dateOfExpiryNepaliTrans').value);
    }

    // Set CT Value of loan of Expiry
    this.form.get('loanExpiryTypeCT').patchValue(this.form.get('loanExpiryType').value);
    if (this.ADloanExpiry) {
      const transDate = this.form.get('loanExpiryTrans').value;
      const convertExpDate = !ObjectUtil.isEmpty(transDate) ? this.engNepDatePipe.transform(transDate, true) : '';
      this.form.get('loanExpiryCT').patchValue(convertExpDate);
    }
    if (this.BSloanExpiry) {
      this.form.get('loanExpiryNepaliCT').patchValue(this.form.get('loanExpiryNepaliTrans').value);
    }
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

    this.form.get('loanAmountFigureCT').patchValue(this.form.get('loanAmountFigureTrans').value);
    this.form.get('loanAmountFigureWordsCT').patchValue(this.form.get('loanAmountFigureWordsTrans').value);
    // this.form.get('marginInPercentageCT').patchValue(this.form.get('marginInPercentageTrans').value);
    this.form.get('baseRateCT').patchValue(this.form.get('baseRateTrans').value);
    this.form.get('premiumRateCT').patchValue(this.form.get('premiumRateTrans').value);
    this.form.get('interestRateCT').patchValue(this.form.get('interestRateTrans').value);
    this.form.get('nameOfBranchManagerCT').patchValue(this.form.get('nameOfBranchManagerTrans').value);
     this.form.get('nameOfRelationalManagerCT').patchValue(this.form.get('nameOfRelationalManagerTrans').value);
    this.form.get('totalLimitInFigureCT').patchValue(this.form.get('totalLimitInFigureTrans').value);
    this.form.get('totalLimitInWordsCT').patchValue(this.form.get('totalLimitInWordsTrans').value);
    this.form.get('serviceChargeFigureCT').patchValue(this.form.get('serviceChargeFigureTrans').value);
    this.form.get('serviceChargeWordsCT').patchValue(this.form.get('serviceChargeWordsTrans').value);
    this.form.get('TdHolderCT').patchValue(this.form.get('TdHolderTrans').value);
    this.form.get('TDAmountCT').patchValue(this.form.get('TDAmountTrans').value);
    this.form.get('TdHoldingCT').patchValue(this.form.get('TdHoldingTrans').value);
    this.form.get('drawingPowerCT').patchValue(this.form.get('drawingPowerTrans').value);
    this.form.get('accountNumberCT').patchValue(this.form.get('accountNumberTrans').value);
    this.form.get('holderNameCT').patchValue(this.form.get('holderNameTrans').value);
    this.form.get('comissionRateCT').patchValue(this.form.get('comissionRateTrans').value);
    this.form.get('miniumComissionAmountCT').patchValue(this.form.get('miniumComissionAmountTrans').value);
    this.form.get('detailOfFacilityCT').patchValue(this.form.get('detailOfFacilityTrans').value);
    this.form.get('serviceChargeInPercCT').patchValue(this.form.get('serviceChargeInPercTrans').value);
    this.form.get('comissionRateFirstQuarterCT').patchValue(this.form.get('comissionRateFirstQuarterTrans').value);
    this.form.get('comissionRateOthersQuarterCT').patchValue(this.form.get('comissionRateOthersQuarterTrans').value);
    this.form.get('tenureFacilityCT').patchValue(this.form.get('tenureFacilityTrans').value);
    this.form.get('sanctionLetterDateTypeCT').patchValue(this.form.get('sanctionLetterDateTypeTrans').value);
  }
  get Form() {
    return this.form.controls;
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
    this.dialogService.open(ClassASanctionLetterComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: false,
      hasScroll: true,
      dialogClass: 'modal-full',
      context: { cadOfferLetterApprovedDoc: this.customerApprovedDoc,
        preview: true,}
    });
  }
  // deleteCTAndTransContorls from form controls
  deleteCTAndTransContorls(data) {
    const individualData = data as FormGroup;
    Object.keys(data).forEach(key => {
      if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1) {
        delete individualData[key];
      }
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
    // Clear Validation for Date of Expiry:
    if (this.BSDateOfExpiry) {
      this.form.get('dateOfExpiryCT').clearValidators();
      this.form.get('dateOfExpiryCT').updateValueAndValidity();
    } else {
      this.form.get('dateOfExpiryNepaliCT').clearValidators();
      this.form.get('dateOfExpiryNepaliCT').updateValueAndValidity();
    }
    // Clear Validation for loan of Expiry:
    if (this.BSloanExpiry) {
      this.form.get('loanExpiryCT').clearValidators();
      this.form.get('loanExpiryCT').updateValueAndValidity();
    } else {
      this.form.get('loanExpiryNepaliCT').clearValidators();
      this.form.get('loanExpiryNepaliCT').updateValueAndValidity();
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
    if (this.form.invalid) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation'));
      this.spinner = false;
      return;
    }
    this.form.get('naturalPersonCheck').patchValue(this.isNatural);
    this.form.get('FixedDeposit').patchValue(this.isFixedDepositSelected );
    this.form.get('OneOff').patchValue(this.isOneoffSelected );
    this.form.get('ForAllLoan').patchValue(this.isAllLoanSelected );
    this.form.get('CommissionType1').patchValue(this.isCommissionType1Selected );
    this.form.get('CommissionType2Trans').patchValue(this.isCommissionType2Selected );
    this.form.get('ForSpecificLoanOnly').patchValue(this.isSpecificSelected);
    this.form.get('New').patchValue(this.isNewIsSelected);
    this.form.get('Existing').patchValue(this.isExistingIsSelected);
    this.spinner = true;
    this.btnDisable = true;
    console.log('customerApprovedDoc: ', this.customerApprovedDoc);
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';
    if (this.customerApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.CLASS_A_SANCTION_LETTER).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.existingOfferLetter = true;
      }
    }

    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.CLASS_A_SANCTION_LETTER).toString()) {
          this.mappedData();
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
          this.translatedData = {};
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.CLASS_A_SANCTION_LETTER);
      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('Trans') > -1 || key === 'municipalityOrVdc' || key === 'securities' || key.indexOf('CT') > -1) {
          return;
        }
        this.attributes = new Attributes();
        this.attributes.en = this.form.get(key).value;
        console.log('Key:::::', key);
        this.attributes.np = this.tdValues[key];
        this.attributes.ct = this.form.get(key + 'Trans').value;
        this.tdValues[key] = this.attributes;
      });
      this.translatedData = {};
      this.deleteCTAndTransContorls(this.tdValues);
      offerDocument.initialInformation = JSON.stringify(this.tdValues);
      this.customerApprovedDoc.offerDocumentList.push(offerDocument);
    }
    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.previewBtn = false;
      this.btnDisable = false;
      this.closed = true;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.btnDisable = true;
    });
  }
}

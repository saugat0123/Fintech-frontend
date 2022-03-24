import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OfferDocument} from '../../../../../model/OfferDocument';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {CustomerLoanOptions} from '../../../../cad-constant/customer-loan-options';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {AddressService} from '../../../../../../../@core/service/baseservice/address.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {SbTranslateService} from '../../../../../../../@core/service/sbtranslate.service';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../../@core/utils';
import {CadDocStatus} from '../../../../../model/CadDocStatus';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {District} from '../../../../../../admin/modal/district';
import {Attributes} from '../../../../../../../@core/model/attributes';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {UdyamsilKarjaSubsidyComponent} from '../../../../../cad-document-template/nabil/nabil-sme/udyamsil-karja-subsidy/udyamsil-karja-subsidy.component';
import {KisanKarjaSubsidyComponent} from '../../../../../cad-document-template/nabil/nabil-sme/kisan-karja-subsidy/kisan-karja-subsidy.component';
import {KisanKarjaSubsidyPrintComponent} from '../../../../../cad-document-template/nabil/nabil-sme/kisan-karja-subsidy/kisan-karja-subsidy-print/kisan-karja-subsidy-print.component';
import {EnglishDateTransformPipe} from '../../../../../../../@core/pipe/english-date-transform.pipe';
import {RequiredLegalDocumentSectionComponent} from '../../sme-template-data/sme-master-template/required-legal-document-section/required-legal-document-section.component';

@Component({
  selector: 'app-kisan-karja-subsidy-template-edit',
  templateUrl: './kisan-karja-subsidy-template-edit.component.html',
  styleUrls: ['./kisan-karja-subsidy-template-edit.component.scss']
})
export class KisanKarjaSubsidyTemplateEditComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() initialInformation: any;
  @ViewChild('requiredLegalDocument', {static: false})
  requiredLegalDocumentSectionComponent: RequiredLegalDocumentSectionComponent;
  kisanKarjaSubsidy: FormGroup;
  spinner = false;
  customerLoanOptions: Array<String> = new Array<String>();
  isLoanOptionSelected = false;
  ADApproval = false;
  BSApproval = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADApplication = false;
  BSApplication = false;
  ADReview = false;
  BSReview = false;
  ADPrevious = false;
  BSPrevious = false;
  municipalityListForSecurities = [];
  provinceList = [];
  allDistrictList = [];
  selectedAD = true;
  isInterestSubsidy = false;
  isCollateral = false;
  isCustomerNew = false;
  attributes;
  translatedValues: any = {};
  tdVal: any = {};
  translateFormGroup: FormGroup;
  oneForm: FormGroup;
  offerLetterDocument: OfferDocument;
  cadDocStatus;
  offerLetterConst = NabilOfferLetterConst;
  isPreview = false;
  saveEnable = false;
  closeEnable = false;
  submitted = false;
  loanOptions = CustomerLoanOptions;
  securities;

  constructor(private formBuilder: FormBuilder,
              private dialogService: NbDialogService,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private addressService: AddressService,
              private modalService: NgbModal,
              private dialogRef: NbDialogRef<KisanKarjaSubsidyTemplateEditComponent>,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engNepDatePipe: EngNepDatePipe,
              private engDateTransPipe: EnglishDateTransformPipe,
              private translatedService: SbTranslateService,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private titleCasePipe: TitleCasePipe) {
  }

  ngOnInit() {
    this.buildForm();
    this.getLoanOptionsType();
    // Retrieving Province List:
    this.getAllProvince();
    // Retrieving District List:
    this.getAllDistrict();
    // getting key from cad doc status:
    this.cadDocStatus = CadDocStatus.key();
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      this.isLoanOptionSelected = true;
      const loanType = this.initialInformation.loanOption ?
          this.initialInformation.loanOption.en : '';
      if (loanType === this.loanOptions.NEW) {
        this.isCustomerNew = true;
      }
      const tempInterestSubsidy = this.initialInformation.isInterestSubsidy ?
          this.initialInformation.isInterestSubsidy.en : false;
      if (!ObjectUtil.isEmpty(tempInterestSubsidy)) {
        this.isInterestSubsidy = tempInterestSubsidy;
      }
      const tempCollateral = this.initialInformation.isCollateral ?
          this.initialInformation.isCollateral.en : false;
      if (!ObjectUtil.isEmpty(tempCollateral)) {
        this.isCollateral = tempCollateral;
      }
      // For Date Flag:
      const tempApprovalType = this.initialInformation.dateOfApprovalType ?
          this.initialInformation.dateOfApprovalType.en : '';
      if (tempApprovalType === 'AD') {
        this.ADApproval = true;
      }
      if (tempApprovalType === 'BS') {
        this.BSApproval = true;
      }

      const tempApplicationType = this.initialInformation.dateOfApplicationType ?
          this.initialInformation.dateOfApplicationType.en : '';
      if (tempApplicationType === 'AD') {
        this.ADApplication = true;
      }
      if (tempApplicationType === 'BS') {
        this.BSApplication = true;
      }

      const tempNextReviewType = this.initialInformation.nextReviewDateType ?
          this.initialInformation.nextReviewDateType.en : '';
      if (tempNextReviewType === 'AD') {
        this.ADReview = true;
      }
      if (tempNextReviewType === 'BS') {
        this.BSReview = true;
      }

      /* For Date of Previous Date*/
      const tempPrevDate = this.initialInformation.previousSanctionType ?
          this.initialInformation.previousSanctionType.en : '';
      if (tempPrevDate === 'AD') {
        this.ADPrevious = true;
      }
      if (tempPrevDate === 'BS') {
        this.BSPrevious = true;
      }
      this.setKisanLoanTemplateData();
    }
  }

  getLoanOptionsType() {
    CustomerLoanOptions.enumObject().forEach(val => {
      this.customerLoanOptions.push(val);
    });
  }

  buildForm() {
    this.kisanKarjaSubsidy = this.formBuilder.group({
      loanOption: [undefined],
      repaymentType: [undefined],
      dateOfApprovalType: [undefined],
      dateOfApprovalNepali: [undefined],
      dateOfApproval: [undefined],
      purposeOfLoan: [undefined],
      dateOfApplicationType: [undefined],
      dateOfApplicationNepali: [undefined],
      dateOfApplication: [undefined],
      /////////
      nextReviewDate : [undefined],
      nextReviewDateType : [undefined],
      nextReviewDateNepali : [undefined],
      /////////
      previousSanctionType: [undefined],
      previousSanctionDateNepali: [undefined],
      previousSanctionDate: [undefined],
      loanAmountFigure: [undefined],
      loanAmountFigureWords: [undefined],
      marginInPercentage: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      serviceCharge: [undefined],
      totalTenureOfLoan: [undefined],
      commitmentFee: [undefined],
      circularRate: [undefined],
      nameOfStaff: [undefined],
      nameOfBranchManager: [undefined],
      interestSubsidy: [undefined],
      collateral: [undefined],
      securities: this.formBuilder.array([]),
      // FIELDS FOR TRANSLATED FIELDS (TRANS):
      loanOptionTrans: [undefined],
      repaymentTypeTrans: [undefined],
      dateOfApprovalTypeTrans: [undefined],
      dateOfApprovalTrans: [undefined],
      dateOfApprovalNepaliTrans: [undefined],
      dateOfApplicationTypeTrans: [undefined],
      dateOfApplicationTrans: [undefined],
      dateOfApplicationNepaliTrans: [undefined],
      ////////
      nextReviewDateTypeTrans: [undefined],
      nextReviewDateTrans: [undefined],
      nextReviewDateNepaliTrans: [undefined],
      ///////
      previousSanctionTypeTrans: [undefined],
      previousSanctionDateTrans: [undefined],
      previousSanctionDateNepaliTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      loanAmountFigureTrans: [undefined],
      loanAmountFigureWordsTrans: [undefined],
      marginInPercentageTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      serviceChargeTrans: [undefined],
      totalTenureOfLoanTrans: [undefined],
      commitmentFeeTrans: [undefined],
      circularRateTrans: [undefined],
      nameOfStaffTrans: [undefined],
      nameOfBranchManagerTrans: [undefined],
      interestSubsidyTrans: [undefined],
      collateralTrans: [undefined],
      // FIELDS FOR CT VALUE
      loanOptionCT: [undefined],
      repaymentTypeCT: [undefined],
      dateOfApprovalCT: [undefined, Validators.required],
      dateOfApprovalNepaliCT: [undefined, Validators.required],
      dateOfApplicationCT: [undefined, Validators.required],
      dateOfApplicationNepaliCT: [undefined, Validators.required],
      ////////
      nextReviewDateCT: [undefined, Validators.required],
      nextReviewDateNepaliCT: [undefined, Validators.required],
      ////////////
      previousSanctionDateCT: [undefined, Validators.required],
      previousSanctionDateNepaliCT: [undefined, Validators.required],
      dateOfApprovalTypeCT: [undefined],
      dateOfApplicationTypeCT: [undefined],
      ////////
      nextReviewDateTypeCT: [undefined],
      /////////
      previousSanctionTypeCT: [undefined],
      purposeOfLoanCT: [undefined, Validators.required],
      loanAmountFigureCT: [undefined/*, Validators.required*/],
      loanAmountFigureWordsCT: [undefined/*, Validators.required*/],
      marginInPercentageCT: [undefined, Validators.required],
      baseRateCT: [undefined, Validators.required],
      premiumRateCT: [undefined, Validators.required],
      interestRateCT: [undefined, Validators.required],
      serviceChargeCT: [undefined, Validators.required],
      totalTenureOfLoanCT: [undefined, Validators.required],
      commitmentFeeCT: [undefined, Validators.required],
      circularRateCT: [undefined, Validators.required],
      nameOfStaffCT: [undefined, Validators.required],
      nameOfBranchManagerCT: [undefined, Validators.required],
      interestSubsidyCT: [undefined],
      collateralCT: [undefined],
    });
    /*this.addDefaultSecurity();*/
  }

  transferValue(val) {
    this.isLoanOptionSelected = !ObjectUtil.isEmpty(val);
    this.isCustomerNew = val === 'NEW';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.kisanKarjaSubsidy.get(numLabel).value);
    this.kisanKarjaSubsidy.get(wordLabel).patchValue(transformValue);
  }

  public dateOfApproval(value): void {
    this.ADApproval = value === 'AD';
    this.BSApproval = value === 'BS';
  }

  public dateOfApplication(value): void {
    this.ADApplication = value === 'AD';
    this.BSApplication = value === 'BS';
  }

  public nextReviewDate(value): void {
    this.ADReview = value === 'AD';
    this.BSReview = value === 'BS';
  }

  public previousSanctionDate(value): void {
    this.ADPrevious = value === 'AD';
    this.BSPrevious = value === 'BS';
  }

  calInterestRate() {
    const baseRate = this.kisanKarjaSubsidy.get('baseRate').value;
    const premiumRate = this.kisanKarjaSubsidy.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.kisanKarjaSubsidy.get('interestRate').patchValue(sum);
    // Converting value from existed pipe:
    this.translateNumber('baseRate', 'baseRateTrans');
    this.translateNumber('premiumRate', 'premiumRateTrans');
    this.translateNumber('interestRate', 'interestRateTrans');
  }

  public getAllProvince(): void {
    this.addressService.getProvince().subscribe((response: any) => {
      this.provinceList = response.detail;
    });
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
            this.kisanKarjaSubsidy.get(['securities', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
          }
        }
    );
  }

  setDefaultNepaliResponse(arrName, source, index, target) {
    this.kisanKarjaSubsidy.get([String(arrName), index, String(target)]).patchValue(
        this.kisanKarjaSubsidy.get([String(arrName), index, String(source)]).value.nepaliName);
    this.kisanKarjaSubsidy.get([String(arrName), index, String(source + 'CT')]).patchValue(
        this.kisanKarjaSubsidy.get([String(arrName), index, String(source)]).value.nepaliName);
  }

  addDefaultSecurity() {
    (this.kisanKarjaSubsidy.get('securities') as FormArray).push(
        this.buildSecurityForm()
    );
  }

  removeSecurityDetails(index) {
    (this.kisanKarjaSubsidy.get('securities') as FormArray).removeAt(index);
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

  translateNumber(source, target, currencyFormat?) {
    const formVal = this.kisanKarjaSubsidy.get(source).value;
    if (!ObjectUtil.isEmpty(formVal)) {
      // tslint:disable-next-line:max-line-length
      let formattedVal;
      if (!ObjectUtil.isEmpty(currencyFormat)) {
        formattedVal = this.currencyFormatterPipe.transform(this.kisanKarjaSubsidy.get(source).value.toString());
      } else {
        formattedVal = this.kisanKarjaSubsidy.get(source).value.toString();
      }
      const wordLabelVar = this.engToNepaliNumberPipe.transform(formattedVal);
      this.kisanKarjaSubsidy.get(target).patchValue(wordLabelVar);
    }
  }

  get FormControls() {
    return this.kisanKarjaSubsidy.controls;
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
  public close(): void {
    this.dialogRef.close();
  }
  interestSubsidyCheck(data) {
    this.isInterestSubsidy = data;
    this.kisanKarjaSubsidy.get('interestSubsidy').patchValue(this.isInterestSubsidy);
  }
  collateralCheck(data) {
    this.isCollateral = data;
    this.kisanKarjaSubsidy.get('collateral').patchValue(this.isCollateral);
  }

  mappedData() {
    Object.keys(this.kisanKarjaSubsidy.controls).forEach(key => {
      if (key.indexOf('Trans') > -1 || key === 'municipalityOrVdc' || key === 'securities' || key.indexOf('CT') > -1) {
        return;
      }
      this.attributes = new Attributes();
      this.attributes.en = this.kisanKarjaSubsidy.get(key).value;
      this.attributes.np = this.kisanKarjaSubsidy.get(key + 'Trans').value;
      this.attributes.ct = this.kisanKarjaSubsidy.get(key + 'CT').value;
      this.tdVal[key] = this.attributes;
    });
  }

  async translateAndSetVal() {
    this.spinner = true;
    // Set Translate Data:
    this.kisanKarjaSubsidy.get('interestSubsidy').patchValue(this.isInterestSubsidy);
    this.kisanKarjaSubsidy.get('collateral').patchValue(this.isCollateral);
    this.kisanKarjaSubsidy.get('loanOptionTrans').patchValue(this.kisanKarjaSubsidy.get('loanOption').value);
    this.kisanKarjaSubsidy.get('repaymentTypeTrans').patchValue(this.kisanKarjaSubsidy.get('repaymentType').value);
    // Set Translated Date of Approval
    const approvalType = this.kisanKarjaSubsidy.get('dateOfApprovalType').value;
    let approvalD;
    let approvalDateTrans;
    if (approvalType === 'AD') {
      const approvalForm = this.kisanKarjaSubsidy.get('dateOfApproval').value;
      approvalD = !ObjectUtil.isEmpty(approvalForm) ?
          this.datePipe.transform(approvalForm) : '';
      approvalDateTrans = !ObjectUtil.isEmpty(approvalD) ? this.engNepDatePipe.transform(approvalD, true) : '';
      this.kisanKarjaSubsidy.get('dateOfApprovalTrans').patchValue(approvalDateTrans);
    } else {
      const approvalNepali = this.kisanKarjaSubsidy.get('dateOfApprovalNepali').value;
      approvalDateTrans = !ObjectUtil.isEmpty(approvalNepali) ?
          approvalNepali.nDate : '';
      this.kisanKarjaSubsidy.get('dateOfApprovalNepaliTrans').patchValue(approvalDateTrans);
    }

    // Set Translated Date Of Application:
    const applicationType = this.kisanKarjaSubsidy.get('dateOfApplicationType').value;
    let appDateTrans;
    let applicationDateTrans;
    if (applicationType === 'AD') {
      const applicationForm = this.kisanKarjaSubsidy.get('dateOfApplication').value;
      appDateTrans = !ObjectUtil.isEmpty(applicationForm) ?
          this.datePipe.transform(applicationForm) : '';
      applicationDateTrans = !ObjectUtil.isEmpty(appDateTrans) ? this.engDateTransPipe.transform(appDateTrans, true) : '';
      this.kisanKarjaSubsidy.get('dateOfApplicationTrans').patchValue(applicationDateTrans);
    } else {
      const applicationNepali = this.kisanKarjaSubsidy.get('dateOfApplicationNepali').value;
      applicationDateTrans = !ObjectUtil.isEmpty(applicationNepali) ?
          applicationNepali.nDate : '';
      this.kisanKarjaSubsidy.get('dateOfApplicationNepaliTrans').patchValue(applicationDateTrans);
    }

    // Set Translated Next Review Date:
    const reviewDateType = this.kisanKarjaSubsidy.get('nextReviewDateType').value;
    let reviewDate;
    let reviewDateTrans;
    if (reviewDateType === 'AD') {
      const reviewForm = this.kisanKarjaSubsidy.get('nextReviewDate').value;
      reviewDate = !ObjectUtil.isEmpty(reviewForm) ?
          this.datePipe.transform(reviewForm) : '';
      reviewDateTrans = !ObjectUtil.isEmpty(reviewDate) ? this.engDateTransPipe.transform(reviewDate, true) : '';
      this.kisanKarjaSubsidy.get('nextReviewDateTrans').patchValue(reviewDateTrans);
    } else {
      const reviewNepali = this.kisanKarjaSubsidy.get('nextReviewDateNepali').value;
      reviewDateTrans = !ObjectUtil.isEmpty(reviewNepali) ?
          reviewNepali.nDate : '';
      this.kisanKarjaSubsidy.get('nextReviewDateNepaliTrans').patchValue(reviewDateTrans);
    }

    // Set Translated Date Of previous Sanction letter:
    const previousSanctionType = this.kisanKarjaSubsidy.get('previousSanctionType').value;
    let preSDate;
    let prevSancDate;
    if (previousSanctionType === 'AD') {
      const previousForm = this.kisanKarjaSubsidy.get('previousSanctionDate').value;
      preSDate = !ObjectUtil.isEmpty(previousForm) ?
          this.datePipe.transform(previousForm) : '';
      prevSancDate = !ObjectUtil.isEmpty(preSDate) ? this.engDateTransPipe.transform(preSDate, true) : '';
      this.kisanKarjaSubsidy.get('previousSanctionDateTrans').patchValue(prevSancDate);
    } else {
      const previousNepali = this.kisanKarjaSubsidy.get('previousSanctionDateNepali').value;
      prevSancDate = !ObjectUtil.isEmpty(previousNepali) ?
          previousNepali.nDate : '';
      this.kisanKarjaSubsidy.get('previousSanctionDateNepaliTrans').patchValue(prevSancDate);
    }

    // For Existed Pipe Value :
    const loanAmountData = this.kisanKarjaSubsidy.get('loanAmountFigure').value;
    if (!ObjectUtil.isEmpty(loanAmountData)) {
      const changeNumber = this.convertNumbersToNepali(loanAmountData, true);
      this.kisanKarjaSubsidy.get('loanAmountFigureTrans').patchValue(changeNumber);
    }

    const loanAmountFigData = this.kisanKarjaSubsidy.get('loanAmountFigureWords').value;
    if (!ObjectUtil.isEmpty(loanAmountFigData)) {
      this.kisanKarjaSubsidy.get('loanAmountFigureWordsTrans').patchValue(loanAmountFigData);
    }

    const marginNum = this.kisanKarjaSubsidy.get('marginInPercentage').value;
    if (!ObjectUtil.isEmpty(marginNum)) {
      const convertedMarginNum = this.convertNumbersToNepali(marginNum, false);
      this.kisanKarjaSubsidy.get('marginInPercentageTrans').patchValue(convertedMarginNum);
    }

    const serviceChargeNum = this.kisanKarjaSubsidy.get('serviceCharge').value;
    if (!ObjectUtil.isEmpty(serviceChargeNum)) {
      const convertServiceCharge = this.convertNumbersToNepali(serviceChargeNum, false);
      this.kisanKarjaSubsidy.get('serviceChargeTrans').patchValue(convertServiceCharge);
    }
    const tenureData = this.kisanKarjaSubsidy.get('totalTenureOfLoan').value;
    if (!ObjectUtil.isEmpty(tenureData)) {
      const convertTenureData = this.convertNumbersToNepali(tenureData, false);
      this.kisanKarjaSubsidy.get('totalTenureOfLoanTrans').patchValue(convertTenureData);
    }

    const commitmentData = this.kisanKarjaSubsidy.get('commitmentFee').value;
    if (!ObjectUtil.isEmpty(commitmentData)) {
      const convertCommitment = this.convertNumbersToNepali(commitmentData, false);
      this.kisanKarjaSubsidy.get('commitmentFeeTrans').patchValue(convertCommitment);
    }

    const circularRateData = this.kisanKarjaSubsidy.get('circularRate').value;
    if (!ObjectUtil.isEmpty(circularRateData)) {
      const convertCircular = this.convertNumbersToNepali(circularRateData, false);
      this.kisanKarjaSubsidy.get('circularRateTrans').patchValue(convertCircular);
    }

    // For Required Translation Data:
    this.translateFormGroup = this.formBuilder.group({
      purposeOfLoan: this.kisanKarjaSubsidy.get('purposeOfLoan').value,
      nameOfStaff: this.kisanKarjaSubsidy.get('nameOfStaff').value,
      nameOfBranchManager: this.kisanKarjaSubsidy.get('nameOfBranchManager').value,
      interestSubsidy: this.kisanKarjaSubsidy.get('interestSubsidy').value,
      collateral: this.kisanKarjaSubsidy.get('collateral').value,
      dateOfApprovalType: this.kisanKarjaSubsidy.get('dateOfApprovalType').value,
      dateOfApplicationType: this.kisanKarjaSubsidy.get('dateOfApplicationType').value,
      nextReviewDateType: this.kisanKarjaSubsidy.get('nextReviewDateType').value,
      previousSanctionType: this.kisanKarjaSubsidy.get('previousSanctionType').value,
    });
    this.translatedValues = await this.translate(this.translateFormGroup);
    this.setTranslatedData(this.translatedValues);
    this.setCTValuesAfterTranslation();
    this.mappedData();
    this.spinner = false;
    this.saveEnable = true;
  }

  async translate(form) {
    this.spinner = true;
    const translatedData = await this.translatedService.translateForm(form);
    this.spinner = false;
    return translatedData;
  }

  async onChangeTranslateSecurity(arrName, source, index, target) {
    this.oneForm = this.formBuilder.group({
      securityOwnersName: this.kisanKarjaSubsidy.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translatedService.translateForm(this.oneForm);
    this.kisanKarjaSubsidy.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.kisanKarjaSubsidy.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }

  translateSecurityDetailsNumberFields(arrName, source, index, target) {
    const translatedNepaliNum = this.engToNepaliNumberPipe.transform(
        String(this.kisanKarjaSubsidy.get([String(arrName), index, String(source)]).value));
    this.kisanKarjaSubsidy.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
    this.kisanKarjaSubsidy.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
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

  public municipalityByDistrictIdForEdit(data, index?): void {
    const district = new District();
    district.id = data;
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalityListForSecurities[index] = response.detail;
          this.municipalityListForSecurities[index].sort((a, b) => a.name.localeCompare(b.name));

        }
    );
  }
  setTranslatedData(data) {
    // SET TRANSLATED DATA:
    this.kisanKarjaSubsidy.get('purposeOfLoanTrans').patchValue(this.translatedValues.purposeOfLoan);
    this.kisanKarjaSubsidy.get('nameOfStaffTrans').patchValue(this.translatedValues.nameOfStaff);
    this.kisanKarjaSubsidy.get('nameOfBranchManagerTrans').patchValue(this.translatedValues.nameOfBranchManager);
    this.kisanKarjaSubsidy.get('interestSubsidyTrans').patchValue(this.translatedValues.interestSubsidy);
    this.kisanKarjaSubsidy.get('collateralTrans').patchValue(this.translatedValues.collateral);
    this.kisanKarjaSubsidy.get('dateOfApprovalTypeTrans').patchValue(this.translatedValues.dateOfApprovalType);
    this.kisanKarjaSubsidy.get('dateOfApplicationTypeTrans').patchValue(this.translatedValues.dateOfApplicationType);
    this.kisanKarjaSubsidy.get('nextReviewDateTypeTrans').patchValue(this.translatedValues.nextReviewDateType);
    this.kisanKarjaSubsidy.get('previousSanctionTypeTrans').patchValue(this.translatedValues.previousSanctionType);
  }

  setCTValuesAfterTranslation() {
    // Set CT Value for every fields:
    this.kisanKarjaSubsidy.get('loanOptionCT').patchValue(this.kisanKarjaSubsidy.get('loanOption').value);
    this.kisanKarjaSubsidy.get('repaymentTypeCT').patchValue(this.kisanKarjaSubsidy.get('repaymentType').value);
    this.kisanKarjaSubsidy.get('dateOfApprovalTypeCT').patchValue(this.kisanKarjaSubsidy.get('dateOfApprovalType').value);
    if (this.ADApproval) {
      const transDate = this.kisanKarjaSubsidy.get('dateOfApprovalTrans').value;
      this.kisanKarjaSubsidy.get('dateOfApprovalCT').patchValue(transDate);
    }
    if (this.BSApproval) {
      this.kisanKarjaSubsidy.get('dateOfApprovalNepaliCT').patchValue(this.kisanKarjaSubsidy.get('dateOfApprovalNepaliTrans').value);
    }

    // SET CT VALUE OF DATE OF APPLICATION
    this.kisanKarjaSubsidy.get('dateOfApplicationTypeCT').patchValue(this.kisanKarjaSubsidy.get('dateOfApplicationType').value);
    if (this.ADApplication) {
      const transDate = this.kisanKarjaSubsidy.get('dateOfApplicationTrans').value;
      this.kisanKarjaSubsidy.get('dateOfApplicationCT').patchValue(transDate);
    }
    if (this.BSApplication) {
      this.kisanKarjaSubsidy.get('dateOfApplicationNepaliCT').patchValue(this.kisanKarjaSubsidy.get('dateOfApplicationNepaliTrans').value);
    }
    // SET CT VALUE OF NEXT REVIEW DATE
    this.kisanKarjaSubsidy.get('nextReviewDateTypeCT').patchValue(this.kisanKarjaSubsidy.get('nextReviewDateType').value);
    if (this.ADReview) {
      const transNextReviewDate = this.kisanKarjaSubsidy.get('nextReviewDateTrans').value;
      this.kisanKarjaSubsidy.get('nextReviewDateCT').patchValue(transNextReviewDate);
    }
    if (this.BSReview) {
      this.kisanKarjaSubsidy.get('nextReviewDateNepaliCT').patchValue(this.kisanKarjaSubsidy.get('nextReviewDateNepaliTrans').value);
    }

    // SET PREVIOUS SANCTION LETTER DATE
    this.kisanKarjaSubsidy.get('previousSanctionTypeCT').patchValue(this.kisanKarjaSubsidy.get('previousSanctionType').value);
    if (this.ADPrevious) {
      const transPreviousDate = this.kisanKarjaSubsidy.get('previousSanctionDateTrans').value;
      this.kisanKarjaSubsidy.get('previousSanctionDateCT').patchValue(transPreviousDate);
    }
    if (this.BSPrevious) {
      this.kisanKarjaSubsidy.get('previousSanctionDateNepaliCT').patchValue(
          this.kisanKarjaSubsidy.get('previousSanctionDateNepaliTrans').value);
    }
    this.kisanKarjaSubsidy.get('purposeOfLoanCT').patchValue(this.kisanKarjaSubsidy.get('purposeOfLoanTrans').value);
    this.kisanKarjaSubsidy.get('loanAmountFigureCT').patchValue(this.kisanKarjaSubsidy.get('loanAmountFigureTrans').value);
    this.kisanKarjaSubsidy.get('loanAmountFigureWordsCT').patchValue(this.kisanKarjaSubsidy.get('loanAmountFigureWordsTrans').value);
    this.kisanKarjaSubsidy.get('marginInPercentageCT').patchValue(this.kisanKarjaSubsidy.get('marginInPercentageTrans').value);
    this.kisanKarjaSubsidy.get('baseRateCT').patchValue(this.kisanKarjaSubsidy.get('baseRateTrans').value);
    this.kisanKarjaSubsidy.get('premiumRateCT').patchValue(this.kisanKarjaSubsidy.get('premiumRateTrans').value);
    this.kisanKarjaSubsidy.get('interestRateCT').patchValue(this.kisanKarjaSubsidy.get('interestRateTrans').value);
    this.kisanKarjaSubsidy.get('serviceChargeCT').patchValue(this.kisanKarjaSubsidy.get('serviceChargeTrans').value);
    this.kisanKarjaSubsidy.get('totalTenureOfLoanCT').patchValue(this.kisanKarjaSubsidy.get('totalTenureOfLoanTrans').value);
    this.kisanKarjaSubsidy.get('commitmentFeeCT').patchValue(this.kisanKarjaSubsidy.get('commitmentFeeTrans').value);
    this.kisanKarjaSubsidy.get('circularRateCT').patchValue(this.kisanKarjaSubsidy.get('circularRateTrans').value);
    this.kisanKarjaSubsidy.get('nameOfStaffCT').patchValue(this.kisanKarjaSubsidy.get('nameOfStaffTrans').value);
    this.kisanKarjaSubsidy.get('nameOfBranchManagerCT').patchValue(this.kisanKarjaSubsidy.get('nameOfBranchManagerTrans').value);
    this.kisanKarjaSubsidy.get('interestSubsidyCT').patchValue(this.kisanKarjaSubsidy.get('interestSubsidy').value);
    this.kisanKarjaSubsidy.get('collateralCT').patchValue(this.kisanKarjaSubsidy.get('collateral').value);
  }

  clearConditionalValidation() {
    // Clear Validation for Approval Date:
    if (this.BSApproval) {
      this.kisanKarjaSubsidy.get('dateOfApprovalCT').clearValidators();
      this.kisanKarjaSubsidy.get('dateOfApprovalCT').updateValueAndValidity();
    } else {
      this.kisanKarjaSubsidy.get('dateOfApprovalNepaliCT').clearValidators();
      this.kisanKarjaSubsidy.get('dateOfApprovalNepaliCT').updateValueAndValidity();
    }
    // Clear Validation for Application Date:
    if (this.BSApplication) {
      this.kisanKarjaSubsidy.get('dateOfApplicationCT').clearValidators();
      this.kisanKarjaSubsidy.get('dateOfApplicationCT').updateValueAndValidity();
    } else {
      this.kisanKarjaSubsidy.get('dateOfApplicationNepaliCT').clearValidators();
      this.kisanKarjaSubsidy.get('dateOfApplicationNepaliCT').updateValueAndValidity();
    }
    // Clear Validation for Next Review Date:
    if (this.BSReview) {
      this.kisanKarjaSubsidy.get('nextReviewDateCT').clearValidators();
      this.kisanKarjaSubsidy.get('nextReviewDateCT').updateValueAndValidity();
    } else {
      this.kisanKarjaSubsidy.get('nextReviewDateNepaliCT').clearValidators();
      this.kisanKarjaSubsidy.get('nextReviewDateNepaliCT').updateValueAndValidity();
    }
    const tempSelectedOption = this.kisanKarjaSubsidy.get('loanOption').value;
    // Clear Validation for previous Sanction Date:
    if (tempSelectedOption === this.loanOptions.EXISTING) {
      if (this.BSPrevious) {
        this.kisanKarjaSubsidy.get('previousSanctionDateCT').clearValidators();
        this.kisanKarjaSubsidy.get('previousSanctionDateCT').updateValueAndValidity();
      } else {
        this.kisanKarjaSubsidy.get('previousSanctionDateNepaliCT').clearValidators();
        this.kisanKarjaSubsidy.get('previousSanctionDateNepaliCT').updateValueAndValidity();
      }
    } else {
      this.kisanKarjaSubsidy.get('previousSanctionDateNepaliCT').clearValidators();
      this.kisanKarjaSubsidy.get('previousSanctionDateNepaliCT').updateValueAndValidity();
      this.kisanKarjaSubsidy.get('previousSanctionDateCT').clearValidators();
      this.kisanKarjaSubsidy.get('previousSanctionDateCT').updateValueAndValidity();
    }
    // Clear Validation for other optional fields.
    // Clear Validation for other optional fields.
    if (this.isInterestSubsidy) {
      this.kisanKarjaSubsidy.get('serviceChargeCT').clearValidators();
      this.kisanKarjaSubsidy.get('serviceChargeCT').updateValueAndValidity();
      this.kisanKarjaSubsidy.get('commitmentFeeCT').clearValidators();
      this.kisanKarjaSubsidy.get('commitmentFeeCT').updateValueAndValidity();
    } else {
      this.kisanKarjaSubsidy.get('circularRateCT').clearValidators();
      this.kisanKarjaSubsidy.get('circularRateCT').updateValueAndValidity();
    }
  }

  submit() {
    this.submitted = true;
    // const securityDetails = [{
    //     securities: this.kisanKarjaSubsidy.get('securities').value,
    // }];
    this.tdVal['securities'] = this.kisanKarjaSubsidy.get('securities').value;
    const tempRequiredDocuments = this.setRequiredDocuments();
    this.tdVal['requiredDocuments'] = tempRequiredDocuments;
    // For Clearing validation of optional and conditional Fields.
    this.clearConditionalValidation();
    const invalidControls = [];
    const controls = this.kisanKarjaSubsidy.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(this.titleCasePipe.transform(name).replace('CT', '').replace('Trans', ''));
      }
    }
    if (this.kisanKarjaSubsidy.invalid) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Please Check validation For :\n' + invalidControls.filter((
          value, index, self) => self.indexOf(value) === index).join(', ')));
      this.spinner = false;
      return;
    }

    this.spinner = true;
    this.customerApprovedDoc.docStatus = this.cadDocStatus[0];

    if (this.customerApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.KISAN_KARJA_SUBSIDY).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
          if (offerLetterPath.docName.toString() ===
              this.offerLetterConst.value(this.offerLetterConst.KISAN_KARJA_SUBSIDY).toString()) {
            offerLetterPath.initialInformation = JSON.stringify(this.tdVal);
          }
        });
      }
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.KISAN_KARJA_SUBSIDY);
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
      this.spinner = false;
      this.isPreview = false;
      this.saveEnable = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
    });
  }

  // TODO Need to pass context based on the template design
  openModal() {
    this.dialogService.open(KisanKarjaSubsidyComponent, {
      closeOnBackdropClick: false,
      hasBackdrop: false,
      hasScroll: true,
      dialogClass: 'modal-full',
      context: {
        cadOfferLetterApprovedDoc: this.customerApprovedDoc,
        preview : true
      }
    });
  }

  /* Clear Form */
  clearForm(controlName) {
    this.kisanKarjaSubsidy.get(controlName).setValue(null);
    this.kisanKarjaSubsidy.get(controlName + 'Trans').setValue(null);
    this.kisanKarjaSubsidy.get(controlName + 'CT').setValue(null);
  }

  clearSecurityMunType(controlName, index, formArrayName) {
    const tempVal = this.kisanKarjaSubsidy.get([formArrayName, index, 'securityOwnersMunicipalityOrVdc']).value;
    if (tempVal === 'VDC') {
      this.kisanKarjaSubsidy.get([formArrayName, index, controlName]).setValue(null);
    }
  }
// Set Template Data:
  setKisanLoanTemplateData() {
    // SET EN VALUE OF FORM
    this.kisanKarjaSubsidy.get('loanOption').patchValue(this.initialInformation.loanOption.en);
    this.kisanKarjaSubsidy.get('repaymentType').patchValue(this.initialInformation.repaymentType.en);
    /*Set Interest Subsidy */
    const tempInterestSub = this.initialInformation.interestSubsidy ?
        this.initialInformation.interestSubsidy.en : false;
    if (!ObjectUtil.isEmpty(tempInterestSub)) {
      this.isInterestSubsidy = tempInterestSub;
    }
    const tempCollateral = this.initialInformation.collateral ?
        this.initialInformation.collateral.en : false;
    if (!ObjectUtil.isEmpty(tempCollateral)) {
      this.isCollateral = tempCollateral;
    }
    this.kisanKarjaSubsidy.get('interestSubsidy').patchValue(this.initialInformation.interestSubsidy.en);
    this.kisanKarjaSubsidy.get('collateral').patchValue(this.initialInformation.collateral.en);
    this.kisanKarjaSubsidy.get('dateOfApprovalType').patchValue(this.initialInformation.dateOfApprovalType.en);
    // SET FIELD FOR DATE OF APPROVAL
    if (this.initialInformation.dateOfApprovalType.en === 'AD') {
      this.kisanKarjaSubsidy.get('dateOfApproval').patchValue(new Date(this.initialInformation.dateOfApproval.en));
    } else {
      const tempApprovalNep = !ObjectUtil.isEmpty(this.initialInformation.dateOfApprovalNepali) ?
          this.initialInformation.dateOfApprovalNepali.en : '';
      this.kisanKarjaSubsidy.get('dateOfApprovalNepali').patchValue(tempApprovalNep);
    }

    // SET FIELD FOR DATE OF APPLICATION:
    this.kisanKarjaSubsidy.get('purposeOfLoan').patchValue(this.initialInformation.purposeOfLoan.en);
    const appDate = !ObjectUtil.isEmpty(this.initialInformation.dateOfApplicationType) ?
        this.initialInformation.dateOfApplicationType.en : '';
    this.kisanKarjaSubsidy.get('dateOfApplicationType').patchValue(appDate);
    if (appDate === 'AD') {
      const tempAppEng = this.initialInformation.dateOfApplication ? this.initialInformation.dateOfApplication.en : '';
      this.kisanKarjaSubsidy.get('dateOfApplication').patchValue(new Date(tempAppEng));
    } else {
      const tempAppNep = this.initialInformation.dateOfApplicationNepali ?
          this.initialInformation.dateOfApplicationNepali.en : '';
      this.kisanKarjaSubsidy.get('dateOfApplicationNepali').patchValue(tempAppNep);
    }
// SET FIELD FOR NEXT REVIEW :
    this.kisanKarjaSubsidy.get('purposeOfLoan').patchValue(this.initialInformation.purposeOfLoan.en);
    const reviewDate = !ObjectUtil.isEmpty(this.initialInformation.nextReviewDateType) ?
        this.initialInformation.nextReviewDateType.en : '';
    this.kisanKarjaSubsidy.get('nextReviewDateType').patchValue(reviewDate);
    if (reviewDate === 'AD') {
      const tempAppEng = this.initialInformation.nextReviewDate ? this.initialInformation.nextReviewDate.en : '';
      this.kisanKarjaSubsidy.get('nextReviewDate').patchValue(new Date(tempAppEng));
    } else {
      const tempAppNep = this.initialInformation.nextReviewDateNepali ?
          this.initialInformation.nextReviewDateNepali.en : '';
      this.kisanKarjaSubsidy.get('nextReviewDateNepali').patchValue(tempAppNep);
    }
    // SET DATE FOR DATE OF PREVIOUS SANCTION LETTER DATE:
    if (!this.isCustomerNew) {
      this.kisanKarjaSubsidy.get('previousSanctionType').patchValue(this.initialInformation.previousSanctionType.en);
      const prevSancType = this.initialInformation.previousSanctionType ?
          this.initialInformation.previousSanctionType.en : '';
      if (prevSancType === 'AD') {
        const tempPrevDate = this.initialInformation.previousSanctionDate ?
            this.initialInformation.previousSanctionDate.en : '';
        this.kisanKarjaSubsidy.get('previousSanctionDate').patchValue(new Date(tempPrevDate));
      } else {
        const tempPrevNep = this.initialInformation.previousSanctionDateNepali ?
            this.initialInformation.previousSanctionDateNepali.en : '';
        this.kisanKarjaSubsidy.get('previousSanctionDateNepali').patchValue(tempPrevNep);
      }
    }

    // Patch value for other remaining fields:
    this.kisanKarjaSubsidy.get('loanAmountFigure').patchValue(this.initialInformation.loanAmountFigure.en);
    this.kisanKarjaSubsidy.get('loanAmountFigureWords').patchValue(this.initialInformation.loanAmountFigureWords.en);
    this.kisanKarjaSubsidy.get('marginInPercentage').patchValue(this.initialInformation.marginInPercentage.en);
    this.kisanKarjaSubsidy.get('baseRate').patchValue(this.initialInformation.baseRate.en);
    this.kisanKarjaSubsidy.get('premiumRate').patchValue(this.initialInformation.premiumRate.en);
    this.kisanKarjaSubsidy.get('interestRate').patchValue(this.initialInformation.interestRate.en);
    this.kisanKarjaSubsidy.get('serviceCharge').patchValue(this.initialInformation.serviceCharge.en);
    this.kisanKarjaSubsidy.get('totalTenureOfLoan').patchValue(this.initialInformation.totalTenureOfLoan.en);
    this.kisanKarjaSubsidy.get('commitmentFee').patchValue(this.initialInformation.commitmentFee.en);
    this.kisanKarjaSubsidy.get('circularRate').patchValue(this.initialInformation.circularRate.en);
    this.kisanKarjaSubsidy.get('nameOfStaff').patchValue(this.initialInformation.nameOfStaff.en);
    this.kisanKarjaSubsidy.get('nameOfBranchManager').patchValue(this.initialInformation.nameOfBranchManager.en);

    /* Set Translated Value of Form*/
    this.setTransData();

    /* Set CT VALUE of Form */
    this.kisanKarjaSubsidy.get('dateOfApprovalCT').patchValue(this.initialInformation.dateOfApproval.ct);
    this.kisanKarjaSubsidy.get('dateOfApprovalNepaliCT').patchValue(this.initialInformation.dateOfApprovalNepali.ct);
    this.kisanKarjaSubsidy.get('dateOfApplicationCT').patchValue(this.initialInformation.dateOfApplication.ct);
    this.kisanKarjaSubsidy.get('dateOfApplicationNepaliCT').patchValue(this.initialInformation.dateOfApplicationNepali.ct);
    this.kisanKarjaSubsidy.get('nextReviewDateCT').patchValue(this.initialInformation.nextReviewDate.ct);
    this.kisanKarjaSubsidy.get('nextReviewDateNepaliCT').patchValue(this.initialInformation.nextReviewDateNepali.ct);
    this.kisanKarjaSubsidy.get('previousSanctionDateCT').patchValue(this.initialInformation.previousSanctionDate.ct);
    this.kisanKarjaSubsidy.get('previousSanctionDateNepaliCT').patchValue(this.initialInformation.previousSanctionDateNepali.ct);
    this.kisanKarjaSubsidy.get('purposeOfLoanCT').patchValue(this.initialInformation.purposeOfLoan.ct);
    this.kisanKarjaSubsidy.get('loanAmountFigureCT').patchValue(this.initialInformation.loanAmountFigure.ct);
    this.kisanKarjaSubsidy.get('loanAmountFigureWordsCT').patchValue(this.initialInformation.loanAmountFigureWords.ct);
    this.kisanKarjaSubsidy.get('marginInPercentageCT').patchValue(this.initialInformation.marginInPercentage.ct);
    this.kisanKarjaSubsidy.get('baseRateCT').patchValue(this.initialInformation.baseRate.ct);
    this.kisanKarjaSubsidy.get('premiumRateCT').patchValue(this.initialInformation.premiumRate.ct);
    this.kisanKarjaSubsidy.get('interestRateCT').patchValue(this.initialInformation.interestRate.ct);
    this.kisanKarjaSubsidy.get('serviceChargeCT').patchValue(this.initialInformation.serviceCharge.ct);
    this.kisanKarjaSubsidy.get('totalTenureOfLoanCT').patchValue(this.initialInformation.totalTenureOfLoan.ct);
    this.kisanKarjaSubsidy.get('commitmentFeeCT').patchValue(this.initialInformation.commitmentFee.ct);
    this.kisanKarjaSubsidy.get('circularRateCT').patchValue(this.initialInformation.circularRate.ct);
    this.kisanKarjaSubsidy.get('nameOfStaffCT').patchValue(this.initialInformation.nameOfStaff.ct);
    this.kisanKarjaSubsidy.get('nameOfBranchManagerCT').patchValue(this.initialInformation.nameOfBranchManager.ct);
    // Retrieving Security Details:
    if (!ObjectUtil.isEmpty(this.initialInformation.securities)) {
      this.securities = this.initialInformation.securities;
      this.setSecurityData();
    } else {
      this.addDefaultSecurity();
    }
  }

  setTransData() {
    this.kisanKarjaSubsidy.get('dateOfApprovalTrans').patchValue(this.initialInformation.dateOfApproval.np);
    this.kisanKarjaSubsidy.get('dateOfApprovalNepaliTrans').patchValue(this.initialInformation.dateOfApprovalNepali.np);
    this.kisanKarjaSubsidy.get('dateOfApplicationTrans').patchValue(this.initialInformation.dateOfApplication.np);
    this.kisanKarjaSubsidy.get('dateOfApplicationNepaliTrans').patchValue(this.initialInformation.dateOfApplicationNepali.np);
    this.kisanKarjaSubsidy.get('nextReviewDateTrans').patchValue(this.initialInformation.nextReviewDate.np);
    this.kisanKarjaSubsidy.get('nextReviewDateNepaliTrans').patchValue(this.initialInformation.nextReviewDateNepali.np);
    this.kisanKarjaSubsidy.get('previousSanctionDateTrans').patchValue(this.initialInformation.previousSanctionDate.np);
    this.kisanKarjaSubsidy.get('previousSanctionDateNepaliTrans').patchValue(this.initialInformation.previousSanctionDateNepali.np);
    this.kisanKarjaSubsidy.get('purposeOfLoanTrans').patchValue(this.initialInformation.purposeOfLoan.np);
    this.kisanKarjaSubsidy.get('loanAmountFigureTrans').patchValue(this.initialInformation.loanAmountFigure.np);
    this.kisanKarjaSubsidy.get('loanAmountFigureWordsTrans').patchValue(this.initialInformation.loanAmountFigureWords.np);
    this.kisanKarjaSubsidy.get('marginInPercentageTrans').patchValue(this.initialInformation.marginInPercentage.np);
    this.kisanKarjaSubsidy.get('baseRateTrans').patchValue(this.initialInformation.baseRate.np);
    this.kisanKarjaSubsidy.get('premiumRateTrans').patchValue(this.initialInformation.premiumRate.np);
    this.kisanKarjaSubsidy.get('interestRateTrans').patchValue(this.initialInformation.interestRate.np);
    this.kisanKarjaSubsidy.get('serviceChargeTrans').patchValue(this.initialInformation.serviceCharge.np);
    this.kisanKarjaSubsidy.get('totalTenureOfLoanTrans').patchValue(this.initialInformation.totalTenureOfLoan.np);
    this.kisanKarjaSubsidy.get('commitmentFeeTrans').patchValue(this.initialInformation.commitmentFee.np);
    this.kisanKarjaSubsidy.get('circularRateTrans').patchValue(this.initialInformation.circularRate.np);
    this.kisanKarjaSubsidy.get('nameOfStaffTrans').patchValue(this.initialInformation.nameOfStaff.np);
    this.kisanKarjaSubsidy.get('nameOfBranchManagerTrans').patchValue(this.initialInformation.nameOfBranchManager.np);
  }
  setSecurityData(): void {
    const securityForm = this.kisanKarjaSubsidy.get('securities') as FormArray;
    this.securities.forEach((data, index) => {
      this.municipalityByDistrictIdForEdit(data.securityOwnersDistrict ? data.securityOwnersDistrict.id : '', index);
      securityForm.push(
          this.formBuilder.group({
            securityOwnersName: [data.securityOwnersName],
            securityOwnersMunicipalityOrVdc: [data.securityOwnersMunicipalityOrVdc],
            securityOwnersMunicipality: [data.securityOwnersMunicipality],
            securityOwnersDistrict: [data.securityOwnersDistrict],
            securityOwnersWardNo: [data.securityOwnersWardNo],
            securityOwnersPlotNo: [data.securityOwnersPlotNo],
            securityOwnersLandArea: [data.securityOwnersLandArea],
            securityOwnersSheetNo: [data.securityOwnersSheetNo],
            securityOwnersNameTrans: [data.securityOwnersNameTrans],
            securityOwnersDistrictTrans: [data.securityOwnersDistrictTrans],
            securityOwnersMunicipalityTrans: [data.securityOwnersMunicipalityTrans],
            securityOwnersWardNoTrans: [data.securityOwnersWardNoTrans],
            securityOwnersPlotNoTrans: [data.securityOwnersPlotNoTrans],
            securityOwnersLandAreaTrans: [data.securityOwnersLandAreaTrans],
            securityOwnersSheetNoTrans: [data.securityOwnersSheetNoTrans],
            securityOwnersNameCT: [data.securityOwnersNameCT],
            securityOwnersDistrictCT: [data.securityOwnersDistrictCT],
            securityOwnersMunicipalityCT: [data.securityOwnersMunicipalityCT],
            securityOwnersWardNoCT: [data.securityOwnersWardNoCT],
            securityOwnersPlotNoCT: [data.securityOwnersPlotNoCT],
            securityOwnersLandAreaCT: [data.securityOwnersLandAreaCT],
            securityOwnersSheetNoCT: [data.securityOwnersSheetNoCT],
          })
      );
    });
  }
  private setRequiredDocuments() {
    const requiredLegalDocument = this.requiredLegalDocumentSectionComponent.requireDocumentForm.value;
    const requiredData = {
      requiredLegalDocument: requiredLegalDocument,
    };
    return (requiredData);
  }
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}



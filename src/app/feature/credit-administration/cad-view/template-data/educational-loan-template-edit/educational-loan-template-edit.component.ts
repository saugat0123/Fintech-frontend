import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {OfferDocument} from '../../../model/OfferDocument';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Attributes} from '../../../../../@core/model/attributes';
import {RetailProfessionalLoanComponent} from '../../../mega-offer-letter-template/mega-offer-letter/retail-professional-loan/retail-professional-loan.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-educational-loan-template-edit',
  templateUrl: './educational-loan-template-edit.component.html',
  styleUrls: ['./educational-loan-template-edit.component.scss']
})
export class EducationalLoanTemplateEditComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() initialInformation: any;
  @Input() offerLetterId: number;
  tdValues: any = {};
  form: FormGroup;
  objectForm: FormGroup;
  fieldFlag = false;
  selectedSecurityVal;
  selectedCountryVal;
  embassyName;
  spinner = false;
  loanLimit = false;
  existingOfferLetter = false;
  btnDisable = true;
  previewBtn = true;
  offerLetterConst = NabilOfferLetterConst;
  attributes;
  translatedData;
  objectTranslate;
  dateTypeBS = false;
  dateTypeAD = false;
  dateTypeBS1 = false;
  dateTypeAD1 = false;
  provinceList: Array<Province> = new Array<Province>();
  districtList: Array<District> = new Array<District>();
  municipalityList: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
  allDistrictList: Array<District> = new Array<District>();
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  cadDocStatus = CadDocStatus.key();
  offerLetterDocument: OfferDocument;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private dialogService: NbDialogService,
      public modelService: NgbModal,
      private ngDialogRef: NbDialogRef<EducationalLoanTemplateEditComponent>,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private engToNepaliNumberPipe: EngToNepaliNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private addressService: AddressService,
      public  modalService: NgbActiveModal,
  ) {
  }

  get Form() {
    return this.form.controls;
  }

  ngOnInit() {
    this.buildForm();
    // get all province list
    this.getAllProvince();
    // get all district list
    this.getAllDistrict();
    console.log(this.offerDocumentList);
    console.log(this.initialInformation);
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      this.fieldFlag = true;
      this.dateTypeAD = true;
      this.dateTypeAD1 = true;
      this.selectedSecurityVal = this.initialInformation.selectedSecurity.en;
      this.selectedCountryVal = this.initialInformation.selectedCountry.en;
    }
    this.setEducationLoanTemplateData();

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

  public getMunicipalityByDistrict(district): void {
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe((response: any) => {
      this.municipalityList = response.detail;
      this.municipalityList.sort((a, b) => a.name.localeCompare(b.name));
      if (event !== null) {
        this.form.get('municipality').patchValue(null);
      }
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      embassyName: [undefined],
      selectedCountry: [undefined],
      selectedSecurity: [undefined],
      loanLimitChecked: [undefined],

      dateOfApproval: [undefined],
      referenceNumber: [undefined],
      dateOfApplication: [undefined],
      purposeOfLoan: [undefined],
      amountInWords: [undefined],
      fixedDepositReceiptAmountFigure: [undefined],
      fixedDepositReceiptAmountWords: [undefined],
      fixedDepositAmountNumber: [undefined],
      distressValue: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      loanAdminFeeFigure: [undefined],
      loanAdminFeeWords: [undefined],
      emiAmountFigure: [undefined],
      emiAmountWords: [undefined],
      loanPeriodInMonths: [undefined],
      moratoriumPeriodInMonths: [undefined],
      loanCommitmentFeeInPercentage: [undefined],
      fixedDepositHolderName: [undefined],
      fixedDepositAmountFigure: [undefined],
      tenureFixedDeposit: [undefined],
      tenureDepositReceiptNumber: [undefined],
      guarantorName: [undefined],
      nameOfBranch: [undefined],
      nameOfEmbassy: [undefined],
      nameOfFixedDeposit: [undefined],
      pledgeAmountFigure: [undefined],
      insuranceAmountFigure: [undefined],
      relationshipOfficerName: [undefined],
      branchManager: [undefined],
      sakhshiDistrict: [undefined],
      sakhshiMunicipality: [undefined],
      sakhshiWardNo: [undefined],
      sakhshiName: [undefined],
      approvalStaffName: [undefined],
      ownersName: [undefined],
      district: [undefined],
      municipality: [undefined],
      wardNo: [undefined],
      seatNo: [undefined],
      kittaNo: [undefined],
      landArea: [undefined],
      promissoryNoteAmount: [undefined],
      loanDeedAmount: [undefined],

      // Translated Value
      embassyNameTransVal: [undefined],
      selectedCountryTransVal: [undefined],
      selectedSecurityTransVal: [undefined],
      loanLimitCheckedTransVal: [undefined],
      dateOfApprovalTransVal: [undefined],
      referenceNumberTransVal: [undefined, Validators.required],
      dateOfApplicationTransVal: [undefined],
      purposeOfLoanTransVal: [undefined, Validators.required],
      amountInWordsTransVal: [undefined],
      fixedDepositReceiptAmountFigureTransVal: [undefined],
      fixedDepositReceiptAmountWordsTransVal: [undefined, Validators.required],
      fixedDepositAmountNumberTransVal: [undefined],
      distressValueTransVal: [undefined],
      baseRateTransVal: [undefined, Validators.required],
      premiumRateTransVal: [undefined, Validators.required],
      interestRateTransVal: [undefined, Validators.required],
      loanAdminFeeFigureTransVal: [undefined, Validators.required],
      loanAdminFeeWordsTransVal: [undefined, Validators.required],
      emiAmountFigureTransVal: [undefined],
      emiAmountWordsTransVal: [undefined],
      loanPeriodInMonthsTransVal: [undefined],
      moratoriumPeriodInMonthsTransVal: [undefined],
      loanCommitmentFeeInPercentageTransVal: [undefined, Validators.required],
      fixedDepositHolderNameTransVal: [undefined, Validators.required],
      fixedDepositAmountFigureTransVal: [undefined, Validators.required],
      tenureFixedDepositTransVal: [undefined, Validators.required],
      tenureDepositReceiptNumberTransVal: [undefined, Validators.required],
      guarantorNameTransVal: [undefined],
      nameOfBranchTransVal: [undefined],
      nameOfEmbassyTransVal: [undefined],
      nameOfFixedDepositTransVal: [undefined],
      pledgeAmountFigureTransVal: [undefined],
      insuranceAmountFigureTransVal: [undefined],
      relationshipOfficerNameTransVal: [undefined, Validators.required],
      branchManagerTransVal: [undefined, Validators.required],
      sakhshiDistrictTransVal: [undefined],
      sakhshiMunicipalityTransVal: [undefined],
      sakhshiWardNoTransVal: [undefined],
      sakhshiNameTransVal: [undefined],
      approvalStaffNameTransVal: [undefined, Validators.required],
      ownersNameTransVal: [undefined],
      districtTransVal: [undefined],
      municipalityTransVal: [undefined],
      wardNoTransVal: [undefined],
      seatNoTransVal: [undefined],
      kittaNoTransVal: [undefined],
      landAreaTransVal: [undefined],
      promissoryNoteAmountTransVal: [undefined],
      loanDeedAmountTransVal: [undefined],
      municipalityOrVdc: [undefined],
      municipalityOrVdcTransVal: [undefined],
    });
  }

  submit() {
    this.submitted = true;
    if (this.selectedSecurityVal === 'LAND' || this.selectedSecurityVal === 'LAND_AND_BUILDING') {
      this.clearConditionalValidation();
    }
    if (this.form.invalid) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation'));
      this.spinner = false;
      return;
    }
    this.form.get('loanLimitChecked').patchValue(this.loanLimit);
    this.spinner = true;
    this.btnDisable = true;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    if (this.customerApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.EDUCATIONAL).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.existingOfferLetter = true;
      }
    }

    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.EDUCATIONAL).toString()) {
          this.mappedData();
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
          this.translatedData = {};
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.EDUCATIONAL);
      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('TransVal') > -1 || key === 'municipalityOrVdc') {
          return;
        }
        this.attributes = new Attributes();
        this.attributes.en = this.form.get(key).value;
        this.attributes.np = this.tdValues[key];
        this.attributes.ct = this.form.get(key + 'TransVal').value;
        this.tdValues[key] = this.attributes;
      });
      this.translatedData = {};
      this.deleteCTAndTransContorls(this.tdValues);
      offerDocument.initialInformation = JSON.stringify(this.tdValues);
      this.customerApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Update Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.previewBtn = false;
      this.btnDisable = true;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.btnDisable = true;
    });
  }

  transferValue() {
    const country = this.form.get('selectedCountry').value;
    const security = this.form.get('selectedSecurity').value;

    if (!ObjectUtil.isEmpty(country) && !ObjectUtil.isEmpty(security)) {
      this.fieldFlag = true;
      this.selectedCountryVal = country;
      this.selectedSecurityVal = security;
    }
  }

  openModel() {
    this.dialogService.open(RetailProfessionalLoanComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false,
      context: {
        cadOfferLetterApprovedDoc: this.customerApprovedDoc,
        preview: true,
      }
    });
  }

  onClose() {
    this.modelService.dismissAll();
  }

  public close(): void {
    this.ngDialogRef.close();
  }

  async translate() {
    this.spinner = true;
    this.translatedData = await this.translateService.translateForm(this.form);
    this.tdValues = this.translatedData;
    if (this.selectedSecurityVal === 'LAND' || this.selectedSecurityVal === 'LAND_AND_BUILDING') {
      this.objectForm = this.formBuilder.group({
        district: this.form.get('district').value.name,
        municipality: this.form.get('municipality').value.name,
      });
      this.objectTranslate = await this.translateService.translateForm(this.objectForm);
    }
    this.setTemplatedCTData(this.translatedData);
    this.spinner = false;
    this.btnDisable = false;
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value.toString());
    this.form.get(numLabel + 'TransVal').patchValue(this.engToNepaliNumberPipe.transform(this.form.get(numLabel).value.toString()));
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
    this.form.get(wordLabel + 'TransVal').patchValue(returnVal);
  }

  translateNumber(source, target) {
    console.log(this.form.get(source).value);
    const wordLabelVar = this.engToNepaliNumberPipe.transform(this.form.get(source).value.toString());
    console.log(wordLabelVar);
    this.form.get(target).patchValue(wordLabelVar);
  }

  checkboxVal(event, formControlName) {
    const checkVal = event.target.checked;
    this[formControlName + 'Check'] = checkVal;
    if (!checkVal) {
      this.clearForm(formControlName + 'TransVal');
    }
  }

  clearForm(controlName) {
    this.form.get(controlName).setValue(null);
  }

  mappedData() {
    Object.keys(this.form.controls).forEach(key => {
      if (key.indexOf('TransVal') > -1 || key === 'municipalityOrVdc') {
        return;
      }
      this.attributes = new Attributes();
      this.attributes.en = this.form.get(key).value;
      this.attributes.np = this.tdValues[key];
      this.attributes.ct = this.form.get(key + 'TransVal').value;
      this.tdValues[key] = this.attributes;
    });
  }

  loanChecked(data) {
    this.loanLimit = data;
  }

  setDateTypeBS() {
    this.dateTypeBS = true;
    this.dateTypeAD = false;
  }

  setDateTypeAD() {
    this.dateTypeBS = false;
    this.dateTypeAD = true;
  }

  setDateTypeBS1() {
    this.dateTypeBS1 = true;
    this.dateTypeAD1 = false;
  }

  setDateTypeAD1() {
    this.dateTypeBS1 = false;
    this.dateTypeAD1 = true;
  }

  calInterestRate() {
    const baseRate = this.form.get('baseRate').value;
    const premiumRate = this.form.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.form.get('interestRate').patchValue(sum);
    this.translateNumber('baseRate', 'baseRateTransVal');
    this.translateNumber('premiumRate', 'premiumRateTransVal');
    this.translateNumber('interestRate', 'interestRateTransVal');
  }

  // deleteCTAndTransContorls from form controls
  deleteCTAndTransContorls(data) {
    const individualData = data as FormGroup;
    Object.keys(data).forEach(key => {
      if (key.indexOf('CT') > -1 || key.indexOf('TransVal') > -1) {
        delete individualData[key];
      }
    });
  }

  private setTemplatedCTData(data): void {
    this.form.get('purposeOfLoanTransVal').patchValue(this.translatedData.purposeOfLoan);
    this.form.get('fixedDepositHolderNameTransVal').patchValue(this.translatedData.fixedDepositHolderName);
    this.form.get('relationshipOfficerNameTransVal').patchValue(this.translatedData.relationshipOfficerName);
    this.form.get('branchManagerTransVal').patchValue(this.translatedData.branchManager);
    this.form.get('approvalStaffNameTransVal').patchValue(this.translatedData.approvalStaffName);
    this.form.get('ownersNameTransVal').patchValue(this.translatedData.ownersName);
    this.form.get('seatNoTransVal').patchValue(this.translatedData.seatNo);
    this.form.get('kittaNoTransVal').patchValue(this.translatedData.kittaNo);
    this.form.get('landAreaTransVal').patchValue(this.translatedData.landArea);
    this.form.get('loanLimitCheckedTransVal').patchValue(this.loanLimit);
    if (!ObjectUtil.isEmpty(data.embassyName)) {
      this.form.get('embassyNameTransVal').patchValue(data.embassyName);
    }
    this.form.get('selectedCountryTransVal').patchValue(data.selectedCountry.en);
    this.form.get('selectedSecurityTransVal').patchValue(data.selectedSecurity.en);
    if (this.selectedSecurityVal === 'LAND' || this.selectedSecurityVal === 'LAND_AND_BUILDING') {
      this.form.get('districtTransVal').patchValue(this.objectTranslate.district);
      this.form.get('municipalityTransVal').patchValue(this.objectTranslate.municipality);
    }
  }

  private clearConditionalValidation(): void {
    this.form.get('fixedDepositHolderNameTransVal').clearValidators();
    this.form.get('fixedDepositHolderNameTransVal').updateValueAndValidity();
    this.form.get('fixedDepositReceiptAmountWordsTransVal').clearValidators();
    this.form.get('fixedDepositReceiptAmountWordsTransVal').updateValueAndValidity();
    this.form.get('fixedDepositAmountFigureTransVal').clearValidators();
    this.form.get('fixedDepositAmountFigureTransVal').updateValueAndValidity();
    this.form.get('tenureFixedDepositTransVal').clearValidators();
    this.form.get('tenureFixedDepositTransVal').updateValueAndValidity();
    this.form.get('tenureDepositReceiptNumberTransVal').clearValidators();
    this.form.get('tenureDepositReceiptNumberTransVal').updateValueAndValidity();
  }

  private setEducationLoanTemplateData(): void {
    // set en value
    this.form.get('selectedCountry').patchValue(this.initialInformation.selectedCountry.en);
    this.form.get('selectedSecurity').patchValue(this.initialInformation.selectedSecurity.en);
    this.form.get('dateOfApproval').patchValue(this.initialInformation.dateOfApproval.en);
    this.form.get('referenceNumber').patchValue(this.initialInformation.referenceNumber.en);
    this.form.get('dateOfApplication').patchValue(this.initialInformation.dateOfApplication.en);
    this.form.get('purposeOfLoan').patchValue(this.initialInformation.purposeOfLoan.en);
    this.form.get('fixedDepositReceiptAmountWords').patchValue(this.initialInformation.fixedDepositReceiptAmountWords.en);
    this.form.get('baseRate').patchValue(this.initialInformation.baseRate.en);
    this.form.get('premiumRate').patchValue(this.initialInformation.premiumRate.en);
    this.form.get('interestRate').patchValue(this.initialInformation.interestRate.en);
    this.form.get('loanAdminFeeFigure').patchValue(this.initialInformation.loanAdminFeeFigure.en);
    this.form.get('loanAdminFeeWords').patchValue(this.initialInformation.loanAdminFeeWords.en);
    this.form.get('loanCommitmentFeeInPercentage').patchValue(this.initialInformation.loanCommitmentFeeInPercentage.en);
    this.form.get('fixedDepositHolderName').patchValue(this.initialInformation.fixedDepositHolderName.en);
    this.form.get('fixedDepositAmountFigure').patchValue(this.initialInformation.fixedDepositAmountFigure.en);
    this.form.get('tenureFixedDeposit').patchValue(this.initialInformation.tenureFixedDeposit.en);
    this.form.get('tenureDepositReceiptNumber').patchValue(this.initialInformation.tenureDepositReceiptNumber.en);
    this.form.get('relationshipOfficerName').patchValue(this.initialInformation.relationshipOfficerName.en);
    this.form.get('branchManager').patchValue(this.initialInformation.branchManager.en);
    this.form.get('approvalStaffName').patchValue(this.initialInformation.approvalStaffName.en);
    this.form.get('embassyName').patchValue(this.initialInformation.embassyName.en);
    this.form.get('loanLimitChecked').patchValue(this.initialInformation.loanLimitChecked.en);
    this.form.get('amountInWords').patchValue(this.initialInformation.amountInWords.en);
    this.form.get('fixedDepositReceiptAmountFigure').patchValue(this.initialInformation.fixedDepositReceiptAmountFigure.en);
    this.form.get('fixedDepositAmountNumber').patchValue(this.initialInformation.fixedDepositAmountNumber.en);
    this.form.get('distressValue').patchValue(this.initialInformation.distressValue.en);
    this.form.get('emiAmountFigure').patchValue(this.initialInformation.emiAmountFigure.en);
    this.form.get('emiAmountWords').patchValue(this.initialInformation.emiAmountWords.en);
    this.form.get('loanPeriodInMonths').patchValue(this.initialInformation.loanPeriodInMonths.en);
    this.form.get('moratoriumPeriodInMonths').patchValue(this.initialInformation.moratoriumPeriodInMonths.en);
    this.form.get('guarantorName').patchValue(this.initialInformation.guarantorName.en);
    this.form.get('nameOfBranch').patchValue(this.initialInformation.nameOfBranch.en);
    this.form.get('nameOfEmbassy').patchValue(this.initialInformation.nameOfEmbassy.en);
    this.form.get('nameOfFixedDeposit').patchValue(this.initialInformation.nameOfFixedDeposit.en);
    this.form.get('pledgeAmountFigure').patchValue(this.initialInformation.pledgeAmountFigure.en);
    this.form.get('insuranceAmountFigure').patchValue(this.initialInformation.insuranceAmountFigure.en);
    this.form.get('sakhshiDistrict').patchValue(this.initialInformation.sakhshiDistrict.en);
    this.form.get('sakhshiMunicipality').patchValue(this.initialInformation.sakhshiMunicipality.en);
    this.form.get('sakhshiWardNo').patchValue(this.initialInformation.sakhshiWardNo.en);
    this.form.get('sakhshiName').patchValue(this.initialInformation.sakhshiName.en);
    this.form.get('ownersName').patchValue(this.initialInformation.ownersName.en);
    this.form.get('district').patchValue(this.initialInformation.district.en);
    this.form.get('municipality').patchValue(this.initialInformation.municipality.en);
    this.form.get('wardNo').patchValue(this.initialInformation.wardNo.en);
    this.form.get('seatNo').patchValue(this.initialInformation.seatNo.en);
    this.form.get('kittaNo').patchValue(this.initialInformation.kittaNo.en);
    this.form.get('landArea').patchValue(this.initialInformation.landArea.en);
    this.form.get('promissoryNoteAmount').patchValue(this.initialInformation.promissoryNoteAmount.en);
    this.form.get('loanDeedAmount').patchValue(this.initialInformation.loanDeedAmount.en);

    // set ct value
    this.form.get('referenceNumberTransVal').patchValue(this.initialInformation.referenceNumber.ct);
    this.form.get('purposeOfLoanTransVal').patchValue(this.initialInformation.purposeOfLoan.ct);
    this.form.get('fixedDepositReceiptAmountWords').patchValue(this.initialInformation.fixedDepositReceiptAmountWords.ct);
    this.form.get('baseRateTransVal').patchValue(this.initialInformation.baseRate.ct);
    this.form.get('premiumRateTransVal').patchValue(this.initialInformation.premiumRate.ct);
    this.form.get('interestRateTransVal').patchValue(this.initialInformation.interestRate.ct);
    this.form.get('loanAdminFeeFigureTransVal').patchValue(this.initialInformation.loanAdminFeeFigure.ct);
    this.form.get('loanAdminFeeWordsTransVal').patchValue(this.initialInformation.loanAdminFeeWords.ct);
    this.form.get('loanCommitmentFeeInPercentageTransVal').patchValue(this.initialInformation.loanCommitmentFeeInPercentage.ct);
    this.form.get('fixedDepositHolderNameTransVal').patchValue(this.initialInformation.fixedDepositHolderName.ct);
    this.form.get('fixedDepositAmountFigureTransVal').patchValue(this.initialInformation.fixedDepositAmountFigure.ct);
    this.form.get('fixedDepositReceiptAmountWordsTransVal').patchValue(this.initialInformation.fixedDepositReceiptAmountWords.ct);
    this.form.get('tenureFixedDepositTransVal').patchValue(this.initialInformation.tenureFixedDeposit.ct);
    this.form.get('tenureDepositReceiptNumberTransVal').patchValue(this.initialInformation.tenureDepositReceiptNumber.ct);
    this.form.get('relationshipOfficerNameTransVal').patchValue(this.initialInformation.relationshipOfficerName.ct);
    this.form.get('branchManagerTransVal').patchValue(this.initialInformation.branchManager.ct);
    this.form.get('approvalStaffNameTransVal').patchValue(this.initialInformation.approvalStaffName.ct);
    this.form.get('amountInWordsTransVal').patchValue(this.initialInformation.amountInWords.ct);
    this.form.get('fixedDepositReceiptAmountFigureTransVal').patchValue(this.initialInformation.fixedDepositReceiptAmountFigure.ct);
    this.form.get('fixedDepositAmountNumberTransVal').patchValue(this.initialInformation.fixedDepositAmountNumber.ct);
    this.form.get('distressValueTransVal').patchValue(this.initialInformation.distressValue.ct);
    this.form.get('emiAmountFigureTransVal').patchValue(this.initialInformation.emiAmountFigure.ct);
    this.form.get('emiAmountWordsTransVal').patchValue(this.initialInformation.emiAmountFigure.ct);
    this.form.get('loanPeriodInMonthsTransVal').patchValue(this.initialInformation.loanPeriodInMonths.ct);
    this.form.get('moratoriumPeriodInMonthsTransVal').patchValue(this.initialInformation.moratoriumPeriodInMonths.ct);
    this.form.get('guarantorNameTransVal').patchValue(this.initialInformation.guarantorName.ct);
    this.form.get('nameOfBranchTransVal').patchValue(this.initialInformation.nameOfBranch.ct);
    this.form.get('nameOfEmbassyTransVal').patchValue(this.initialInformation.nameOfEmbassy.ct);
    this.form.get('nameOfFixedDepositTransVal').patchValue(this.initialInformation.nameOfFixedDeposit.ct);
    this.form.get('pledgeAmountFigureTransVal').patchValue(this.initialInformation.pledgeAmountFigure.ct);
    this.form.get('insuranceAmountFigureTransVal').patchValue(this.initialInformation.insuranceAmountFigure.ct);
    this.form.get('sakhshiDistrictTransVal').patchValue(this.initialInformation.sakhshiDistrict.ct);
    this.form.get('sakhshiMunicipalityTransVal').patchValue(this.initialInformation.sakhshiMunicipality.ct);
    this.form.get('sakhshiWardNoTransVal').patchValue(this.initialInformation.sakhshiWardNo.ct);
    this.form.get('sakhshiNameTransVal').patchValue(this.initialInformation.sakhshiName.ct);
    this.form.get('ownersNameTransVal').patchValue(this.initialInformation.ownersName.en);
    this.form.get('districtTransVal').patchValue(this.initialInformation.district.ct);
    this.form.get('municipalityTransVal').patchValue(this.initialInformation.municipality.ct);
    this.form.get('wardNoTransVal').patchValue(this.initialInformation.wardNo.ct);
    this.form.get('seatNoTransVal').patchValue(this.initialInformation.seatNo.en);
    this.form.get('kittaNoTransVal').patchValue(this.initialInformation.kittaNo.en);
    this.form.get('landAreaTransVal').patchValue(this.initialInformation.landArea.en);
    this.form.get('promissoryNoteAmountTransVal').patchValue(this.initialInformation.promissoryNoteAmount.ct);
    this.form.get('loanDeedAmountTransVal').patchValue(this.initialInformation.loanDeedAmount.ct);
  }
}

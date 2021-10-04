import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {OfferDocument} from '../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {RetailProfessionalLoanComponent} from '../../../mega-offer-letter-template/mega-offer-letter/retail-professional-loan/retail-professional-loan.component';
import {Attributes} from '../../../../../@core/model/attributes';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';

@Component({
  selector: 'app-educational-loan-template-data',
  templateUrl: './educational-loan-template-data.component.html',
  styleUrls: ['./educational-loan-template-data.component.scss']
})
export class EducationalLoanTemplateDataComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
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
      private modelService: NgbModal,
      private ngDialogRef: NbDialogRef<EducationalLoanTemplateDataComponent>,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private engToNepaliNumberPipe: EngToNepaliNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private addressService: AddressService,
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
      // guaranteedAmountFigure: [undefined],
      // guaranteedAmountWords: [undefined],
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
      // guaranteedAmountFigureTransVal: [undefined, Validators.required],
      // guaranteedAmountWordsTransVal: [undefined, Validators.required],
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
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
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
      // if (!ObjectUtil.isEmpty(this.form.get('embassyName').value)) {
      //   this.singleTranslate(this.form.get('embassyName').value);
      // }
      // this.embassyName = this.translateService.translate(this.form.get('embassyName').value);
    }
  }

  openModel() {
    // this.modelService.open(modalName, {size: 'xl', centered: true});
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
    this.form.get(numLabel + 'TransVal').patchValue(this.engToNepaliNumberPipe.transform(this.form.get(numLabel).value));
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
    // if (!ObjectUtil.isEmpty(this.tdValues[formControlName])) {
    //   const val = this.tdValues[formControlName];
    //   this.form.get(formControlName + 'TransVal').patchValue(val);
    // }
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
    // this.form.get('referenceNumberTransVal').patchValue(this.translatedData.referenceNumber);
    this.form.get('purposeOfLoanTransVal').patchValue(this.translatedData.purposeOfLoan);
    // this.form.get('distressValueTransVal').patchValue(this.translatedData.distressValue);
    // this.form.get('baseRateTransVal').patchValue(this.translatedData.baseRate);
    // this.form.get('premiumRateTransVal').patchValue(this.translatedData.premiumRate);
    // this.form.get('interestRateTransVal').patchValue(this.translatedData.interestRate);
    // this.form.get('loanAdminFeeFigureTransVal').patchValue(this.translatedData.loanAdminFeeFigure);
    // this.form.get('loanAdminFeeWordsTransVal').patchValue(this.translatedData.loanAdminFeeWords);
    // this.form.get('emiAmountFigureTransVal').patchValue(this.translatedData.emiAmountFigure);
    // this.form.get('emiAmountWordsTransVal').patchValue(this.translatedData.emiAmountWords);
    // this.form.get('loanPeriodInMonthsTransVal').patchValue(this.translatedData.loanPeriodInMonths);
    // this.form.get('moratoriumPeriodInMonthsTransVal').patchValue(this.translatedData.moratoriumPeriodInMonths);
    // this.form.get('loanCommitmentFeeInPercentageTransVal').patchValue(this.translatedData.loanCommitmentFeeInPercentage);
    this.form.get('fixedDepositHolderNameTransVal').patchValue(this.translatedData.fixedDepositHolderName);
    // this.form.get('fixedDepositAmountFigureTransVal').patchValue(this.translatedData.fixedDepositAmountFigure);
    // this.form.get('fixedDepositReceiptAmountWordsTransVal').patchValue(this.translatedData.fixedDepositReceiptAmountWords);
    // this.form.get('tenureFixedDepositTransVal').patchValue(this.translatedData.tenureFixedDeposit);
    // this.form.get('tenureDepositReceiptNumberTransVal').patchValue(this.translatedData.tenureDepositReceiptNumber);
    // this.form.get('guaranteedAmountFigureTransVal').patchValue(this.translatedData.guaranteedAmountFigure);
    // this.form.get('guaranteedAmountWordsTransVal').patchValue(this.translatedData.guaranteedAmountWords);
    // this.form.get('pledgeAmountFigureTransVal').patchValue(this.translatedData.pledgeAmountFigure);
    // this.form.get('insuranceAmountFigureTransVal').patchValue(this.translatedData.insuranceAmountFigure);
    this.form.get('relationshipOfficerNameTransVal').patchValue(this.translatedData.relationshipOfficerName);
    this.form.get('branchManagerTransVal').patchValue(this.translatedData.branchManager);
    this.form.get('approvalStaffNameTransVal').patchValue(this.translatedData.approvalStaffName);
    this.form.get('ownersNameTransVal').patchValue(this.translatedData.ownersName);
    // this.form.get('wardNoTransVal').patchValue(this.translatedData.wardNo);
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


  // changeDocumentName(securityType) {
  //     if (securityType === 'FIXED_DEPOSIT') {
  //       this.docSecurityName = 'Class A';
  //     } else {
  //       this.docSecurityName = 'Class E';
  //     }
  // }
}


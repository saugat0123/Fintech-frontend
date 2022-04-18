import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
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
import {SecurityDetails} from '../../../cad-document-template/nabil/securities-view/model/securities-details.model';
import {Securities} from '../../../cad-document-template/nabil/securities-view/model/securities.model';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

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
  oneForm: FormGroup;
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
  dateTypeBS2 = false;
  dateTypeAD2 = false;
  provinceList: Array<Province> = new Array<Province>();
  districtList: Array<District> = new Array<District>();
  municipalityList: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
  allDistrictList: Array<District> = new Array<District>();
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  cadDocStatus = CadDocStatus.key();
  offerLetterDocument: OfferDocument;
  submitted = false;
  securityDetails: SecurityDetails[];
  municipalityListForSecurities = [];
  securities: Securities[];

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
      private datePipe: DatePipe,
      private engNepDatePipe: EngNepDatePipe
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
    console.log(this.initialInformation);
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      const dateOfApproval1 = this.initialInformation.dateOfApprovalType ? this.initialInformation.dateOfApprovalType.en : '';
      if (dateOfApproval1 === 'AD') {
        this.dateTypeAD = true;
      } else {
        this.dateTypeBS = true;
      }
      const dateOfApplication1 = this.initialInformation.dateOfApplicationType ? this.initialInformation.dateOfApplicationType.en : '';
      if (dateOfApplication1 === 'AD') {
        this.dateTypeAD1 = true;
      } else {
        this.dateTypeBS1 = true;
      }
      const dateOfExpiry1 = this.initialInformation.dateOfExpiryType ? this.initialInformation.dateOfExpiryType.en : '';
      if (dateOfExpiry1 === 'AD') {
        this.dateTypeAD2 = true;
      } else {
        this.dateTypeBS2 = true;
      }
      this.fieldFlag = true;
      // this.dateTypeAD = true;
      // this.dateTypeAD1 = true;
      // this.dateTypeAD2 = true;
      this.selectedSecurityVal = this.initialInformation.selectedSecurity.en;
      this.selectedCountryVal = this.initialInformation.selectedCountry.en;
      this.securityDetails = this.initialInformation.securityDetails;
      if (!ObjectUtil.isEmpty(this.initialInformation.securityDetails)) {
        this.securityDetails.forEach((security) => {
          this.securities = security.securities;
        });
      } else {
        this.addDefaultSecurity();
      }
    }
    this.setEducationLoanTemplateData();
    this.setSecurityData();

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

  public getMunicipalityByDistrict(data, event?, index?): void {
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

  public loanMunicipalityByDistrictIdForEdit(data,  index?): void {
    const district = new District();
    district.id = data;
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalityListForSecurities[index] = response.detail;
          this.municipalityListForSecurities[index].sort((a, b) => a.name.localeCompare(b.name));

        }
    );
  }

  async onChangeSecurityOwnersName(arrName, source, index, target) {
    this.oneForm = this.formBuilder.group({
      securityOwnersName: this.form.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.oneForm);
    this.form.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      embassyName: [undefined],
      selectedCountry: [undefined],
      selectedSecurity: [undefined],
      loanLimitChecked: [undefined],

      dateOfApproval: [undefined],
      dateOfApprovalType: [undefined],
      dateOfApprovalNepali: [undefined],
      //referenceNumber: [undefined],
      dateOfApplication: [undefined],
      dateOfApplicationNepali: [undefined],
      dateOfApplicationType: [undefined],
      dateofExpiry:[undefined],
      dateofExpiryNepali: [undefined],
      dateOfExpiryType: [undefined],
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
      ownersName: [undefined],
      district: [undefined],
      municipality: [undefined],
      wardNo: [undefined],
      seatNo: [undefined],
      kittaNo: [undefined],
      landArea: [undefined],
      promissoryNoteAmount: [undefined],
      loanDeedAmount: [undefined],
      accountNumber: [undefined],
      bankName: [undefined],

      // Translated Value
      embassyNameTransVal: [undefined],
      selectedCountryTransVal: [undefined],
      selectedSecurityTransVal: [undefined],
      loanLimitCheckedTransVal: [undefined],
      dateOfApprovalTransVal: [undefined],
      dateOfApprovalNepaliTransVal: [undefined],
      dateOfApprovalTypeTransVal: [undefined],
      //referenceNumberTransVal: [undefined, Validators.required],
      dateOfApplicationTransVal: [undefined],
      dateOfApplicationNepaliTransVal: [undefined],
      dateOfApplicationTypeTransVal: [undefined],
      dateofExpiryTransVal:[undefined],
      dateofExpiryNepaliTransVal: [undefined],
      dateOfExpiryTypeTransVal: [undefined],
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
      accountNumberTransVal: [undefined],
      bankNameTransVal: [undefined],
      securities: this.formBuilder.array([])
    });
  }

  initSecuritiesForm() {
    return this.formBuilder.group({
      securityOwnersName: [undefined],
      securityOwnersNameTransVal: [{value: undefined, disabled: true}],
      securityOwnersNameCT: [undefined],

      securityOwnersDistrict: [undefined],
      securityOwnersDistrictTransVal: [{value: undefined, disabled: true}],
      securityOwnersDistrictCT: [undefined],

      securityOwnersMunicipalityOrVdc: [undefined],

      securityOwnersMunicipality: [undefined],
      securityOwnersMunicipalityTransVal: [{value: undefined, disabled: true}],
      securityOwnersMunicipalityCT: [undefined],

      securityOwnersWardNo: [undefined],
      securityOwnersWardNoTransVal: [{value: undefined, disabled: true}],
      securityOwnersWardNoCT: [undefined],

      securityOwnersSeatNo: [undefined],
      securityOwnersSeatNoTransVal: [{value: undefined, disabled: true}],
      securityOwnersSeatNoCT: [undefined],

      securityOwnersKittaNo: [undefined],
      securityOwnersKittaNoTransVal: [{value: undefined, disabled: true}],
      securityOwnersKittaNoCT: [undefined],

      securityOwnersLandArea: [undefined],
      securityOwnersLandAreaTransVal: [{value: undefined, disabled: true}],
      securityOwnersLandAreaCT: [undefined],
    });
  }

  public removeIndividualSecurities(i): void {
    (this.form.get('securities') as FormArray).removeAt(i);
  }

  public translateSecuritiDetailsNumberFields(arrName, source, index, target): void {
    const translatedNepaliNum = this.engToNepaliNumberPipe.transform(String(this.form.get([String(arrName), index, String(source)]).value));
    this.form.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
  }

  public setDefaultNepaliResponse(arrName, source, index, target): void {
    this.form.get([String(arrName), index, String(target)]).patchValue(this.form.get([String(arrName), index, String(source)]).value.nepaliName);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(this.form.get([String(arrName), index, String(source)]).value.nepaliName);
  }

  submit() {
    this.submitted = true;
    const securityDetails = [{
      securityType: this.form.get('selectedSecurity').value,
      securities: this.form.get('securities').value,
    }];
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
          this.tdValues['securityDetails'] = securityDetails;
          Object.keys(this.form.controls).forEach(key => {
            if (key.indexOf('TransVal') > -1 || key === 'municipalityOrVdc' || key === 'securities') {
              return;
            }
            this.attributes = new Attributes();
            this.attributes.en = this.form.get(key).value;
            this.attributes.np = this.tdValues[key];
            this.attributes.ct = this.form.get(key + 'TransVal').value;
            this.tdValues[key] = this.attributes;
          });
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
          this.translatedData = {};
        }
      });
    }
    console.log(this.customerApprovedDoc);
    this.administrationService.saveCadDocumentBulk(this.customerApprovedDoc).subscribe((res: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully update Offer Letter'));
      this.customerApprovedDoc = res.detail;
      this.spinner = false;
      this.previewBtn = false;
      this.btnDisable = true;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to update Offer Letter'));
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
      const district = this.form.get('district').value;
      const municipality = this.form.get('municipality').value;
      if (!ObjectUtil.isEmpty(district) && !ObjectUtil.isEmpty(municipality)) {
        this.objectForm = this.formBuilder.group({
          district: this.form.get('district').value.name,
          municipality: this.form.get('municipality').value.name,
        });
        this.objectTranslate = await this.translateService.translateForm(this.objectForm);
      }
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
    const wordLabelVar = this.engToNepaliNumberPipe.transform(this.form.get(source).value.toString());
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

  setDateTypeBS2() {
    this.dateTypeBS2 = true;
    this.dateTypeAD2 = false;
  }

  setDateTypeAD2() {
    this.dateTypeBS2 = false;
    this.dateTypeAD2 = true;
  }

  calInterestRate() {
    const baseRate = this.form.get('baseRate').value;
    const premiumRate = this.form.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.form.get('interestRate').patchValue(sum.toFixed(2));
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

  public addDefaultSecurity(): void {
    (this.form.get('securities') as FormArray).push(
        this.initSecuritiesForm()
    );
  }

  private setTemplatedCTData(data): void {
    this.form.get('purposeOfLoanTransVal').patchValue(this.translatedData.purposeOfLoan);
    this.form.get('fixedDepositHolderNameTransVal').patchValue(this.translatedData.fixedDepositHolderName);
    this.form.get('relationshipOfficerNameTransVal').patchValue(this.translatedData.relationshipOfficerName);
    this.form.get('branchManagerTransVal').patchValue(this.translatedData.branchManager);
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
    if (this.selectedSecurityVal === 'FIXED_DEPOSIT') {
      this.form.get('accountNumberTransVal').patchValue(data.accountNumber);
      this.form.get('bankNameTransVal').patchValue(data.bankName);
    }
    this.form.get('dateOfApprovalTransVal').patchValue(this.translatedData.dateOfApproval);
    this.form.get('dateOfApprovalNepaliTransVal').patchValue(this.translatedData.dateOfApprovalNepali);

    // Set Ct Value for Date of Application:
    this.form.get('dateOfApplicationTransVal').patchValue(this.translatedData.dateOfApplication);
    this.form.get('dateOfApplicationNepaliTransVal').patchValue(this.translatedData.dateOfApplicationNepali);

    // Set Ct Value for Date of Expiry:
    this.form.get('dateofExpiryTransVal').patchValue(this.translatedData.dateofExpiry);
    this.form.get('dateofExpiryNepaliTransVal').patchValue(this.translatedData.dateofExpiryNepali);
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
    // this.form.get('dateOfApproval').patchValue(this.initialInformation.dateOfApproval.en);
    // Set Date of Approval
    this.form.get('dateOfApprovalType').patchValue(this.initialInformation.dateOfApprovalType.en);
    if (this.initialInformation.dateOfApprovalType.en === 'AD') {
      this.form.get('dateOfApproval').patchValue(new Date(this.initialInformation.dateOfApproval.en));
    } else {
      const dateApproval = this.initialInformation.dateOfApprovalNepali ? this.initialInformation.dateOfApprovalNepali.en : '';
      this.form.get('dateOfApprovalNepali').patchValue(dateApproval);
    }
    //this.form.get('referenceNumber').patchValue(this.initialInformation.referenceNumber.en);
    // Set Date Of Application:
    this.form.get('dateOfApplicationType').patchValue(this.initialInformation.dateOfApplicationType.en);
    if (this.initialInformation.dateOfApplicationType.en === 'AD') {
      this.form.get('dateOfApplication').patchValue(new Date(this.initialInformation.dateOfApplication.en));
    }
    if (this.initialInformation.dateOfApplicationType.en === 'BS') {
      const dateApplication = this.initialInformation.dateOfApplicationNepali ? this.initialInformation.dateOfApplicationNepali.en : '';
      this.form.get('dateOfApplicationNepali').patchValue(dateApplication);
    }
    // this.form.get('dateOfApplication').patchValue(this.initialInformation.dateOfApplication.en);
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
    this.form.get('promissoryNoteAmount').patchValue(this.initialInformation.promissoryNoteAmount.en);
    this.form.get('loanDeedAmount').patchValue(this.initialInformation.loanDeedAmount.en);
    if (this.selectedSecurityVal === 'FIXED_DEPOSIT' && (!ObjectUtil.isEmpty(this.initialInformation.accountNumber) ||
        !ObjectUtil.isEmpty(this.initialInformation.bankName))) {
      this.form.get('accountNumber').patchValue(this.initialInformation.accountNumber.en);
      this.form.get('bankName').patchValue(this.initialInformation.bankName.en);
    }
    if (this.selectedSecurityVal === 'FIXED_DEPOSIT') {
      // this.form.get('dateofExpiry').patchValue(this.initialInformation.dateofExpiry.en);
      this.form.get('dateOfExpiryType').patchValue(this.initialInformation.dateOfExpiryType.en);
      // set value for the date of expiry
      const expiryDateType = this.initialInformation.dateOfExpiryType ? this.initialInformation.dateOfExpiryType.en : '';
      if (expiryDateType === 'AD') {
        const newExpiryDate = this.initialInformation.dateofExpiry ? this.initialInformation.dateofExpiry.en : '';
        this.form.get('dateofExpiry').patchValue(new Date(newExpiryDate));
      } else {
        this.form.get('dateofExpiryNepali').patchValue(this.initialInformation.dateofExpiryNepali.en);
      }
    }

    // set ct value
    //this.form.get('referenceNumberTransVal').patchValue(this.initialInformation.referenceNumber.ct);
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
    this.form.get('promissoryNoteAmountTransVal').patchValue(this.initialInformation.promissoryNoteAmount.ct);
    this.form.get('loanDeedAmountTransVal').patchValue(this.initialInformation.loanDeedAmount.ct);
    if (!ObjectUtil.isEmpty(this.form.get('embassyName').value)) {
      this.form.get('embassyNameTransVal').patchValue(this.initialInformation.embassyName.ct);
    }
    if (this.selectedSecurityVal === 'FIXED_DEPOSIT' && (!ObjectUtil.isEmpty(this.initialInformation.accountNumber)
        || !ObjectUtil.isEmpty(this.initialInformation.bankName))) {
      this.form.get('accountNumberTransVal').patchValue(this.initialInformation.accountNumber.ct);
      this.form.get('bankNameTransVal').patchValue(this.initialInformation.bankName.ct);
    }
  }

  public setSecurityData(): void {
    const securitiesControl = this.form.get('securities') as FormArray;
    this.securities.forEach((data: Securities, index) => {
      this.loanMunicipalityByDistrictIdForEdit(data.securityOwnersDistrict.id, index);
      securitiesControl.push(
          this.formBuilder.group({
            securityOwnersName: [data.securityOwnersName],
            securityOwnersNameTransVal: [data.securityOwnersNameCT],
            securityOwnersNameCT: [data.securityOwnersNameCT],
            securityOwnersDistrict: [data.securityOwnersDistrict],
            securityOwnersDistrictTransVal: [data.securityOwnersDistrictCT],
            securityOwnersDistrictCT: [data.securityOwnersDistrictCT],
            securityOwnersMunicipalityOrVdc: [data.securityOwnersMunicipalityOrVdc],
            securityOwnersMunicipality: [data.securityOwnersMunicipality],
            securityOwnersMunicipalityTransVal: [data.securityOwnersMunicipalityCT],
            securityOwnersMunicipalityCT: [data.securityOwnersMunicipalityCT],
            securityOwnersWardNo: [data.securityOwnersWardNo],
            securityOwnersWardNoTransVal: [data.securityOwnersWardNoCT],
            securityOwnersWardNoCT: [data.securityOwnersWardNoCT],
            securityOwnersSeatNo: [data.securityOwnersSeatNo],
            securityOwnersSeatNoTransVal: [data.securityOwnersSeatNoCT],
            securityOwnersSeatNoCT: [data.securityOwnersSeatNoCT],
            securityOwnersKittaNo: [data.securityOwnersKittaNo],
            securityOwnersKittaNoTransVal: [data.securityOwnersKittaNoCT],
            securityOwnersKittaNoCT: [data.securityOwnersKittaNoCT],
            securityOwnersLandArea: [data.securityOwnersLandArea],
            securityOwnersLandAreaTransVal: [data.securityOwnersLandAreaCT],
            securityOwnersLandAreaCT: [data.securityOwnersLandAreaCT],
          })
      );
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}

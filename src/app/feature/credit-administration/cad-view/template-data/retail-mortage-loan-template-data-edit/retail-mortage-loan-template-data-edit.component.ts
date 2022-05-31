import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OfferDocument} from '../../../model/OfferDocument';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {ToastService} from '../../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {Attributes} from '../../../../../@core/model/attributes';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {RetailMortgageLoanComponent} from '../../../mega-offer-letter-template/mega-offer-letter/retail-mortgage-loan/retail-mortgage-loan.component';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Securities} from '../../../cad-document-template/nabil/securities-view/model/securities.model';
import {SecurityDetails} from '../../../cad-document-template/nabil/securities-view/model/securities-details.model';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-retail-mortage-loan-template-data-edit',
  templateUrl: './retail-mortage-loan-template-data-edit.component.html',
  styleUrls: ['./retail-mortage-loan-template-data-edit.component.scss']
})
export class RetailMortageLoanTemplateDataEditComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList;
  @Input() initialInformation : any;
  offerLetterTypes = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterSelect;
  form: FormGroup;
  oneform: FormGroup;
  translatedValues: any = {};
  spinner = false;
  dateTypeBS;
  dateTypeAD;
  dateTypeBS1;
  dateTypeAD1;
  dateTypeBS2;
  dateTypeAD2;
  submitted = false;
  fieldFlag = false;
  offerLetterDocument: OfferDocument;
  previewBtn = true;
  btnDisable = true;
  loanLimit = false;
  existingOfferLetter = false;
  attributes;
  selectedSecurityVal;
  tdValues: any = {};
  provinceList: Array<Province> = new Array<Province>();
  districtList: Array<District> = new Array<District>();
  municipalityList: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
  allDistrictList: Array<District> = new Array<District>();
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  cadDocStatus = CadDocStatus.key();
  municipalityListForSecurities = [];
  applicationDate: any;
  signatureDate: any;
  securityDetails: SecurityDetails[];
  securities: Securities[];
  dateofApproval: any;

  constructor(
      private formBuilder: FormBuilder,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private translateService: SbTranslateService,
      private toastService: ToastService,
      private modelService: NgbModal,
      private dialogService: NbDialogService,
      private engToNepaliNumberPipe: EngToNepaliNumberPipe,
      private administrationService: CreditAdministrationService,
      private addressService: AddressService,
      private currencyFormatterPipe: CurrencyFormatterPipe,
      public dialogueService: NbDialogRef<RetailMortageLoanTemplateDataEditComponent>,
      private datePipe: DatePipe,
      private engNepDatePipe: EngNepDatePipe
  ) { }

  get Form() {
    return this.form.controls;
  }

  ngOnInit() {
    this.setDateFlag();
    this.securityDetails = this.initialInformation.securityDetails;
    if (!ObjectUtil.isEmpty(this.initialInformation.securityDetails)) {
      this.securityDetails.forEach((security) => {
        this.securities = security.securities;
      });
    } else {
      this.addDefaultSecurity();
    }
    this.buildmortgage();
    this.getAllProvince();
    this.getAllDistrict();
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
  buildmortgage() {
    this.form = this.formBuilder.group({
      selectedSecurity: [ObjectUtil.isEmpty(this.initialInformation.selectedSecurity) ? undefined :
          this.initialInformation.selectedSecurity.en],
      loanLimitChecked: [undefined],
      // referenceNumber: [undefined],
      dateOfApproval: [ObjectUtil.isEmpty(this.initialInformation.dateOfApproval) ? undefined :
          this.initialInformation.dateOfApproval.en],
      dateOfApprovalType: [ObjectUtil.isEmpty(this.initialInformation.dateOfApprovalType) ? undefined :
          this.initialInformation.dateOfApprovalType.en],
      dateOfApprovalNepali: [ObjectUtil.isEmpty(this.initialInformation.dateOfApprovalNepali) ? undefined :
      this.initialInformation.dateOfApprovalNepali.en],
      dateofApplication: [ObjectUtil.isEmpty(this.initialInformation.dateofApplication) ? undefined :
          this.initialInformation.dateofApplication.en],
      dateofApplicationType: [ObjectUtil.isEmpty(this.initialInformation.dateofApplicationType) ? undefined :
          this.initialInformation.dateofApplicationType.en],
      dateofApplicationNepali: [ObjectUtil.isEmpty(this.initialInformation.dateofApplicationNepali) ? undefined :
          this.initialInformation.dateofApplicationNepali.en],
      loanPurpose: [ObjectUtil.isEmpty(this.initialInformation.loanPurpose) ? undefined :
          this.initialInformation.loanPurpose.en],
      drawingPower: [ObjectUtil.isEmpty(this.initialInformation.drawingPower) ? undefined :
          this.initialInformation.drawingPower.en],
      baseRate: [ObjectUtil.isEmpty(this.initialInformation.baseRate) ? undefined :
          this.initialInformation.baseRate.en],
      premiumRate: [ObjectUtil.isEmpty(this.initialInformation.premiumRate) ? undefined :
          this.initialInformation.premiumRate.en],
      interestRate: [ObjectUtil.isEmpty(this.initialInformation.interestRate) ? undefined :
          this.initialInformation.interestRate.en],
      loanAdminFeeInFigure: [ObjectUtil.isEmpty(this.initialInformation.loanAdminFeeInFigure) ? undefined :
      this.initialInformation.loanAdminFeeInFigure.en],
      loanAdminFeeInWords: [ObjectUtil.isEmpty(this.initialInformation.loanAdminFeeInWords) ? undefined :
      this.initialInformation.loanAdminFeeInWords.en],
      emiInFigure: [ObjectUtil.isEmpty(this.initialInformation.emiInFigure) ? undefined :
          this.initialInformation.emiInFigure.en],
      emiInWords: [ObjectUtil.isEmpty(this.initialInformation.emiInWords) ? undefined :
      this.initialInformation.emiInWords.en],
      loanPeriod: [ObjectUtil.isEmpty(this.initialInformation.loanPeriod) ? undefined :
      this.initialInformation.loanPeriod.en],
      loanCommitmentFee: [ObjectUtil.isEmpty(this.initialInformation.loanCommitmentFee) ? undefined :
      this.initialInformation.loanCommitmentFee.en],
      insuranceAmount: [ObjectUtil.isEmpty(this.initialInformation.insuranceAmount) ? undefined :
          this.initialInformation.insuranceAmount.en],
      relationshipOfficerName: [ObjectUtil.isEmpty(this.initialInformation.relationshipOfficerName)
      ? undefined : this.initialInformation.relationshipOfficerName.en],
      branchManagerName: [ObjectUtil.isEmpty(this.initialInformation.branchManagerName)
      ? undefined : this.initialInformation.branchManagerName.en],


      // For Translated Value
      selectedSecurityTransVal: [undefined],
      loanLimitCheckedTransVal: [undefined],
      // referenceNumberTransVal: [undefined, Validators.required],
      dateOfApprovalTransVal: [undefined],
      dateOfApprovalNepaliTransVal: [undefined],
      dateOfApprovalTypeTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      dateofApplicationNepaliTransVal: [undefined],
      dateofApplicationTypeTransVal: [undefined],
      loanPurposeTransVal: [ObjectUtil.isEmpty(this.initialInformation.loanPurpose) ? undefined :
          this.initialInformation.loanPurpose.ct, Validators.required],
      drawingPowerTransVal: [ObjectUtil.isEmpty(this.initialInformation.drawingPower) ? undefined :
          this.initialInformation.drawingPower.ct, Validators.required],
      baseRateTransVal: [ObjectUtil.isEmpty(this.initialInformation.baseRate) ? undefined :
          this.initialInformation.baseRate.ct],
      premiumRateTransVal: [ObjectUtil.isEmpty(this.initialInformation.premiumRate) ? undefined :
          this.initialInformation.premiumRate.ct],
      interestRateTransVal: [ObjectUtil.isEmpty(this.initialInformation.interestRate) ? undefined :
          this.initialInformation.interestRate.ct],
      loanAdminFeeInFigureTransVal: [ObjectUtil.isEmpty(this.initialInformation.loanAdminFeeInFigure) ? undefined :
          this.initialInformation.loanAdminFeeInFigure.ct, Validators.required],
      loanAdminFeeInWordsTransVal: [ObjectUtil.isEmpty(this.initialInformation.loanAdminFeeInWords) ? undefined :
          this.initialInformation.loanAdminFeeInWords.ct],
      emiInFigureTransVal: [ObjectUtil.isEmpty(this.initialInformation.emiInFigure) ? undefined :
          this.initialInformation.emiInFigure.ct, Validators.required],
      emiInWordsTransVal: [ObjectUtil.isEmpty(this.initialInformation.emiInWords) ? undefined :
          this.initialInformation.emiInWords.ct],
      loanPeriodTransVal: [ObjectUtil.isEmpty(this.initialInformation.loanPeriod) ? undefined :
          this.initialInformation.loanPeriod.ct, Validators.required],
      loanCommitmentFeeTransVal: [ObjectUtil.isEmpty(this.initialInformation.loanCommitmentFee) ? undefined :
          this.initialInformation.loanCommitmentFee.ct, Validators.required],
      insuranceAmountTransVal: [ObjectUtil.isEmpty(this.initialInformation.insuranceAmount) ? undefined :
          this.initialInformation.insuranceAmount.ct],
      relationshipOfficerNameTransVal: [ObjectUtil.isEmpty(this.initialInformation.relationshipOfficerName)
          ? undefined : this.initialInformation.relationshipOfficerName.ct, Validators.required],
      branchManagerNameTransVal: [ObjectUtil.isEmpty(this.initialInformation.branchManagerName)
          ? undefined : this.initialInformation.branchManagerName.ct, Validators.required],
      securities: this.formBuilder.array([]),
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

  addDefaultSecurity() {
    (this.form.get('securities') as FormArray).push(
        this.initSecuritiesForm()
    );
  }

  removeIndividualSecurities(i) {
    (this.form.get('securities') as FormArray).removeAt(i);
  }

  translateSecuritiDetailsNumberFields(arrName, source, index, target) {
    const translatedNepaliNum = this.engToNepaliNumberPipe.transform(String(this.form.get([String(arrName), index, String(source)]).value));
    this.form.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
  }

  async onChangeSecurityOwnersName(arrName, source, index, target) {
    this.oneform = this.formBuilder.group({
      securityOwnersName: this.form.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.oneform);
    this.form.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }

  async onChangeTranslateSecurity(arrName, source, index, target) {
    this.oneform = this.formBuilder.group({
      securityOwnersName: this.form.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.oneform);
    this.form.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }

  setDefaultNepaliResponse(arrName, source, index, target) {
    this.form.get([String(arrName), index, String(target)]).patchValue(this.form.get([String(arrName), index, String(source)]).value.nepaliName);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(this.form.get([String(arrName), index, String(source)]).value.nepaliName);
  }

  async translate() {
    this.spinner = true;
    this.translatedValues = await this.translateService.translateForm(this.form);
    this.tdValues = this.translatedValues;
    this.setTemplatedCTData(this.translatedValues);
    this.spinner = false;
    this.btnDisable = false;
  }

  private setTemplatedCTData(data): void {
    this.form.get('dateOfApprovalTypeTransVal').patchValue(this.form.get('dateOfApprovalType').value);
    if (this.dateTypeAD) {
      const approvalDate = this.form.get('dateOfApproval').value;
      const convertApprovalDate = approvalDate ?
          this.engNepDatePipe.transform(this.datePipe.transform(approvalDate), true) : '';
      this.form.get('dateOfApprovalTransVal').patchValue(convertApprovalDate);
    }
    if (this.dateTypeBS) {
      const approvalDateNepali = !ObjectUtil.isEmpty(this.form.get('dateOfApprovalNepali').value) ?
          this.form.get('dateOfApprovalNepali').value : '';
      this.form.get('dateOfApprovalNepaliTransVal').patchValue(approvalDateNepali.nDate);
    }
    // this.form.get('dateofApplicationTransVal').patchValue(this.podtranslatedData.dateofApplication);
    this.form.get('dateofApplicationTypeTransVal').patchValue(this.form.get('dateofApplicationType').value);
    if (this.dateTypeAD) {
      const applicationDate = this.form.get('dateofApplication').value;
      const convertApplicationDate = applicationDate ?
          this.engNepDatePipe.transform(this.datePipe.transform(applicationDate), true) : '';
      this.form.get('dateofApplicationTransVal').patchValue(convertApplicationDate);
    }
    if (this.dateTypeBS) {
      const applicationNepali = !ObjectUtil.isEmpty(this.form.get('dateofApplicationNepali').value) ?
          this.form.get('dateofApplicationNepali').value : '';
      this.form.get('dateofApplicationNepaliTransVal').patchValue(applicationNepali.nDate);
    }
    this.form.get('loanPurposeTransVal').patchValue(this.translatedValues.loanPurpose);
    this.form.get('relationshipOfficerNameTransVal').patchValue(this.translatedValues.relationshipOfficerName);
    this.form.get('branchManagerNameTransVal').patchValue(this.translatedValues.branchManagerName);
    this.form.get('selectedSecurityTransVal').patchValue(data.selectedSecurity.en);
    this.form.get('loanLimitCheckedTransVal').patchValue(this.loanLimit);
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    this.form.get(numLabel + 'TransVal').patchValue(this.engToNepaliNumberPipe.transform(this.form.get(numLabel).value.toString()));
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
    this.form.get(wordLabel + 'TransVal').patchValue(returnVal);
  }

  translateNumber(source, target) {
    const wordLabelVar = this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(this.form.get(source).value.toString()));
    this.form.get(target).patchValue(wordLabelVar);
  }

  translateNumber1(source, target) {
    const wordLabelVar = this.engToNepaliNumberPipe.transform(this.form.get(source).value.toString());
    this.form.get(target).patchValue(wordLabelVar);
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

  checkboxVal(event, formControlName) {
    // if (!ObjectUtil.isEmpty(this.translatedValues[formControlName])) {
    //   const val = this.translatedValues[formControlName];
    //   this.form.get(formControlName + 'TransVal').patchValue(val);
    // }
    const checkVal = event.target.checked;
    this[formControlName + 'Check'] = checkVal;
    console.log('checked Value', this[formControlName + 'Check']);
    if (!checkVal) {
      this.clearForm(formControlName + 'TransVal');
    }
  }

  loanChecked(data) {
    this.loanLimit = data;
    console.log('Loan Limit Checked?', this.loanLimit);
  }

  clearForm(controlName) {
    this.form.get(controlName).setValue(null);
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

  transferValue() {
    const security = this.form.get('selectedSecurity').value;
    if (!ObjectUtil.isEmpty(security)) {
      this.fieldFlag = true;
      this.selectedSecurityVal = security;
    }
  }

  deleteCTAndTransControls(data) {
    const individualData = data as FormGroup;
    Object.keys(data).forEach(key => {
      if (key.indexOf('CT') > -1 || key.indexOf('TransVal') > -1) {
        delete individualData[key];
      }
    });
  }

  openModel() {
    this.dialogService.open(RetailMortgageLoanComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false,
      context: {
        cadOfferLetterApprovedDoc: this.customerApprovedDoc,
        preview: true,
      }
    });
  }

  submit() {

    this.submitted = true;
    const securityDetails = [{
      securityType: this.form.get('selectedSecurity').value,
      securities: this.form.get('securities').value,
    }];
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
          === this.offerLetterConst.value(this.offerLetterConst.MORTAGE_LOAN).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.existingOfferLetter = true;
      }
    }

    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.MORTAGE_LOAN).toString()) {
          this.mappedData();
          this.tdValues['securityDetails'] = securityDetails;
          this.translatedValues = {};
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.MORTAGE_LOAN);
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
      this.tdValues['securityDetails'] = securityDetails;
      this.translatedValues = {};
      this.deleteCTAndTransControls(this.tdValues);
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

  mappedData() {
    Object.keys(this.form.controls).forEach(key => {
      console.log('key: ', key);
      if (key.indexOf('TransVal') > -1 || key === 'municipalityOrVdc' || key === 'securities') {
        return;
      }
      this.attributes = new Attributes();
      if (!ObjectUtil.isEmpty(this.translatedValues)) {
        this.attributes.en = this.form.get(key).value;
        this.attributes.np = this.form.get(key + 'TransVal').value;
        this.attributes.ct = this.form.get(key + 'TransVal').value;
        this.tdValues[key] = this.attributes;
      } else {
        this.attributes.en = this.form.get(key).value;
        this.attributes.np = this.tdValues[key];
        this.attributes.ct = this.form.get(key + 'TransVal').value;
        this.tdValues[key] = this.attributes;
      }
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  setDateFlag(): void{
    if (this.initialInformation.dateOfApprovalType.en === 'BS') {
      this.dateTypeBS = true;
    } else {
      this.dateTypeAD = true;
    }

    if (this.initialInformation.dateofApplicationType.en === 'BS') {
      this.dateTypeBS1 = true;
    } else {
      this.dateTypeAD1 = true;
    }

    if(this.initialInformation.loanLimitChecked.en === true){
      this.loanLimit = true;
    }

  }

}

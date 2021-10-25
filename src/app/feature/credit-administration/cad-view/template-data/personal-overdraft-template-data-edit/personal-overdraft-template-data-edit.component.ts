import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {District} from '../../../../admin/modal/district';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PersonalOverdraftComponent} from '../../../mega-offer-letter-template/mega-offer-letter/personal-overdraft/personal-overdraft.component';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Attributes} from '../../../../../@core/model/attributes';
import {SecurityDetails} from '../../../cad-document-template/nabil/securities-view/model/securities-details.model';
import {Securities} from '../../../cad-document-template/nabil/securities-view/model/securities.model';

@Component({
  selector: 'app-personal-overdraft-template-data-edit',
  templateUrl: './personal-overdraft-template-data-edit.component.html',
  styleUrls: ['./personal-overdraft-template-data-edit.component.scss']
})
export class PersonalOverdraftTemplateDataEditComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Input() initialInformation: any;
  @Input() offerLetterId: number;
  municipalityListForSecurities = [];
  allDistrictList: Array<District> = new Array<District>();
  oneForm: FormGroup;
  offerLetterTypes = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterSelect;
  translatedValues: any = {};
  form: FormGroup;
  objectForm: FormGroup;
  spinner = false;
  btnDisable = true;
  loanLimit = false;
  renewal = false;
  existingOfferLetter = false;
  attributes;
  tdValues: any = {};
  translatedData;
  previewBtn = true;
  dateTypeBS = false;
  dateTypeAD = false;
  dateTypeBS1 = false;
  dateTypeAD1 = false;
  dateTypeBS2 = false;
  dateTypeAD2 = false;
  offerLetterDocument: OfferDocument;
  cadDocStatus = CadDocStatus.key();
  submitted = false;
  fieldFlag = false;
  selectedSecurityVal;
  objectTranslate;
  vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
  securityDetails: SecurityDetails[];
  securities: Securities[];

  constructor(private formBuilder: FormBuilder,
              private dialogService: NbDialogService,
              private modelService: NgbModal,
              public ngDialogRef: NbDialogRef<PersonalOverdraftTemplateDataEditComponent>,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private translateService: SbTranslateService,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private addressService: AddressService, ) { }

  ngOnInit() {
    this.buildForm();
    this.getAllDistrict();
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      this.selectedSecurityVal = this.initialInformation.selectedSecurity.en;
      this.fieldFlag = true;
      this.dateTypeAD = true;
      this.dateTypeAD1 = true;
      this.dateTypeAD2 = true;
      this.securityDetails = this.initialInformation.securityDetails;
      if (!ObjectUtil.isEmpty(this.initialInformation.securityDetails)) {
        this.securityDetails.forEach((security) => {
          this.securities = security.securities;
        });
      } else {
        this.addDefaultSecurity();
      }
      this.setPersonalOverdraftData();
      this.setSecurityData();
    }
  }

  public getAllDistrict(): void {
    this.addressService.getAllDistrict().subscribe((response: any) => {
      this.allDistrictList = response.detail;
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      selectedSecurity: [undefined],
      loanLimitChecked: [undefined],
      renewalChecked: [undefined],
      // referenceNumber: [undefined],
      dateOfApproval: [undefined],
      dateofApplication: [undefined],
      purposeOfLoan: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanadminFee: [undefined],
      loanadminFeeWords: [undefined],
      loanCommitmentFee: [undefined],
      dateofExpiry: [undefined],
      // nameofGuarantors: [undefined],
      /*guaranteedamountinFigure: [undefined],
      guaranteedamountinWords: [undefined],*/
      insuranceAmountinFigure: [undefined],
      relationshipofficerName: [undefined],
      nameofBranchManager: [undefined],

      // fortranslatedvalue
      selectedSecurityTransVal: [undefined],
      loanLimitCheckedTransVal: [undefined],
      renewalCheckedTransVal: [undefined],
      // referenceNumberTransVal: [undefined, Validators.required],
      dateOfApprovalTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      purposeOfLoanTransVal: [undefined, Validators.required],
      baseRateTransVal: [undefined, Validators.required],
      premiumRateTransVal: [undefined, Validators.required],
      yearlyInterestRateTransVal: [undefined],
      loanadminFeeTransVal: [undefined, Validators.required],
      loanadminFeeWordsTransVal: [undefined],
      loanCommitmentFeeTransVal: [undefined, Validators.required],
      dateofExpiryTransVal: [undefined],
      // nameofGuarantorsTransVal: [undefined],
      /*guaranteedamountinFigureTransVal: [undefined],
      guaranteedamountinWordsTransVal: [undefined],*/
      insuranceAmountinFigureTransVal: [undefined, Validators.required],
      relationshipofficerNameTransVal: [undefined, Validators.required],
      nameofBranchManagerTransVal: [undefined, Validators.required],
      securities: this.formBuilder.array([])
    });
  }

  submit() {
    this.submitted = true;
    const securityDetails = [{
      securityType: this.form.get('selectedSecurity').value,
      securities: this.form.get('securities').value,
    }];
    if (this.selectedSecurityVal === 'LAND') {
      this.clearConditionalValidation();
    }
    if (this.form.invalid) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation'));
      this.spinner = false;
      return;
    }
    this.form.get('loanLimitChecked').patchValue(this.loanLimit);
    this.form.get('renewalChecked').patchValue(this.renewal);
    this.spinner = true;
    this.btnDisable = true;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    if (this.customerApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.existingOfferLetter = true;
      }
    }

    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
          this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT).toString()) {
          this.tdValues['securityDetails'] = securityDetails;
          this.mappedData();
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
          this.translatedData = {};
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT);
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

  private clearConditionalValidation(): void {
    this.form.get('insuranceAmountinFigureTransVal').clearValidators();
    this.form.get('insuranceAmountinFigureTransVal').updateValueAndValidity();
  }

  mappedData() {
    Object.keys(this.form.controls).forEach(key => {
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
    });
  }
  get Form() {
    return this.form.controls;
  }

  openModel() {
    this.dialogService.open(PersonalOverdraftComponent, {
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
    this.setTemplatedCTData(this.translatedData);
    this.spinner = false;
    this.btnDisable = false;
  }
  private setTemplatedCTData(data): void {
    // this.form.get('referenceNumberTransVal').patchValue(this.translatedData.referenceNumber);
    this.form.get('dateOfApprovalTransVal').patchValue(this.translatedData.dateOfApproval);
    this.form.get('dateofApplicationTransVal').patchValue(this.translatedData.dateofApplication);
    this.form.get('purposeOfLoanTransVal').patchValue(this.translatedData.purposeOfLoan);
    this.form.get('baseRateTransVal').patchValue(this.translatedData.baseRate);
    this.form.get('premiumRateTransVal').patchValue(this.translatedData.premiumRate);
    this.form.get('yearlyInterestRateTransVal').patchValue(this.translatedData.yearlyInterestRate);
    // this.form.get('loanadminFeeTransVal').patchValue(this.translatedData.loanadminFee);
    this.form.get('loanadminFeeWordsTransVal').patchValue(this.translatedData.loanadminFeeWords);
    // this.form.get('loanCommitmentFeeTransVal').patchValue(this.translatedData.loanCommitmfentFee);
    this.form.get('dateofExpiryTransVal').patchValue(this.translatedData.dateofExpiry);
    // this.form.get('propertyPlotNumberTransVal').patchValue(this.translatedData.propertyPlotNumber);
    // this.form.get('propertyAreaTransVal').patchValue(this.translatedData.propertyArea);
    // this.form.get('sheetNumberTransVal').patchValue(this.translatedData.sheetNumber);
    this.form.get('relationshipofficerNameTransVal').patchValue(this.translatedData.relationshipofficerName);
    this.form.get('nameofBranchManagerTransVal').patchValue(this.translatedData.nameofBranchManager);
    // this.form.get('insuranceAmountinFigureTransVal').patchValue(this.translatedData.insuranceAmountinFigure);
    this.form.get('loanLimitCheckedTransVal').patchValue(this.loanLimit);
    this.form.get('renewalCheckedTransVal').patchValue(this.renewal);
    this.form.get('selectedSecurityTransVal').patchValue(data.selectedSecurity.en);

    // this.form.get('renewalCheckedTransval').patchValue(this.renewal);
    // this.form.get('selectedSecurityTransVal').patchValue(data.selectedSecurity.en);
    /*this.form.get('sakshiDistrictTransVal').patchValue(this.translatedData.sakshiDistrict);
    this.form.get('sakshiMunicipalityTransVal').patchValue(this.translatedData.sakshiMunicipality);
    this.form.get('sakshiWardNumTransVal').patchValue(this.translatedData.sakshiWardNum);
    this.form.get('sakshiNameTransVal').patchValue(this.translatedData.sakshiName);*/
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

  loanChecked(data) {
    this.loanLimit = data;
  }

  renewalChecked(data) {
    this.renewal = data;
  }

  transferValue() {
    const security = this.form.get('selectedSecurity').value;
    if (!ObjectUtil.isEmpty(security)) {
      this.fieldFlag = true;
      this.selectedSecurityVal = security;
    }
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

  public calInterestRate(): void {
    const baseRate = this.form.get('baseRate').value;
    const premiumRate = this.form.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.form.get('yearlyInterestRate').patchValue(sum);
    this.translateNumber('baseRate', 'baseRateTransVal');
    this.translateNumber('premiumRate', 'premiumRateTransVal');
    this.translateNumber('yearlyInterestRate', 'yearlyInterestRateTransVal');
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

  private initSecuritiesForm(): FormGroup {
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

  public addDefaultSecurity(): void {
    (this.form.get('securities') as FormArray).push(
        this.initSecuritiesForm()
    );
  }

  public removeIndividualSecurities(i): void {
    (this.form.get('securities') as FormArray).removeAt(i);
  }

  async onChangeSecurityOwnersName(arrName, source, index, target) {
    this.oneForm = this.formBuilder.group({
      securityOwnersName: this.form.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.oneForm);
    this.form.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
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

  public setDefaultNepaliResponse(arrName, source, index, target): void {
    this.form.get([String(arrName), index, String(target)])
        .patchValue(this.form.get([String(arrName), index, String(source)]).value.nepaliName);
    this.form.get([String(arrName), index, String(source + 'CT')])
        .patchValue(this.form.get([String(arrName), index, String(source)]).value.nepaliName);
  }

  public translateSecuritiDetailsNumberFields(arrName, source, index, target): void {
    const translatedNepaliNum = this.engToNepaliNumberPipe
        .transform(String(this.form.get([String(arrName), index, String(source)]).value));
    this.form.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
  }

  async onChangeTranslateSecurity(arrName, source, index, target) {
    this.oneForm = this.formBuilder.group({
      securityOwnersName: this.form.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.oneForm);
    this.form.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.form.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
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

  private setPersonalOverdraftData(): void {
    // set en value
    this.form.get('selectedSecurity').patchValue(this.initialInformation.selectedSecurity.en);
    // this.form.get('referenceNumber').patchValue(this.initialInformation.referenceNumber.en);
    this.form.get('dateOfApproval').patchValue(this.initialInformation.dateOfApproval.en);
    this.form.get('dateofApplication').patchValue(this.initialInformation.dateofApplication.en);
    this.form.get('purposeOfLoan').patchValue(this.initialInformation.purposeOfLoan.en);
    this.form.get('baseRate').patchValue(this.initialInformation.baseRate.en);
    this.form.get('premiumRate').patchValue(this.initialInformation.premiumRate.en);
    this.form.get('yearlyInterestRate').patchValue(this.initialInformation.yearlyInterestRate.en);
    this.form.get('loanadminFee').patchValue(this.initialInformation.loanadminFee.en);
    this.form.get('loanadminFeeWords').patchValue(this.initialInformation.loanadminFeeWords.en);
    this.form.get('loanCommitmentFee').patchValue(this.initialInformation.loanCommitmentFee.en);
    this.form.get('dateofExpiry').patchValue(this.initialInformation.dateofExpiry.en);
    this.form.get('relationshipofficerName').patchValue(this.initialInformation.relationshipofficerName.en);
    this.form.get('nameofBranchManager').patchValue(this.initialInformation.nameofBranchManager.en);
    this.form.get('insuranceAmountinFigure').patchValue(this.initialInformation.insuranceAmountinFigure.en);

    // set ct value
    // this.form.get('referenceNumberTransVal').patchValue(this.initialInformation.referenceNumber.ct);
    this.form.get('purposeOfLoanTransVal').patchValue(this.initialInformation.purposeOfLoan.ct);
    this.form.get('baseRateTransVal').patchValue(this.initialInformation.baseRate.ct);
    this.form.get('premiumRateTransVal').patchValue(this.initialInformation.premiumRate.ct);
    this.form.get('yearlyInterestRateTransVal').patchValue(this.initialInformation.yearlyInterestRate.ct);
    this.form.get('loanadminFeeTransVal').patchValue(this.initialInformation.loanadminFee.ct);
    this.form.get('loanadminFeeWordsTransVal').patchValue(this.initialInformation.loanadminFeeWords.ct);
    this.form.get('loanCommitmentFeeTransVal').patchValue(this.initialInformation.loanCommitmentFee.ct);
    this.form.get('relationshipofficerNameTransVal').patchValue(this.initialInformation.relationshipofficerName.ct);
    this.form.get('nameofBranchManagerTransVal').patchValue(this.initialInformation.nameofBranchManager.ct);
    this.form.get('insuranceAmountinFigureTransVal').patchValue(this.initialInformation.insuranceAmountinFigure.ct);
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

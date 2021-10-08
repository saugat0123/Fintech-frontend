import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {PersonalOverdraftComponent} from '../../../mega-offer-letter-template/mega-offer-letter/personal-overdraft/personal-overdraft.component';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {OfferDocument} from '../../../model/OfferDocument';
import {Attributes} from '../../../../../@core/model/attributes';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';
import {ObjectUtil} from "../../../../../@core/utils/ObjectUtil";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EngToNepaliNumberPipe} from "../../../../../@core/pipe/eng-to-nepali-number.pipe";

@Component({
  selector: 'app-personal-overdraft-template-data',
  templateUrl: './personal-overdraft-template-data.component.html',
  styleUrls: ['./personal-overdraft-template-data.component.scss']
})
export class PersonalOverdraftTemplateDataComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
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

  constructor(private formBuilder: FormBuilder,
              private dialogService: NbDialogService,
              private modelService: NgbModal,
              private ngDialogRef: NbDialogRef<PersonalOverdraftComponent>,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private translateService: SbTranslateService,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      selectedSecurity: [undefined],
      loanLimitChecked: [undefined],
      renewalChecked: [undefined],
      referenceNumber: [undefined],
      dateofApproval: [undefined],
      dateofApplication: [undefined],
      loanPurpose: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanadminFee: [undefined],
      loanadminFeeWords: [undefined],
      loanCommitmentFee: [undefined],
      dateofExpiry: [undefined],
      ownerName: [undefined],
      ownersAddress: [undefined],
      propertyPlotNumber: [undefined],
      sheetNumber: [undefined],
      propertyArea: [undefined],
      // nameofGuarantors: [undefined],
      /*guaranteedamountinFigure: [undefined],
      guaranteedamountinWords: [undefined],*/
      insuranceAmountinFigure: [undefined],
      relationshipofficerName: [undefined],
      nameofBranchManager: [undefined],
      staffName: [undefined],

      // fortranslatedvalue
      selectedSecurityTransVal: [undefined],
      loanLimitCheckedTransVal: [undefined],
      renewalCheckedTransVal: [undefined],
      referenceNumberTransVal: [undefined, Validators.required],
      dateofApprovalTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      loanPurposeTransVal: [undefined, Validators.required],
      baseRateTransVal: [undefined, Validators.required],
      premiumRateTransVal: [undefined, Validators.required],
      yearlyInterestRateTransVal: [undefined],
      loanadminFeeTransVal: [undefined, Validators.required],
      loanadminFeeWordsTransVal: [undefined],
      loanCommitmentFeeTransVal: [undefined, Validators.required],
      dateofExpiryTransVal: [undefined],
      ownerNameTransVal: [undefined, Validators.required],
      ownersAddressTransVal: [undefined, Validators.required],
      propertyPlotNumberTransVal: [undefined, Validators.required],
      sheetNumberTransVal: [undefined, Validators.required],
      propertyAreaTransVal: [undefined, Validators.required],
      // nameofGuarantorsTransVal: [undefined],
      /*guaranteedamountinFigureTransVal: [undefined],
      guaranteedamountinWordsTransVal: [undefined],*/
      insuranceAmountinFigureTransVal: [undefined],
      relationshipofficerNameTransVal: [undefined, Validators.required],
      nameofBranchManagerTransVal: [undefined, Validators.required],
      staffNameTransVal: [undefined, Validators.required],

    });
  }submit() {
    this.submitted = true;
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
          this.mappedData();
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
          this.translatedData = {};
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT);
      Object.keys(this.form.controls).forEach(key => {
        if ( key.indexOf('TransVal') > -1) {
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

  mappedData() {
    Object.keys(this.form.controls).forEach(key => {
      Object.keys(this.form.controls).forEach(key => {
        if (key.indexOf('TransVal') > -1) {
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
    console.log('Data Value:',data);
    // this.form.get('referenceNumberTransVal').patchValue(this.translatedData.referenceNumber);
    this.form.get('dateofApprovalTransVal').patchValue(this.translatedData.dateofApproval);
    this.form.get('dateofApplicationTransVal').patchValue(this.translatedData.dateofApplication);
    this.form.get('loanPurposeTransVal').patchValue(this.translatedData.loanPurpose);
    this.form.get('baseRateTransVal').patchValue(this.translatedData.baseRate);
    this.form.get('premiumRateTransVal').patchValue(this.translatedData.premiumRate);
    this.form.get('yearlyInterestRateTransVal').patchValue(this.translatedData.yearlyInterestRate);
    // this.form.get('loanadminFeeTransVal').patchValue(this.translatedData.loanadminFee);
    this.form.get('loanadminFeeWordsTransVal').patchValue(this.translatedData.loanadminFeeWords);
    // this.form.get('loanCommitmentFeeTransVal').patchValue(this.translatedData.loanCommitmentFee);
    this.form.get('dateofExpiryTransVal').patchValue(this.translatedData.dateofExpiry);
    this.form.get('ownerNameTransVal').patchValue(this.translatedData.ownerName);
    this.form.get('ownersAddressTransVal').patchValue(this.translatedData.ownersAddress);
    // this.form.get('propertyPlotNumberTransVal').patchValue(this.translatedData.propertyPlotNumber);
    // this.form.get('propertyAreaTransVal').patchValue(this.translatedData.propertyArea);
    // this.form.get('sheetNumberTransVal').patchValue(this.translatedData.sheetNumber);
    this.form.get('relationshipofficerNameTransVal').patchValue(this.translatedData.relationshipofficerName);
    this.form.get('nameofBranchManagerTransVal').patchValue(this.translatedData.nameofBranchManager);
    this.form.get('staffNameTransVal').patchValue(this.translatedData.staffName);
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

  loanChecked(data) {
    this.loanLimit = data;
  }

  renewalChecked(data){
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

  calInterestRate() {
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
}

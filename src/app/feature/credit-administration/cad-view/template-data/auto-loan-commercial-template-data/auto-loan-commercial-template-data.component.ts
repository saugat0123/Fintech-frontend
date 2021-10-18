import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {PersonalLoanAndPersonalOverdraftComponent} from '../../../mega-offer-letter-template/mega-offer-letter/personal-loan-and-personal-overdraft/personal-loan-and-personal-overdraft.component';
import {NbDialogService} from '@nebular/theme';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../model/OfferDocument';
import {Attributes} from '../../../../../@core/model/attributes';
import {ToastService} from '../../../../../@core/utils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';

@Component({
  selector: 'app-auto-loan-commercial-template-data',
  templateUrl: './auto-loan-commercial-template-data.component.html',
  styleUrls: ['./auto-loan-commercial-template-data.component.scss']
})
export class AutoLoanCommercialTemplateDataComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  tdValues: any = {};
  offerLetterTypes = [];
  offerLetterConst: NabilOfferLetterConst;
  offerLetterSelect;
  form: FormGroup;
  translatedValues: any = {};
  spinner = false;
  submitted = false;
  dateTypeBS = false;
  dateTypeAD = false;
  dateTypeBS1 = false;
  dateTypeAD1 = false;
  previewBtn = true;
  offerLetterDocument: OfferDocument;
  existingOfferLetter = false;
  btnDisable = true;
  translatedData;
  attributes;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private dialogService: NbDialogService,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private translateService: SbTranslateService,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe ) { }

  ngOnInit() {
    this.buildAuto();
  }
  buildAuto() {
    this.form = this.formBuilder.group({
      referenceNumber: [undefined],
      dateofApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateofApplication: [undefined],
      nameoftheVehicle: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      distressSituationPercentage: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanadminFee: [undefined],
      loanadminFeeWords: [undefined],
      EMIAmount: [undefined],
      EMIAmountInWord: [undefined],
      equatedMonth: [undefined],
      loanCommitmentFee: [undefined],
      nameofGuarantors: [undefined],
      guaranteedamountinFigure: [undefined],
      guaranteedamountinWords: [undefined],
      ownerName: [undefined],
      ownersAddress: [undefined],
      propertyPlotNumber: [undefined],
      propertyArea: [undefined],
      seatNumber: [undefined],
      branchName: [undefined],
      vendorName: [undefined],
      loanAmount: [undefined],
      guarantorAmount: [undefined],
      insuranceAmount: [undefined],
      additionalGuarantorDetails: [undefined],
      relationshipofficerName: [undefined],
      dateofSignature: [undefined],
      district: [undefined],
      municipalityVDC: [undefined],
      wardNum: [undefined],
      witnessName: [undefined],
      staffName: [undefined],
      // For Translated Value
      referenceNumberTransVal: [undefined],
      dateofApprovalTransVal: [undefined],
      customerNameTransVal: [undefined],
      customerAddressTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      nameoftheVehicleTransVal: [undefined],
      loanAmountInFigureTransVal: [undefined],
      loanAmountInWordsTransVal: [undefined],
      distressSituationPercentageTransVal: [undefined],
      baseRateTransVal: [undefined],
      premiumRateTransVal: [undefined],
      yearlyInterestRateTransVal: [undefined],
      loanadminFeeTransVal: [undefined],
      loanadminFeeWordsTransVal: [undefined],
      EMIAmountTransVal: [undefined],
      EMIAmountInWordTransVal: [undefined],
      equatedMonthTransVal: [undefined],
      loanCommitmentFeeTransVal: [undefined],
      nameofGuarantorsTransVal: [undefined],
      guaranteedamountinFigureTransVal: [undefined],
      guaranteedamountinWordsTransVal: [undefined],
      ownerNameTransVal: [undefined],
      ownersAddressTransVal: [undefined],
      propertyPlotNumberTransVal: [undefined],
      propertyAreaTransVal: [undefined],
      seatNumberTransVal: [undefined],
      branchNameTransVal: [undefined],
      vendorNameTransVal: [undefined],
      loanAmountTransVal: [undefined],
      guarantorAmountTransVal: [undefined],
      insuranceAmountTransVal: [undefined],
      additionalGuarantorDetailsTransVal: [undefined],
      relationshipofficerNameTransVal: [undefined],
      dateofSignatureTransVal: [undefined],
      districtTransVal: [undefined],
      municipalityVDCTransVal: [undefined],
      wardNumTransVal: [undefined],
      witnessNameTransVal: [undefined],
      staffNameTransVal: [undefined],
    });
  }
  async translate() {
    this.spinner = true;
    this.translatedValues = await this.translateService.translateForm(this.form);
    this.spinner = false;
    this.btnDisable = false;
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
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
  translateNumber(source, target) {
    const wordLabelVar = this.engToNepaliNumberPipe.transform(this.form.get(source).value.toString());
    this.form.get(target).patchValue(wordLabelVar);
  }
  clearForm(controlName) {
    this.form.get(controlName).setValue(null);
  }
  get Form() {
    return this.form.controls;
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
  openModel() {
    // this.modelService.open(modalName, {size: 'xl', centered: true});
    this.dialogService.open(PersonalLoanAndPersonalOverdraftComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false,
      context: {
        cadOfferLetterApprovedDoc: this.customerApprovedDoc,
        preview: true,
      }
    });
  }
  mappedData() {
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
  }
  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation'));
      this.spinner = false;
      return;
    }
    this.spinner = true;
    this.btnDisable = true;
    this.customerApprovedDoc.docStatus = 'OFFER_AND_LEGAL_PENDING';

    if (this.customerApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument = this.customerApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
          === this.offerLetterConst.value(this.offerLetterConst.AUTO_LOAN_COMMERCIAL).toString())[0];
      if (!ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.existingOfferLetter = true;
      }
    }

    if (this.existingOfferLetter) {
      this.customerApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.AUTO_LOAN_COMMERCIAL).toString()) {
          this.mappedData();
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.AUTO_LOAN_COMMERCIAL);
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
      this.translatedData = {};
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

  }

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {SbTranslateService} from '../../../../../@core/service/sbtranslate.service';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {RetailProfessionalLoanComponent} from '../../../mega-offer-letter-template/mega-offer-letter/retail-professional-loan/retail-professional-loan.component';
import {NbDialogService} from '@nebular/theme';
import {PersonalOverdraftComponent} from '../../../mega-offer-letter-template/mega-offer-letter/personal-overdraft/personal-overdraft.component';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {OfferDocument} from '../../../model/OfferDocument';
import {Attributes} from '../../../../../@core/model/attributes';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NabilOfferLetterConst} from '../../../nabil-offer-letter-const';

@Component({
  selector: 'app-personal-overdraft-template-data',
  templateUrl: './personal-overdraft-template-data.component.html',
  styleUrls: ['./personal-overdraft-template-data.component.scss']
})
export class PersonalOverdraftTemplateDataComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  offerLetterTypes = [];
  offerLetterConst = NabilOfferLetterConst;
  offerLetterSelect;
  translatedValues: any = {};
  form: FormGroup;
  spinner = false;
  btnDisable = true;
  loanLimit = false;
  existingOfferLetter = false;
  attributes;
  tdValues: any = {};
  translatedData;
  previewBtn = true;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private translateService: SbTranslateService,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private dialogService: NbDialogService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      loanLimitChecked: [undefined],
      referenceNumber: [undefined],
      dateofApproval: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      dateofApplication: [undefined],
      nameoftheVehicle: [undefined],
      loanCommitmentFee: [undefined],
      loanAmountinFigure: [undefined],
      loanAmountInWords: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      yearlyInterestRate: [undefined],
      loanadminFee: [undefined],
      loanadminFeeWords: [undefined],
      dateofExpiry: [undefined],
      ownerName: [undefined],
      ownersAddress: [undefined],
      propertyPlotNumber: [undefined],
      ownersName: [undefined],
      ownersProperty: [undefined],
      freeText: [undefined],
      propertyArea: [undefined],
      nameofBranch: [undefined],
      nameofCompanyCustomerWorking: [undefined],
      nameofGuarantors: [undefined],
      guaranteedamountinFigure: [undefined],
      guaranteedamountinWords: [undefined],
      insuranceAmountinFigure: [undefined],
      relationshipofficerName: [undefined],
      branchName: [undefined],
      district: [undefined],
      wardNum: [undefined],
      witnessName: [undefined],
      staffName: [undefined],
      // fortranslatedvalue
      referenceNumberTransVal: [undefined],
      dateofApprovalTransVal: [undefined],
      customerNameTransVal: [undefined],
      customerAddressTransVal: [undefined],
      dateofApplicationTransVal: [undefined],
      nameoftheVehicleTransVal: [undefined],
      loanCommitmentFeeTransVal: [undefined],
      loanAmountinFigureTransVal: [undefined],
      loanAmountInWordsTransVal: [undefined],
      baseRateTransVal: [undefined],
      premiumRateTransVal: [undefined],
      yearlyInterestRateTransVal: [undefined],
      loanadminFeeTransVal: [undefined],
      loanadminFeeWordsTransVal: [undefined],
      dateofExpiryTransVal: [undefined],
      ownerNameTransVal: [undefined],
      ownersAddressTransVal: [undefined],
      propertyPlotNumberTransVal: [undefined],
      ownersNameTransVal: [undefined],
      ownersPropertyTransVal: [undefined],
      freeTextTransVal: [undefined],
      propertyAreaTransVal: [undefined],
      nameofBranchTransVal: [undefined],
      nameofCompanyCustomerWorkingTransVal: [undefined],
      nameofGuarantorsTransVal: [undefined],
      guaranteedamountinFigureTransVal: [undefined],
      guaranteedamountinWordsTransVal: [undefined],
      insuranceAmountinFigureTransVal: [undefined],
      relationshipofficerNameTransVal: [undefined],
      branchNameTransVal: [undefined],
      districtTransVal: [undefined],
      wardNumTransVal: [undefined],
      witnessNameTransVal: [undefined],
      staffNameTransVal: [undefined],
    });
  }

  async translate() {
    this.spinner = true;
    this.translatedData = await this.translateService.translateForm(this.form);
    this.tdValues = this.translatedData;
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

  openModel() {
    // this.modelService.open(modalName, {size: 'xl', centered: true});
    this.dialogService.open(PersonalOverdraftComponent, {
      closeOnBackdropClick: false,
      closeOnEsc: false,
      hasBackdrop: false,
      context: {
        cadOfferLetterApprovedDoc: this.cadData,
        preview: true,
      }
    });
  }

  clearForm(controlName) {
    this.form.get(controlName).setValue(null);
  }
  submit() {
    this.form.get('loanLimitChecked').patchValue(this.loanLimit);
    this.spinner = true;
    this.btnDisable = true;
    this.cadData.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadData.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.tdValues);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PERSONAL_OVERDRAFT);
      Object.keys(this.form.controls).forEach(key => {
        if (key === 'loanDetails') {
          return;
        }
        this.attributes = new Attributes();
        this.attributes.en = this.form.get(key).value;
        this.attributes.np = this.tdValues[key];
        this.tdValues[key] = this.attributes;
      });
      this.translatedData = {};
      offerDocument.initialInformation = JSON.stringify(this.tdValues);
      this.cadData.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.previewBtn = this.btnDisable = false;
      this.openModel();
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = this.btnDisable = false;
    });
  }

}

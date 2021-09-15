import {Component, Input, OnInit} from '@angular/core';
import {Form, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CustomerOfferLetterService} from '../../../../loan/service/customer-offer-letter.service';
import {MegaOfferLetterConst} from '../../../mega-offer-letter-const';
import {OfferDocument} from '../../../model/OfferDocument';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {NepaliEditor} from '../../../../../@core/utils/constants/nepaliEditor';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliPercentWordPipe} from '../../../../../@core/pipe/nepali-percent-word.pipe';

@Component({
  selector: 'app-sme',
  templateUrl: './sme.component.html',
  styleUrls: ['./sme.component.scss']
})
export class SmeComponent implements OnInit {
    loanForm: FormGroup;
  // todo replace enum constant string compare
  smeLoanHolderInfo;
    spinner = false;
  existingOfferLetter = false;
  initialInfoPrint;
  loanRateDetail;
  overdraftTotal = [undefined];
  offerLetterConst = MegaOfferLetterConst;
  offerLetterDocument: OfferDocument;
  selectedLoanArray = [];
  overdraft = false;
  demandLoan = false;
  fixedTermLoan = false;
  hirePurchase = false;
  letterOfCredit = false;
  trustReceipt = false;
  cashCredit = false;
  shortTermLoan = false;
  bankGuarantee = false;


  ckeConfig = NepaliEditor.CK_CONFIG;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;


  constructor( private formBuilder: FormBuilder,
               private router: Router,
               private toastService: ToastService,
               private administrationService: CreditAdministrationService,
               protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
               private routerUtilsService: RouterUtilsService,
               private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               private engToNepNumberPipe: EngToNepaliNumberPipe,
               private currencyFormatPipe: CurrencyFormatterPipe,
               private nepToEngNumberPipe: NepaliToEngNumberPipe,
               private nepPercentWordPipe: NepaliPercentWordPipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder.nepData)) {
      this.smeLoanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      console.log(this.smeLoanHolderInfo);
    }
    this.checkOfferLetterData();
  }
  buildForm() {
    this.loanForm = this.formBuilder.group({
      dateOfGeneration: [undefined],
      customerName: [undefined],
      customerAddress: [undefined],
      applicationDateInAD: [undefined],
      vehicleDescription: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      annualInterestRate: [undefined],
      serviceCharge: [undefined],
      serviceChargeWords: [undefined],
      communicationFee: [undefined],
      emiAmount: [undefined],
      emiAmountWords: [undefined],
      numberOfEmi: [undefined],
      collateralReleaseFee: [undefined],
      loanCommitmentFee: [undefined],
      branchName: [undefined],
      lateFee: [undefined],
      dealerName: [undefined],
      changeFeeBelow1Cr: [undefined],
      changeFeeAbove1Cr: [undefined],
      documentAccessFee: [undefined],
      promissoryNoteAmount: [undefined],
      loanDeedAmount: [undefined],
      guaranteeAmount: [undefined],
      signatureDate: [undefined],
      bankRepresentativeName: [undefined],
    });
  }
  checkOfferLetterData() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.SME).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.SME);
      this.fillForm();
    } else  {
      const  initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      console.log(initialInfo);
      this.initialInfoPrint = initialInfo;
      console.log(this.offerLetterDocument);
      this.existingOfferLetter = true;
      this.loanForm.patchValue(initialInfo, {emitEvent: false});
      this.initialInfoPrint = initialInfo;
    }
  }

  fillForm() {
    console.log('this.loanHolderInfo', this.cadOfferLetterApprovedDoc);
    let cadNepData = {
      numberNepali: ')',
      nepaliWords: 'सुन्य',
    };
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.nepData)) {
      cadNepData = JSON.parse(this.cadOfferLetterApprovedDoc.nepData);
    }
    console.log('loan config data', this.smeLoanHolderInfo);
    const customerAddress = this.smeLoanHolderInfo.permanentMunicipality + ' ' +
        this.smeLoanHolderInfo.permanentWard + ', ' + this.smeLoanHolderInfo.permanentDistrict;
    this.loanForm.patchValue({
      customerName: this.smeLoanHolderInfo.name ? this.smeLoanHolderInfo.name : '',
      customerAddress: customerAddress ? customerAddress : '',
      loanAmount: cadNepData.numberNepali,
      loanAmountWords: cadNepData.nepaliWords,
    });
  }

  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() === this.offerLetterConst.value(this.offerLetterConst.SME).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.loanForm.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.SME);
      offerDocument.initialInformation = JSON.stringify(this.loanForm.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe( () => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    } ,  error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });

  }
    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.loanForm.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.loanForm.get(wordLabel).patchValue(returnVal);
    }


}

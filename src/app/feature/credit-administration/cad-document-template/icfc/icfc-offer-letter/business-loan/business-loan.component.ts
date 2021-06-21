import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NbDialogRef} from '@nebular/theme';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';



@Component({
  selector: 'app-business-loan',
  templateUrl: './business-loan.component.html',
  styleUrls: ['./business-loan.component.scss']
})
export class BusinessLoanComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  businessLoan: FormGroup;
  nepData;
  offerLetterDocument: OfferDocument;
  offerLetterConst = IcfcOfferLetterConst;
  initialInfoPrint;
  existingOfferLetter: boolean;
  spinner: boolean;

  constructor(private dialogRef: NbDialogRef<BusinessLoanComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilService: RouterUtilsService) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.businessLoan.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.businessLoan.get(wordLabel).patchValue(returnVal);
  }

  buildForm() {
    this.businessLoan = this.formBuilder.group({
      address: [undefined],
      district: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      branch: [undefined],
      regNo: [undefined],
      debtorName: [undefined],
      date: [undefined],
      guarantorName: [undefined],
      field: [undefined],
      field2: [undefined],
      karja: [undefined],
      rate: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      rate2: [undefined],
      baseRate2: [undefined],
      premiumRate2: [undefined],
    });
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.businessLoan.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.businessLoan.get(wordLabel).patchValue(convertedVal);
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.businessLoan.patchValue({
      date: this.nepData.date ? this.nepData.date : '',
      year: this.nepData.year ? this.nepData.year  : '',
      month: this.nepData.month ? this.nepData.month : '',
      day: this.nepData.day ? this.nepData.day : '',
      baseRate: this.nepData.baseRate ? this.nepData.baseRate : '',
      baseRate2: this.nepData.baseRate2 ? this.nepData.baseRate2 : '',
      premiumRate: this.nepData.premiumRate ? this.nepData.premiumRate : '',
      premiumRate2: this.nepData.premiumRate2 ? this.nepData.premiumRate2 : '',
    });
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.BUSINESS_LOAN).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.BUSINESS_LOAN);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      console.log('It is initial info', initialInfo);
      // Codes of setting the businessLoan arrays:
      if (!ObjectUtil.isEmpty(initialInfo)) {}
      this.businessLoan.patchValue(this.initialInfoPrint);
    }
  }

  onSubmit() {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.BUSINESS_LOAN).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.businessLoan.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.BUSINESS_LOAN);
      offerDocument.initialInformation = JSON.stringify(this.businessLoan.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
      console.log('This is cad offer letter : ', this.cadOfferLetterApprovedDoc);
    }
    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-bank-guarantee',
  templateUrl: './bank-guarantee.component.html',
  styleUrls: ['./bank-guarantee.component.scss']
})
export class BankGuaranteeComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  bankGuarantee: FormGroup;
  existingOfferLetter: boolean;
  offerLetterConst = IcfcOfferLetterConst;
  spinner: boolean;
  offerLetterDocument: OfferDocument;
  nepData;
  initialInfoPrint;

  constructor(private formBuilder: FormBuilder,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<BankGuaranteeComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.BANK_GUARANTEE).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.BANK_GUARANTEE);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {}
      this.bankGuarantee.patchValue(this.initialInfoPrint);
    }
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.bankGuarantee.patchValue({
      date: this.nepData.date ? this.nepData.date : '',
      address: this.nepData.address ? this.nepData.address : '',
      amount: this.nepData.amount ? this.nepData.amount : '',
      amount2: this.nepData.date ? this.nepData.amount2 : '',
    });
  }

  onSubmit() {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.BANK_GUARANTEE).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.bankGuarantee.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.BANK_GUARANTEE);
      offerDocument.initialInformation = JSON.stringify(this.bankGuarantee.value);
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

  buildForm() {
    this.bankGuarantee = this.formBuilder.group({
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
      amount: [undefined],
      name: [undefined],
    });
  }
}

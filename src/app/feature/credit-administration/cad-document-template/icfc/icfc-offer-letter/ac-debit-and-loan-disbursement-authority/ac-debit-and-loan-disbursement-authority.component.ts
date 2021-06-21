import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-ac-debit-and-loan-disbursement-authority',
  templateUrl: './ac-debit-and-loan-disbursement-authority.component.html',
  styleUrls: ['./ac-debit-and-loan-disbursement-authority.component.scss']
})
export class AcDebitAndLoanDisbursementAuthorityComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  acDebitAndLoanDisbursementAuthority: FormGroup;
  offerLetterConst = IcfcOfferLetterConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  spinner: boolean;
  nepData;

  constructor(private formBuilder: FormBuilder,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<AcDebitAndLoanDisbursementAuthorityComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.AC_DEBIT_AND_LOAN_DISBURSEMENT_AUTHORITY).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.AC_DEBIT_AND_LOAN_DISBURSEMENT_AUTHORITY);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {}
      this.acDebitAndLoanDisbursementAuthority.patchValue(this.initialInfoPrint);
    }
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.acDebitAndLoanDisbursementAuthority.patchValue({
      date: this.nepData.date ? this.nepData.date : '',
      address: this.nepData.address ? this.nepData.address : '',
      amount: this.nepData.amount ? this.nepData.amount : '',
      amount2: this.nepData.date ? this.nepData.amount2 : '',
    });
  }

  onSubmit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.AC_DEBIT_AND_LOAN_DISBURSEMENT_AUTHORITY).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.acDebitAndLoanDisbursementAuthority.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.AC_DEBIT_AND_LOAN_DISBURSEMENT_AUTHORITY);
      offerDocument.initialInformation = JSON.stringify(this.acDebitAndLoanDisbursementAuthority.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });

  }

  buildForm() {
    this.acDebitAndLoanDisbursementAuthority = this.formBuilder.group({
      date: [undefined],
      address: [undefined],
      amount: [undefined],
      amount2: [undefined],
      loan: [undefined],
      loanAmount: [undefined],
      loanAmount2: [undefined],
      accountNo: [undefined],
      date2: [undefined],
      address2: [undefined],
      name: [undefined],
      accountNo2: [undefined],
      loan2: [undefined],
      rate: [undefined],
    });
  }
}

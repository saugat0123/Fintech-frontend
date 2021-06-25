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
  selectedData = 'Loan Disbursement';
  subjectType = ['Loan Disbursement', 'Account Debit Authority'];
  initialInfoPrint;
  loanDisbursementSelected: boolean;
  accountDebitSelected: boolean;
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
      this.loanDisbursementSelected = true;
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.selectedData = initialInfo.subjectSelectedValue;
      this.changeType(this.selectedData);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {}
      this.acDebitAndLoanDisbursementAuthority.patchValue(this.initialInfoPrint);
    }
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.acDebitAndLoanDisbursementAuthority.patchValue({
      name: this.nepData.name ? this.nepData.name : '',
    });
  }

  onSubmit(): void {
    console.log(this.acDebitAndLoanDisbursementAuthority.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.AC_DEBIT_AND_LOAN_DISBURSEMENT_AUTHORITY).toString()) {
          this.acDebitAndLoanDisbursementAuthority.get('subjectSelectedValue').patchValue(this.selectedData);
          offerLetterPath.initialInformation = JSON.stringify(this.acDebitAndLoanDisbursementAuthority.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.AC_DEBIT_AND_LOAN_DISBURSEMENT_AUTHORITY);
      this.acDebitAndLoanDisbursementAuthority.get('subjectSelectedValue').patchValue(this.selectedData);
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
      amountInWords: [undefined],
      loan: [undefined],
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      accountNo: [undefined],
      date2: [undefined],
      address2: [undefined],
      name: [undefined],
      accountNo2: [undefined],
      loan2: [undefined],
      rate: [undefined],
      amount2: [undefined],
      loanAmount2: [undefined],
      subjectSelectedValue: [undefined],
    });
  }

  changeType($event) {
    this.selectedData = $event;
    $event.includes('Loan Disbursement') ? this.loanDisbursementSelected = true : this.loanDisbursementSelected = false;
    $event.includes('Account Debit Authority') ? this.accountDebitSelected = true : this.accountDebitSelected = false;
  }
}

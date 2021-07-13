import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {LegalDocumentCheckListEnum} from '../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-ac-debit-and-loan-disbursement-authority',
  templateUrl: './ac-debit-and-loan-disbursement-authority.component.html',
  styleUrls: ['./ac-debit-and-loan-disbursement-authority.component.scss']
})
export class AcDebitAndLoanDisbursementAuthorityComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  acDebitAndLoanDisbursementAuthority: FormGroup;
  offerLetterConst = LegalDocumentCheckListEnum;
  selectedData = 'Loan Disbursement';
  subjectType = ['Loan Disbursement', 'Account Debit Authority'];
  initialInfoPrint;
  loanDisbursementSelected: boolean;
  accountDebitSelected: boolean;
  existingOfferLetter = false;
  spinner: boolean;
  // nepData;

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
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.loanDisbursementSelected = true;
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.selectedData = initialInfo.subjectSelectedValue;
          this.changeType(this.selectedData);
          this.acDebitAndLoanDisbursementAuthority.patchValue(this.initialInfoPrint);
        }
      });
    }
  }

  onSubmit(): void {
    console.log(this.acDebitAndLoanDisbursementAuthority.value);
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          this.acDebitAndLoanDisbursementAuthority.get('subjectSelectedValue').patchValue(this.selectedData);
          singleCadFile.initialInformation = JSON.stringify(this.acDebitAndLoanDisbursementAuthority.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        this.acDebitAndLoanDisbursementAuthority.get('subjectSelectedValue').patchValue(this.selectedData);
        cadFile.initialInformation = JSON.stringify(this.acDebitAndLoanDisbursementAuthority.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      this.acDebitAndLoanDisbursementAuthority.get('subjectSelectedValue').patchValue(this.selectedData);
      cadFile.initialInformation = JSON.stringify(this.acDebitAndLoanDisbursementAuthority.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
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

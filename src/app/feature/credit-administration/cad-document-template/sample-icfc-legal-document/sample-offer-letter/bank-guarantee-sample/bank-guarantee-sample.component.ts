import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-bank-guarantee-sample',
  templateUrl: './bank-guarantee-sample.component.html',
  styleUrls: ['./bank-guarantee-sample.component.scss']
})
export class BankGuaranteeSampleComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  bankGuarantee: FormGroup;
  offerLetterConst = CadCheckListTemplateEnum;
  spinner: boolean;
  initialInfoPrint;

  constructor(private formBuilder: FormBuilder,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<BankGuaranteeSampleComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  checkOfferLetter() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.bankGuarantee.patchValue(this.initialInfoPrint);
        }
      });
    }
  }

  buildForm() {
    this.bankGuarantee = this.formBuilder.group({
      field: [undefined],
      field2: [undefined],
      field3: [undefined],
      refNo: [undefined],
      refNo2: [undefined],
      name: [undefined],
      ward: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      amount2: [undefined],
      amountInWords2: [undefined],
      startDate: [undefined],
      expiryDate: [undefined],
      amount3: [undefined],
      amountInWords3: [undefined],
      office: [undefined],
      branchAddress: [undefined],
      office2: [undefined],
      date: [undefined]
    });
  }

  onSubmit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.bankGuarantee.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.bankGuarantee.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.bankGuarantee.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.log(error);
      this.toastService.show(new Alert(AlertType.DANGER, 'Failed to save offer letter !'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilService.reloadCadProfileRoute(this.cadData.id);
    });
  }

}

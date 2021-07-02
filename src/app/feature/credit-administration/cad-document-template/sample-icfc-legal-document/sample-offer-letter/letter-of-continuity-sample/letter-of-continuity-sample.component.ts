import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-letter-of-continuity-sample',
  templateUrl: './letter-of-continuity-sample.component.html',
  styleUrls: ['./letter-of-continuity-sample.component.scss']
})
export class LetterOfContinuitySampleComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  letterOfContinuity: FormGroup;
  offerLetterConst = CadCheckListTemplateEnum;
  initialInfoPrint;
  spinner: boolean;

  constructor(private formBuilder: FormBuilder,
              private currencyFormatPipe: CurrencyFormatterPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<LetterOfContinuitySampleComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.letterOfContinuity = this.formBuilder.group({
      date: [undefined],
      branchAddress: [undefined],
      witness: [undefined],
      witness2: [undefined]
    });
  }

  checkOfferLetter() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.letterOfContinuity.patchValue(this.initialInfoPrint);
        }
      });
    }
  }

  onSubmit(): void {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.letterOfContinuity.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.letterOfContinuity.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfContinuity.value);
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

}

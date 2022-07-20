import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
import {NepaliWordPipe} from '../../../../../../@core/pipe/nepali-word.pipe';

@Component({
  selector: 'app-statement-of-position',
  templateUrl: './statement-of-position.component.html',
  styleUrls: ['./statement-of-position.component.scss']
})
export class StatementOfPositionComponent implements OnInit {

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private nepaliToEnglishPipe: NepaliToEngNumberPipe,
      private nepaliNumber: NepaliNumberPipe,
      private nepaliWordPipe: NepaliWordPipe,
  ) { }
  form: FormGroup;
  cadCheckListEnum = CadCheckListTemplateEnum;
  initialInfoPrint;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId;
  @Input() customerLoanId;


  spinner = false;
  nepaliData;
  individual = false;
  amount;
  ngOnInit() {
    if (this.cadData.assignedLoan[0].loanCategory === 'INDIVIDUAL') {
      this.individual = true;
    }
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = singleCadFile.initialInformation;
          this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
          if (!ObjectUtil.isEmpty(JSON.parse(singleCadFile.initialInformation).amount)) {
            this.amount = JSON.parse(singleCadFile.initialInformation).amount;
          }
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
      this.form.patchValue(JSON.parse(this.initialInfoPrint));
      this.form.patchValue({
        amountInWords: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(this.amount)),
        branch: this.cadData.assignedLoan[0].branch.nepaliName
      });
    } else {
      this.fillNepaliData();
      this.form.patchValue({
        amount: this.nepaliNumber.transform(this.amount, 'preeti'),
        amountInWords: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(this.amount)),
        branch: this.cadData.assignedLoan[0].branch.nepaliName
      });
    }
  }
  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      guarantorName: [undefined],
      jagaDetail: [undefined],
      jagaMulya: [undefined],
      // address: [undefined],
      gharDetail: [undefined],
      gharMulya: [undefined],
      shareDetail: [undefined],
      shareMulya: [undefined],
      suchikritNabhayekoShareDetail: [undefined],
      suchikritNabhayekoShareMulya: [undefined],
      anyaSurachaharukoDetail: [undefined],
      anyaSurachaharukoMulya: [undefined],
      bankBalanceDetail: [undefined],
      bankBalance: [undefined],
      sawariSadhanDetail: [undefined],
      sawariSadhanMulya: [undefined],
      gargahanaDetail: [undefined],
      gargahanaMulya: [undefined],
      total: [undefined],
      bankBataRinkoBiwaran: [undefined],
      bankBataRinkoMulya: [undefined],
      bitiyeSansthabataRinkoBiwaran: [undefined],
      bitiyeSansthabataRinkoMulya: [undefined],
      nijiSapatikoBiwaran: [undefined],
      nijiSapatikoMulya: [undefined],
      anyaShahukoBiwaran: [undefined],
      anyaShahukoMulya: [undefined],
      mulya: [undefined],
      networth: [undefined],
    });
  }
  fillNepaliData() {
    if (!ObjectUtil.isEmpty(this.nepaliData)) {
      this.form.patchValue({
        name: this.nepaliData.name,
        branch: this.cadData.loanHolder.branch.nepaliName
      });
    }
  }
  submit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved statement of position'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save statement of position'));
      this.dialogRef.close();
      this.spinner = false;
    });
    console.log(this.form.value);
  }
  amountChange(e) {
    this.form.patchValue({
      amountInWords: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
    });
   }
}

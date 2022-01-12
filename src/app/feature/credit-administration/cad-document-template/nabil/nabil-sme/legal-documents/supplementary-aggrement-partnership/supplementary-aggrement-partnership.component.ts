import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CreditAdministrationService} from '../../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../../@core/utils';
import {CadOfferLetterModalComponent} from '../../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../../utils/router-utils.service';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {NbDialogRef} from '@nebular/theme';
import {Alert, AlertType} from '../../../../../../../@theme/model/Alert';
import {CadFile} from '../../../../../model/CadFile';
import {Document} from '../../../../../../admin/modal/document';
import {OfferDocument} from '../../../../../model/OfferDocument';

@Component({
  selector: 'app-supplementary-aggrement-partnership',
  templateUrl: './supplementary-aggrement-partnership.component.html',
  styleUrls: ['./supplementary-aggrement-partnership.component.scss']
})
export class SupplementaryAggrementPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  form: FormGroup;
  individualData;
  finalAmount;
  loanAmountWord;
  supportedInfo;
  initialInfoPrint;
  cadFileList: Array<OfferDocument>;
  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatPipe: CurrencyFormatterPipe
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.cadData)) {
      let totalLoan = 0;
      this.cadData.assignedLoan.forEach(val => {
        const proposedAmount = val.proposal.proposedLimit;
        totalLoan = totalLoan + proposedAmount;
      });
      this.finalAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(totalLoan));
      this.loanAmountWord = this.nepaliCurrencyWordPipe.transform(totalLoan);
    }
    this.fillForm();
    // this.setFreeInfo(this.individualData.textAreas);
    // this.setFreeInfo();
    this.patchFreeInfo();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      addressOfBank: [undefined],
      nameOfBorrower: [undefined],
      dateOfHyothenciation: [undefined],
      sanctionLetter: [undefined],
      loanAmountInFig: [undefined],
      loanAmountInWord: [undefined],
      dateOfTrust: [undefined],
      letterOfCredit: [undefined],
      letterOfCreditIssueDate: [undefined],
      textAreas: this.formBuilder.array([]),
    });
    this.addTextArea();
  }

  addTextArea() {
    (this.form.get('textAreas') as FormArray).push(
        this.formBuilder.group({
          freeTexts: [undefined]
        }));
  }

  removeAtIndex(i: number) {
    (this.form.get('textAreas') as FormArray).removeAt(i);
  }
 // setFreeInfo() {
 //    let text = '';
 //    if (!ObjectUtil.isEmpty(this.cadData)) {
 //      this.cadData.cadFileList.forEach(individualCadFile => {
 //        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
 //          text = JSON.parse(individualCadFile.supportedInformation);
 //        }
 //      });
 //    }
 //    return text ? text : '';
 //  }
  setFreeInfo(textAreas: any) {
    const formArray = this.form.get('textAreas') as FormArray;
    if (!ObjectUtil.isEmpty(this.cadData)) {
    if (!ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      const cadFileList = this.cadFileList;
      this.cadFileList = cadFileList;
    }
      // this.cadData.cadFileList.forEach(individualCadFile => {
      //   // const freeTextList = this.customerInfo.guarantors.guarantorList;
      //   // this.supportedInfo = freeTextList;
      //   if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
      //     this.supportedInfo = JSON.parse(individualCadFile.supportedInformation);
      //   }
      // });
    }
    textAreas.forEach(value => {
      formArray.push(this.formBuilder.group({
        freeTexts: [value.freeTexts],
      }));
    });
  }
  private fillForm() {
    this.form.patchValue({
      addressOfBank: this.individualData.branch ? this.individualData.branch.ct : '',
      nameOfBorrower: this.individualData.name ? this.individualData.name.ct : '',
      dateOfHyothenciation: this.individualData.name ? this.individualData.name.ct : '',
      loanAmountInFig: this.finalAmount ? this.finalAmount : '',
      loanAmountInWord: this.loanAmountWord ? this.loanAmountWord : '',
    });
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(individualCadFile => {
        if (individualCadFile.customerLoanId === this.customerLoanId && individualCadFile.cadDocument.id === this.documentId) {
          flag = false;
         // individualCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        // cadFile.initialInformation = JSON.stringify(this.form.value);
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
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }

  private patchFreeInfo() {
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      const data = JSON.parse(this.cadData.loanHolder.nepData);
      this.form.patchValue(data);
      this.setFreeInfo(data.textAreas);
    }
  }
}



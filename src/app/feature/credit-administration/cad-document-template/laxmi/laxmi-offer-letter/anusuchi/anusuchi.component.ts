import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-anusuchi',
  templateUrl: './anusuchi.component.html',
  styleUrls: ['./anusuchi.component.scss']
})
export class AnusuchiComponent implements OnInit {

  @Input() customerLoanId;
  @Input() cadData;
  @Input() documentId;
  form: FormGroup;
  initialInfoPrint;
  spinner = false;
  offerLetterConst = CadCheckListTemplateEnum;
  customerData;

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = JSON.parse(singleCadFile.supportedInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.customerData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.fillForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      bankName1: [undefined],
      bankName2: [undefined],
      bankName3: [undefined],
      bankName4: [undefined],
      amountDate1: [undefined],
      amountDate2: [undefined],
      amountDate3: [undefined],
      amountDate4: [undefined],
      deadline1: [undefined],
      deadline2: [undefined],
      deadline3: [undefined],
      deadline4: [undefined],
      totalAmountDate1: [undefined],
      totalAmountDate2: [undefined],
      totalAmountDate3: [undefined],
      totalAmountDate4: [undefined],
      totalDeadline1: [undefined],
      totalDeadline2: [undefined],
      totalDeadline3: [undefined],
      totalDeadline4: [undefined],
      grandTotalAmountDate: [undefined],
      grandTotalDeadline: [undefined],
      borrowerName: [undefined],
      currentCapitalDebt1: [undefined],
      currentCapitalDebt2: [undefined],
      currentCapitalDebt3: [undefined],
      currentCapitalDebt4: [undefined],
      periodicLoan1: [undefined],
      periodicLoan2: [undefined],
      periodicLoan3: [undefined],
      periodicLoan4: [undefined],
      otherLoan1: [undefined],
      otherLoan2: [undefined],
      otherLoan3: [undefined],
      otherLoan4: [undefined],
      nonCellBasedFacility1: [undefined],
      nonCellBasedFacility2: [undefined],
      nonCellBasedFacility3: [undefined],
      nonCellBasedFacility4: [undefined],
    });
  }
  setFreeText() {
    const freeText = {
      date: this.form.get('date') ? this.form.get('date').value : '',
      bankName1: this.form.get('bankName1') ? this.form.get('bankName1').value : '',
      bankName2: this.form.get('bankName2') ? this.form.get('bankName2').value : '',
      bankName3: this.form.get('bankName3') ? this.form.get('bankName3').value : '',
      bankName4: this.form.get('bankName4') ? this.form.get('bankName4').value : '',
      amountDate1: this.form.get('amountDate1') ? this.form.get('amountDate1').value : '',
      amountDate2: this.form.get('amountDate2') ? this.form.get('amountDate2').value : '',
      amountDate3: this.form.get('amountDate3') ? this.form.get('amountDate3').value : '',
      amountDate4: this.form.get('amountDate4') ? this.form.get('amountDate4').value : '',
      deadline1: this.form.get('deadline1') ? this.form.get('deadline1').value : '',
      deadline2: this.form.get('deadline2') ? this.form.get('deadline2').value : '',
      deadline3: this.form.get('deadline3') ? this.form.get('deadline3').value : '',
      deadline4: this.form.get('deadline4') ? this.form.get('deadline4').value : '',
      totalAmountDate1: this.form.get('totalAmountDate1') ? this.form.get('totalAmountDate1').value : '',
      totalAmountDate2: this.form.get('totalAmountDate2') ? this.form.get('totalAmountDate2').value : '',
      totalAmountDate3: this.form.get('totalAmountDate3') ? this.form.get('totalAmountDate3').value : '',
      totalAmountDate4: this.form.get('totalAmountDate4') ? this.form.get('totalAmountDate4').value : '',
      totalDeadline1: this.form.get('totalDeadline1') ? this.form.get('totalDeadline1').value : '',
      totalDeadline2: this.form.get('totalDeadline2') ? this.form.get('totalDeadline2').value : '',
      totalDeadline3: this.form.get('totalDeadline3') ? this.form.get('totalDeadline3').value : '',
      totalDeadline4: this.form.get('totalDeadline4') ? this.form.get('totalDeadline4').value : '',
      grandTotalAmountDate: this.form.get('grandTotalAmountDate') ? this.form.get('grandTotalAmountDate').value : '',
      grandTotalDeadline: this.form.get('grandTotalDeadline') ? this.form.get('grandTotalDeadline').value : '',
      borrowerName: this.form.get('borrowerName') ? this.form.get('borrowerName').value : '',
      currentCapitalDebt1: this.form.get('currentCapitalDebt1') ? this.form.get('currentCapitalDebt1').value : '',
      currentCapitalDebt2: this.form.get('currentCapitalDebt2') ? this.form.get('currentCapitalDebt2').value : '',
      currentCapitalDebt3: this.form.get('currentCapitalDebt3') ? this.form.get('currentCapitalDebt3').value : '',
      currentCapitalDebt4: this.form.get('currentCapitalDebt4') ? this.form.get('currentCapitalDebt4').value : '',
      periodicLoan1: this.form.get('periodicLoan1') ? this.form.get('periodicLoan1').value : '',
      periodicLoan2: this.form.get('periodicLoan2') ? this.form.get('periodicLoan2').value : '',
      periodicLoan3: this.form.get('periodicLoan3') ? this.form.get('periodicLoan3').value : '',
      periodicLoan4: this.form.get('periodicLoan4') ? this.form.get('periodicLoan4').value : '',
      otherLoan1: this.form.get('otherLoan1') ? this.form.get('otherLoan1').value : '',
      otherLoan2: this.form.get('otherLoan2') ? this.form.get('otherLoan2').value : '',
      otherLoan3: this.form.get('otherLoan3') ? this.form.get('otherLoan3').value : '',
      otherLoan4: this.form.get('otherLoan4') ? this.form.get('otherLoan4').value : '',
      nonCellBasedFacility1: this.form.get('nonCellBasedFacility1') ? this.form.get('nonCellBasedFacility1').value : '',
      nonCellBasedFacility2: this.form.get('nonCellBasedFacility2') ? this.form.get('nonCellBasedFacility2').value : '',
      nonCellBasedFacility3: this.form.get('nonCellBasedFacility3') ? this.form.get('nonCellBasedFacility3').value : '',
      nonCellBasedFacility4: this.form.get('nonCellBasedFacility4') ? this.form.get('nonCellBasedFacility4').value : '',
    };
    return JSON.stringify(freeText);
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.customerData)) {
      this.form.patchValue({
        date: this.initialInfoPrint ? this.initialInfoPrint.date : '',
        bankName1: this.initialInfoPrint ? this.initialInfoPrint.bankName1 : '',
        bankName2: this.initialInfoPrint ? this.initialInfoPrint.bankName2 : '',
        bankName3: this.initialInfoPrint ? this.initialInfoPrint.bankName3 : '',
        bankName4: this.initialInfoPrint ? this.initialInfoPrint.bankName4 : '',
        amountDate1: this.initialInfoPrint ? this.initialInfoPrint.amountDate1 : '',
        amountDate2: this.initialInfoPrint ? this.initialInfoPrint.amountDate2 : '',
        amountDate3: this.initialInfoPrint ? this.initialInfoPrint.amountDate3 : '',
        amountDate4: this.initialInfoPrint ? this.initialInfoPrint.amountDate4 : '',
        deadline1: this.initialInfoPrint ? this.initialInfoPrint.deadline1 : '',
        deadline2: this.initialInfoPrint ? this.initialInfoPrint.deadline2 : '',
        deadline3: this.initialInfoPrint ? this.initialInfoPrint.deadline3 : '',
        deadline4: this.initialInfoPrint ? this.initialInfoPrint.deadline4 : '',
        totalAmountDate1: this.initialInfoPrint ? this.initialInfoPrint.totalAmountDate1 : '',
        totalAmountDate2: this.initialInfoPrint ? this.initialInfoPrint.totalAmountDate2 : '',
        totalAmountDate3: this.initialInfoPrint ? this.initialInfoPrint.totalAmountDate3 : '',
        totalAmountDate4: this.initialInfoPrint ? this.initialInfoPrint.totalAmountDate4 : '',
        totalDeadline1: this.initialInfoPrint ? this.initialInfoPrint.totalDeadline1 : '',
        totalDeadline2: this.initialInfoPrint ? this.initialInfoPrint.totalDeadline2 : '',
        totalDeadline3: this.initialInfoPrint ? this.initialInfoPrint.totalDeadline2 : '',
        totalDeadline4: this.initialInfoPrint ? this.initialInfoPrint.totalDeadline4 : '',
        grandTotalAmountDate: this.initialInfoPrint ? this.initialInfoPrint.grandTotalAmountDate : '',
        grandTotalDeadline: this.initialInfoPrint ? this.initialInfoPrint.grandTotalDeadline : '',
        borrowerName: this.initialInfoPrint ? this.initialInfoPrint.borrowerName : '',
        currentCapitalDebt1: this.initialInfoPrint ? this.initialInfoPrint.currentCapitalDebt1 : '',
        currentCapitalDebt2: this.initialInfoPrint ? this.initialInfoPrint.currentCapitalDebt1 : '',
        currentCapitalDebt3: this.initialInfoPrint ? this.initialInfoPrint.currentCapitalDebt3 : '',
        currentCapitalDebt4: this.initialInfoPrint ? this.initialInfoPrint.currentCapitalDebt4 : '',
        periodicLoan1: this.initialInfoPrint ? this.initialInfoPrint.periodicLoan1 : '',
        periodicLoan2: this.initialInfoPrint ? this.initialInfoPrint.periodicLoan2 : '',
        periodicLoan3: this.initialInfoPrint ? this.initialInfoPrint.periodicLoan3 : '',
        periodicLoan4: this.initialInfoPrint ? this.initialInfoPrint.periodicLoan4 : '',
        otherLoan1: this.initialInfoPrint ? this.initialInfoPrint.otherLoan1 : '',
        otherLoan2: this.initialInfoPrint ? this.initialInfoPrint.otherLoan2 : '',
        otherLoan3: this.initialInfoPrint ? this.initialInfoPrint.otherLoan3 : '',
        otherLoan4: this.initialInfoPrint ? this.initialInfoPrint.otherLoan4 : '',
        nonCellBasedFacility1: this.initialInfoPrint ? this.initialInfoPrint.nonCellBasedFacility1 : '',
        nonCellBasedFacility2: this.initialInfoPrint ? this.initialInfoPrint.nonCellBasedFacility2 : '',
        nonCellBasedFacility3: this.initialInfoPrint ? this.initialInfoPrint.nonCellBasedFacility3 : '',
        nonCellBasedFacility4: this.initialInfoPrint ? this.initialInfoPrint.nonCellBasedFacility4 : '',
      });
    }
  }

  onSubmit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
      this.spinner = false;
    });
  }
  checkChecked(event, type) {
    switch (type) {
      case 'currentCapitalDebt1':
        if (event) {
          this.form.get('currentCapitalDebt1').setValue(event);
        } else {
          this.form.get('currentCapitalDebt1').setValue(event);
        }
        break;

      case 'currentCapitalDebt2':
        if (event) {
          this.form.get('currentCapitalDebt2').setValue(event);
        } else {
          this.form.get('currentCapitalDebt2').setValue(event);
        }
        break;

      case 'currentCapitalDebt3':
        if (event) {
          this.form.get('currentCapitalDebt3').setValue(event);
        } else {
          this.form.get('currentCapitalDebt3').setValue(event);
        }
        break;

      case 'currentCapitalDebt4':
        if (event) {
          this.form.get('currentCapitalDebt4').setValue(event);
        } else {
          this.form.get('currentCapitalDebt4').setValue(event);
        }
        break;

      case 'periodicLoan1':
        if (event) {
          this.form.get('periodicLoan1').setValue(event);
        } else {
          this.form.get('periodicLoan1').setValue(event);
        }
        break;

      case 'periodicLoan2':
        if (event) {
          this.form.get('periodicLoan2').setValue(event);
        } else {
          this.form.get('periodicLoan2').setValue(event);
        }
        break;

      case 'periodicLoan3':
        if (event) {
          this.form.get('periodicLoan3').setValue(event);
        } else {
          this.form.get('periodicLoan3').setValue(event);
        }
        break;

      case 'periodicLoan4':
        if (event) {
          this.form.get('periodicLoan4').setValue(event);
        } else {
          this.form.get('periodicLoan4').setValue(event);
        }
        break;

      case 'otherLoan1':
        if (event) {
          this.form.get('otherLoan1').setValue(event);
        } else {
          this.form.get('otherLoan1').setValue(event);
        }
        break;

      case 'otherLoan2':
        if (event) {
          this.form.get('otherLoan2').setValue(event);
        } else {
          this.form.get('otherLoan2').setValue(event);
        }
        break;

      case 'otherLoan3':
        if (event) {
          this.form.get('otherLoan3').setValue(event);
        } else {
          this.form.get('otherLoan3').setValue(event);
        }
        break;

      case 'otherLoan4':
        if (event) {
          this.form.get('otherLoan4').setValue(event);
        } else {
          this.form.get('otherLoan4').setValue(event);
        }
        break;

      case 'nonCellBasedFacility1':
        if (event) {
          this.form.get('nonCellBasedFacility1').setValue(event);
        } else {
          this.form.get('nonCellBasedFacility1').setValue(event);
        }
        break;

      case 'nonCellBasedFacility2':
        if (event) {
          this.form.get('nonCellBasedFacility2').setValue(event);
        } else {
          this.form.get('nonCellBasedFacility2').setValue(event);
        }
        break;

      case 'nonCellBasedFacility3':
        if (event) {
          this.form.get('nonCellBasedFacility3').setValue(event);
        } else {
          this.form.get('nonCellBasedFacility3').setValue(event);
        }
        break;

      case 'nonCellBasedFacility4':
        if (event) {
          this.form.get('nonCellBasedFacility4').setValue(event);
        } else {
          this.form.get('nonCellBasedFacility4').setValue(event);
        }
        break;

    }
  }
}

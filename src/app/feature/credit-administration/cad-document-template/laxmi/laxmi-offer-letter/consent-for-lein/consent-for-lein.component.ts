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
  selector: 'app-consent-for-lein',
  templateUrl: './consent-for-lein.component.html',
  styleUrls: ['./consent-for-lein.component.scss']
})
export class ConsentForLeinComponent implements OnInit {
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
      branchName: [undefined],
      date: [undefined],
      khatawala: [undefined],
      accountNo: [undefined],
      rokkaAmount: [undefined],
      borrowerName: [undefined],
      borrowerFatherName: [undefined],
      borrowerGrandFatherName: [undefined],
      borrowerAddress: [undefined],
      regNo: [undefined],
      regDate: [undefined],
      regOffice: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      collateralName: [undefined],
      collateralFatherName: [undefined],
      collateralGrandFatherName: [undefined],
      collateralAddress: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDay: [undefined],
      roj: [undefined],
      role: [undefined],
      rolePerson: [undefined]
    });
  }
  setFreeText() {
    const freeText = {
      branchName: this.form.get('branchName') ? this.form.get('branchName').value : '',
      date: this.form.get('date') ? this.form.get('date').value : '',
      khatawala: this.form.get('khatawala') ? this.form.get('khatawala').value : '',
      accountNo: this.form.get('accountNo') ? this.form.get('accountNo').value : '',
      rokkaAmount: this.form.get('rokkaAmount') ? this.form.get('rokkaAmount').value : '',
      borrowerName: this.form.get('borrowerName') ? this.form.get('borrowerName').value : '',
      borrowerFatherName: this.form.get('borrowerFatherName') ? this.form.get('borrowerFatherName').value : '',
      borrowerGrandFatherName: this.form.get('borrowerGrandFatherName') ? this.form.get('borrowerGrandFatherName').value : '',
      borrowerAddress: this.form.get('borrowerAddress') ? this.form.get('borrowerAddress').value : '',
      regNo: this.form.get('regNo') ? this.form.get('regNo').value : '',
      regDate: this.form.get('regDate') ? this.form.get('regDate').value : '',
      regOffice: this.form.get('regOffice') ? this.form.get('regOffice').value : '',
      amount: this.form.get('amount') ? this.form.get('amount').value : '',
      amountInWords: this.form.get('amountInWords') ? this.form.get('amountInWords').value : '',
      collateralName: this.form.get('collateralName') ? this.form.get('collateralName').value : '',
      collateralFatherName: this.form.get('collateralFatherName') ? this.form.get('collateralFatherName').value : '',
      collateralGrandFatherName: this.form.get('collateralGrandFatherName') ? this.form.get('collateralGrandFatherName').value : '',
      collateralAddress: this.form.get('collateralAddress') ? this.form.get('collateralAddress').value : '',
      itiSambatYear: this.form.get('itiSambatYear') ? this.form.get('itiSambatYear').value : '',
      itiSambatMonth: this.form.get('itiSambatMonth') ? this.form.get('itiSambatMonth').value : '',
      itiSambatDay: this.form.get('itiSambatDay') ? this.form.get('itiSambatDay').value : '',
      roj: this.form.get('roj') ? this.form.get('roj').value : '',
      role: this.form.get('role') ? this.form.get('role').value : '',
      rolePerson: this.form.get('rolePerson') ? this.form.get('rolePerson').value : '',
    };
    return JSON.stringify(freeText);
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.customerData)) {
      this.form.patchValue({
        branchName: this.initialInfoPrint ? this.initialInfoPrint.branchName : '',
        date: this.initialInfoPrint ? this.initialInfoPrint.date : '',
        khatawala: this.initialInfoPrint ? this.initialInfoPrint.khatawala : '',
        accountNo: this.initialInfoPrint ? this.initialInfoPrint.accountNo : '',
        rokkaAmount: this.initialInfoPrint ? this.initialInfoPrint.rokkaAmount : '',
        borrowerName: this.initialInfoPrint ? this.initialInfoPrint.borrowerName : '',
        borrowerFatherName: this.initialInfoPrint ? this.initialInfoPrint.borrowerFatherName : '',
        borrowerGrandFatherName: this.initialInfoPrint ? this.initialInfoPrint.borrowerGrandFatherName : '',
        borrowerAddress: this.initialInfoPrint ? this.initialInfoPrint.borrowerAddress : '',
        regNo: this.initialInfoPrint ? this.initialInfoPrint.regNo : '',
        regDate: this.initialInfoPrint ? this.initialInfoPrint.regDate : '',
        regOffice: this.initialInfoPrint ? this.initialInfoPrint.regOffice : '',
        amount: this.initialInfoPrint ? this.initialInfoPrint.amount : '',
        amountInWords: this.initialInfoPrint ? this.initialInfoPrint.amountInWords : '',
        collateralName: this.initialInfoPrint ? this.initialInfoPrint.collateralName : '',
        collateralFatherName: this.initialInfoPrint ? this.initialInfoPrint.collateralFatherName : '',
        collateralGrandFatherName: this.initialInfoPrint ? this.initialInfoPrint.collateralGrandFatherName : '',
        collateralAddress: this.initialInfoPrint ? this.initialInfoPrint.collateralAddress : '',
        itiSambatYear: this.initialInfoPrint ? this.initialInfoPrint.itiSambatYear : '',
        itiSambatMonth: this.initialInfoPrint ? this.initialInfoPrint.itiSambatMonth : '',
        itiSambatDay: this.initialInfoPrint ? this.initialInfoPrint.itiSambatDay : '',
        roj: this.initialInfoPrint ? this.initialInfoPrint.roj : '',
        role: this.initialInfoPrint ? this.initialInfoPrint.role : '',
        rolePerson: this.initialInfoPrint ? this.initialInfoPrint.rolePerson : '',
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
}

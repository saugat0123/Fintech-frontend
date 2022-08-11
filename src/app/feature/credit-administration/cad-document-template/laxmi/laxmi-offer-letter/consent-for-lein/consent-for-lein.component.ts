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
  collateralDetails = [];
  loanCategory;

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
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan[0].loanCategory)) {
      this.loanCategory = this.cadData.assignedLoan[0].loanCategory;
    }
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = JSON.parse(singleCadFile.supportedInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.customerData = JSON.parse(this.cadData.loanHolder.nepData);
      if (!ObjectUtil.isEmpty(this.customerData)) {
        this.customerData.collateralDetails.forEach((val) => {
          const data = val.fdHolderDetail;
          if (!ObjectUtil.isEmpty(data)) {
            this.collateralDetails.push(data);
          }
        });
      }
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
      date: this.form.get('date') ? this.form.get('date').value : '',
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
        branchName: this.customerData.branchDetail ? this.customerData.branchDetail.branchNameInNepali : '',
        date: this.initialInfoPrint ? this.initialInfoPrint.date : '',
        khatawala: this.collateralDetails ? this.collateralDetails[0].name : '',
        accountNo: this.collateralDetails ? this.collateralDetails[0].fdReceiptNo : '',
        rokkaAmount: this.collateralDetails ? this.collateralDetails[0].fdAmount : '',
        borrowerName: this.customerData ? this.customerData.nepaliName : '',
        borrowerFatherName: this.customerData.fatherName ? this.customerData.fatherName : '',
        borrowerGrandFatherName: this.customerData.grandFatherName ? this.customerData.grandFatherName : '',
        regNo: this.customerData.registrationNo ? this.customerData.registrationNo : '',
        regDate: this.customerData.regIssueDate ? this.customerData.regIssueDate : '',
        regOffice: this.customerData.companyRegOffice ? this.customerData.companyRegOffice : '',
        amount: this.customerData.miscellaneousDetail ? this.customerData.miscellaneousDetail.loanAmountInFig : '',
        amountInWords: this.customerData.miscellaneousDetail ? this.customerData.miscellaneousDetail.loanAmountInWord : '',
        collateralName: this.collateralDetails ? this.collateralDetails[0].name : '',
        collateralFatherName: this.collateralDetails ? this.collateralDetails[0].fatherName : '',
        collateralGrandFatherName: this.collateralDetails ? this.collateralDetails[0].grandFatherName : '',
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

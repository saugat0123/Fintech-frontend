import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';

@Component({
  selector: 'app-guarantor-acknowledgement',
  templateUrl: './guarantor-acknowledgement.component.html',
  styleUrls: ['./guarantor-acknowledgement.component.scss']
})
export class GuarantorAcknowledgementComponent implements OnInit {
  @Input() customerLoanId;
  @Input() cadData;
  @Input() documentId;
  form: FormGroup;
  spinner = false;
  initialInfoPrint;
  cadCheckListEnum = CadCheckListTemplateEnum;
  loanCategory;
  customerData;

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
  ) { }

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
    }
    this.fillForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      branch: [undefined],
      individualPermissionProviderName: [undefined],
      permissionProviderName: [undefined],
      authorizedPersonName: [undefined],
      shanakhatWitnessBranch: [undefined],
      shanakhatWitnessPosition: [undefined],
      shanakhatWitnessName: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      roj: [undefined],
      shuvam: [undefined]
    });
  }
  setFreeText() {
    const freeText = {
      individualPermissionProviderName: this.form.get('individualPermissionProviderName') ? this.form.get('individualPermissionProviderName').value : '',
      permissionProviderName: this.form.get('permissionProviderName') ? this.form.get('permissionProviderName').value : '',
      authorizedPersonName: this.form.get('authorizedPersonName') ? this.form.get('authorizedPersonName').value : '',
      shanakhatWitnessBranch: this.form.get('shanakhatWitnessBranch') ? this.form.get('shanakhatWitnessBranch').value : '',
      shanakhatWitnessPosition: this.form.get('shanakhatWitnessPosition') ? this.form.get('shanakhatWitnessPosition').value : '',
      shanakhatWitnessName: this.form.get('shanakhatWitnessName') ? this.form.get('shanakhatWitnessName').value : '',
      year: this.form.get('year') ? this.form.get('year').value : '',
      month: this.form.get('month') ? this.form.get('month').value : '',
      day: this.form.get('day') ? this.form.get('day').value : '',
      roj: this.form.get('roj') ? this.form.get('roj').value : '',
      shuvam: this.form.get('shuvam') ? this.form.get('shuvam').value : ''
    };
    return JSON.stringify(freeText);
  }
  fillForm() {
    this.form.patchValue({
      branch: this.customerData.branchDetail ? this.customerData.branchDetail.branchNameInNepali : '',
      individualPermissionProviderName: this.initialInfoPrint ? this.initialInfoPrint.individualPermissionProviderName : '',
      permissionProviderName: this.initialInfoPrint ? this.initialInfoPrint.permissionProviderName : '',
      authorizedPersonName: this.initialInfoPrint ? this.initialInfoPrint.authorizedPersonName : '',
      shanakhatWitnessBranch: this.initialInfoPrint ? this.initialInfoPrint.shanakhatWitnessBranch : '',
      shanakhatWitnessPosition: this.initialInfoPrint ? this.initialInfoPrint.shanakhatWitnessPosition : '',
      shanakhatWitnessName: this.initialInfoPrint ? this.initialInfoPrint.shanakhatWitnessName : '',
      year: this.initialInfoPrint ? this.initialInfoPrint.year : '',
      month: this.initialInfoPrint ? this.initialInfoPrint.month : '',
      day: this.initialInfoPrint ? this.initialInfoPrint.day : '',
      roj: this.initialInfoPrint ? this.initialInfoPrint.roj : '',
      shuvam: this.initialInfoPrint ? this.initialInfoPrint.shuvam : ''
    });
  }
  submit() {
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
      cadFile.supportedInformation = this.setFreeText();
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }
    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.spinner = false;
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }
}

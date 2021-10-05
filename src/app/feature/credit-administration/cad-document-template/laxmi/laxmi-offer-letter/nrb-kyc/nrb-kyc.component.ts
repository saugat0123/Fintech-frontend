import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-nrb-kyc',
  templateUrl: './nrb-kyc.component.html',
  styleUrls: ['./nrb-kyc.component.scss']
})
export class NrbKycComponent implements OnInit {
  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService
  ) { }
  @Input() cadData;
  @Input() customerLoanId;
  @Input() documentId;
  initialInfoPrint;
spinner = false;
  form: FormGroup;
  cadCheckListEnum = CadCheckListTemplateEnum;
  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = singleCadFile.initialInformation;
          this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.form = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }
  buildForm() {
    this.form = this.formBuilder.group({
      institutionChaluOne: [undefined],
      amount: [undefined],
      yesNo: [undefined],
      institutionChaluTwo: [undefined],
      amountTwo: [undefined],
      yesNoTwo: [undefined],
      total: [undefined],
      finalTotal: [undefined],
      yesNoTotal: [undefined],
      yesNoFinalTotal: [undefined],
    });
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
  console.log(this.form.value);
}
}

import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';

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
      private routerUtilsService: RouterUtilsService,
      private nepaliNumberPipe: NepaliNumberPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private nepaliToEnglish: NepaliToEngNumberPipe
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
      if (this.cadData.cadFileList.length > 0) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            this.initialInfoPrint = singleCadFile.initialInformation;
            const data = JSON.parse(singleCadFile.initialInformation);
            this.form.patchValue(data);
            this.setBankDetails(data);
          }
        });
      } else {
        this.addBankDetails();
      }
    }
  }
  buildForm() {
    this.form = this.formBuilder.group({
      // institutionChaluOne: [undefined],
      // amount: [undefined],
      // yesNo: [undefined],
      // institutionChaluTwo: [undefined],
      // amountTwo: [undefined],
      // yesNoTwo: [undefined],
      // total: [undefined],
      // finalTotal: [undefined],
      // yesNoTotal: [undefined],
      // yesNoFinalTotal: [undefined],
      date: [undefined],
      memberName1: [undefined],
      branchName: [undefined],
      bankDetails: this.formBuilder.array([]),
      detailsName: [undefined],
      memberName: [undefined],
      centerNo: [undefined],
      address: [undefined],
      totalWithOutCollateral: [undefined],
      totalWithCollateral: [undefined],
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
}

  addBankDetails() {
    (this.form.get('bankDetails') as FormArray).push(
        this.formBuilder.group({
          bankName: [undefined],
          expiredOrNot: [undefined],
          withoutCollateral: [undefined],
          withCollateral: [undefined],
        })
    );
  }

  setBankDetails(data) {
    const detail = this.form.get('bankDetails') as FormArray;
    console.log('detail', detail);
    data.bankDetails.forEach(s => {
      detail.push(this.formBuilder.group({
        bankName: [s.bankName],
        expiredOrNot: [s.expiredOrNot],
        withoutCollateral: [s.withoutCollateral],
        withCollateral: [s.withCollateral],
      }));
    });
  }

  removeBankDetails(i) {
    (<FormArray>this.form.get('bankDetails')).removeAt(i);
    this.addWithCollateralValue();
    this.addWithoutCollateralValue();
  }

  addWithCollateralValue() {
    let totalCollateral = 0;
    const data = this.form.get('bankDetails') as FormArray;
    data.value.forEach(s => {
      totalCollateral += Number(this.nepaliToEnglish.transform(s.withCollateral));
    });
    const value = this.nepaliNumberPipe.transform(totalCollateral, 'preeti');
    this.form.get('totalWithCollateral').patchValue(value);
  }

  addWithoutCollateralValue() {
    let totalWithoutCollateral = 0;
    const data = this.form.get('bankDetails') as FormArray;
    data.value.forEach(s => {
      totalWithoutCollateral += Number(this.nepaliToEnglish.transform(s.withoutCollateral));
    });
    const value = this.nepaliNumberPipe.transform(totalWithoutCollateral, 'preeti');
    this.form.get('totalWithOutCollateral').patchValue(value);
  }
}

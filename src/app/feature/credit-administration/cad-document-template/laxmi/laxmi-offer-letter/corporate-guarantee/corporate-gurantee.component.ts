import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
  selector: 'app-corporate-gurantee',
  templateUrl: './corporate-guarantee.component.html',
  styleUrls: ['./corporate-guarantee.component.scss']
})
export class CorporateGuranteeComponent implements OnInit {
  @Input() cadData;
  @Input() documentId;
  @Input() customerLoanId;
  form: FormGroup;
  spinner = false;
  initialInfoPrint;
  cadCheckListEnum = CadCheckListTemplateEnum;
  nepaliData;
  amount;
  customerInfo;
  loanHolderNepData;
  loanHolderData;
  taggedGuarantorsDetailsInLoan = [];
  corporateGuarantorNepDataArray: Array<any> = new Array<any>();
  freeText: Array<any> = new Array<any>();

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
  ) { }

  ngOnInit() {
    this.amount = this.cadData.assignedLoan[0].proposal.proposedLimit;
    if (!ObjectUtil.isEmpty(this.cadData)) {
      if (!ObjectUtil.isEmpty(this.cadData.loanHolder) &&
          !ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
        this.loanHolderNepData = JSON.parse(this.cadData.loanHolder.nepData);
      }
    }
    this.loadCorporateGuarantorData();
    this.buildForm();
    this.fillFreeText();
  }
  loadCorporateGuarantorData() {
    if (!ObjectUtil.isEmpty(this.loanHolderNepData)) {
      this.loanHolderData = this.loanHolderNepData;
      this.loanHolderData.guarantorDetails.forEach((val) => {
        this.taggedGuarantorsDetailsInLoan.push(val);
      });
    }
    this.taggedGuarantorsDetailsInLoan = Array.from(
        new Set(
            this.taggedGuarantorsDetailsInLoan.map((val) => JSON.stringify(val))
        )
    ).map((val) => JSON.parse(val));
  }
  buildForm() {
    this.form = this.formBuilder.group({
      corporateGuarantee: this.formBuilder.array([]),
    });
    this.taggedCorporateGuarantorsDetailForm();
  }

taggedCorporateGuarantorsDetailForm() {
  if (!ObjectUtil.isEmpty(this.taggedGuarantorsDetailsInLoan)) {
    this.taggedGuarantorsDetailsInLoan.forEach((val) => {
      if (val.guarantorType === 'Corporate_Guarantor') {
        const corporateGuarantorData = val;
        this.corporateGuarantorNepDataArray.push(corporateGuarantorData);
        const FormArrayData = (this.form.get('corporateGuarantee') as FormArray);
        FormArrayData.push(this.formBuilder.group({
              district: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchDistrict : ''],
              municipality: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchMunVdc : ''],
              wardNumber: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchWardNo : ''],
              branch: [this.loanHolderNepData.branchDetail ? this.loanHolderNepData.branchDetail.branchNameInNepali : ''],
              witnessDistrict1: [undefined],
              witnessMunicipality1: [undefined],
              witnessWardNum1: [undefined],
              witnessAge1: [undefined],
              witnessName1: [undefined],
              witnessDistrict2: [undefined],
              witnessMunicipality2: [undefined],
              witnessWardNum2: [undefined],
              witnessAge2: [undefined],
              witnessName2: [undefined],
              shanakhatWitnessPosition: [undefined],
              shanakhatWitnessName: [undefined],
              year: [undefined],
              month: [undefined],
              day: [undefined],
              roj: [undefined],
              shuvam: [undefined]
            })
        );
      }
    });
  }
}

  fillFreeText() {
    if  (this.cadData.cadFileList.length > 0) {
      if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            this.initialInfoPrint = JSON.parse(singleCadFile.supportedInformation);
          }
        });
        const freeText = this.form.value;
        if (this.initialInfoPrint !== null) {
          for (let val = 0; val < freeText.corporateGuarantee.length; val++) {
            this.form.get(['corporateGuarantee', val, 'witnessDistrict1']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].witnessDistrict1 : '');
            this.form.get(['corporateGuarantee', val, 'witnessMunicipality1']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].witnessMunicipality1 : '');
            this.form.get(['corporateGuarantee', val, 'witnessWardNum1']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].witnessWardNum1 : '');
            this.form.get(['corporateGuarantee', val, 'witnessAge1']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].witnessAge1 : '');
            this.form.get(['corporateGuarantee', val, 'witnessName1']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].witnessName1 : '');
            this.form.get(['corporateGuarantee', val, 'witnessDistrict2']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].witnessDistrict2 : '');
            this.form.get(['corporateGuarantee', val, 'witnessMunicipality2']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].witnessMunicipality2 : '');
            this.form.get(['corporateGuarantee', val, 'witnessWardNum2']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].witnessWardNum2 : '');
            this.form.get(['corporateGuarantee', val, 'witnessAge2']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].witnessAge2 : '');
            this.form.get(['corporateGuarantee', val, 'witnessName2']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].witnessName2 : '');
            this.form.get(['corporateGuarantee', val, 'shanakhatWitnessPosition']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].shanakhatWitnessPosition : '');
            this.form.get(['corporateGuarantee', val, 'shanakhatWitnessName']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].shanakhatWitnessName : '');
            this.form.get(['corporateGuarantee', val, 'shanakhatWitnessName']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].shanakhatWitnessName : '');
            this.form.get(['corporateGuarantee', val, 'year']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].year : '');
            this.form.get(['corporateGuarantee', val, 'month']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].month : '');
            this.form.get(['corporateGuarantee', val, 'day']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].day : '');
            this.form.get(['corporateGuarantee', val, 'roj']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].roj : '');
            this.form.get(['corporateGuarantee', val, 'shuvam']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].shuvam : '');
          }
        }
      }
    }
  }
  setFreeText() {
    const free = this.form.value;
    for (let val = 0; val < free.corporateGuarantee.length; val++) {
      const tempFreeText = {
        witnessDistrict1: this.form.get(['corporateGuarantee', val, 'witnessDistrict1']).value ?
            this.form.get(['corporateGuarantee', val, 'witnessDistrict1']).value : '',
        witnessMunicipality1: this.form.get(['corporateGuarantee', val, 'witnessMunicipality1']).value ?
            this.form.get(['corporateGuarantee', val, 'witnessMunicipality1']).value : '',
        witnessWardNum1: this.form.get(['corporateGuarantee', val, 'witnessWardNum1']).value ?
            this.form.get(['corporateGuarantee', val, 'witnessWardNum1']).value : '',
        witnessAge1: this.form.get(['corporateGuarantee', val, 'witnessAge1']).value ?
            this.form.get(['corporateGuarantee', val, 'witnessAge1']).value : '',
        witnessName1: this.form.get(['corporateGuarantee', val, 'witnessName1']).value ?
            this.form.get(['corporateGuarantee', val, 'witnessName1']).value : '',
        witnessDistrict2: this.form.get(['corporateGuarantee', val, 'witnessDistrict2']).value ?
            this.form.get(['corporateGuarantee', val, 'witnessDistrict2']).value : '',
        witnessMunicipality2: this.form.get(['corporateGuarantee', val, 'witnessMunicipality2']).value ?
            this.form.get(['corporateGuarantee', val, 'witnessMunicipality2']).value : '',
        witnessWardNum2: this.form.get(['corporateGuarantee', val, 'witnessWardNum2']).value ?
            this.form.get(['corporateGuarantee', val, 'witnessWardNum2']).value : '',
        witnessAge2: this.form.get(['corporateGuarantee', val, 'witnessAge2']).value ?
            this.form.get(['corporateGuarantee', val, 'witnessAge2']).value : '',
        witnessName2: this.form.get(['corporateGuarantee', val, 'witnessName2']).value ?
            this.form.get(['corporateGuarantee', val, 'witnessName2']).value : '',
        shanakhatWitnessPosition: this.form.get(['corporateGuarantee', val, 'shanakhatWitnessPosition']).value ?
            this.form.get(['corporateGuarantee', val, 'shanakhatWitnessPosition']).value : '',
        shanakhatWitnessName: this.form.get(['corporateGuarantee', val, 'shanakhatWitnessName']).value ?
            this.form.get(['corporateGuarantee', val, 'shanakhatWitnessName']).value : '',
        year: this.form.get(['corporateGuarantee', val, 'year']).value ?
            this.form.get(['corporateGuarantee', val, 'year']).value : '',
        month: this.form.get(['corporateGuarantee', val, 'month']).value ?
            this.form.get(['corporateGuarantee', val, 'month']).value : '',
        day: this.form.get(['corporateGuarantee', val, 'day']).value ?
            this.form.get(['corporateGuarantee', val, 'day']).value : '',
        roj: this.form.get(['corporateGuarantee', val, 'roj']).value ?
            this.form.get(['corporateGuarantee', val, 'roj']).value : '',
        shuvam: this.form.get(['corporateGuarantee', val, 'shuvam']).value ?
            this.form.get(['corporateGuarantee', val, 'shuvam']).value : ''
      };
      this.freeText.push(tempFreeText);
    }
    return JSON.stringify(this.freeText);
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

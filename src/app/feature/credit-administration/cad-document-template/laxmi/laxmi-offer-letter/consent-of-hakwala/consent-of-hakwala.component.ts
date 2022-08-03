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
  selector: 'app-consent-of-hakwala',
  templateUrl: './consent-of-hakwala.component.html',
  styleUrls: ['./consent-of-hakwala.component.scss']
})
export class ConsentOfHakwalaComponent implements OnInit {
  @Input() customerLoanId;
  @Input() cadData;
  @Input() documentId;
  form: FormGroup;
  initialInfoPrint;
  spinner = false;
  offerLetterConst = CadCheckListTemplateEnum;
  customerData;
  collateralDetail: Array<any> = new Array<any>();
  freeText: Array<any> = new Array<any>();

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
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.customerData = JSON.parse(this.cadData.loanHolder.nepData);
      this.setCollateralDetail();
    }
    this.fillfreeText();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      collateral: this.formBuilder.array([]),
    });
  }
  addCollateralDetail() {
    (this.form.get('collateral') as FormArray).push(this.collateralField());
  }
  collateralField() {
    return this.formBuilder.group({
      customerName: [this.customerData.nepaliName ? this.customerData.nepaliName : ''],
      acceptor: this.formBuilder.array([]),
      ownerName: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDay: [undefined],
      roj: [undefined],
    });
  }
  fillfreeText() {
    if (this.cadData.cadFileList.length > 0) {
      if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
        this.cadData.cadFileList.forEach((val, i) => {
          if (val.customerLoanId === this.customerLoanId && val.cadDocument.id === this.documentId) {
            this.initialInfoPrint = JSON.parse(val.supportedInformation);
          }
        });
        if (this.initialInfoPrint != null) {
          for (let val = 0; val < this.initialInfoPrint.length; val++) {
            this.form.get(['collateral', val, 'ownerName']).patchValue(this.initialInfoPrint ?
            this.initialInfoPrint[val].ownerName : '');
            this.form.get(['collateral', val, 'itiSambatYear']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].itiSambatYear : '');
            this.form.get(['collateral', val, 'itiSambatMonth']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].itiSambatMonth : '');
            this.form.get(['collateral', val, 'itiSambatDay']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].itiSambatDay : '');
            this.form.get(['collateral', val, 'roj']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].roj : '');
            this.setAcceptor(val, this.initialInfoPrint[val].acceptor);
          }
        }
      }
    }
  }
  setAcceptor(i, acceptorData) {
    const controls = this.form.get(['collateral', i, 'acceptor']) as FormArray;
    acceptorData.forEach(val => {
      controls.push(
          this.formBuilder.group({
            acceptorName: [val.acceptorName],
            acceptorAddress: [val.acceptorAddress],
            acceptorCitizenshipNo: [val.acceptorCitizenshipNo],
            acceptanceDate: [val.acceptanceDate],
            acceptorIssuedOffice: [val.acceptorIssuedOffice],
            acceptorRelation: [val.acceptorRelation]
          })
      );
    });
  }
   setFreeText() {
    const free = this.form.value;
     for (let val = 0; val < free.collateral.length; val++) {
       const tempFreeText = {
         acceptor: this.form.get(['collateral', val, 'acceptor']).value ?
             this.form.get(['collateral', val, 'acceptor']).value : '',
         ownerName: this.form.get(['collateral', val, 'ownerName']) ? this.form.get(['collateral', val, 'ownerName']).value : '',
         itiSambatYear: this.form.get(['collateral', val, 'itiSambatYear']) ?
             this.form.get(['collateral', val, 'itiSambatYear']).value : '',
         itiSambatMonth: this.form.get(['collateral', val, 'itiSambatMonth']) ? this.form.get(['collateral', val, 'itiSambatMonth']).value : '',
         itiSambatDay: this.form.get(['collateral', val, 'itiSambatDay']) ? this.form.get(['collateral', val, 'itiSambatDay']).value : '',
         roj: this.form.get(['collateral', val, 'roj']) ? this.form.get(['collateral', val, 'roj']).value : ''
       };
       this.freeText.push(tempFreeText);
     }
    return JSON.stringify(this.freeText);
  }
  addAcceptors(i) {
    const acceptorData = this.form.get(['collateral', i, 'acceptor']) as FormArray;
    acceptorData.push(
        this.formBuilder.group({
          acceptorName: [undefined],
          acceptorAddress: [undefined],
          acceptorCitizenshipNo: [undefined],
          acceptanceDate: [undefined],
          acceptorIssuedOffice: [undefined],
          acceptorRelation: [undefined]
        })
    );
  }
  setCollateralDetail() {
    this.customerData.collateralDetails.forEach(val => {
      this.collateralDetail.push(val);
      this.addCollateralDetail();
    });
  }
  removeAcceptor(i) {
    (<FormArray>this.form.get(['collateral', i, 'acceptor'])).removeAt(i);
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
      cadFile.supportedInformation = this.setFreeText();
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

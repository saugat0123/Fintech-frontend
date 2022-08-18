import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
  selector: 'app-consent-of-sellers-hakwala',
  templateUrl: './consent-of-sellers-hakwala.component.html',
  styleUrls: ['./consent-of-sellers-hakwala.component.scss']
})
export class ConsentOfSellersHakwalaComponent implements OnInit {
  @Input() customerLoanId;
  @Input() cadData;
  @Input() documentId;
  form: FormGroup;
  spinner = false;
  offerLetterConst = CadCheckListTemplateEnum;
  initialInfoPrint;
  customerData;
  loanHolderData;
  collateralDataDetails = [];
  collateralDataArray: Array<any> = new Array<any>();
  freeText: Array<any> = new Array<any>();
  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.customerData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.loadCollateralData();
    this.buildForm();
    this.fillForm();
  }
  loadCollateralData() {
    if (!ObjectUtil.isEmpty(this.customerData)) {
      this.loanHolderData = this.customerData;
      this.loanHolderData.collateralDetails.forEach((val) => {
        this.collateralDataDetails.push(val);
      });
    }
    this.collateralDataDetails = Array.from(
        new Set(
            this.collateralDataDetails.map((val) => JSON.stringify(val))
        )
    ).map((val) => JSON.parse(val));
  }
  buildForm() {
    this.form = this.formBuilder.group({
      consentOfSellerHakwala: this.formBuilder.array([]),
    });
    if (this.collateralDataDetails.length > 0) {
      this.consentOfSellerHakwalaForm();
    }
  }

  consentOfSellerHakwalaForm() {
    if (!ObjectUtil.isEmpty(this.collateralDataDetails)) {
      this.collateralDataDetails.forEach(val => {
        if (val.collateralType === 'land_and_building') {
          this.collateralDataArray.push(val);
          const FormArrayData = (this.form.get('consentOfSellerHakwala') as FormArray);
          FormArrayData.push(this.formBuilder.group({
                customerName1: val.sellerName ? val.sellerName : '',
                date: [undefined],
                customerName2: val.nameInNepali ? val.nameInNepali : '',
                acceptor: this.formBuilder.array([]),
                ownerName: val.sellerName ? val.sellerName : '',
                itiSambatYear: [undefined],
                itiSambatMonth: [undefined],
                itiSambatDay: [undefined],
                roj: [undefined],
              })
          );
        }
      });
    }
  }

  setFreeText() {
    const free = this.form.value;
    for (let val = 0; val < free.consentOfSellerHakwala.length; val++) {
      const tempFreeText = {
        date: this.form.get('') ? this.form.get('').value : '',
        acceptor: this.form.get(['consentOfSellerHakwala', val, 'acceptor']).value ?
            this.form.get(['consentOfSellerHakwala', val, 'acceptor']).value : '',
        itiSambatYear: this.form.get(['consentOfSellerHakwala', val, 'itiSambatYear']) ? this.form.get(['consentOfSellerHakwala', val, 'itiSambatYear']).value : '',
        itiSambatMonth: this.form.get(['consentOfSellerHakwala', val, 'itiSambatMonth']) ? this.form.get(['consentOfSellerHakwala', val, 'itiSambatMonth']).value : '',
        itiSambatDay: this.form.get(['consentOfSellerHakwala', val, 'itiSambatDay']) ? this.form.get(['consentOfSellerHakwala', val, 'itiSambatDay']).value : '',
        roj: this.form.get(['consentOfSellerHakwala', val, 'roj']) ? this.form.get(['consentOfSellerHakwala', val, 'roj']).value : '',
      };
      this.freeText.push(tempFreeText);
    }
    return JSON.stringify(this.freeText);
  }
  fillForm() {
    if  (this.cadData.cadFileList.length > 0) {
      if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            this.initialInfoPrint = JSON.parse(singleCadFile.supportedInformation);
          }
        });
        const freeText = this.form.value;
        if (this.initialInfoPrint !== null) {
          for (let val = 0; val < freeText.consentOfSellerHakwala.length; val++) {
            this.form.get(['consentOfSellerHakwala', val, 'date']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].date : '');
            this.form.get(['consentOfSellerHakwala', val, 'itiSambatYear']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].itiSambatYear : '');
            this.form.get(['consentOfSellerHakwala', val, 'itiSambatMonth']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].itiSambatMonth : '');
            this.form.get(['consentOfSellerHakwala', val, 'itiSambatDay']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].itiSambatDay : '');
            this.form.get(['consentOfSellerHakwala', val, 'roj']).patchValue(this.initialInfoPrint ?
                this.initialInfoPrint[val].roj : '');
            if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
              this.setAcceptor(val, this.initialInfoPrint[val].acceptor);
            } else {
              this.addAcceptors(val);
            }
          }
        }
      }
    }
  }
  setAcceptor(i, acceptorData) {
    const controls = this.form.get(['consentOfSellerHakwala', i, 'acceptor']) as FormArray;
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
  addAcceptors(i) {
    const acceptors = this.form.get(['consentOfSellerHakwala', i, 'acceptor']) as FormArray;
    acceptors.push(
        this.formBuilder.group({
          acceptorName: [undefined],
          acceptorAddress: [undefined],
          acceptorCitizenshipNo: [undefined],
          acceptanceDate: [undefined],
          acceptorIssuedOffice: [undefined],
          acceptorRelation: [undefined],
        })
    );
  }
  removeAcceptor(i) {
    (<FormArray>this.form.get(['consentOfSellerHakwala', i, 'acceptor'])).removeAt(i);
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

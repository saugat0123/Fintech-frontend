import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {FormBuilder, FormGroup} from '@angular/forms';
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
  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = singleCadFile.initialInformation;
        }
      });
    }
    this.checkInitialData();
  }


  onSubmit() {
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
  checkInitialData() {
    if (!ObjectUtil.isEmpty(this.initialInfoPrint)) {
      this.form.patchValue(JSON.parse(this.initialInfoPrint));
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      customerName: [undefined],
      date: [undefined],
      acceptorName: [undefined],
      acceptorAddress: [undefined],
      acceptorCitizenshipNo: [undefined],
      acceptanceDate: [undefined],
      acceptorIssuedOffice: [undefined],
      acceptorRelation: [undefined],
      acceptorNameTwo: [undefined],
      acceptorAddressTwo: [undefined],
      acceptorCitizenshipNoTwo: [undefined],
      acceptanceDateTwo: [undefined],
      acceptorIssuedOfficeTwo: [undefined],
      acceptorRelationTwo: [undefined],
      acceptorNameThree: [undefined],
      acceptorAddressThree: [undefined],
      acceptorCitizenshipNoThree: [undefined],
      acceptanceDateThree: [undefined],
      acceptorIssuedOfficeThree: [undefined],
      acceptorRelationThree: [undefined],
      acceptorNameFour: [undefined],
      acceptorAddressFour: [undefined],
      acceptorCitizenshipNoFour: [undefined],
      acceptanceDateFour: [undefined],
      acceptorIssuedOfficeFour: [undefined],
      acceptorRelationFour: [undefined],
      ownerName: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDay: [undefined],
      roj: [undefined],
    });
  }
}

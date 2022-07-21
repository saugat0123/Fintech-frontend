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
import {json} from 'd3';

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
          this.initialInfoPrint = singleCadFile.supportedInformation;
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
      customerName1: [undefined],
      customerName2: [undefined],
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
  setFreeText() {
    const freeText = {
      customerName1: this.form.get('customerName1') ? this.form.get('customerName1').value : '',
      customerName2: this.form.get('customerName2') ? this.form.get('customerName2').value : '',
      date: this.form.get('') ? this.form.get('').value : '',
      acceptorName: this.form.get('acceptorName') ? this.form.get('acceptorName').value : '',
      acceptorAddress: this.form.get('acceptorAddress') ? this.form.get('acceptorAddress').value : '',
      acceptorCitizenshipNo: this.form.get('acceptorCitizenshipNo') ? this.form.get('acceptorCitizenshipNo').value : '',
      acceptanceDate: this.form.get('acceptanceDate') ? this.form.get('acceptanceDate').value : '',
      acceptorIssuedOffice: this.form.get('acceptorIssuedOffice') ? this.form.get('acceptorIssuedOffice').value : '',
      acceptorRelation: this.form.get('acceptorRelation') ? this.form.get('acceptorRelation').value : '',
      acceptorNameTwo: this.form.get('acceptorNameTwo') ? this.form.get('acceptorNameTwo').value : '',
      acceptorAddressTwo: this.form.get('acceptorAddressTwo') ? this.form.get('acceptorAddressTwo').value : '',
      acceptorCitizenshipNoTwo: this.form.get('acceptorCitizenshipNoTwo') ? this.form.get('acceptorCitizenshipNoTwo').value : '',
      acceptanceDateTwo: this.form.get('acceptanceDateTwo') ? this.form.get('acceptanceDateTwo').value : '',
      acceptorIssuedOfficeTwo: this.form.get('acceptorIssuedOfficeTwo') ? this.form.get('acceptorIssuedOfficeTwo').value : '',
      acceptorRelationTwo: this.form.get('acceptorRelationTwo') ? this.form.get('acceptorRelationTwo').value : '',
      acceptorNameThree: this.form.get('acceptorNameThree') ? this.form.get('acceptorNameThree').value : '',
      acceptorAddressThree: this.form.get('acceptorAddressThree') ? this.form.get('acceptorAddressThree').value : '',
      acceptorCitizenshipNoThree: this.form.get('acceptorCitizenshipNoThree') ? this.form.get('acceptorCitizenshipNoThree').value : '',
      acceptanceDateThree: this.form.get('acceptanceDateThree') ? this.form.get('acceptanceDateThree').value : '',
      acceptorIssuedOfficeThree: this.form.get('acceptorIssuedOfficeThree') ? this.form.get('acceptorIssuedOfficeThree').value : '',
      acceptorRelationThree: this.form.get('acceptorRelationThree') ? this.form.get('acceptorRelationThree').value : '',
      acceptorNameFour: this.form.get('acceptorNameFour') ? this.form.get('acceptorNameFour').value : '',
      acceptorAddressFour: this.form.get('acceptorAddressFour') ? this.form.get('acceptorAddressFour').value : '',
      acceptorCitizenshipNoFour: this.form.get('acceptorCitizenshipNoFour') ? this.form.get('acceptorCitizenshipNoFour').value : '',
      acceptanceDateFour: this.form.get('acceptanceDateFour') ? this.form.get('acceptanceDateFour').value : '',
      acceptorIssuedOfficeFour: this.form.get('acceptorIssuedOfficeFour') ? this.form.get('acceptorIssuedOfficeFour').value : '',
      acceptorRelationFour: this.form.get('acceptorRelationFour') ? this.form.get('acceptorRelationFour').value : '',
      ownerName: this.form.get('ownerName') ? this.form.get('ownerName').value : '',
      itiSambatYear: this.form.get('itiSambatYear') ? this.form.get('itiSambatYear').value : '',
      itiSambatMonth: this.form.get('itiSambatMonth') ? this.form.get('itiSambatMonth').value : '',
      itiSambatDay: this.form.get('itiSambatDay') ? this.form.get('itiSambatDay').value : '',
      roj: this.form.get('roj') ? this.form.get('roj').value : '',
    };
    return JSON.stringify(freeText);
  }
  fillForm() {
    this.form.patchValue({
      customerName1: this.initialInfoPrint ? this.initialInfoPrint.customerName1 : '',
      customerName2: this.initialInfoPrint ? this.initialInfoPrint.customerName2 : '',
      date: this.initialInfoPrint ? this.initialInfoPrint.date : '',
      acceptorName: this.initialInfoPrint ? this.initialInfoPrint.acceptorName : '',
      acceptorAddress: this.initialInfoPrint ? this.initialInfoPrint.acceptorAddress : '',
      acceptorCitizenshipNo: this.initialInfoPrint ? this.initialInfoPrint.acceptorCitizenshipNo : '',
      acceptanceDate: this.initialInfoPrint ? this.initialInfoPrint.acceptanceDate : '',
      acceptorIssuedOffice: this.initialInfoPrint ? this.initialInfoPrint.acceptorIssuedOffice : '',
      acceptorRelation: this.initialInfoPrint ? this.initialInfoPrint.acceptorRelation : '',
      acceptorNameTwo: this.initialInfoPrint ? this.initialInfoPrint.acceptorNameTwo : '',
      acceptorAddressTwo: this.initialInfoPrint ? this.initialInfoPrint.acceptorAddressTwo : '',
      acceptorCitizenshipNoTwo: this.initialInfoPrint ? this.initialInfoPrint.acceptorCitizenshipNoTwo : '',
      acceptanceDateTwo: this.initialInfoPrint ? this.initialInfoPrint.acceptanceDateTwo : '',
      acceptorIssuedOfficeTwo: this.initialInfoPrint ? this.initialInfoPrint.acceptorIssuedOfficeTwo : '',
      acceptorRelationTwo: this.initialInfoPrint ? this.initialInfoPrint.acceptorRelationTwo : '',
      acceptorNameThree: this.initialInfoPrint ? this.initialInfoPrint.acceptorNameThree : '',
      acceptorAddressThree: this.initialInfoPrint ? this.initialInfoPrint.acceptorAddressThree : '',
      acceptorCitizenshipNoThree: this.initialInfoPrint ? this.initialInfoPrint.acceptorCitizenshipNoThree : '',
      acceptanceDateThree: this.initialInfoPrint ? this.initialInfoPrint.acceptanceDateThree : '',
      acceptorIssuedOfficeThree: this.initialInfoPrint ? this.initialInfoPrint.acceptorIssuedOfficeThree : '',
      acceptorRelationThree: this.initialInfoPrint ? this.initialInfoPrint.acceptorRelationThree : '',
      acceptorNameFour: this.initialInfoPrint ? this.initialInfoPrint.acceptorNameFour : '',
      acceptorAddressFour: this.initialInfoPrint ? this.initialInfoPrint.acceptorAddressFour : '',
      acceptorCitizenshipNoFour: this.initialInfoPrint ? this.initialInfoPrint.acceptorCitizenshipNoFour : '',
      acceptanceDateFour: this.initialInfoPrint ? this.initialInfoPrint.acceptanceDateFour : '',
      acceptorIssuedOfficeFour: this.initialInfoPrint ? this.initialInfoPrint.acceptorIssuedOfficeFour : '',
      acceptorRelationFour: this.initialInfoPrint ? this.initialInfoPrint.acceptorRelationFour : '',
      ownerName: this.initialInfoPrint ? this.initialInfoPrint.ownerName : '',
      itiSambatYear: this.initialInfoPrint ? this.initialInfoPrint.itiSambatYear : '',
      itiSambatMonth: this.initialInfoPrint ? this.initialInfoPrint.itiSambatMonth : '',
      itiSambatDay: this.initialInfoPrint ? this.initialInfoPrint.itiSambatDay : '',
      roj: this.initialInfoPrint ? this.initialInfoPrint.roj : '',
    });
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

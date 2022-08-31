import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';

@Component({
  selector: 'app-supplementary-agreement-proprietorship',
  templateUrl: './supplementary-agreement-proprietorship.component.html',
  styleUrls: ['./supplementary-agreement-proprietorship.component.scss']
})
export class SupplementaryAgreementProprietorshipComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  supplementaryAgreementProprietorship: FormGroup;
  nepData;
  guarantorData;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) {
  }

  ngOnInit(): void {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.supplementaryAgreementProprietorship.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.guarantorData = Object.values(this.nepData.guarantorDetails);
    }
  }

  buildForm() {
    this.supplementaryAgreementProprietorship = this.formBuilder.group({
      date: [undefined],
      branch: [undefined],
      companyRegistrationOffice: [undefined],
      registrationIssuedDate: [undefined],
      registrationNo: [undefined],
      companyDistrict: [undefined],
      companyMunicipalityVDC: [undefined],
      companyWardNo: [undefined],
      borrowerName: [undefined],
      authorizedPersonGrandfatherName: [undefined],
      authorizedPersonFatherName: [undefined],
      authorizedPersonHusbandName: [undefined],
      authorizedPersonDistrict: [undefined],
      authorizedPersonMunicipalityVDC: [undefined],
      authorizedPersonWardNo: [undefined],
      authorizedPersonAge: [undefined],
      authorizedPersonName: [undefined],
      date2: [undefined],
      offerLetterIssuedDate: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      date3: [undefined],
      receiptNo: [undefined],
      receiptDate: [undefined],
      itemDetails: [undefined],
      itemDetails2: [undefined],
      witnessName: [undefined],
      witnessName2: [undefined],
    });
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.supplementaryAgreementProprietorship.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.supplementaryAgreementProprietorship.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.supplementaryAgreementProprietorship.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }

  changeToNepAmount(event: any, target, from) {
    this.supplementaryAgreementProprietorship.get([target]).patchValue(event.nepVal);
    this.supplementaryAgreementProprietorship.get([from]).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.supplementaryAgreementProprietorship.get([target]).value;
    return patchValue1;
  }
}

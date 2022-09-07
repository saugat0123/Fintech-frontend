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
  selector: 'app-kalo-suchi-borrower-company',
  templateUrl: './kalo-suchi-borrower-company.component.html',
  styleUrls: ['./kalo-suchi-borrower-company.component.scss']
})
export class KaloSuchiBorrowerCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  kaloSuchiBorrowerCompany: FormGroup;
  nepData;
  initialInfo;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfo = JSON.parse(singleCadFile.initialInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.kaloSuchiBorrowerCompany.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }

  buildForm() {
    this.kaloSuchiBorrowerCompany = this.formBuilder.group({
      debtor: [undefined],
      district: [undefined],
      metropolitian: [undefined],
      ward: [undefined],
      permanentAdd: [undefined],
      creditInfo: [undefined],
      relationship: [undefined],
      approver: [undefined],
      approverDistrict: [undefined],
      approverMunicipality: [undefined],
      approverWard: [undefined],
      approverTole: [undefined],
      date1: [undefined],
    });
  }
  fillForm() {
    this.kaloSuchiBorrowerCompany.patchValue({
      debtor: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
      district: [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.district : ''],
      metropolitian: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.municipality : '',
      ward: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.wardNo : '',
      permanentAdd: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.tole : '',
      creditInfo: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanFacilityTypeInNep : '',
      approver: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
      approverDistrict: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.district : '',
      approverMunicipality: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.municipality : '',
      approverWard: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.wardNo : '',
      approverTole: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
      date1 : undefined,
      relationship : undefined,
    });
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.kaloSuchiBorrowerCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.kaloSuchiBorrowerCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.kaloSuchiBorrowerCompany.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
    });
  }

}
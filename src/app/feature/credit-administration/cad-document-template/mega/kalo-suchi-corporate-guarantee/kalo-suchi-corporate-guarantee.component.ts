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
  selector: 'app-kalo-suchi-corporate-guarantee',
  templateUrl: './kalo-suchi-corporate-guarantee.component.html',
  styleUrls: ['./kalo-suchi-corporate-guarantee.component.scss']
})
export class KaloSuchiCorporateGuaranteeComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  kaloSuchiCorporateGuarantee: FormGroup;
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
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.kaloSuchiCorporateGuarantee.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
  }

  buildForm() {
    this.kaloSuchiCorporateGuarantee = this.formBuilder.group({
      borrowerName: [undefined],
      districtPermanent: [undefined],
      municipalityPermanent: [undefined],
      wardNumPermanent: [undefined],
      tolePermanent: [undefined],
      loanFacilityTypeNepali : [undefined],
      guarantorName : [undefined],
      relationship: [undefined],
      institutionRegDistrict: [undefined],
      institutionRegMun: [undefined],
      institutionRegWard: [undefined],
      institutionRegTole: [undefined],
      date: [undefined],
    });
  }
  fillForm() {
    this.kaloSuchiCorporateGuarantee.patchValue({
      borrowerName: !ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : '',
      districtPermanent: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.district : '',
      municipalityPermanent: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.municipality : '',
      wardNumPermanent: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ?
          this.nepData.institutionRegisteredAddress.wardNo : '',
      tolePermanent: !ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.tole : '',
      loanFacilityTypeNepali: !ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
          this.nepData.miscellaneousDetail.loanFacilityTypeInNep : '',
      guarantorName : !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0]) ?
          this.nepData.guarantorDetails[0].name : '',
      institutionRegDistrict: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress) ?
          this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress.district : '',
      institutionRegMun: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress) ?
          this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress.municipality : '',
      institutionRegWard: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress) ?
          this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress.wardNo : '',
      institutionRegTole: !ObjectUtil.isEmpty(this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress) ?
          this.nepData.guarantorDetails[0].guarantorInstitutionRegisteredAddress.tole : '',
    });
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.kaloSuchiCorporateGuarantee.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.kaloSuchiCorporateGuarantee.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.kaloSuchiCorporateGuarantee.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save'));
      this.dialogRef.close();
    });
  }

}

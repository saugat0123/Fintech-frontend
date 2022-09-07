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
  selector: 'app-supplementary-agreement-partnership',
  templateUrl: './supplementary-agreement-partnership.component.html',
  styleUrls: ['./supplementary-agreement-partnership.component.scss']
})
export class SupplementaryAgreementPartnershipComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  supplementaryAgreementPartnership: FormGroup;
  nepData;
  initialInfo;
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
          this.initialInfo = JSON.parse(singleCadFile.initialInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.guarantorData = Object.values(this.nepData.guarantorDetails);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.supplementaryAgreementPartnership.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
  }

  buildForm() {
    this.supplementaryAgreementPartnership = this.formBuilder.group({
      date: [undefined],
      branch: [undefined],
      companyRegistrationOffice: [undefined],
      registrationIssuedDate: [undefined],
      registrationNo: [undefined],
      companyDistrict: [undefined],
      companyMunicipalityVDC: [undefined],
      companyWardNo: [undefined],
      borrowerName: [undefined],
      authorizedPersonGrandFatherName: [undefined],
      authorizedPersonFatherName: [undefined],
      authorizedPersonHusbandName: [undefined],
      authorizedPersonDistrict: [undefined],
      authorizedPersonMunicipalityVDC: [undefined],
      authorizedPersonWardNo: [undefined],
      authorizedPersonAge: [undefined],
      authorizedPersonName: [undefined],
      authorizedPersonGrandFatherName2: [undefined],
      authorizedPersonFatherName2: [undefined],
      authorizedPersonHusbandName2: [undefined],
      authorizedPersonDistrict2: [undefined],
      authorizedPersonMunicipalityVDC2: [undefined],
      authorizedPersonWardNo2: [undefined],
      authorizedPersonAge2: [undefined],
      authorizedPersonName2: [undefined],
      date2: [undefined],
      name: [undefined],
      name2: [undefined],
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
  fillForm() {
    this.supplementaryAgreementPartnership.patchValue({
          branch: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchNameInNepali : ''],
          companyRegistrationOffice: [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : ''],
          registrationIssuedDate: [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : ''],
          registrationNo: [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : ''],
          companyDistrict: [!ObjectUtil.isEmpty
          (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
          companyMunicipalityVDC: [!ObjectUtil.isEmpty
          (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
          companyWardNo: [!ObjectUtil.isEmpty
          (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.municipality : ''],
          borrowerName: [!ObjectUtil.isEmpty
          (this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
          authorizedPersonGrandFatherName: [!ObjectUtil.isEmpty
          (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.grandFatherName : ''],
          authorizedPersonFatherName: [!ObjectUtil.isEmpty
          (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.fatherName : ''],
          authorizedPersonHusbandName: [!ObjectUtil.isEmpty
          (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.husbandName : ''],
          authorizedPersonDistrict: [!ObjectUtil.isEmpty
          (this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.district : ''],
          authorizedPersonMunicipalityVDC: [!ObjectUtil.isEmpty
          (this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.municipality : ''],
          authorizedPersonWardNo: [!ObjectUtil.isEmpty
          (this.nepData.authorizedPersonAddress) ? this.nepData.authorizedPersonAddress.wardNo : ''],
          authorizedPersonName: [!ObjectUtil.isEmpty
          (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : ''],
          offerLetterIssuedDate: [!ObjectUtil.isEmpty
          (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.offerIssueDate : ''],
          amount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
          amountInWords: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
        }
    );
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.supplementaryAgreementPartnership.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.supplementaryAgreementPartnership.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.supplementaryAgreementPartnership.value);
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
    this.supplementaryAgreementPartnership.get([target]).patchValue(event.nepVal);
    this.supplementaryAgreementPartnership.get([from]).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.supplementaryAgreementPartnership.get([target]).value;
    return patchValue1;
  }
}

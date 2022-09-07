import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
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
  selector: 'app-loan-deed-company',
  templateUrl: './loan-deed-company.component.html',
  styleUrls: ['./loan-deed-company.component.scss']
})
export class LoanDeedCompanyComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  loanDeedCompany: FormGroup;
  nepData;
  guarantorData;
  submitted = false;
  isForEdit = false;
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit(): void {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const data = JSON.parse(singleCadFile.initialInformation);
          this.loanDeedCompany.patchValue(data);
          this.setName(data);
          this.isForEdit = true;
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.guarantorData = Object.values(this.nepData.guarantorDetails);
      if (!this.isForEdit) {
        this.fillForm();
      }
    }
  }

  buildForm() {
    this.loanDeedCompany = this.formBuilder.group({
      branch: [undefined],
      act: [undefined],
      registrationOffice: [undefined],
      registrationIssuedDate: [undefined],
      registrationNo: [undefined],
      registrationOfficeDistrict: [undefined],
      registrationOfficeMunicipalityVDC: [undefined],
      registrationOfficeWardNo: [undefined],
      borrowerName: [undefined],
      authorizedPersonName: [undefined],
      offerLetterIssuedDate: [undefined],
      signature: [undefined],
      amount: [undefined],
      amount2: [undefined],
      totalAmount: [undefined],
      amountInWords: [undefined],
      amountInWords2: [undefined],
      totalAmountInWords: [undefined],
      loanFacilityType: [undefined],
      // loanFacilityType2: [undefined],
      FACOwnerName: [undefined],
      FACOwnerDistrict: [undefined],
      FACOwnerMunicipalityVDC: [undefined],
      FACOwnerWardNo: [undefined],
      nakshaSeatNo: [undefined],
      plotNo: [undefined],
      area: [undefined],
      witnessName: [undefined],
      witnessName2: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      time: [undefined],
      nameMa: [undefined],
      jariGareko: [undefined],
      freeText: [undefined],
      loanFacilityType2: this.formBuilder.array([]),
      freeText2: [undefined],
    });

  }
  fillForm() {
    this.loanDeedCompany.patchValue({
      branch: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchNameInNepali : ''],
      registrationOffice: [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : ''],
      registrationIssuedDate: [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : ''],
      registrationNo: [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : ''],
      registrationOfficeDistrict: [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
      registrationOfficeMunicipalityVDC: [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.municipality : ''],
      registrationOfficeWardNo: [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.wardNo : ''],
      borrowerName: [!ObjectUtil.isEmpty(this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
      authorizedPersonName: [!ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : ''],
      offerLetterIssuedDate: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.offerIssueDate : ''],
    loanFacilityType: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanFacilityTypeInNep : ''],
      amount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
      amountInWords: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
      loanFacilityType2: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanFacilityTypeInNep : ''],
      amount2: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
      amountInWords2: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInWord : ''],
      FACOwnerName: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0]) ? this.nepData.collateralDetails[0].nameInNepali : ''],
      FACOwnerDistrict: [!ObjectUtil.isEmpty(this.nepData.collateralDetails[0].landAndBuildingDetail)
          ? this.nepData.collateralDetails[0].landAndBuildingDetail.district : ''],
      FACOwnerMunicipalityVDC: [!ObjectUtil.isEmpty
     (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.municipality : ''],
      FACOwnerWardNo: [!ObjectUtil.isEmpty
      (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.wardNo : ''],
      nakshaSeatNo: [!ObjectUtil.isEmpty
      (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.nakshaSeatNo : ''],
      plotNo: [!ObjectUtil.isEmpty
      (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.plotNo : ''],
      area: [!ObjectUtil.isEmpty
      (this.nepData.collateralDetails[0].landAndBuildingDetail) ? this.nepData.collateralDetails[0].landAndBuildingDetail.area : ''],
    });
    if (!ObjectUtil.isEmpty(this.nepData)) {
      if (!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanFacilityTypeInNep)) {
        this.addName();
 this.loanDeedCompany.get(['loanFacilityType2', 0, 'loanFacilityType2']).patchValue(this.nepData.miscellaneousDetail.loanFacilityTypeInNep);
      }
    }
  }


  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.loanDeedCompany.value);
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
    this.loanDeedCompany.get([target]).patchValue(event.nepVal);
    this.loanDeedCompany.get([from]).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.loanDeedCompany.get([target]).value;
    return patchValue1;
  }
  addName() {
    (this.loanDeedCompany.get('loanFacilityType2') as FormArray).push(this.formBuilder.group({
      loanFacilityType2: [undefined],
    }));
  }

  remove(i) {
    (this.loanDeedCompany.get('loanFacilityType2') as FormArray).removeAt(i);
  }

  setName(data) {
    if (data.length < 0) {
      this.addName();
    }
    data.loanFacilityType2.forEach(d => {
      (this.loanDeedCompany.get('loanFacilityType2') as FormArray).push(this.formBuilder.group({
        loanFacilityType2: [d ? d.loanFacilityType2 : undefined],
      }));
    });
  }
}

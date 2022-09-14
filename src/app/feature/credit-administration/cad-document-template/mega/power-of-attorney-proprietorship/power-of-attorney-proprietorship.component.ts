import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {Guarantor} from '../../../../loan/model/guarantor';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';

@Component({
  selector: 'app-power-of-attorney-proprietorship',
  templateUrl: './power-of-attorney-proprietorship.component.html',
  styleUrls: ['./power-of-attorney-proprietorship.component.scss']
})
export class PowerOfAttorneyProprietorshipComponent implements OnInit {

  PowerOfAttorneyProprietorship: FormGroup;
  @Input() customerInfo: CustomerInfoData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  nepData;
  guarantorData;
  initialInfo;
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
          this.initialInfo = JSON.parse(singleCadFile.initialInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
      this.guarantorData = Object.values(this.nepData.guarantorDetails);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.PowerOfAttorneyProprietorship.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
  }

  buildForm() {
    this.PowerOfAttorneyProprietorship = this.formBuilder.group({
      bankBranchName: [undefined],
      guarantorGrandFatherName: [undefined],
      guarrantorFatherName: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipalityOrVdc: [undefined],
      guarantorWardNo: [undefined],
      tempProvinceNo: [undefined],
      tempAddDistrict: [undefined],
      tempAddMunicipality: [undefined],
      tempAddWardNo: [undefined],
      tempAddress: [undefined],
      guarantorAge: [undefined],
      guarantorName: [undefined],
      guarantorCitizenshipNum: [undefined],
      guarantorIssueDate: [undefined],
      guarantorIssueDistrict: [undefined],
      guarantorGrandfather1: [undefined],
      guarrantorFatherName1: [undefined],
      guarantorDistrict1: [undefined],
      guarantorMunicipalityOrVdc1: [undefined],
      guarantorWardNo1: [undefined],
      guarantorProvinceNo: [undefined],
      tempAddDistrict1: [undefined],
      TempAddMunicipality1: [undefined],
      tempAddWardNo1: [undefined],
      tempAddress1: [undefined],
      guarantorAge1: [undefined],
      guarantorName1: [undefined],
      guarantorCitizenshipNo1: [undefined],
      CitizenshipIssuedDate1: [undefined],
      CitizenshipIssuedDistrict1: [undefined],
      guarantorGrandFather2: [undefined],
      guarrantorFatherName2: [undefined],
      borrowerDistrict: [undefined],
      borrowerMunicipalityOrVdc: [undefined],
      borrowerWardNo: [undefined],
      borrowerProvinceNo: [undefined],
      borrowerTempDistrict: [undefined],
      tempMunicipalityOrVdc2: [undefined],
      tempWardNo2: [undefined],
      tempAddress2: [undefined],
      borrowerAge: [undefined],
      borrowerName: [undefined],
      borrowerCitizenshipNo: [undefined],
      borrowerCitizenshipIssuedDate: [undefined],
      borrowerCitizenshipIssuedDistrict: [undefined],
      numberOfGuarantor: [undefined],
      loanApprovalDate: [undefined],
      loanAmount: [undefined],
      loanAmtInWord: [undefined],
      loanFacility1: [undefined],
      purpose1: [undefined],
      loanFacilityAmount1: [undefined],
      interestRate1: [undefined],
      timePeriod1: [undefined],
      apology1: [undefined],
      loanFacility2: [undefined],
      purpose2: [undefined],
      loanFacilityAmount2: [undefined],
      interestRate2: [undefined],
      timePeriod2: [undefined],
      apology2: [undefined],
      staffName: [undefined],
      guarantorName2: [undefined],
      guarantorAddress: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDay: [undefined],
      docWrittenWeek: [undefined],
      witnessDistrict1: [undefined],
      witnessMunicipalityOrVdc1: [undefined],
      witnessWardNo1: [undefined],
      witnessAge1: [undefined],
      witnessName1: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipalityOrVdc2: [undefined],
      witnessWardNo2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      date: [undefined],
      registerNum: [undefined],
      offerDate: [undefined],
      actYear: [undefined],
      borrowerPersonName: [undefined],
      institutionRegDestrict: [undefined],
      institutionRegVDC: [undefined],
      institutionRegWard: [undefined],
    });
  }

  fillForm() {
    this.PowerOfAttorneyProprietorship.patchValue({
      bankBranchName : [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? (this.nepData.companyRegOffice) : ''],
      date : [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? (this.nepData.regIssueDate) : ''],
      registerNum : [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? (this.nepData.registrationNo) : ''],
      institutionRegDestrict : [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.district) ? (this.nepData.institutionRegisteredAddress.district) : ''],
      institutionRegVDC : [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.municipality) ? (this.nepData.institutionRegisteredAddress.municipality) : ''],
      institutionRegWard : [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress.municipality) ? (this.nepData.institutionRegisteredAddress.municipality) : ''],
      borrowerPersonName : [!ObjectUtil.isEmpty(this.nepData.nepaliName) ? (this.nepData.nepaliName) : ''],
      guarantorGrandFatherName : [!ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail.grandfatherName) ? (this.nepData.authorizedPersonDetail.grandfatherName) : ''],
      guarrantorFatherName : [!ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail.fatherName) ? (this.nepData.authorizedPersonDetail.fatherName) : ''],
      guarantorDistrict : [!ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress.district) ? (this.nepData.authorizedPersonAddress.district) : ''],
      guarantorMunicipalityOrVdc : [!ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress.municipality) ? (this.nepData.authorizedPersonAddress.municipality) : ''],
      guarantorWardNo : [!ObjectUtil.isEmpty(this.nepData.authorizedPersonAddress.wardNo) ? (this.nepData.authorizedPersonAddress.wardNo) : ''],
      guarantorName : [!ObjectUtil.isEmpty(this.nepData.authorizedPersonDetail.name) ? (this.nepData.authorizedPersonDetail.name) : ''],
      offerDate : [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.offerIssueDate) ? (this.nepData.miscellaneousDetail.offerIssueDate) : ''],
      loanAmount : [ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanAmountInFig) ? '' : (this.nepData.miscellaneousDetail.loanAmountInFig)],
      loanAmtInWord : [ObjectUtil.isEmpty(this.nepData.miscellaneousDetail.loanAmountInWord) ? '' : (this.nepData.miscellaneousDetail.loanAmountInWord)],
    });
  }
  changeToNepAmount(event: any, target, from) {
    this.PowerOfAttorneyProprietorship.get([target]).patchValue(event.nepVal);
    this.PowerOfAttorneyProprietorship.get([from]).patchValue(event.val);
  }

  patchFunction(target) {
    const patchValue1 = this.PowerOfAttorneyProprietorship.get([target]).value;
    return patchValue1;
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.PowerOfAttorneyProprietorship.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.PowerOfAttorneyProprietorship.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.PowerOfAttorneyProprietorship.value);
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

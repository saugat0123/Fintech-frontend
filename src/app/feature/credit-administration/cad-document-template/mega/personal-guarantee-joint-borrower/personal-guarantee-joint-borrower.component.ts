import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
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

@Component({
  selector: 'app-personal-guarantee-joint-borrower',
  templateUrl: './personal-guarantee-joint-borrower.component.html',
  styleUrls: ['./personal-guarantee-joint-borrower.component.scss']
})
export class PersonalGuaranteeJointBorrowerComponent implements OnInit {

  personalGuaranteeJoint: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  nepData;
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
          this.personalGuaranteeJoint.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
  }

  buildForm() {
    this.personalGuaranteeJoint = this.formBuilder.group({
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
      guarantorCitizenshipNo: [undefined],
      guarantorCitizenshipIssuedDate: [undefined],
      citizenshipIssuedDistrict: [undefined],
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
    });
  }

  onSubmit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteeJoint.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.personalGuaranteeJoint.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.personalGuaranteeJoint.value);
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
    console.log(this.personalGuaranteeJoint.value);
  }

}

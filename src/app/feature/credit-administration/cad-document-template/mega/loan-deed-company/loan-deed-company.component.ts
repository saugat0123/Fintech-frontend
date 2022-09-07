import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
          this.loanDeedCompany.patchValue(JSON.parse(singleCadFile.initialInformation));
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
      loanFacilityType2: [undefined],
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
      time: [undefined]
    });

  }
  fillForm() {
    this.loanDeedCompany.patchValue({
      branch: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchNameInNepali : ''],
      registrationOffice: [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : ''],
      registrationIssuedDate: [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : ''],
      registrationNo: [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : ''],
      registrationOfficeDistrict: [!ObjectUtil.isEmpty(this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
      // registrationOfficeMunicipalityVDC:
    });
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
}

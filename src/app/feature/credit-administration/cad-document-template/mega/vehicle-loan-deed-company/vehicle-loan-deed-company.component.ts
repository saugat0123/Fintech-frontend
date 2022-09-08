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
  selector: 'app-vehicle-loan-deed-company',
  templateUrl: './vehicle-loan-deed-company.component.html',
  styleUrls: ['./vehicle-loan-deed-company.component.scss']
})
export class VehicleLoanDeedCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  vehicleLoanDeedCompany: FormGroup;
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
          this.initialInfo = JSON.parse(singleCadFile.initialInformation);        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialInfo)) {
      this.vehicleLoanDeedCompany.patchValue(this.initialInfo);
    } else {
      this.fillForm();
    }
  }

  buildForm() {
    this.vehicleLoanDeedCompany = this.formBuilder.group({
      branchOfficeAddress: [undefined],
      companyRegistrationOffice: [undefined],
      act: [undefined],
      regNo: [undefined],
      regDate: [undefined],
      district: [undefined],
      metropolitan: [undefined],
      wardNo: [undefined],
      borrowerName: [undefined],
      authorizedPerson: [undefined],
      loanAmount: [undefined],
      loanAmountInWords: [undefined],
      offerLetterIssuedDate: [undefined],
      witness1: [undefined],
      witness2: [undefined],
      sambatYear: [undefined],
      sambatMonth: [undefined],
      sambatDay: [undefined],
      sambatDate: [undefined],
      shubham: [undefined],
      engineNo: [undefined],
      vehicleCompany: [undefined],
      vehicleModel: [undefined],
      vehicleRegNo: [undefined],
      witness3: [undefined],
      chassisNo: [undefined],
    });
  }
  fillForm() {
    this.vehicleLoanDeedCompany.patchValue({
          branchOfficeAddress: [!ObjectUtil.isEmpty(this.nepData.branchDetail) ? this.nepData.branchDetail.branchNameInNepali : ''],
          companyRegistrationOffice: [!ObjectUtil.isEmpty(this.nepData.companyRegOffice) ? this.nepData.companyRegOffice : ''],
      regDate: [!ObjectUtil.isEmpty(this.nepData.regIssueDate) ? this.nepData.regIssueDate : ''],
      regNo: [!ObjectUtil.isEmpty(this.nepData.registrationNo) ? this.nepData.registrationNo : ''],
      district: [!ObjectUtil.isEmpty
          (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
      metropolitan: [!ObjectUtil.isEmpty
          (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.district : ''],
      wardNo: [!ObjectUtil.isEmpty
          (this.nepData.institutionRegisteredAddress) ? this.nepData.institutionRegisteredAddress.municipality : ''],
          borrowerName: [!ObjectUtil.isEmpty
          (this.nepData.nepaliName) ? this.nepData.nepaliName : ''],
      authorizedPerson: [!ObjectUtil.isEmpty
          (this.nepData.authorizedPersonDetail) ? this.nepData.authorizedPersonDetail.name : ''],
          offerLetterIssuedDate: [!ObjectUtil.isEmpty
          (this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.offerIssueDate : ''],
          loanAmount: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ? this.nepData.miscellaneousDetail.loanAmountInFig : ''],
          loanAmountInWords: [!ObjectUtil.isEmpty(this.nepData.miscellaneousDetail) ?
              this.nepData.miscellaneousDetail.loanAmountInWord : ''],
        }
    );
  }
  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.vehicleLoanDeedCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.vehicleLoanDeedCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.vehicleLoanDeedCompany.value);
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

  changeToNepAmount(event: any, target, from) {
    this.vehicleLoanDeedCompany.get([target]).patchValue(event.nepVal);
    this.vehicleLoanDeedCompany.get([from]).patchValue(event.val);
  }
  patchFunction(target) {
    const patchValue1 = this.vehicleLoanDeedCompany.get([target]).value;
    return patchValue1;
  }
}

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
  selector: 'app-letter-of-continuity-company',
  templateUrl: './letter-of-continuity-company.component.html',
  styleUrls: ['./letter-of-continuity-company.component.scss']
})
export class LetterOfContinuityCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  letterOfContinuityCompany: FormGroup;
  nepData;
  initialData;
  constructor(private formBuilder: FormBuilder,
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
          this.initialData = JSON.parse(singleCadFile.initialInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    if (!ObjectUtil.isEmpty(this.initialData)) {
      this.letterOfContinuityCompany.patchValue(this.initialData);
    } else {
      this.fillForm();
    }
  }
  buildForm() {
    this.letterOfContinuityCompany = this.formBuilder.group({
      branchNameNepali: [undefined],
      actYear: [undefined],
      companyRegOffice: [undefined],
      registrationDate: [undefined],
      registrationNo: [undefined],
      district: [undefined],
      vdcMunicipality: [undefined],
      wardNum: [undefined],
      tole: [undefined],
      borrowerNameNepali: [undefined],
      authorizedPersonName: [undefined],
      sachiOne: [undefined],
      sachiTwo: [undefined],
      year: [undefined],
      month: [undefined],
      date: [undefined],
      roj: [undefined],
    });
  }
  fillForm() {
     this.letterOfContinuityCompany.get('branchNameNepali').patchValue(this.nepData.branchDetail.branchNameInNepali);
     this.letterOfContinuityCompany.get('companyRegOffice').patchValue(this.nepData.companyRegOffice);
     this.letterOfContinuityCompany.get('registrationDate').patchValue(this.nepData.regIssueDate);
     this.letterOfContinuityCompany.get('registrationNo').patchValue(this.nepData.registrationNo);
     this.letterOfContinuityCompany.get('district').patchValue(this.nepData.institutionRegisteredAddress.district);
     this.letterOfContinuityCompany.get('vdcMunicipality').patchValue(this.nepData.institutionRegisteredAddress.municipality);
     this.letterOfContinuityCompany.get('wardNum').patchValue(this.nepData.institutionRegisteredAddress.wardNo);
     this.letterOfContinuityCompany.get('borrowerNameNepali').patchValue(this.nepData.nepaliName);
     this.letterOfContinuityCompany.get('authorizedPersonName').patchValue(this.nepData.authorizedPersonDetail.name);
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.letterOfContinuityCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.letterOfContinuityCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.letterOfContinuityCompany.value);
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

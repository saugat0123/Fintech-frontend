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
  selector: 'app-letter-of-continuity-partnership',
  templateUrl: './letter-of-continuity-partnership.component.html',
  styleUrls: ['./letter-of-continuity-partnership.component.scss']
})
export class LetterOfContinuityPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  form: FormGroup;
  nepData;
  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.fillForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      branchNameNepali: [undefined],
      actYear: [undefined],
      companyRegOffice: [undefined],
      registrationIssueDate: [undefined],
      registrationNo: [undefined],
      district: [undefined],
      vdcOrMuni: [undefined],
      wardNum: [undefined],
      borrowerNameInNepali: [undefined],
      grandFatherOrFatherInLaw: [undefined],
      fatherOrHusbandName: [undefined],
      authDistrict: [undefined],
      borrowerVdcOrMunicipality: [undefined],
      borrowerWardNo: [undefined],
      year1: [undefined],
      authorizedPersonName: [undefined],
      authorizedPersonFreeText: [undefined],
      sachiOne: [undefined],
      sachiTwo: [undefined],
      year: [undefined],
      month: [undefined],
      date: [undefined],
      roj: [undefined]
    });
  }
  fillForm() {
     this.form.get('branchNameNepali').patchValue(this.nepData.branchDetail.branchNameInNepali);
     this.form.get('companyRegOffice').patchValue(this.nepData.companyRegOffice);
     this.form.get('registrationIssueDate').patchValue(this.nepData.regIssueDate);
     this.form.get('registrationNo').patchValue(this.nepData.registrationNo);
     this.form.get('district').patchValue(this.nepData.institutionRegisteredAddress.district);
     this.form.get('vdcOrMuni').patchValue(this.nepData.institutionRegisteredAddress.municipality);
     this.form.get('wardNum').patchValue(this.nepData.institutionRegisteredAddress.wardNo);
     this.form.get('borrowerNameInNepali').patchValue(this.nepData.nepaliName);
     this.form.get('grandFatherOrFatherInLaw').patchValue(this.nepData.authorizedPersonDetail.grandFatherName);
     this.form.get('fatherOrHusbandName').patchValue(this.nepData.authorizedPersonDetail.fatherName);
     this.form.get('authDistrict').patchValue(this.nepData.authorizedPersonAddress.district);
     this.form.get('borrowerVdcOrMunicipality').patchValue(this.nepData.authorizedPersonAddress.municipality);
     this.form.get('borrowerWardNo').patchValue(this.nepData.authorizedPersonAddress.wardNo);
     this.form.get('authorizedPersonName').patchValue(this.nepData.authorizedPersonDetail.name);
  }

  submit() {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.form.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.form.value);
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

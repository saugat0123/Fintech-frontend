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
          this.letterOfContinuityCompany.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    // this.fillForm();
  }
  buildForm() {
    this.letterOfContinuityCompany = this.formBuilder.group({
      branchNameNepali: [undefined],
      actYear: [undefined],
      registrationIssueDate: [undefined],
      panNo: [undefined],
      gender: [undefined],
      vdcMunicipality: [undefined],
      wardNum: [undefined],
      tole: [undefined],
      borrowerNameNepali: [undefined],
      authGrandfatherOrFatherInLaw: [undefined],
      sachiOne: [undefined],
      sachiTwo: [undefined],
      year: [undefined],
      month: [undefined],
      date: [undefined],
      roj: [undefined],
    });
  }
  // fillForm() {
  //    this.letterOfContinuityCompany.get('branchNameNepali').patchValue(this.nepData.branchDetail.branchNameInNepali);
  //    this.letterOfContinuityCompany.get('registrationIssueDate').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.letterOfContinuityCompany.get('panNo').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.letterOfContinuityCompany.get('gender').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.letterOfContinuityCompany.get('vdcMunicipality').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.letterOfContinuityCompany.get('wardNum').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.letterOfContinuityCompany.get('tole').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.letterOfContinuityCompany.get('borrowerNameNepali').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.letterOfContinuityCompany.get('authGrandfatherOrFatherInLaw').patchValue(this.nepData.branchDetail.branchNameNepali);
  // }

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

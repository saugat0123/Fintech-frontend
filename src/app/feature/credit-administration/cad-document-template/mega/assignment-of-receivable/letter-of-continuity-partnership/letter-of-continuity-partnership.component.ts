import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

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
    // this.fillForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      branchNameNepali: [undefined],
      actYear: [undefined],
      registrationIssueDate: [undefined],
      panNo: [undefined],
      vdcOrMuni: [undefined],
      wardNo: [undefined],
      tole: [undefined],
      borrowerNameInNepali: [undefined],
      grandFatherOrFatherInLaw: [undefined],
      fatherOrHusbandName: [undefined],
      district: [undefined],
      borrowerVdcOrMunicipality: [undefined],
      borrowerWardNo: [undefined],
      year1: [undefined],
      authorizedPersonName: [undefined],
      year2: [undefined],
      sachiOne: [undefined],
      sachiTwo: [undefined],
      year: [undefined],
      month: [undefined],
      date: [undefined],
      roj: [undefined]
    });
  }
  // fillForm() {
  //    this.form.get('branchNameNepali').patchValue(this.nepData.branchDetail.branchNameInNepali);
  //    this.form.get('registrationIssueDate').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.form.get('panNo').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.form.get('gender').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.form.get('vdcMunicipality').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.form.get('wardNum').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.form.get('tole').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.form.get('borrowerNameNepali').patchValue(this.nepData.branchDetail.branchNameNepali);
  //    this.form.get('authGrandfatherOrFatherInLaw').patchValue(this.nepData.branchDetail.branchNameNepali);
  // }

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

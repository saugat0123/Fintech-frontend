import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {CadFile} from '../../../model/CadFile';
import {Document} from '../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../utils/router-utils.service';

@Component({
  selector: 'app-loan-deed-partnership',
  templateUrl: './loan-deed-partnership.component.html',
  styleUrls: ['./loan-deed-partnership.component.scss']
})
export class LoanDeedPartnershipComponent implements OnInit {
  form: FormGroup;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  nepData;
  loanDetails;
  individualData;
  initialInfoPrint;
  offerLetterConst = NabilDocumentChecklist;
  ckConfig = Editor.CK_CONFIG;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    console.log('CAD DATA::::::::::', this.cadData);
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      nameOfBranch: [undefined],
      actYearInFigure: [undefined],
      nameOfHeadOrSection: [undefined],
      dateOfRegistration: [undefined],
      registrationNumber: [undefined],
      firmName: [undefined],
      grandFatherNameOrFatherInLaw: [undefined],
      fatherNameOrHusbandName: [undefined],
      districtOfProprietor: [undefined],
      municipalityName: [undefined],
      wardNoOfProprietor: [undefined],
      ageOfProprietor: [undefined],
      nameOfProprietor: [undefined],
      grandFatherNameOrFatherInLaw1: [undefined],
      fatherNameOrHusbandName1: [undefined],
      districtOfProprietor1: [undefined],
      municipalityName1: [undefined],
      wardNoOfProprietor1: [undefined],
      ageOfProprietor1: [undefined],
      nameOfProprietor1: [undefined],
      grandFatherNameOrFatherInLaw2: [undefined],
      fatherNameOrHusbandName2: [undefined],
      districtOfProprietor2: [undefined],
      municipalityName2: [undefined],
      wardNoOfProprietor2: [undefined],
      ageOfProprietor2: [undefined],
      nameOfProprietor2: [undefined],
      sanctionLetterIssuedDate: [undefined],
      totalLoanAmount: [undefined],
      totalLoanAmountWords: [undefined],
      yearInFigure: [undefined],
      month: [undefined],
      days: [undefined],
      freeText: [undefined]
    });
  }

  checkOfferLetter() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.form.patchValue(JSON.parse(singleCadFile.initialInformation));
        }
      });
      this.fillForm();
    }
    this.fillForm();
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.loanDetails = this.cadData.assignedLoan;
    this.form.patchValue({
      nameOfBranch: this.nepData.branch.ct,
    });
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

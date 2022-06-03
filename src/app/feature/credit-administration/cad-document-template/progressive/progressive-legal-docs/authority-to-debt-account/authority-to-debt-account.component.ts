import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {AuthorityToDebtAccountPrintComponent} from './authority-to-debt-account-print/authority-to-debt-account-print.component';

@Component({
  selector: 'app-authority-to-debt-account',
  templateUrl: './authority-to-debt-account.component.html',
  styleUrls: ['./authority-to-debt-account.component.scss']
})
export class AuthorityToDebtAccountComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  form: FormGroup;
  spinner;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;
  loanCategory;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,
              private dialogRef: NbDialogRef<AuthorityToDebtAccountPrintComponent>) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData.assignedLoan)) {
      this.loanCategory = this.cadData.assignedLoan[0].loanCategory;
    }
    this.buildForm();
    this.fillForm();
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      if (this.loanCategory === 'INSTITUTION') {
        this.form.patchValue({
          BranchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
          sincerelyName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
          naPraNaName: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
          mitiName: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
          jiPrakaName: this.nepaliData.representativeCitizenshipIssuingAuthority ?
              this.nepaliData.representativeCitizenshipIssuingAuthority : '',
          sincerelyPermanentAddress: !ObjectUtil.isEmpty(this.nepaliData.representativePermanentDistrict) ?
              this.nepaliData.representativePermanentDistrict : '',
          jillaName: !ObjectUtil.isEmpty(this.nepaliData.representativePermanentMunicipality) ?
              this.nepaliData.representativePermanentMunicipality : '',
          jagaName: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
          sincerelyTempAddress: !ObjectUtil.isEmpty(this.nepaliData.representativeTemporaryDistrict) ?
              this.nepaliData.representativeTemporaryDistrict : '',
          jillaName1: !ObjectUtil.isEmpty(this.nepaliData.representativeTemporaryMunicipality) ?
              this.nepaliData.representativeTemporaryMunicipality : '',
          jagaName1: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
          parentName: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
          grandParentsName: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
          husbandWifeName: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : ''
        });
      }
      if (this.loanCategory === 'INDIVIDUAL') {
        this.form.patchValue({
          BranchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
          accNumber: this.nepaliData.accountNo ? this.nepaliData.accountNo : '',
          sincerelyName: this.nepaliData.name ? this.nepaliData.name : '',
          naPraNaName: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
          mitiName: this.nepaliData.citizenshipIssueDate ? this.nepaliData.citizenshipIssueDate : '',
          jiPrakaName: this.nepaliData.citizenshipIssueDistrict ? this.nepaliData.citizenshipIssueDistrict : '',
          sincerelyPermanentAddress: !ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ? this.nepaliData.permanentDistrict.nepaliName : '',
          jillaName: !ObjectUtil.isEmpty(this.nepaliData.permanentMunicipalities) ? this.nepaliData.permanentMunicipalities.nepaliName : '',
          jagaName: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
          sincerelyTempAddress: !ObjectUtil.isEmpty(this.nepaliData.temporaryDistrict) ? this.nepaliData.temporaryDistrict.nepaliName : '',
          jillaName1: !ObjectUtil.isEmpty(this.nepaliData.temporaryMunicipalities) ?
              this.nepaliData.temporaryMunicipalities.nepaliName : '',
          jagaName1: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
          parentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
          grandParentsName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
          husbandWifeName: this.nepaliData.husbandName ? this.nepaliData.husbandName : ''
        });
      }
    }
  }

  onSubmit(): void {
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.form.value);
          this.initialInfoPrint = singleCadFile.initialInformation;
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
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved '));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save '));
      this.dialogRef.close();
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      date: [undefined],
      BranchName: [undefined],
      accNumber: [undefined],
      sincerelyName: [undefined],
      naPraNaName: [undefined],
      mitiName: [undefined],
      jiPrakaName: [undefined],
      sincerelyPermanentAddress: [undefined],
      jillaName: [undefined],
      jagaName: [undefined],
      sincerelyTempAddress: [undefined],
      jillaName1: [undefined],
      jagaName1: [undefined],
      parentName: [undefined],
      grandParentsName: [undefined],
      husbandWifeName: [undefined]
    });
  }
}


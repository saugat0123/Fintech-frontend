import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {LegalDocumentCheckListEnum} from '../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-loan-deed-multiple-icfc',
  templateUrl: './loan-deed-multiple-icfc.component.html',
  styleUrls: ['./loan-deed-multiple-icfc.component.scss']
})
export class LoanDeedMultipleIcfcComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;

  loanDeedShareLoan: FormGroup;
  multipleData;
  spinner;
  nepData;
  offerLetterConst = LegalDocumentCheckListEnum;
  initialInfoPrint;
  editor = NepaliEditor.CK_CONFIG;
  guarantorData;

  constructor(private formBuilder: FormBuilder,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private dialogRef: NbDialogRef<LoanDeedMultipleIcfcComponent>,
              private routerUtilsService: RouterUtilsService,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private nepaliPercentWordPipe: NepaliPercentWordPipe) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }


  buildForm() {
    this.loanDeedShareLoan = this.formBuilder.group({
      branchName: [undefined],
      grandFatherName: [undefined],
      parentsName: [undefined],
      provinceName: [undefined],
      zoneName: [undefined],
      districtName: [undefined],
      municipalityVdc: [undefined],
      wardNo: [undefined],
      temporaryProvince: [undefined],
      temporaryZone: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipality: [undefined],
      temporaryWardNo: [undefined],
      debtorAge: [undefined],
      debtorName: [undefined],
      citizenshipNo: [undefined],
      citizenshipIssuedDate: [undefined],
      citizenshipIssuedOffice: [undefined],
      date: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      accountNumber: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDay: [undefined],
      docWrittenWeek: [undefined],
      subham: [undefined],
      evidenceName2: [undefined],
      writersName: [undefined],
      listOfShare: [undefined],
      loanApprovalSpecificationTable: this.formBuilder.array([this.buildLoanApprovalSpecification()]),
      evidenceNameArray: this.formBuilder.array([this.buildEvidenceDetails()]),
    });
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    this.loanDeedShareLoan.patchValue({
      grandFatherName: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
      parentsName: this.nepData.fatherName ? this.nepData.fatherName : '',
      provinceName: this.nepData.permanentProvince ? this.nepData.permanentProvince : '',
      districtName: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
      municipalityVdc: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
      wardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
      temporaryProvince: this.nepData.temporaryProvince ? this.nepData.temporaryProvince : '',
      temporaryDistrict: this.nepData.temporaryDistrict ? this.nepData.temporaryDistrict : '',
      temporaryMunicipality: this.nepData.temporaryMunicipality ? this.nepData.temporaryMunicipality : '',
      temporaryWardNo: this.nepData.temporaryWard ? this.nepData.temporaryWard : '',
      debtorAge: this.nepData.age ? this.nepData.age : '',
      debtorName: this.nepData.name ? this.nepData.name : '',
      citizenshipNo: this.nepData.citizenshipNo ? this.nepData.citizenshipNo : '',
      citizenshipIssuedDate: this.nepData.citizenshipIssueDate ? this.nepData.citizenshipIssueDate : '',
      citizenshipIssuedOffice: this.nepData.citizenshipIssueDistrict ? this.nepData.citizenshipIssueDistrict : '',
    });
  }

  checkOfferLetter() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      if (this.cadData.cadFileList.length > 0) {
        this.cadData.cadFileList.forEach(singleCadFile => {
          if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
            const initialInfo = JSON.parse(singleCadFile.initialInformation);
            this.initialInfoPrint = initialInfo;
            if (!ObjectUtil.isEmpty(initialInfo)) {
              this.setLoanApprovalTable(initialInfo.loanApprovalSpecificationTable);
              this.setEvidenceData(initialInfo.evidenceNameArray);
            }
            this.loanDeedShareLoan.patchValue(this.initialInfoPrint);
          } else {
            this.fillForm();
          }
        });
      } else {
        this.fillForm();
      }
    }
  }

  buildLoanApprovalSpecification() {
    return this.formBuilder.group({
      loanApprovalDate: [undefined],
      tableLoanAmount: [undefined],
      interestRate: [undefined],
      serviceCharge: [undefined],
      facilityAndPaymentDate: [undefined],
    });
  }

  addTableData() {
    (this.loanDeedShareLoan.get('loanApprovalSpecificationTable') as FormArray).push(this.buildLoanApprovalSpecification());
  }

  setLoanApprovalTable(data) {
    const formArray = this.loanDeedShareLoan.get('loanApprovalSpecificationTable') as FormArray;
    (this.loanDeedShareLoan.get('loanApprovalSpecificationTable') as FormArray).clear();
    if (data.length === 0) {
      this.addTableData();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        loanApprovalDate: [value.loanApprovalDate],
        tableLoanAmount: [value.tableLoanAmount],
        interestRate: [value.interestRate],
        serviceCharge: [value.serviceCharge],
        facilityAndPaymentDate: [value.facilityAndPaymentDate],
      }));
    });
  }

  removeTableData(index) {
    (this.loanDeedShareLoan.get('loanApprovalSpecificationTable') as FormArray).removeAt(index);
  }

  buildEvidenceDetails() {
    return this.formBuilder.group({
      evidenceName1: [undefined],
    });
  }

  addEvidenceData() {
    (this.loanDeedShareLoan.get('evidenceNameArray') as FormArray).push(this.buildEvidenceDetails());
  }

  removeEvideneData(i) {
    (this.loanDeedShareLoan.get('evidenceNameArray') as FormArray).removeAt(i);
  }

  setEvidenceData(data) {
    const formArray = this.loanDeedShareLoan.get('evidenceNameArray') as FormArray;
    (this.loanDeedShareLoan.get('evidenceNameArray') as FormArray).clear();
    if (data.length === 0) {
      this.addTableData();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        evidenceName1: [value.evidenceName1],
      }));
    });
  }


  submit() {
    console.log(this.loanDeedShareLoan.value);
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.loanDeedShareLoan.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.loanDeedShareLoan.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.loanDeedShareLoan.value);
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
    });
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.loanDeedShareLoan.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.loanDeedShareLoan.get(wordLabel).patchValue(convertedVal);
  }

}

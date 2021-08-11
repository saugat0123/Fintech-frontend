import {Component, Input, OnInit} from '@angular/core';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NepaliNumberAndWords} from '../../../../model/nepaliNumberAndWords';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {LegalDocumentCheckListEnum} from '../../legalDocumentCheckListEnum';
import {RemoveNumberCommaPipe} from "../../../../../../@core/pipe/remove-number-comma.pipe";

@Component({
  selector: 'app-loan-deed-hire-purchase',
  templateUrl: './loan-deed-hire-purchase.component.html',
  styleUrls: ['./loan-deed-hire-purchase.component.scss']
})
export class LoanDeedHirePurchaseComponent implements OnInit {

  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() nepaliAmount: NepaliNumberAndWords;

  loanDeedHirePurchase: FormGroup;
  multipleData;
  spinner;
  nepData;
  offerLetterDocument: OfferDocument;
  offerLetterConst = LegalDocumentCheckListEnum;
  initialInfoPrint;
  editor = NepaliEditor.CK_CONFIG;
  existingOfferLetter = false;
  guarantorData;

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private dialogRef: NbDialogRef<LoanDeedHirePurchaseComponent>,
              private removeCommaPipe: RemoveNumberCommaPipe) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.loanDeedHirePurchase = this.formBuilder.group({
      branchName: [undefined],
      registeredGovMinistry: [undefined],
      registeredGovOffice: [undefined],
      companyRegisteredNo: [undefined],
      companyRegisteredDate: [undefined],
      companyProvince: [undefined],
      companyZone: [undefined],
      companyDistrict: [undefined],
      companyMunicipality: [undefined],
      companyWardNo: [undefined],
      companyPanNo: [undefined],
      companyName: [undefined],
      grandParents: [undefined],
      parentsName: [undefined],
      permanentProvince: [undefined],
      permanentZone: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipality: [undefined],
      permanentWardNo: [undefined],
      temporaryProvince: [undefined],
      temporaryZone: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipality: [undefined],
      temporaryWardNo: [undefined],
      age: [undefined],
      officialPersonName: [undefined],
      citizenshipNo: [undefined],
      citizenshipIssuedDate: [undefined],
      citizenshipIssuedOffice: [undefined],
      loanHolderCompany: [undefined],
      loanApprovalDate: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      accountNo: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDay: [undefined],
      docWrittenWeek: [undefined],
      subham: [undefined],
      writersName: [undefined],
      securityDetailsArray: this.formBuilder.array([this.buildSecurityDetails()]),
      evidenceNameArray: this.formBuilder.array([this.buildEvidence()]),
      loanApprovalSpecificationTable: this.formBuilder.array([this.buildLoanApproval()]),
    });
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    this.loanDeedHirePurchase.patchValue({
      grandParents: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
      parentsName: this.nepData.fatherName ? this.nepData.fatherName : '',
      permanentProvince: this.nepData.permanentProvince ? this.nepData.permanentProvince : '',
      permanentDistrict: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
      permanentMunicipality: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
      permanentWardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
      temporaryProvince: this.nepData.temporaryProvince ? this.nepData.temporaryProvince : '',
      temporaryDistrict: this.nepData.temporaryDistrict ? this.nepData.temporaryDistrict : '',
      temporaryMunicipality: this.nepData.temporaryMunicipality ? this.nepData.temporaryMunicipality : '',
      temporaryWardNo: this.nepData.temporaryWard ? this.nepData.temporaryWard : '',
      age: this.nepData.age ? this.nepData.age : '',
      officialPersonName: this.nepData.name ? this.nepData.name : '',
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
              this.setSecurityDetails(initialInfo.securityDetailsArray);
              this.setEvidenceData(initialInfo.evidenceNameArray);
              this.setLoanApproval(initialInfo.loanApprovalSpecificationTable);
            }
            this.loanDeedHirePurchase.patchValue(this.initialInfoPrint);
          } else {
            this.fillForm();
          }
        });
      } else {
        this.fillForm();
      }
    }
  }

  buildSecurityDetails() {
    return this.formBuilder.group({
      sNo: [undefined],
      vehicleSpecification: [undefined],
      engineNo: [undefined],
      registeredNo: [undefined],
      remark: [undefined],
    });
  }

  addSecurityDetails() {
    (this.loanDeedHirePurchase.get('securityDetailsArray') as FormArray).push(this.buildSecurityDetails());
  }

  removeSecurityDtails(index) {
    (this.loanDeedHirePurchase.get('securityDetailsArray') as FormArray).removeAt(index);
  }

  setSecurityDetails(data) {
    const formArray = this.loanDeedHirePurchase.get('securityDetailsArray') as FormArray;
    (this.loanDeedHirePurchase.get('securityDetailsArray') as FormArray).clear();
    if (data.length === 0) {
      this.addSecurityDetails();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        sNo: [value.sNo],
        vehicleSpecification: [value.vehicleSpecification],
        engineNo: [value.engineNo],
        registeredNo: [value.registeredNo],
        remark: [value.remark],
      }));
    });
  }

  buildEvidence() {
    return this.formBuilder.group({
      evidenceName1: [undefined],
    });
  }

  addEvidenceDetails() {
    (this.loanDeedHirePurchase.get('evidenceNameArray') as FormArray).push(this.buildEvidence());
  }

  removeEvidenceDetails(index) {
    (this.loanDeedHirePurchase.get('evidenceNameArray') as FormArray).removeAt(index);
  }

  setEvidenceData(data) {
    const formArray = this.loanDeedHirePurchase.get('evidenceNameArray') as FormArray;
    (this.loanDeedHirePurchase.get('evidenceNameArray') as FormArray).clear();
    if (data.length === 0) {
      this.addEvidenceDetails();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        evidenceName1: [value.evidenceName1],
      }));
    });
  }

  buildLoanApproval() {
    return this.formBuilder.group({
      loanApprovalYear: [undefined],
      tableLoanAmount: [undefined],
      interestRate: [undefined],
      serviceCharge: [undefined],
      facilityAndPaymentDate: [undefined],
    });
  }

  addLoanApproval() {
    (this.loanDeedHirePurchase.get('loanApprovalSpecificationTable') as FormArray).push(this.buildLoanApproval());
  }

  removeLoanApproval(index) {
    (this.loanDeedHirePurchase.get('loanApprovalSpecificationTable') as FormArray).removeAt(index);
  }

  setLoanApproval(data) {
    const formArray = this.loanDeedHirePurchase.get('loanApprovalSpecificationTable') as FormArray;
    (this.loanDeedHirePurchase.get('loanApprovalSpecificationTable') as FormArray).clear();
    if (data.length === 0) {
      this.addLoanApproval();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        loanApprovalYear: [value.loanApprovalYear],
        tableLoanAmount: [value.tableLoanAmount],
        interestRate: [value.interestRate],
        serviceCharge: [value.serviceCharge],
        facilityAndPaymentDate: [value.facilityAndPaymentDate],
      }));
    });
  }

  submit() {
    console.log('Form Group Value', this.loanDeedHirePurchase.value);
    this.spinner = true;
    let flag = true;

    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.loanDeedHirePurchase.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.loanDeedHirePurchase.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.loanDeedHirePurchase.value);
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
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.loanDeedHirePurchase.get(numLabel).value);
    const cleanVal = this.removeCommaPipe.transform(wordLabelVar);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(cleanVal);
    this.loanDeedHirePurchase.get(wordLabel).patchValue(convertedVal);
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliPercentWordPipe} from '../../../../../../@core/pipe/nepali-percent-word.pipe';
import {OfferDocument} from '../../../../model/OfferDocument';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NepaliEditor} from '../../../../../../@core/utils/constants/nepaliEditor';

@Component({
  selector: 'app-loan-deed-multiple-icfc',
  templateUrl: './loan-deed-multiple-icfc.component.html',
  styleUrls: ['./loan-deed-multiple-icfc.component.scss']
})
export class LoanDeedMultipleIcfcComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  loanDeedMultiple: FormGroup;
  multipleData;
  spinner;
  nepData;
  offerLetterDocument: OfferDocument;
  offerLetterConst = IcfcOfferLetterConst;
  initialInfoPrint;
  editor = NepaliEditor.CK_CONFIG;
  existingOfferLetter = false;
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
    this.loanDeedMultiple = this.formBuilder.group({
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
    this.nepData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    this.loanDeedMultiple.patchValue({
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
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_SHARE_LOAN).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_SHARE_LOAN);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      if (!ObjectUtil.isEmpty(initialInfo)) {
        this.setLoanApprovalTable(initialInfo.loanApprovalSpecificationTable);
        this.setEvidenceData(initialInfo.evidenceNameArray);
      }
      this.loanDeedMultiple.patchValue(this.initialInfoPrint);
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
    (this.loanDeedMultiple.get('loanApprovalSpecificationTable') as FormArray).push(this.buildLoanApprovalSpecification());
  }

  setLoanApprovalTable(data) {
    const formArray = this.loanDeedMultiple.get('loanApprovalSpecificationTable') as FormArray;
    (this.loanDeedMultiple.get('loanApprovalSpecificationTable') as FormArray).clear();
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
    (this.loanDeedMultiple.get('loanApprovalSpecificationTable') as FormArray).removeAt(index);
  }

  buildEvidenceDetails() {
    return this.formBuilder.group({
      evidenceName1: [undefined],
    });
  }

  addEvidenceData() {
    (this.loanDeedMultiple.get('evidenceNameArray') as FormArray).push(this.buildEvidenceDetails());
  }

  removeEvideneData(i) {
    (this.loanDeedMultiple.get('evidenceNameArray') as FormArray).removeAt(i);
  }

  setEvidenceData(data) {
    const formArray = this.loanDeedMultiple.get('evidenceNameArray') as FormArray;
    (this.loanDeedMultiple.get('evidenceNameArray') as FormArray).clear();
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
    console.log(this.loanDeedMultiple.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
        this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_SHARE_LOAN).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.loanDeedMultiple.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LOAN_DEED_SHARE_LOAN);
      offerDocument.initialInformation = JSON.stringify(this.loanDeedMultiple.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    });
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.loanDeedMultiple.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.loanDeedMultiple.get(wordLabel).patchValue(convertedVal);
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../model/customerApprovedLoanCadDocumentation";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ProgressiveLegalDocConst} from "../progressive-legal-doc-const";
import {CustomerOfferLetter} from "../../../../../loan/model/customer-offer-letter";
import {OfferDocument} from "../../../../model/OfferDocument";
import {NbDialogRef} from "@nebular/theme";
import {NepaliToEngNumberPipe} from "../../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliCurrencyWordPipe} from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import {CreditAdministrationService} from "../../../../service/credit-administration.service";
import {ToastService} from "../../../../../../@core/utils";
import {RouterUtilsService} from "../../../../utils/router-utils.service";
import {CustomerOfferLetterService} from "../../../../../loan/service/customer-offer-letter.service";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {CadFile} from "../../../../model/CadFile";
import {Document} from "../../../../../admin/modal/document";
import {Alert, AlertType} from "../../../../../../@theme/model/Alert";

@Component({
  selector: 'app-rokka-letter',
  templateUrl: './rokka-letter.component.html',
  styleUrls: ['./rokka-letter.component.scss']
})
export class RokkaLetterComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  spinner;
  form: FormGroup;
  offerLetterConst = ProgressiveLegalDocConst;
  customerOfferLetter: CustomerOfferLetter;
  initialInfoPrint;
  existingOfferLetter = false;
  offerLetterDocument: OfferDocument;
  nepaliData;

  constructor(private dialogRef: NbDialogRef<RokkaLetterComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService) { }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      branchName: [undefined],
      letterNumber: [undefined],
      landRevenueOffice: [undefined],
      date: [undefined],
      perDistrict: [undefined],
      perMunicipality: [undefined],
      perWardNumber: [undefined],
      tempDistrict: [undefined],
      tempMunicipality: [undefined],
      tempWardNo: [undefined],
      tempAddress: [undefined],
      debtorName: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      companyStaffName: [undefined],
      naPramanPatraNumber: [undefined],
      // tableLandOwnerName: [undefined],
      // tableFatherName: [undefined],
      // tableGrandFather: [undefined],
      // tableAddressName: [undefined],
      // tableTempAddress: [undefined],
      // tableRegistrationNumber: [undefined],
      // tableDistrictName: [undefined],
      // tablePerAddress: [undefined],
      // tableTempAddress2: [undefined],
      // tableKittaNo: [undefined],
      // tablelandArea: [undefined],
      // tableSitNo: [undefined],
      tableBodartha: [undefined],
      financeBranchName: [undefined],
      financeBranchName2: [undefined],
      personalSignatureArray: this.formBuilder.array([this.buildPersonalSampleTable()]),
    });
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          if (!ObjectUtil.isEmpty(initialInfo.personalSignatureArray)) {
            this.setPersonalSampleTest(initialInfo.personalSignatureArray);
          }
          if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
            // this.form(initialInfo.guarantorDetails);
          }
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      console.log('This is nepali Data: ', this.nepaliData);

      this.form.patchValue({
        debtorName: this.nepaliData.name ? this.nepaliData.name : '',
        perDistrict: this.nepaliData.permanentDistrict ? this.nepaliData.permanentDistrict : '',
        perMunicipality: this.nepaliData.permanentMunicipality ? this.nepaliData.permanentMunicipality : '',
        perWardNumber: this.nepaliData.permanentWard ? this.nepaliData.permanentWard : '',
        tempDistrict: this.nepaliData.temporaryDistrict ? this.nepaliData.temporaryDistrict : '',
        tempMunicipality: this.nepaliData.temporaryMunicipality ? this.nepaliData.temporaryMunicipality : '',
        tempWardNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
      });
    }
  }

  onSubmit() {
    console.log('Form Control Data: ', this.form.value);
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

  buildPersonalSampleTable() {
    return this.formBuilder.group({
      tableLandOwnerName: [undefined],
      tableFatherName: [undefined],
      tableGrandFather: [undefined],
      tableAddressName: [undefined],
      tableTempAddress: [undefined],
      tableRegistrationNumber: [undefined],
      tableDistrictName: [undefined],
      tablePerAddress: [undefined],
      tableTempAddress2: [undefined],
      tableKittaNo: [undefined],
      tablelandArea: [undefined],
      tableSitNo: [undefined],
    });
  }

  addPersonalSampleTable() {
    (this.form.get('personalSignatureArray') as FormArray).push(this.buildPersonalSampleTable());
  }

  removePersonalSampleTable(index) {
    (this.form.get('personalSignatureArray') as FormArray).removeAt(index);
  }

  setPersonalSampleTest(data) {
    const formArray = this.form.get('personalSignatureArray') as FormArray;
    (this.form.get('personalSignatureArray') as FormArray).clear();
    if (data.length === 0) {
      this.addPersonalSampleTable();
      return;
    }
    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        tableLandOwnerName: [value.tableLandOwnerName],
        tableFatherName: [value.tableFatherName],
        tableGrandFather: [value.tableGrandFather],
        tableAddressName: [value.tableAddressName],
        tableTempAddress: [value.tableTempAddress],
        tableRegistrationNumber: [value.tableRegistrationNumber],
        tableDistrictName: [value.tableDistrictName],
        tablePerAddress: [value.tablePerAddress],
        tableTempAddress2: [value.tableTempAddress2],
        tableKittaNo: [value.tableKittaNo],
        tablelandArea: [value.tablelandArea],
        tableSitNo: [value.tableSitNo],
      }));
    });
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(convertedVal);
  }

}

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
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      branchName: [undefined],
      branchDistrict: [undefined],
      branchPhoneNo: [undefined],
      letterNumber: [undefined],
      landRevenueOffice: [undefined],
      landRevenueOfficeDistrict: [undefined],
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
      tableBodartha: [undefined],
      financeBranchName: [undefined],
      financeBranchName2: [undefined],
      personalSignatureArray: this.formBuilder.array([this.buildPersonalSampleTable()]),
      rokkaFaatOffice: [undefined],
      rokkaFaatOfficeDistrict: [undefined],
      karmachariName: [undefined],
      postName: [undefined],
      karmachariName2: [undefined],
      postName2: [undefined],
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
         /* if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
            // this.form(initialInfo.guarantorDetails);
          }*/
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.form.patchValue({
        branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        branchDistrict: this.nepaliData.branchDistrict ? this.nepaliData.branchDistrict : '',
        branchPhoneNo: this.nepaliData.branchTelNo ? this.nepaliData.branchTelNo : '',
        debtorName: this.nepaliData.collateralDetails[0].collateralName ? this.nepaliData.collateralDetails[0].collateralName : '',
        perDistrict: !ObjectUtil.isEmpty(this.nepaliData.collateralOwnerDetails[0]) ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentDistrict.nepaliName : '',
        perMunicipality: !ObjectUtil.isEmpty(this.nepaliData.collateralOwnerDetails[0]) ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentVdc : '',
        perWardNumber: !ObjectUtil.isEmpty(this.nepaliData.collateralOwnerDetails[0]) ? this.nepaliData.collateralOwnerDetails[0].collateralOwnerPermanentVdcWard : '',
      });
    }

    this.setPersonalSampleTest(this.nepaliData.collateralDetails);
  }

  onSubmit() {
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
      tableSpouseName: [undefined],
      tableAddressName: [undefined],
      tableTempMun: [undefined],
      tableTempWardNo: [undefined],
      tableTempDistrict: [undefined],
      tableRegistrationNumber: [undefined],
      tableDistrictName: [undefined],
      tablePerMun: [undefined],
      tablePerWardNo: [undefined],
      tableTempMun2: [undefined],
      tableTempWardNo2: [undefined],
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
        tableLandOwnerName: [value.collateralName],
        tableFatherName: [value.collateralFatherName],
        tableGrandFather: [value.collateralGrandFatherName],
        tableSpouseName: [value.tableSpouseName],
        tableAddressName: [value.tableAddressName],
        tableTempMun: [!ObjectUtil.isEmpty(value.collateralPermanentMunVdc) ?
            value.collateralPermanentMunVdc.nepaliName : ''],
        tableTempWardNo: [value.collateralPermanentWardNo],
        tableTempDistrict: [!ObjectUtil.isEmpty(value.collateralPermanentDistrict) ?
            value.collateralPermanentDistrict.nepaliName : ''],
        tableRegistrationNumber: [value.tableRegistrationNumber],
        tableDistrictName: [value.collateralDistrict],
        tablePerMun: [value.collateralMunVdcOriginal],
        tablePerWardNo: [value.collateralWardNoOld],
        tableTempMun2: [value.collateralMunVdcChanged],
        tableTempWardNo2: [value.wardNoNew],
        tableKittaNo: [value.plotNo],
        tablelandArea: [value.areaOfCollateral],
        tableSitNo: [value.seatNo],
      }));
    });
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(convertedVal);
  }

}

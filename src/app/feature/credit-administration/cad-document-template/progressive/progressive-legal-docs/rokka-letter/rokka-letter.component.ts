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
import {CompanyInfo} from '../../../../../admin/modal/company-info';
import {CustomerType} from '../../../../../customer/model/customerType';
import {CustomerInfoData} from '../../../../../loan/model/customerInfoData';

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
  customerInstitution = false;
  customerIndividual = false;
  loanData;
  tempData;

  constructor(private dialogRef: NbDialogRef<RokkaLetterComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService) { }

  ngOnInit() {
    this.loanData = this.cadData.loanHolder;
    this.tempData = JSON.parse(this.cadData.nepData);
    this.buildForm();
    this.fillForm();
    console.log('this.loanData ', this.loanData);
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
      loanAmount: [!ObjectUtil.isEmpty(this.tempData.numberNepali) ? this.tempData.numberNepali : ''],
      loanAmountWords: [!ObjectUtil.isEmpty(this.tempData.nepaliWords) ? this.tempData.nepaliWords : ''],
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
      corporateDistrict: [undefined],
      corporateMunicipality: [undefined],
      corporateWardNumber: [undefined],
      corporateName: [undefined],
      representativeName: [undefined],
      collateralName: [undefined],
      corporateAddress: [undefined]
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
      console.log('this.cadData', this.cadData);
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
      this.form.patchValue({
        branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        branchDistrict: this.nepaliData.branchDistrict ? this.nepaliData.branchDistrict : '',
        branchPhoneNo: this.nepaliData.branchTelNo ? this.nepaliData.branchTelNo : '',
        debtorName: this.nepaliData.name ? this.nepaliData.name : '',
        perDistrict: !ObjectUtil.isEmpty(this.nepaliData.permanentDistrict) ? this.nepaliData.permanentDistrict : '',
        perMunicipality: !ObjectUtil.isEmpty(this.nepaliData.permanentVdc) ? this.nepaliData.permanentVdc : '',
        perWardNumber: !ObjectUtil.isEmpty(this.nepaliData.permanentVdcWard) ? this.nepaliData.permanentVdcWard : '',
        corporateDistrict: !ObjectUtil.isEmpty(this.nepaliData.companyDistrict) ? this.nepaliData.companyDistrict : '',
        corporateMunicipality: !ObjectUtil.isEmpty(this.nepaliData.companyVdcMun) ? this.nepaliData.companyVdcMun : '',
        corporateWardNumber: !ObjectUtil.isEmpty(this.nepaliData.companyWardNo) ? this.nepaliData.companyWardNo : '',
        corporateName: !ObjectUtil.isEmpty(this.nepaliData.corporateName) ? this.nepaliData.companyName : '',
        representativeName: !ObjectUtil.isEmpty(this.nepaliData.representativeName) ? this.nepaliData.representativeName : '',
        collateralName: !ObjectUtil.isEmpty(this.nepaliData.collateralDetails[0]) ? this.nepaliData.collateralDetails[0].collateralName : '',
      });
    }

    //this.setPersonalSampleTest(this.nepaliData.collateralDetails);

    this.nepaliData.collateralDetails.forEach((value, i) => {
      try {
        this.setSecurityDetails(value, i);
      } catch (error) {
        this.addPersonalSampleTable();
        this.setSecurityDetails(value, i);
      }
    });

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
      landOwnerDistrict: [undefined],
      tableMunicipality: [undefined],
      tableOldWardNum: [undefined],
      institutionLandOwnerName: [undefined],
      institutionRegistrationNo: [undefined],
      institutionRegistrationDate: [undefined],
      institutionPanNo: [undefined],
      institutionLandOwnerDistrict: [undefined],
      institutionPerMun: [undefined],
      institutionPerWardNo: [undefined]
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
        tablePerMun: [value.collateralPermanentVdc],
        tablePerWardNo: [value.collateralPermanentVdcWard],
        tableTempMun2: [value.collateralMunVdcChanged],
        tableTempWardNo2: [value.wardNoNew],
        tableKittaNo: [value.plotNo],
        tablelandArea: [value.areaOfCollateral],
        tableSitNo: [value.seatNo],
        landOwnerDistrict: [value.collateralPermanentDistrict],
        tableMunicipality: [value.collateralMunVdcOriginal],
        tableOldWardNum: [value.collateralWardNoOld],
        institutionLandOwnerName: [value.companyName],
        institutionRegistrationNo: [value.companyRegistrationNo],
        institutionRegistrationDate: [value.registrationDate],
        institutionPanNo: [value.panNo],
        institutionLandOwnerDistrict: [value.companyDistrict],
        institutionPerMun: [value.companyVdcMun],
        institutionPerWardNo: [value.companyWardNo]
      }));
    });
  }

  // convertAmountInWords(numLabel, wordLabel) {
  //   const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
  //   const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
  //   this.form.get(wordLabel).patchValue(convertedVal);
  // }

  setSecurityDetails(value, i) {
    this.form.get(['personalSignatureArray', i, 'tableLandOwnerName']).patchValue(value.collateralName);
    this.form.get(['personalSignatureArray', i, 'tableFatherName']).patchValue(value.collateralFatherName);
    this.form.get(['personalSignatureArray', i, 'tableGrandFather']).patchValue(value.collateralGrandFatherName);
    this.form.get(['personalSignatureArray', i, 'tableDistrictName']).patchValue(value.collateralDistrict);
    this.form.get(['personalSignatureArray', i, 'tablePerMun']).patchValue(value.collateralMunVdcOriginal);
    this.form.get(['personalSignatureArray', i, 'tablePerWardNo']).patchValue(value.collateralWardNoOld);
    this.form.get(['personalSignatureArray', i, 'tableTempMun2']).patchValue(value.collateralMunVdcChanged);
    this.form.get(['personalSignatureArray', i, 'tableTempWardNo2']).patchValue(value.wardNoNew);
    this.form.get(['personalSignatureArray', i, 'tableKittaNo']).patchValue(value.plotNo);
    this.form.get(['personalSignatureArray', i, 'tablelandArea']).patchValue(value.areaOfCollateral);
    this.form.get(['personalSignatureArray', i, 'tableSitNo']).patchValue(value.seatNo);
    this.form.get(['personalSignatureArray', i, 'landOwnerDistrict']).patchValue(value.landOwnerDistrict);
  }

}

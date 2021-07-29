import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from "@nebular/theme";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {NepaliToEngNumberPipe} from "../../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliCurrencyWordPipe} from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import {CreditAdministrationService} from "../../../../service/credit-administration.service";
import {ToastService} from "../../../../../../@core/utils";
import {RouterUtilsService} from "../../../../utils/router-utils.service";
import {CustomerOfferLetterService} from "../../../../../loan/service/customer-offer-letter.service";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {CustomerApprovedLoanCadDocumentation} from "../../../../model/customerApprovedLoanCadDocumentation";
import {ProgressiveLegalDocConst} from "../progressive-legal-doc-const";
import {CustomerOfferLetter} from "../../../../../loan/model/customer-offer-letter";
import {OfferDocument} from "../../../../model/OfferDocument";
import {CadFile} from "../../../../model/CadFile";
import {Document} from "../../../../../admin/modal/document";
import {Alert, AlertType} from "../../../../../../@theme/model/Alert";

@Component({
  selector: 'app-promisory-note-institutional',
  templateUrl: './promisory-note-institutional.component.html',
  styleUrls: ['./promisory-note-institutional.component.scss']
})
export class PromisoryNoteInstitutionalComponent implements OnInit {
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

  constructor(private dialogRef: NbDialogRef<PromisoryNoteInstitutionalComponent>,
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

  buildForm(){
    this.form = this.formBuilder.group({
      MinistryOffice: [undefined],
      DepartmentName: [undefined],
      RegisterOffice: [undefined],
      Act: [undefined],
      UnderName: [undefined],
      UnderDate: [undefined],
      PraliNo: [undefined],
      ServiceOfficeName: [undefined],
      CertifiedCompany: [undefined],
      certificateNo: [undefined],
      CertifiedDistrict: [undefined],
      CertifiedMunicipality: [undefined],
      CertifiedWadNo: [undefined],
      bottomGrandfatherName: [undefined],
      bottomGrandMotherName: [undefined],
      bottomFatherName: [undefined],
      bottomMotherName: [undefined],
      bottomHusbandName: [undefined],
      bottomDistrictName: [undefined],
      bottomMunicipalityName: [undefined],
      bottomWadNo: [undefined],
      bottomTempDistrict: [undefined],
      bottomTempMunicipality: [undefined],
      bottomTempWadNo: [undefined],
      bottomAge: [undefined],
      bottoCustomerName: [undefined],
      bottoCustomerCizenshipNo: [undefined],
      bottomDate: [undefined],
      bottomCDOoffice: [undefined],
      bottomBranchName: [undefined],
      bottomAmount: [undefined],
      bottomAmountInWord: [undefined],
      bottomSincerlySign: [undefined],
      AkhtiyarName: [undefined],
      bottomSincerlyCitizenShipNo: [undefined],
      bottomSincerlyDate: [undefined],
      bottomSincerlyCDOoffice: [undefined],
      AkhtiyarPermanentDistrict: [undefined],
      AkhtiyarPermanentVDC: [undefined],
      AkhtiyarPermanentWadNo: [undefined],
      SabikVDC: [undefined],
      SabikWadNo: [undefined],
      AkhtiyarTempDistrict: [undefined],
      AkhtiyarTempVDC: [undefined],
      AkhtiyarTempWadNo: [undefined],
      buttomSincerlyParentName: [undefined],
      buttomSincerlyGrandParentName: [undefined],
      buttomSincerlyHusbandName: [undefined],
      buttomIdentifiedGuarantorName: [undefined],
      buttomIdentifiedHintNo: [undefined],
      buttomItisambatYear: [undefined],
      buttomItisambatMonth: [undefined],
      buttomItisambatDay: [undefined],
      buttomItisambatTime: [undefined],
      buttomItisambatRojSubham: [undefined],
      guarantorDetails: this.formBuilder.array([]),
      secguarantorDetails: this.formBuilder.array([]),
      address:[undefined]
    })

  }
  fillForm(){
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          if (!ObjectUtil.isEmpty(initialInfo.secguarantorDetails)) {
            this.setsecGuarantorDetails(initialInfo.secguarantorDetails);
          }
          if (!ObjectUtil.isEmpty(initialInfo.guarantorDetails)) {
            this.setGuarantorDetails(initialInfo.guarantorDetails);
          }
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

      this.form.patchValue({
        customerName: this.nepaliData.name ? this.nepaliData.name : '',
      });
    }
  }

  secaddGuarantor(): void {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.push(this.secguarantorFormGroup());
  }

  secguarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWadNo: [undefined]
    });
  }
  setsecGuarantorDetails(data) {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    if (data.length === 0) {
      this.secaddGuarantor();
      return;
    }
    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
        citizenNumber: [value.citizenNumber],
        issuedYear: [value.issuedYear],
        guarantorCDOoffice: [value.guarantorCDOoffice],
        guarantorDistrict: [value.guarantorDistrict],
        guarantorMunicipality: [value.guarantorMunicipality],
        guarantorWadNo: [value.guarantorWadNo]
      }));
    });
  }

  secremoveGuarantor(index: number): void {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.removeAt(index);
  }
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }


  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }
  addGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }


  guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWadNo: [undefined]
    });
  }

  setGuarantorDetails(data) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length === 0) {
      this.addGuarantor();
      return;
    }
    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
        citizenNumber: [value.citizenNumber],
        issuedYear: [value.issuedYear],
        guarantorCDOoffice: [value.guarantorCDOoffice],
        guarantorDistrict: [value.guarantorDistrict],
        guarantorMunicipality: [value.guarantorMunicipality],
        guarantorWadNo: [value.guarantorWadNo]
      }));
    });
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

}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {OfferDocument} from '../../../../model/OfferDocument';
import {LegalDocumentCheckListEnum} from '../../../../../admin/modal/legalDocumentCheckListEnum';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-personal-guarantee-company-icfc',
  templateUrl: './personal-guarantee-company-icfc.component.html',
  styleUrls: ['./personal-guarantee-company-icfc.component.scss']
})
export class PersonalGuaranteeCompanyIcfcComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  personalGuaranteeCompany: FormGroup;
  offerLetterDocument: OfferDocument;
  spinner;
  offerLetterConst = LegalDocumentCheckListEnum;
  initialInfoPrint;
  nepData;

  constructor(private formBuilder: FormBuilder,
              private toastService: ToastService,
              private administrationService: CreditAdministrationService,
              private routerUtilsService: RouterUtilsService,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private dialogRef: NbDialogRef<PersonalGuaranteeCompanyIcfcComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.personalGuaranteeCompany = this.formBuilder.group({
      grandParentsName: [undefined],
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
      loanHolderAge: [undefined],
      loanHolderName: [undefined],
      citizenshipNo: [undefined],
      citizenshipIssuedDate: [undefined],
      citizenshipIssuedOffice: [undefined],
      companyProvince: [undefined],
      companyZone: [undefined],
      companyDistrict: [undefined],
      companyMunicipality: [undefined],
      companyWardNo: [undefined],
      govMinistryName: [undefined],
      govOfficeName: [undefined],
      companyRegisteredNo: [undefined],
      companyRegisteredDate: [undefined],
      registeredCompanyName: [undefined],
      loanApprovedDate: [undefined],
      loanType: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      loanProviderName: [undefined],
      loanProvidersAddress: [undefined],
      docWrittenYear: [undefined],
      docWrittenMonth: [undefined],
      docWrittenDate: [undefined],
      docWrittenRoj: [undefined],
      subham: [undefined],
      evidenceArray: this.formBuilder.array([this.buildEvidenceArray()]),
    });
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    this.personalGuaranteeCompany.patchValue({
      grandParentsName: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
      parentsName: this.nepData.fatherName ? this.nepData.fatherName : '',
      permanentProvince: this.nepData.permanentProvince ? this.nepData.permanentProvince : '',
      permanentDistrict: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
      permanentMunicipality: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
      permanentWardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
      temporaryProvince: this.nepData.temporaryProvince ? this.nepData.temporaryProvince : '',
      temporaryDistrict: this.nepData.temporaryDistrict ? this.nepData.temporaryDistrict : '',
      temporaryMunicipality: this.nepData.temporaryMunicipality ? this.nepData.temporaryMunicipality : '',
      temporaryWardNo: this.nepData.temporaryWard ? this.nepData.temporaryWard : '',
      loanHolderAge: this.nepData.age ? this.nepData.age : '',
      loanHolderName: this.nepData.name ? this.nepData.name : '',
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
              this.setEvidenceData(initialInfo.evidenceArray);
            }
            this.personalGuaranteeCompany.patchValue(this.initialInfoPrint);
          } else {
            this.fillForm();
          }
        });
      } else {
        this.fillForm();
      }
    }
  }

  buildEvidenceArray() {
    return this.formBuilder.group({
      evidenceName: [undefined],
    });
  }

  addEvidence() {
    (this.personalGuaranteeCompany.get('evidenceArray') as FormArray).push(this.buildEvidenceArray());
  }

  removeEvidence(index) {
    (this.personalGuaranteeCompany.get('evidenceArray') as FormArray).removeAt(index);
  }

  setEvidenceData(data) {
    const formArray = this.personalGuaranteeCompany.get('evidenceArray') as FormArray;
    (this.personalGuaranteeCompany.get('evidenceArray') as FormArray).clear();
    if (data.length === 0) {
      this.addEvidence();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        evidenceName: [value.evidenceName],
      }));
    });
  }

  submit() {
    console.log(this.personalGuaranteeCompany.value);
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteeCompany.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.personalGuaranteeCompany.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.personalGuaranteeCompany.value);
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
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.personalGuaranteeCompany.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.personalGuaranteeCompany.get(wordLabel).patchValue(convertedVal);
  }

}

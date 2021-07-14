import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {OfferDocument} from '../../../../model/OfferDocument';
import {LegalDocumentCheckListEnum} from '../../../../../admin/modal/legalDocumentCheckListEnum';
import {ToastService} from '../../../../../../@core/utils';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NbDialogRef} from '@nebular/theme';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';

@Component({
  selector: 'app-personal-guarantee-personal',
  templateUrl: './personal-guarantee-personal.component.html',
  styleUrls: ['./personal-guarantee-personal.component.scss']
})
export class PersonalGuaranteePersonalComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  personalGuaranteePersonal: FormGroup;
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
              private dialogRef: NbDialogRef<PersonalGuaranteePersonalComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.personalGuaranteePersonal = this.formBuilder.group({
      guarantorGrandParents: [undefined],
      guarantorParents: [undefined],
      guarantorPerProvince: [undefined],
      guarantorPerZone: [undefined],
      guarantorPerDistrict: [undefined],
      guarantorPerMunicipality: [undefined],
      guarantorPerWardNo: [undefined],
      guarantorTempProvince: [undefined],
      guarantorTempZone: [undefined],
      guarantorTempDistrict: [undefined],
      guarantorTempMunicipality: [undefined],
      guarantorTempWarNo: [undefined],
      guarantorAge: [undefined],
      guarantorName: [undefined],
      guarantorCitizenshipNo: [undefined],
      guarantorCitizenIssuedDate: [undefined],
      guarantorCitizenIssuedOffice: [undefined],
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
      loanHolderAge: [undefined],
      loanHolderName: [undefined],
      citizenshipNo: [undefined],
      citizenshipIssuedDate: [undefined],
      citizenshipIssuedOffice: [undefined],
      loanApprovalDate: [undefined],
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
      evidenceArray: this.formBuilder.array([this.buildEvidence()]),
    });
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    this.personalGuaranteePersonal.patchValue({
      grandParents: this.nepData.grandFatherName ? this.nepData.grandFatherName : '',
      parentsName: this.nepData.fatherName ? this.nepData.fatherName : '',
      permanentProvince: this.nepData.permanentProvince ? this.nepData.permanentProvince : '',
      permanentZone: [undefined],
      permanentDistrict: this.nepData.permanentDistrict ? this.nepData.permanentDistrict : '',
      permanentMunicipality: this.nepData.permanentMunicipality ? this.nepData.permanentMunicipality : '',
      permanentWardNo: this.nepData.permanentWard ? this.nepData.permanentWard : '',
      temporaryProvince: this.nepData.temporaryProvince ? this.nepData.temporaryProvince : '',
      temporaryZone: [undefined],
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
            this.personalGuaranteePersonal.patchValue(this.initialInfoPrint);
          } else {
            this.fillForm();
          }
        });
      } else {
        this.fillForm();
      }
    }
  }

  buildEvidence() {
    return this.formBuilder.group({
      evidenceName: [undefined],
    });
  }

  addEvidence() {
    (this.personalGuaranteePersonal.get('evidenceArray') as FormArray).push(this.buildEvidence());
  }

  removeEvidence(index) {
    (this.personalGuaranteePersonal.get('evidenceArray') as FormArray).removeAt(index);
  }

  setEvidenceData(data) {
    const formArray = this.personalGuaranteePersonal.get('evidenceArray') as FormArray;
    (this.personalGuaranteePersonal.get('evidenceArray') as FormArray).clear();
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
    console.log(this.personalGuaranteePersonal.value);
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.personalGuaranteePersonal.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.personalGuaranteePersonal.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.personalGuaranteePersonal.value);
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
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.personalGuaranteePersonal.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.personalGuaranteePersonal.get(wordLabel).patchValue(convertedVal);
  }

}

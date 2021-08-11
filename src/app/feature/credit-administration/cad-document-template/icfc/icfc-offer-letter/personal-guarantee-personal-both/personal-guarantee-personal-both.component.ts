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
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {LegalDocumentCheckListEnum} from '../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-personal-guarantee-personal-both',
  templateUrl: './personal-guarantee-personal-both.component.html',
  styleUrls: ['./personal-guarantee-personal-both.component.scss']
})
export class PersonalGuaranteePersonalBothComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  prsnGuaranteeBoth: FormGroup;
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
              private dialogRef: NbDialogRef<PersonalGuaranteePersonalBothComponent>) { }

  ngOnInit() {
    this.buildForm();
    this.checkOfferLetter();
  }

  buildForm() {
    this.prsnGuaranteeBoth = this.formBuilder.group({
      guarantorGrandParents: [undefined],
      guarantorParents: [undefined],
      guarantorPermanentProvince: [undefined],
      guarantorPermanentZone: [undefined],
      guarantorPermanentDistrict: [undefined],
      guarantorPerMunicipality: [undefined],
      guarantorPerWardNo: [undefined],
      guarantorTempProvince: [undefined],
      guarantorTempZone: [undefined],
      guarantorTempDistrict: [undefined],
      guarantorTempMunicipality: [undefined],
      guarantorTempWardNo: [undefined],
      guarantorAge: [undefined],
      guarantorName: [undefined],
      guarantorCitizenshipNo: [undefined],
      guarantorCitizenIssuedDate: [undefined],
      guarantorCitizenIssuedOffice: [undefined],
      grandParentsName1: [undefined],
      parentsName1: [undefined],
      permanentProvince1: [undefined],
      permanentZone1: [undefined],
      permanentDistrict1: [undefined],
      permanentMunicipality1: [undefined],
      permanentWardNo1: [undefined],
      temporaryProvince1: [undefined],
      temporaryZone1: [undefined],
      temporaryDistrict1: [undefined],
      temporaryMunicipality1: [undefined],
      temporaryWardNo1: [undefined],
      loanHolderAge1: [undefined],
      loanHolderName1: [undefined],
      citizenshipNo1: [undefined],
      citizenshipIssuedDate1: [undefined],
      citizenshipIssuedOffice1: [undefined],
      grandFatherName2: [undefined],
      parentsName2: [undefined],
      permanentProvince2: [undefined],
      permanentZone2: [undefined],
      permanentDistrict2: [undefined],
      permanentMunicipality2: [undefined],
      permanentWardNo2: [undefined],
      temporaryProvincec2: [undefined],
      temporaryZone2: [undefined],
      temporaryDistrict2: [undefined],
      temporaryMunicipality2: [undefined],
      temporaryWardNo2: [undefined],
      loanHolderAge2: [undefined],
      loanHolderName2: [undefined],
      citizenshipNo2: [undefined],
      citizenshipIssuedDate2: [undefined],
      citizenshipIssuedOffice2: [undefined],
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
      evidenceArray: this.formBuilder.array([this.buildEvidence()]),
    });
  }

  fillForm() {
    this.nepData = JSON.parse(this.cadData.loanHolder.nepData);
    this.prsnGuaranteeBoth.patchValue({
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
            this.prsnGuaranteeBoth.patchValue(this.initialInfoPrint);
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
    (this.prsnGuaranteeBoth.get('evidenceArray') as FormArray).push(this.buildEvidence());
  }

  removeEvidence(index) {
    (this.prsnGuaranteeBoth.get('evidenceArray') as FormArray).removeAt(index);
  }

  setEvidenceData(data) {
    const formArray = this.prsnGuaranteeBoth.get('evidenceArray') as FormArray;
    (this.prsnGuaranteeBoth.get('evidenceArray') as FormArray).clear();
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
    console.log(this.prsnGuaranteeBoth.value);
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.initialInformation = JSON.stringify(this.prsnGuaranteeBoth.value);
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.initialInformation = JSON.stringify(this.prsnGuaranteeBoth.value);
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      cadFile.initialInformation = JSON.stringify(this.prsnGuaranteeBoth.value);
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
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.prsnGuaranteeBoth.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.prsnGuaranteeBoth.get(wordLabel).patchValue(convertedVal);
  }

}

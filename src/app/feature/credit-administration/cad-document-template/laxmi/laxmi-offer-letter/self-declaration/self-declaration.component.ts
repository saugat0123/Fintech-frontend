import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogRef} from '@nebular/theme';
import {CadOfferLetterModalComponent} from '../../../../cad-offerletter-profile/cad-offer-letter-modal/cad-offer-letter-modal.component';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliNumberPipe} from '../../../../../../@core/pipe/nepali-number.pipe';
import {NepaliWordPipe} from '../../../../../../@core/pipe/nepali-word.pipe';

@Component({
  selector: 'app-self-declaration',
  templateUrl: './self-declaration.component.html',
  styleUrls: ['./self-declaration.component.scss']
})
export class SelfDeclarationComponent implements OnInit {

  constructor(
      private formBuilder: FormBuilder,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
      private routerUtilsService: RouterUtilsService,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private nepaliToEnglishPipe: NepaliToEngNumberPipe,
      private nepaliNumber: NepaliNumberPipe,
  ) { }
  form: FormGroup;
  cadCheckListEnum = CadCheckListTemplateEnum;
  initialInfoPrint;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId;
  @Input() customerLoanId;


  spinner = false;
  nepaliData;
  individual = false;
  amount;
  ngOnInit() {
    if (this.cadData.assignedLoan[0].loanCategory === 'INDIVIDUAL') {
      this.individual = true;
    }
  this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          this.initialInfoPrint = JSON.parse(singleCadFile.supportedInformation);
        }
      });
    }
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.fillForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      year: [undefined],
      month: [undefined],
      day: [undefined],
      name: [undefined],
      // address: [undefined],
      amount: [undefined],
      amountInWords: [undefined],
      branch: [undefined],
      nameOfIndividualDeclaration: [undefined],
      permanentAddressOfIndividualDeclaration: [undefined],
      individualPerMunicipality: [undefined],
      individualPerWard: [undefined],
      individualPerTole: [undefined],
      temporaryAddressOfIndividualDeclaration: [undefined],
      individualTempMunicipality: [undefined],
      individualTempWard: [undefined],
      individualTempTole: [undefined],
      nameOfInstitutionDeclaration: [undefined],
      signatureOfProprietor: [undefined],
      permanentAddressOfInstitutionDeclaration: [undefined],
      institutionPerMunicipality: [undefined],
      institutionPerWard: [undefined],
      institutionPerTole: [undefined],
      temporaryAddressOfInstitutionDeclaration: [undefined],
      institutionTempMunicipality: [undefined],
      institutionTempWard: [undefined],
      institutionTempTole: [undefined]
    });
  }
  setFreeText() {
    const freeText = {
      year: this.form.get('year') ? this.form.get('year').value : '',
      month: this.form.get('month') ? this.form.get('month').value : '',
      day: this.form.get('day') ? this.form.get('day').value : ''
    };
    return JSON.stringify(freeText);
  }
  fillForm() {
    if  (!ObjectUtil.isEmpty(this.nepaliData)) {
      this.form.patchValue({
        year: this.initialInfoPrint ? this.initialInfoPrint.year : '',
        month: this.initialInfoPrint ? this.initialInfoPrint.month : '',
        day: this.initialInfoPrint ? this.initialInfoPrint.day : '',
        name: [undefined],
        // address: [undefined],
        amount: this.nepaliData.miscellaneousDetail ? this.nepaliData.miscellaneousDetail.loanAmountInFig : '',
        amountInWords: this.nepaliData.miscellaneousDetail ? this.nepaliData.miscellaneousDetail.loanAmountInWord : '',
        branch: this.nepaliData.branchDetail ? this.nepaliData.branchDetail.branchNameInNepali : '',
        nameOfIndividualDeclaration: this.nepaliData.nepaliName ? this.nepaliData.nepaliName : '',
        permanentAddressOfIndividualDeclaration: this.nepaliData.customerPermanentAddress ? this.nepaliData.customerPermanentAddress.district : '',
        individualPerMunicipality: this.nepaliData.customerPermanentAddress ? this.nepaliData.customerPermanentAddress.municipality : '',
        individualPerWard: this.nepaliData.customerPermanentAddress ? this.nepaliData.customerPermanentAddress.wardNo : '',
        individualPerTole: this.nepaliData.customerPermanentAddress ? this.nepaliData.customerPermanentAddress.tole : '',
        temporaryAddressOfIndividualDeclaration: this.nepaliData.customerTemporaryAddress ? this.nepaliData.customerTemporaryAddress.district : '',
        individualTempMunicipality: this.nepaliData.customerTemporaryAddress ? this.nepaliData.customerTemporaryAddress.municipality : '',
        individualTempWard: this.nepaliData.customerTemporaryAddress ? this.nepaliData.customerTemporaryAddress.wardNo : '',
        individualTempTole: this.nepaliData.customerTemporaryAddress ? this.nepaliData.customerTemporaryAddress.tole : '',
        nameOfInstitutionDeclaration: this.nepaliData.nepaliName ? this.nepaliData.nepaliName : '',
        signatureOfProprietor: [undefined],
        permanentAddressOfInstitutionDeclaration: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.district : '',
        institutionPerMunicipality: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.municipality : '',
        institutionPerWard: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.institutionRegisteredAddress.wardNo : '',
        institutionPerTole: this.nepaliData.institutionRegisteredAddress ? this.nepaliData.customerPermanentAddress.tole : '',
        temporaryAddressOfInstitutionDeclaration: this.nepaliData.institutionCurrentAddress ? this.nepaliData.institutionCurrentAddress.district : '',
        institutionTempMunicipality: this.nepaliData.institutionCurrentAddress ? this.nepaliData.institutionCurrentAddress.municipality : '',
        institutionTempWard: this.nepaliData.institutionCurrentAddress ? this.nepaliData.institutionCurrentAddress.wardNo : '',
        institutionTempTole: this.nepaliData.institutionCurrentAddress ? this.nepaliData.institutionCurrentAddress.tole : '',

      });
    }
  }
  submit() {
    this.spinner = true;
    let flag = true;
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          flag = false;
          singleCadFile.supportedInformation = this.setFreeText();
        }
      });
      if (flag) {
        const cadFile = new CadFile();
        const document = new Document();
        cadFile.supportedInformation = this.setFreeText();
        document.id = this.documentId;
        cadFile.cadDocument = document;
        cadFile.customerLoanId = this.customerLoanId;
        this.cadData.cadFileList.push(cadFile);
      }
    } else {
      const cadFile = new CadFile();
      const document = new Document();
      document.id = this.documentId;
      cadFile.cadDocument = document;
      cadFile.customerLoanId = this.customerLoanId;
      this.cadData.cadFileList.push(cadFile);
    }

    this.administrationService.saveCadDocumentBulk(this.cadData).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.dialogRef.close();
      this.spinner = false;
    });
  }
  // amountChange(e) {
  //     this.form.patchValue({
  //       amountInWords: this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglishPipe.transform(e.target.value))
  //     });
  // }
}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';

@Component({
  selector: 'app-cross-guarantee-bond',
  templateUrl: './cross-guarantee-bond.component.html',
  styleUrls: ['./cross-guarantee-bond.component.scss']
})
export class CrossGuaranteeBondComponent implements OnInit {
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

  constructor(private dialogRef: NbDialogRef<CrossGuaranteeBondComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService) {
  }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
  }

  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
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


  buildForm() {
    this.form = this.formBuilder.group({
      branchName: [undefined],
      regOffice: [undefined],
      date: [undefined],
      praliNo: [undefined],
      regDistrict: [undefined],
      regMunicipality: [undefined],
      regWadNo: [undefined],
      district: [undefined],
      municipality: [undefined],
      wadNo: [undefined],
      fromPersonNAme: [undefined],
      sanchalakName: [undefined],
      husbandName: [undefined],
      sasuraName: [undefined],
      middleDistrict: [undefined],
      middleMunicipality: [undefined],
      middleWadNo: [undefined],
      permanentDistrict: [undefined],
      permanentMuniciplaity: [undefined],
      permanentWadNo: [undefined],
      age: [undefined],
      dhitoGuarantor: [undefined],
      banijyaOffice: [undefined],
      middleDate: [undefined],
      middlePraliNo: [undefined],
      middleRegDistrict: [undefined],
      middleRegMunicipality: [undefined],
      middleRegWadNo: [undefined],
      buttonDistrict: [undefined],
      buttonMunicipality: [undefined],
      buttonWadNo: [undefined],
      buttonPersonName: [undefined],
      buttonSanchalakName: [undefined],
      buttonHusbandName: [undefined],
      buttonSasuraName: [undefined],
      downDistrictName: [undefined],
      downMunicipalityName: [undefined],
      downWadno: [undefined],
      downTempDistrict: [undefined],
      downTempMunicplaity: [undefined],
      downTempWadNo: [undefined],
      downAge: [undefined],
      downDebtorName: [undefined],
      downguarantor: [undefined],
      chaNo: [undefined],
      BS: [undefined],
      amount: [undefined],
      amountInWord: [undefined],
      mapoka: [undefined],
      buttonBS: [undefined],
      RNo: [undefined],
      buttonChaNo: [undefined],
      buttonBsDate: [undefined],
      karja: [undefined],
      buttonAmount: [undefined],
      buttonAmountInWord: [undefined],
      landownerName: [undefined],
      landownerParentName: [undefined],
      landownerSasuraName: [undefined],
      tableDistrict: [undefined],
      tableMunicipality: [undefined],
      tableWadNo: [undefined],
      tableKeyNo: [undefined],
      tableLandArea: [undefined],
      tableComment: [undefined],
      itsisambatYear: [undefined],
      itsisambatMonth: [undefined],
      itsisambatDate: [undefined],
      itsisambatRojSubham: [undefined]


    });
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

}

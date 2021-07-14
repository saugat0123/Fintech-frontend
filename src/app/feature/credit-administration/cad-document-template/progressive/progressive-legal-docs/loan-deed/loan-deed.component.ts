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
  selector: 'app-loan-deed',
  templateUrl: './loan-deed.component.html',
  styleUrls: ['./loan-deed.component.scss']
})
export class LoanDeedComponent implements OnInit {
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


  constructor(private dialogRef: NbDialogRef<LoanDeedComponent>,
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
      district: [undefined],
      municipality: [undefined],
      wadNo: [undefined],
      branchName: [undefined],
      grandParentName: [undefined],
      parentName: [undefined],
      husbandWifeName: [undefined],
      likhitDistrict: [undefined],
      likhitMunicipalty: [undefined],
      likhitWadNo: [undefined],
      sabikVDC: [undefined],
      sabikWadNo: [undefined],
      tempVDC: [undefined],
      tempWadNo: [undefined],
      age: [undefined],
      customerName: [undefined],
      citizenshipNo: [undefined],
      date: [undefined],
      cdoOffice: [undefined],
      mantralayaName: [undefined],
      biBhag: [undefined],
      regOffice: [undefined],
      act: [undefined],
      underName: [undefined],
      underDate: [undefined],
      praliNo: [undefined],
      sewaKaryalaya: [undefined],
      lekhaNumDate: [undefined],
      certficateNo: [undefined],
      certifiedDistrict: [undefined],
      certifiedMunicipality: [undefined],
      certifiedWadNo: [undefined],
      certifiedRegOffice: [undefined],
      certifiedGrandParentName: [undefined],
      certifiedParentName: [undefined],
      certifiedHusbandWifeName: [undefined],
      certifiedPersonDistrict: [undefined],
      certifiedPersonMunicipality: [undefined],
      certifiedPersonWadNo: [undefined],
      certifiedPersonTempDistrict: [undefined],
      certifiedPersonTempVDC: [undefined],
      certifiedPersonTempWadNo: [undefined],
      certifiedPersonAge: [undefined],
      certifiedPersonName: [undefined],
      certifiedPersonCitizenshipNo: [undefined],
      certifiedDate: [undefined],
      certifiedCdoOffice: [undefined],
      namjariDate: [undefined],
      approvedSubidhakisim: [undefined],
      approvedAmount: [undefined],
      approvedCommision: [undefined],
      approvedLoanTime: [undefined],
      SecuritiesSN: [undefined],
      SecuritiesSNBibaran: [undefined],
      SecuritiesDistrict: [undefined],
      SecuritiesMunicipality: [undefined],
      SecuritiesWadNo: [undefined],
      SecuritiesKeyNo: [undefined],
      SecuritiesArea: [undefined],
      SecuritiesRegNo: [undefined],
      SecuritiesOwnerName: [undefined],
      itiSambatYear: [undefined],
      itiSambatMonth: [undefined],
      itiSambatDate: [undefined],
      itiSambatTime: [undefined],
      itiSambatRoj: [undefined]

    });
  }


}

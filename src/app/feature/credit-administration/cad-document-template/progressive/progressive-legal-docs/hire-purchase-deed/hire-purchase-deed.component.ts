import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';


@Component({
  selector: 'app-hire-purchase-deed',
  templateUrl: './hire-purchase-deed.component.html',
  styleUrls: ['./hire-purchase-deed.component.scss']
})
export class HirePurchaseDeedComponent implements OnInit {
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

  constructor(private dialogRef: NbDialogRef<HirePurchaseDeedComponent>,
              private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private administrationService: CreditAdministrationService,
              private toastService: ToastService,
              private routerUtilsService: RouterUtilsService,
              private customerOfferLetterService: CustomerOfferLetterService,) {
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
      districtName: [undefined],
      municipalityName: [undefined],
      wadNo: [undefined],
      branchName: [undefined],
      grandParentName: [undefined],
      parentName: [undefined],
      husbandWifeName: [undefined],
      customerDistrict: [undefined],
      customerMunicipality: [undefined],
      customerWadNo: [undefined],
      sabikVDC: [undefined],
      sabikWadNo: [undefined],
      tempMunicipality: [undefined],
      tempWadNo: [undefined],
      age: [undefined],
      customerName: [undefined],
      customerCitizenshipNo: [undefined],
      date: [undefined],
      cdoOffice: [undefined],
      matralayaName: [undefined],
      biBhagCompany: [undefined],
      regOffice: [undefined],
      act: [undefined],
      under: [undefined],
      underDate: [undefined],
      praliNo: [undefined],
      serviceOffice: [undefined],
      serviceDate: [undefined],
      certificateNo: [undefined],
      certifiedDistrict: [undefined],
      certifiedMunicipality: [undefined],
      certifiedWadNo: [undefined],
      secRegOffice: [undefined],
      pratinidhiGrandParent: [undefined],
      pratinidhiParent: [undefined],
      pratinidhiHusbandWifeName: [undefined],
      pratinidhiDistrict: [undefined],
      pratinidhiMunicipality: [undefined],
      pratinidhiWadNo: [undefined],
      pratinidhiTempDistrict: [undefined],
      pratinidhiTempMunicipality: [undefined],
      pratinidhiTempWadNo: [undefined],
      pratinidhiAge: [undefined],
      pratinidhiName: [undefined],
      pratinidhiCitizenshipNo: [undefined],
      pratinidhiDate: [undefined],
      pratinidhiCDOoffice: [undefined],
      kistabandiBranchName: [undefined],
      kistabandiBranchAddress: [undefined],
      tapsilSN: [undefined],
      sawariPrakar: [undefined],
      engineNo: [undefined],
      chasisNo: [undefined],
      regNo: [undefined],
      regDate: [undefined],
      sincerlySign: [undefined],
      akhtiyarName: [undefined],
      akhtiyarCitizenshipNo: [undefined],
      akhtiyarDate: [undefined],
      akhtiyarMuniciplity: [undefined],
      akhtiyarPermanentDistrict: [undefined],
      akhtiyarPermanentMunicipality: [undefined],
      akhtiyarPermanentWadNo: [undefined],
      akhtiyarSabikVDC: [undefined],
      akhtiyarSabikWadNo: [undefined],
      akhtiyarTempDistrict: [undefined],
      akhtiyarTempMunicipality: [undefined],
      akhtiyarTempWadNo: [undefined],
      sicerlyFatherName: [undefined],
      sicerlyMotherName: [undefined],
      sicerlyGrandFatherName: [undefined],
      sicerlyGrandMotherName: [undefined],
      sicerlyHusbandName: [undefined],
      sicerlyWifeNAme: [undefined],
      sanakhatPersonName: [undefined],
      sanakhatPersonSymNo: [undefined],
      itisambatYear: [undefined],
      itisambatMonth: [undefined],
      itisambatDate: [undefined],
      itisambatTime: [undefined],
      itisambatSubham: [undefined],
      guarantorDetail: this.formBuilder.array([])
    });
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

  setGuarantors(data) {
    const formArray = this.form.get('guarantorDetail') as FormArray;
    if (data.length === 0) {
      this.addMoreGuarantor();
      return;
    }
    data.forEach(value => {
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

  addMoreGuarantor(): void {
    const formArray = this.form.get('guarantorDetail') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetail') as FormArray;
    formArray.removeAt(index);
  }


}

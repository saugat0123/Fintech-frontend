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
              private routerUtilsService: RouterUtilsService) {
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
          this.setGuarantors(initialInfo.guarantorDetail);
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

      this.form.patchValue({
        districtName: this.nepaliData.branchDistrict ? this.nepaliData.branchDistrict : '',
        municipalityName: this.nepaliData.branchMunVdc ? this.nepaliData.branchMunVdc : '',
        wadNo: this.nepaliData.branchWardNo ? this.nepaliData.branchWardNo : '',
        branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        grandParentName: this.nepaliData.grandFatherName ? this.nepaliData.grandFatherName : '',
        parentName: this.nepaliData.fatherName ? this.nepaliData.fatherName : '',
        customerDistrict: this.nepaliData.district ? this.nepaliData.district : '',
        customerMunicipality: this.nepaliData.municipalities ? this.nepaliData.municipalities : '',
        customerWadNo: this.nepaliData.wardNumber ? this.nepaliData.wardNumber : '',
        // sabikVDC: this.nepaliData.name ? this.nepaliData.name : '', ?????
        // sabikWadNo: this.nepaliData.name ? this.nepaliData.name : '', ?????
        tempMunicipality: this.nepaliData.temporaryMunicipalities ? this.nepaliData.temporaryMunicipalities : '',
        tempWadNo: this.nepaliData.temporaryWard ? this.nepaliData.temporaryWard : '',
        // age: this.nepaliData.name ? this.nepaliData.name : '',????
        // customerName: this.nepaliData.name ? this.nepaliData.name : '',????
        customerCitizenshipNo: this.nepaliData.citizenshipNo ? this.nepaliData.citizenshipNo : '',
        // date: this.nepaliData.name ? this.nepaliData.name : '',????
        // cdoOffice: this.nepaliData.name ? this.nepaliData.name : '',??????
        // matralayaName: this.nepaliData. ? this.nepaliData. : '',
        // biBhagCompany: this.nepaliData. ? this.nepaliData. : '',
        // regOffice: this.nepaliData. ? this.nepaliData. : '',
        // act: this.nepaliData. ? this.nepaliData. : '',
        // under: this.nepaliData. ? this.nepaliData. : '',
        // underDate: this.nepaliData. ? this.nepaliData. : '',
        // praliNo: this.nepaliData. ? this.nepaliData. : '',
        // serviceOffice: this.nepaliData. ? this.nepaliData. : '',
        // serviceDate: this.nepaliData. ? this.nepaliData. : '',
        // certificateNo: this.nepaliData. ? this.nepaliData. : '',
        // certifiedDistrict: this.nepaliData. ? this.nepaliData. : '',
        // certifiedMunicipality: this.nepaliData. ? this.nepaliData. : '',
        // certifiedWadNo: this.nepaliData. ? this.nepaliData. : '',
        // secRegOffice: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiGrandParent: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiParent: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiHusbandWifeName: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiDistrict: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiMunicipality: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiWadNo: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiTempDistrict: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiTempMunicipality: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiTempWadNo: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiAge: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiName: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiCitizenshipNo: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiDate: this.nepaliData. ? this.nepaliData. : '',
        // pratinidhiCDOoffice: this.nepaliData. ? this.nepaliData. : '',

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
      guarantorDetail: this.formBuilder.array([]),
      witnessName: [undefined],
      witnessCitizenshipNo: [undefined],
      witnessCitizenshipIssueDate: [undefined],
      witnessCDOoffice: [undefined],
      witnessIssuedPlace: [undefined],
      witnessMunicipality: [undefined],
      witnessWardNo: [undefined],
      witnessName1: [undefined],
      witnessCitizenshipNo1: [undefined],
      witnessCitizenshipIssueDate1: [undefined],
      witnessCDOoffice1: [undefined],
      witnessIssuedPlace1: [undefined],
      witnessMunicipality1: [undefined],
      witnessWardNo1: [undefined]
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

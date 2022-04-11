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
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';

@Component({
  selector: 'app-hypothecation-of-goods-and-receivables-b',
  templateUrl: './hypothecation-of-goods-and-receivables-b.component.html',
  styleUrls: ['./hypothecation-of-goods-and-receivables-b.component.scss']
})
export class HypothecationOfGoodsAndReceivablesBComponent implements OnInit {
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
  loanAmount;

  constructor(private dialogRef: NbDialogRef<HypothecationOfGoodsAndReceivablesBComponent>,
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
    this.loanAmount = JSON.parse(this.cadData.nepData);
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          //this.setGuarantors(initialInfo.guarantorDetail);
          if (!ObjectUtil.isEmpty(initialInfo.samaanBibaran)) {
            this.setSamaanBibaran(initialInfo.samaanBibaran);
          }
          this.form.patchValue(this.initialInfoPrint);
        }
      });
    }

    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.nepaliData = JSON.parse(this.cadData.loanHolder.nepData);

      this.form.patchValue({
        districtName: this.nepaliData.branchDistrict ? this.nepaliData.branchDistrict : '',
        municipalityName: this.nepaliData.branchMunVdc ? this.nepaliData.branchMunVdc : '',
        wardNo: this.nepaliData.branchWardNo ? this.nepaliData.branchWardNo : '',
        branchName: this.nepaliData.branchName ? this.nepaliData.branchName : '',
        matralayaName: this.nepaliData.ministryOfGovernmentOfNepal ? this.nepaliData.ministryOfGovernmentOfNepal : '',
        bibhagCompany: this.nepaliData.department ? this.nepaliData.department : '',
        regOffice: this.nepaliData.companyRegistrarOfficeDistrict ? this.nepaliData.companyRegistrarOfficeDistrict : '',
        act:  this.nepaliData.nameOfRegisteringAct ? this.nepaliData.nameOfRegisteringAct : '',
        actDate: this.nepaliData.yearOfActEnactment ? this.nepaliData.yearOfActEnactment : '',
        pvtNo: this.nepaliData.registrationDate ? this.nepaliData.registrationDate : '',
        karDataKaryalaya: this.nepaliData.companyRegistrationNo ? this.nepaliData.companyRegistrationNo : '',
        karDataDate: this.nepaliData.taxPayerServiceOffice ? this.nepaliData.taxPayerServiceOffice : '',
        sthaiLekhaNo: this.nepaliData.panRegistrationDate ? this.nepaliData.panRegistrationDate : '',
        pramanPatraNo: this.nepaliData.panNo ? this.nepaliData.panNo : '',
        pramanPatraDistrict: this.nepaliData.companyDistrict ? this.nepaliData.companyDistrict : '',
        pramanPatraMunicipality: this.nepaliData.companyVdcMun ? this.nepaliData.companyVdcMun : '',
        pramanPatraWadNo: this.nepaliData.companyWardNo ? this.nepaliData.companyWardNo : '',
        secSecurityOffice: this.nepaliData.companyName ? this.nepaliData.companyName : '',
        sanchalak: this.nepaliData.representativeGrandFatherName ? this.nepaliData.representativeGrandFatherName : '',
        pratinidhiGrandSon: this.nepaliData.representativeFatherName ? this.nepaliData.representativeFatherName : '',
        pratinidhiDistrict: this.nepaliData.representativePermanentDistrict ? this.nepaliData.representativePermanentDistrict : '',
        pratinidhiMunicipality: this.nepaliData.representativePermanentMunicipality ? this.nepaliData.representativePermanentMunicipality : '',
        pratinidhiWard: this.nepaliData.representativePermanentWard ? this.nepaliData.representativePermanentWard : '',
        pratinidhiPermDistrict: this.nepaliData.representativeTemporaryDistrict ? this.nepaliData.representativeTemporaryDistrict : '',
        pratinidhiPermMunicipality: this.nepaliData.representativeTemporaryMunicipality ? this.nepaliData.representativeTemporaryMunicipality : '',
        pratinidhiPermWard: this.nepaliData.representativeTemporaryWard ? this.nepaliData.representativeTemporaryWard : '',
        customerName: this.nepaliData.representativeName ? this.nepaliData.representativeName : '',
        customerCitizenShipNo: this.nepaliData.representativeCitizenshipNo ? this.nepaliData.representativeCitizenshipNo : '',
        customerCitizenShipDate: this.nepaliData.representativeCitizenshipIssueDate ? this.nepaliData.representativeCitizenshipIssueDate : '',
        customerCitizenShipDistrict: this.nepaliData.representativeCitizenshipIssuingAuthority ? this.nepaliData.representativeCitizenshipIssuingAuthority : '',
        karjaRu: !ObjectUtil.isEmpty(this.loanAmount) ? this.loanAmount.numberNepali : '',
        karjaRuWord: !ObjectUtil.isEmpty(this.loanAmount) ? this.loanAmount.nepaliWords : '',
        sawikMunicipality: this.nepaliData.representativePermanentVdc ? this.nepaliData.representativePermanentVdc : '',
        sawikWard: this.nepaliData.representativePermanentVdcWard ? this.nepaliData.representativePermanentVdcWard : '',
        pratinidhiSpouse: this.nepaliData.representativeHusbandWifeName ? this.nepaliData.representativeHusbandWifeName : '',
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
      wardNo: [undefined],
      branchName: [undefined],
      matralayaName: [undefined],
      bibhagCompany: [undefined],
      regOffice: [undefined],
      act: [undefined],
      actUnder: [undefined],
      actDate: [undefined],
      pvtNo: [undefined],
      karDataKaryalaya: [undefined],
      karDataDate: [undefined],
      sthaiLekhaNo: [undefined],
      pramanPatraNo: [undefined],
      pramanPatraDistrict: [undefined],
      pramanPatraMunicipality: [undefined],
      pramanPatraWadNo: [undefined],
      secSecurityOffice: [undefined],
      sanchalak: [undefined],
      pratinidhiGrandSon: [undefined],
      pratinidhiSpouse: [undefined],
      pratinidhiDistrict: [undefined],
      pratinidhiMunicipality: [undefined],
      pratinidhiWard: [undefined],
      pratinidhiPermDistrict: [undefined],
      pratinidhiPermMunicipality: [undefined],
      pratinidhiPermWard: [undefined],
      customerAge: [undefined],
      customerName: [undefined],
      customerCitizenShipNo: [undefined],
      customerCitizenShipDate: [undefined],
      customerCitizenShipDistrict: [undefined],
      dhaniBittiyaSanthaDate: [undefined],
      karjaRu: [undefined],
      karjaRuWord: [undefined],
      tapsilMulyaRu: [undefined],
      tapsilMulyaWord: [undefined],
      signName: [undefined],
      signCitizenNo: [undefined],
      signDate: [undefined],
      signDistrictOffice: [undefined],
      permDistrict: [undefined],
      permMunicipality: [undefined],
      permWard: [undefined],
      sawikMunicipality: [undefined],
      sawikWard: [undefined],
      currentDistrict: [undefined],
      currentMunicipality: [undefined],
      currentWard: [undefined],
      signFatherName: [undefined],
      signGrandFatherName: [undefined],
      signHusbandName: [undefined],
      sanakhatPersonName: [undefined],
      sanakhatPersonSymNo: [undefined],
      itisambatYear: [undefined],
      itisambatMonth: [undefined],
      itisambatDate: [undefined],
      itisambatTime: [undefined],
      itisambatSubham: [undefined],
      guarantorDetail: this.formBuilder.array([]),
      samaanBibaran: this.formBuilder.array([]),
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

  samaanBibaranFormGroup(): FormGroup {
    return this.formBuilder.group({
      tapsilBibaran: [undefined],
      tapsilMulya: [undefined]
    });
  }

  setSamaanBibaran(data) {
    const formArray = this.form.get('samaanBibaran') as FormArray;
    if (data.length === 0) {
      this.addMoreSamaanBibaran();
      return;
    }
    data.forEach(value => {
      formArray.push(this.formBuilder.group({
        tapsilBibaran: [value.tapsilBibaran],
        tapsilMulya: [value.tapsilMulya],
      }));
    });
  }

  addMoreSamaanBibaran(): void {
    const formArray = this.form.get('samaanBibaran') as FormArray;
    formArray.push(this.samaanBibaranFormGroup());
  }

  removeSamaanBibaran(index: number): void {
    const formArray = this.form.get('samaanBibaran') as FormArray;
    formArray.removeAt(index);
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
}

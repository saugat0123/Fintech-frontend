import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerOfferLetter} from '../../../../../loan/model/customer-offer-letter';
import {OfferDocument} from '../../../../model/OfferDocument';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {NbDialogRef} from '@nebular/theme';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {CustomerOfferLetterService} from '../../../../../loan/service/customer-offer-letter.service';

@Component({
  selector: 'app-mortgage-deed-corporate',
  templateUrl: './mortgage-deed-corporate.component.html',
  styleUrls: ['./mortgage-deed-corporate.component.scss']
})
export class MortgageDeedCorporateComponent implements OnInit {
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
  constructor(
      private dialogRef: NbDialogRef<MortgageDeedCorporateComponent>,
      private formBuilder: FormBuilder,
      private nepToEngNumberPipe: NepaliToEngNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private administrationService: CreditAdministrationService,
      private toastService: ToastService,
      private routerUtilsService: RouterUtilsService,
      private customerOfferLetterService: CustomerOfferLetterService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.fillForm();
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
  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
  addRinBibaran(): void {
    const formArray = this.form.get('rinBibaran') as FormArray;
    formArray.push(this.rinBibaranFormGroup());
  }
  setRinBibaran(data) {
    const formArray = this.form.get('rinBibaran') as FormArray;
    if (data.length === 0) {
      this.addRinBibaran();
      return;
    }
    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        creditorNameNepali2: [undefined],
        creditorNameEnglish2: [undefined],
        dateOfReg: [undefined],
        nameOfCorporate: [undefined],
        placeOfCorporate: [undefined],
        praLiNo: [undefined],
        panNumber: [undefined],
        dateOfReg2: [undefined],
        regCorporate: [undefined],
        placeOfRegCorporate: [undefined],
        proprietorNameInNep: [undefined],
        proprietorNameInEng: [undefined],
        proprietorCitizenNo: [undefined],
        dateOfIssue: [undefined],
        placeOfIssue: [undefined],
        address1: [undefined],
      }));
    });
  }
  addSampatiBibaran(): void {
    const formArray = this.form.get('sampatiBibaran') as FormArray;
    formArray.push(this.sampatiBibaranFormGroup());
  }
  setSampatiBibaran(data) {
    const formArray = this.form.get('sampatiBibaran') as FormArray;
    if (data.length === 0) {
      this.addSampatiBibaran();
      return;
    }
    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        jaggaPradeshNo: [undefined],
        jaggaDistrict: [undefined],
        sawikDistrict: [undefined],
        sawikMunicipality: [undefined],
        sawikWardNo: [undefined],
        sawikTole: [undefined],
        halDistrict: [undefined],
        halMunicipality: [undefined],
        halWardNo: [undefined],
        halTole: [undefined],
        seatNo: [undefined],
        kittaNoAnka: [undefined],
        kittaNoWord: [undefined],
        Khanda: [undefined],
        area: [undefined],
        type: [undefined],
        kaifiyat: [undefined]
      }));
    });
  }
  rinBibaranFormGroup(): FormGroup {
    return  this.formBuilder.group({
      creditorNameNepali2: [undefined],
      creditorNameEnglish2: [undefined],
      dateOfReg: [undefined],
      nameOfCorporate: [undefined],
      placeOfCorporate: [undefined],
      praLiNo: [undefined],
      panNumber: [undefined],
      dateOfReg2: [undefined],
      regCorporate: [undefined],
      placeOfRegCorporate: [undefined],
      proprietorNameInNep: [undefined],
      proprietorNameInEng: [undefined],
      proprietorCitizenNo: [undefined],
      dateOfIssue: [undefined],
      placeOfIssue: [undefined],
      address1: [undefined],
    });
  }
  sampatiBibaranFormGroup(): FormGroup {
    return  this.formBuilder.group({
      jaggaPradeshNo: [undefined],
      jaggaDistrict: [undefined],
      sawikDistrict: [undefined],
      sawikMunicipality: [undefined],
      sawikWardNo: [undefined],
      sawikTole: [undefined],
      halDistrict: [undefined],
      halMunicipality: [undefined],
      halWardNo: [undefined],
      halTole: [undefined],
      seatNo: [undefined],
      kittaNoAnka: [undefined],
      kittaNoWord: [undefined],
      Khanda: [undefined],
      area: [undefined],
      type: [undefined],
      kaifiyat: [undefined]
    });
  }
  removeRinBibaran(index: number): void {
    const formArray = this.form.get('rinBibaran') as FormArray;
    formArray.removeAt(index);
  }
  removeSampatiBibaran(index: number): void {
    const formArray = this.form.get('sampatiBibaran') as FormArray;
    formArray.removeAt(index);
  }
  fillForm() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
      this.cadData.cadFileList.forEach(singleCadFile => {
        if (singleCadFile.customerLoanId === this.customerLoanId && singleCadFile.cadDocument.id === this.documentId) {
          const initialInfo = JSON.parse(singleCadFile.initialInformation);
          this.initialInfoPrint = initialInfo;
          if (!ObjectUtil.isEmpty(initialInfo.rinBibaran)) {
            this.setRinBibaran(initialInfo.rinBibaran);
          }
          if (!ObjectUtil.isEmpty(initialInfo.sampatiBibaran)) {
            this.setSampatiBibaran(initialInfo.sampatiBibaran);
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
  buildForm() {
    this.form = this.formBuilder.group({
      tokenDartaNo: [undefined],
      regNo: [undefined],
      creditorName: [undefined],
      tokenDartaDate1: [undefined],
      tokenDartaDate2: [undefined],
      districtName: [undefined],
      municipalityName: [undefined],
      wardNo: [undefined],
      branchName: [undefined],
      dhitoName: [undefined],
      aageChreditor: [undefined],
      upabhogRu: [undefined],
      upabhogRuWord: [undefined],
      jyayeJethaRu: [undefined],
      jyayeJethaRuWord: [undefined],
      creditorNameNepali1: [undefined],
      creditorNameEnglish1: [undefined],
      dartaOfReg1: [undefined],
      praLiNo1: [undefined],
      dartaOffice: [undefined],
      address: [undefined],
      panNo1: [undefined],
      dartaMiti1: [undefined],
      dartaOffice1: [undefined],
      RegOfficeAddress1: [undefined],
      propNameNepali1: [undefined],
      propNameEnglish1: [undefined],
      propCitizenNo1: [undefined],
      propCitizenJariDate1: [undefined],
      propCitizenJariOffice1: [undefined],
      propAddress1: [undefined],
      branchNep1: [undefined],
      branchEng1: [undefined],
      propNameNepali2: [undefined],
      propNameEnglish2: [undefined],
      propCitizenNo2: [undefined],
      propCitizenJariDate2: [undefined],
      propCitizenJariOffice2: [undefined],
      propAddress2: [undefined],
      kittaNo: [undefined],
      chaluArthikBarsa: [undefined],
      itisambatYear: [undefined],
      itisambatMonth: [undefined],
      itisambatDay: [undefined],
      itisambatTime: [undefined],
      itisambatShubam: [undefined],
      dhitoSurakchanKarta: [undefined],
      dhitoSurakchanKartaName: [undefined],
      karmachariName1: [undefined],
      karmachariPosition1: [undefined],
      karmachariDate1: [undefined],
      karmachariName2: [undefined],
      karmachariPosition2: [undefined],
      karmachariDate2: [undefined],
      jaggaMinimumPrice: [undefined],
      karmachariName3: [undefined],
      karmachariPosition3: [undefined],
      karmachariDate3: [undefined],
      regNo2: [undefined],
      paritDate: [undefined],
      tokenDartaNo2: [undefined],
      date: [undefined],
      karobatThailiRu: [undefined],
      regDasturRu: [undefined],
      lavKar: [undefined],
      anyaKar: [undefined],
      rasidNo: [undefined],
      malpotKaryalaya: [undefined],
      doormukam: [undefined],
      paritMiti: [undefined],
      paritName: [undefined],
      paritPosition: [undefined],
      fatwalaMiti: [undefined],
      fatwalaName: [undefined],
      fatwalaPosition: [undefined],
      name: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWadNo: [undefined],
      name1: [undefined],
      citizenNumber1: [undefined],
      issuedYear1: [undefined],
      guarantorCDOoffice1: [undefined],
      guarantorDistrict1: [undefined],
      guarantorMunicipality1: [undefined],
      guarantorWadNo1: [undefined],
      rinBibaran: this.formBuilder.array([]),
      sampatiBibaran: this.formBuilder.array([]),
      jillaName: [undefined],
      cityName: [undefined],
      wodaNum: [undefined],
      jillaName2: [undefined]

    });
  }
}

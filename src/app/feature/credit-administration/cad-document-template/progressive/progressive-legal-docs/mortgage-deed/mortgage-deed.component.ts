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
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ProgressiveLegalDocConst} from '../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';

@Component({
  selector: 'app-mortgage-deed',
  templateUrl: './mortgage-deed.component.html',
  styleUrls: ['./mortgage-deed.component.scss']
})
export class MortgageDeedComponent implements OnInit {
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

  constructor(private dialogRef: NbDialogRef<MortgageDeedComponent>,
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
      dartaDate1: [undefined],
      praliNo1: [undefined],
      dartaOfficeAndAddress1: [undefined],
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
      creditorNameNepali2: [undefined],
      creditorNameEnglish2: [undefined],
      dateOfBirth1: [undefined],
      address1: [undefined],
      sex1: [undefined],
      creditorCitizenshipNo1: [undefined],
      creditorCitizenshipIssueDate1: [undefined],
      creditorCitizenshipIssueOffice1: [undefined],
      creditorCitizenshipOfficeAddress1: [undefined],
      creditorMobileNo1: [undefined],
      creditorFatherName1: [undefined],
      creditorMotherName1: [undefined],
      creditorSpouse1: [undefined],
      creditorGrandFatherName1: [undefined],
      creditorGrandMotherName1: [undefined],
      creditorNameNepali3: [undefined],
      creditorNameEnglish3: [undefined],
      dartaDate2: [undefined],
      praliNo2: [undefined],
      dartaOfficeAndAddress2: [undefined],
      panNo2: [undefined],
      dartaMiti2: [undefined],
      dartaOffice2: [undefined],
      RegOfficeAddress2: [undefined],
      propNameNepali2: [undefined],
      propNameEnglish2: [undefined],
      propCitizenNo2: [undefined],
      propCitizenJariDate2: [undefined],
      propCitizenJariOffice2: [undefined],
      propAddress2: [undefined],
      creditorNameNepali4: [undefined],
      creditorNameEnglish4: [undefined],
      dateOfBirth3: [undefined],
      address3: [undefined],
      sex3: [undefined],
      creditorCitizenshipNo2: [undefined],
      creditorCitizenshipIssueDate2: [undefined],
      creditorCitizenshipIssueOffice2: [undefined],
      creditorCitizenshipOfficeAddress2: [undefined],
      jaggaDhaniSanketNo: [undefined],
      creditorMobileNo2: [undefined],
      creditorFatherName2: [undefined],
      creditorMotherName2: [undefined],
      creditorSpouse2: [undefined],
      creditorGrandFatherName2: [undefined],
      creditorGrandMotherName2: [undefined],
      creditorNameNepali5: [undefined],
      branchName1: [undefined],
      creditorNameEnglish5: [undefined],
      branchName2: [undefined],
      dartaDate3: [undefined],
      dartaNo3: [undefined],
      dartaOfficeAndAddress3: [undefined],
      panNo3: [undefined],
      dartaMiti3: [undefined],
      dartaOffice3: [undefined],
      pratiNameNepali3: [undefined],
      pratiNameEnglish3: [undefined],
      pratiCitizenNo3: [undefined],
      pratiCitizenJariDate3: [undefined],
      pratiCitizenJariOffice3: [undefined],
      pratiAddress3: [undefined],
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
      kaifiyat: [undefined],
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
    });
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';
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

@Component({
  selector: 'app-mortgage-deed',
  templateUrl: './mortgage-deed.component.html',
  styleUrls: ['./mortgage-deed.component.scss']
})
export class MortgageDeedComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  spinner;
  form: FormGroup;
  offerLetterConst = ProgressiveOfferLetterConst;
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
              private customerOfferLetterService: CustomerOfferLetterService) { }

  ngOnInit() {
    this.buildForm();

    this.checkOfferLetter();
  }
  fillForm() {
    this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);

    this.form.patchValue({
      customerName: this.nepaliData.name ? this.nepaliData.name : '',
    });

  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      this.form.patchValue(initialInfo);
    }
  }

  onSubmit(): void {
    console.log(this.form.value);
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.MORTGAGE_DEED);
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }

    this.administrationService.saveCadDocumentBulk(this.cadOfferLetterApprovedDoc).subscribe(() => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Offer Letter'));
      this.spinner = false;
      this.dialogRef.close();
      this.routerUtilsService.reloadCadProfileRoute(this.cadOfferLetterApprovedDoc.id);
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
}

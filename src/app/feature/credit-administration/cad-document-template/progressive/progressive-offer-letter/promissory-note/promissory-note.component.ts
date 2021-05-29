import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ExcelOfferLetterConst} from '../../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';
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
  selector: 'app-promissory-note',
  templateUrl: './promissory-note.component.html',
  styleUrls: ['./promissory-note.component.scss']
})
export class PromissoryNoteComponent implements OnInit {

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

  constructor(private dialogRef: NbDialogRef<PromissoryNoteComponent>,
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
        === this.offerLetterConst.value(this.offerLetterConst.PROMISSORY_NOTE).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PROMISSORY_NOTE);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      this.form.patchValue(initialInfo);
    }
  }

  onSubmit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = CadDocStatus.OFFER_PENDING;

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(offerLetterPath => {
        if (offerLetterPath.docName.toString() ===
            this.offerLetterConst.value(this.offerLetterConst.PROMISSORY_NOTE).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.PROMISSORY_NOTE);
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

  buildForm(){
    this.form=this.formBuilder.group({
      grandParentName:[undefined],
      fatherName:[undefined],
      motherName:[undefined],
      husbandName:[undefined],
      districtName:[undefined],
      municipality:[undefined],
      wadNo:[undefined],
      temporaryDistrict:[undefined],
      tempMunicipality:[undefined],
      tempWadNo:[undefined],
      age:[undefined],
      customerName:[undefined],
      citizenShipNo:[undefined],
      date:[undefined],
      cdoOffice:[undefined],
      branchName:[undefined],
      amount:[undefined],
      amountInNumber:[undefined],
      sincerlyName:[undefined],
      sincerlySign:[undefined],
      sincerlyCitizenshipNo:[undefined],
      sincerlyDate:[undefined],
      sincerlyCDOoffice:[undefined],
      sincerlyPermanentMunicipality:[undefined],
      sincerlyPermanentDistrict:[undefined],
      sincerlyPermanentWadNo:[undefined],
      sincerlyPermanentVDCname:[undefined],
      sincerlyTemporaryDistrict:[undefined],
      sincerlyTemporaryVDCname:[undefined],
      sincerlyTemporaryWadNo:[undefined],
      sincerlyParentName:[undefined],
      sincerlyGrandParentName:[undefined],
      sincerlyHusbandWifeName:[undefined],
      guarantor1name:[undefined],
      guarantor1Sign:[undefined],
      guarantor1citizenshipNo:[undefined],
      guarantor1Date:[undefined],
      guarantor1CDOoffice:[undefined],
      guarantor1District:[undefined],
      guarantor1VDC:[undefined],
      guarantor1WadNo:[undefined],
      guarantor2name:[undefined],
      guarantor2Sign:[undefined],
      guarantor2citizenshipNo:[undefined],
      guarantor2Date:[undefined],
      guarantor2CDOoffice:[undefined],
      guarantor2District:[undefined],
      guarantor2VDC:[undefined],
      guarantor2WadNo:[undefined],
      IdentifiedGuarantorName:[undefined],
      IdentifiedHintNo:[undefined],
      ItisambatYear:[undefined],
      ItisambatMonth:[undefined],
      ItisambatDay:[undefined],
      ItisambatTime:[undefined],
      ItisambatRojSubham:[undefined],
      MinistryOffice:[undefined],
      DepartmentName:[undefined],
      RegisterOffice:[undefined],
      Act:[undefined],
      UnderName:[undefined],
      UnderDate:[undefined],
      PraliNo:[undefined],
      ServiceOfficeName:[undefined],
      certificateNo:[undefined],
      CertifiedDistrict:[undefined],
      CertifiedMunicipality:[undefined],
      CertifiedWadNo:[undefined],
      bottomGrandfatherName:[undefined],
      bottomGrandMotherName:[undefined],
        bottomFatherName:[undefined],
      bottomMotherName:[undefined],
      bottomHusbandName:[undefined],
      bottomDistrictName:[undefined],
      bottomMunicipalityName:[undefined],
      bottomWadNo:[undefined],
      bottomTempDistrict:[undefined],
      bottomTempMunicipality:[undefined],
      bottomTempWadNo:[undefined],
      bottomAge:[undefined],
      bottoCustomerName:[undefined],
      bottoCustomerCizenshipNo:[undefined],
      bottomDate:[undefined],
      bottomCDOoffice:[undefined],
      bottomBranchName:[undefined],
      bottomAmount:[undefined],
      bottomAmountInWord:[undefined],
      bottomSincerlySign:[undefined],
      AkhtiyarName:[undefined],
      bottomSincerlyCitizenShipNo:[undefined],
      bottomSincerlyDate:[undefined],
      bottomSincerlyCDOoffice:[undefined],
      AkhtiyarPermanentDistrict:[undefined],
      AkhtiyarPermanentVDC:[undefined],
      AkhtiyarPermanentWadNo:[undefined],
      SabikVDC:[undefined],
      SabikWadNo:[undefined],
      AkhtiyarTempDistrict:[undefined],
      AkhtiyarTempVDC:[undefined],
      AkhtiyarTempWadNo:[undefined],
      buttomSincerlyParentName:[undefined],
      buttomSincerlyGrandParentName:[undefined],
      buttomSincerlyHusbandName:[undefined],
      buttomguarantor1Sign:[undefined],
      buttomguarantor1name:[undefined],
      buttomguarantor1citizenshipNo:[undefined],
      buttomguarantor1Date:[undefined],
      buttomguarantor1CDOoffice:[undefined],
      buttomguarantor1District:[undefined],
      buttomguarantor1VDC:[undefined],
      buttomguarantor1WadNo:[undefined],
      buttomguarantor2Sign:[undefined],
      buttomguarantor2name:[undefined],
      buttomguarantor2citizenshipNo:[undefined],
      buttomguarantor2Date:[undefined],
      buttomguarantor2CDOoffice:[undefined],
      buttomguarantor2District:[undefined],
      buttomguarantor2VDC:[undefined],
      buttomguarantor2WadNo:[undefined],
      buttomIdentifiedGuarantorName:[undefined],
      buttomIdentifiedHintNo:[undefined],
      buttomItisambatYear:[undefined],
      buttomItisambatMonth:[undefined],
      buttomItisambatDay:[undefined],
      buttomItisambatTime:[undefined],
      buttomItisambatRojSubham:[undefined]







    })
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

}

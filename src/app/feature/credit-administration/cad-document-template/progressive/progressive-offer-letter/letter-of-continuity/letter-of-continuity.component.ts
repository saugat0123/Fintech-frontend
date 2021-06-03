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
  selector: 'app-letter-of-continuity',
  templateUrl: './letter-of-continuity.component.html',
  styleUrls: ['./letter-of-continuity.component.scss']
})
export class LetterOfContinuityComponent implements OnInit {


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
  constructor(private dialogRef: NbDialogRef<LetterOfContinuityComponent>,
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
    this.setGuarantors(this.nepaliData.guarantorDetails);
    this.setsecGuarantors(this.nepaliData.guarantorDetails);


  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_CONTINUITY).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_CONTINUITY);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      this.setGuarantors(initialInfo.guarantorDetails);
      this.setsecGuarantors(initialInfo.secguarantorDetails);
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
            this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_CONTINUITY).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.LETTER_OF_CONTINUITY);
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
      amount:[undefined],
      amountInWord:[undefined],
      sincerlyName:[undefined],
      sincerlyPermanentAddress:[undefined],
      sincerlyTempAdress:[undefined],
      ParentsName:[undefined],
      grandParentsName:[undefined],
      husbanWifeName:[undefined],
      IdentifiedGuarantorName:[undefined],
      IdentifiedHintNo:[undefined],
      ItisambatYear:[undefined],
      ItisambatMonth:[undefined],
      ItisambatDay:[undefined],
      ItisambatTime:[undefined],
      ItisambatRojSubham:[undefined],
      branchName:[undefined],
      udhyogBibhag:[undefined],
      praliNo:[undefined],
      underDate:[undefined],
      sewaKendra:[undefined],
      certificateNo:[undefined],
      regDate:[undefined],
      registeredName:[undefined],
      debtorName:[undefined],
      pratiNidhi:[undefined],
      belowAmount:[undefined],
      belowAmountInWord:[undefined],
      signaturePersonName:[undefined],
      signaturePersonCitizenshipNo:[undefined],
      signaturePersonCitizenshipIssueDate:[undefined],
      signaturePersonCDOoffice:[undefined],
      signaturePersonPermanentDistrict:[undefined],
      signaturePersonPermanentMuniciplity:[undefined],
      signaturePersonPermanentWadNo:[undefined],
      sabikVDC:[undefined],
      sabikWadNo:[undefined],
      signaturePersonTempDistrict:[undefined],
      signaturePersonTempMunicipality:[undefined],
      signaturePersonTempWadNo:[undefined],
      sanakhatPersonName:[undefined],
      sanakhatPersonSymNo:[undefined],
      itisambatYear:[undefined],
      itisambatMonth:[undefined],
      itisambatDate:[undefined],
      itisambatTime:[undefined],
      itisambatSubham:[undefined],
      buttonParentName:[undefined],
      buttonGrandParentName:[undefined],
      buttonHusbandWifeName:[undefined],
      guarantorDetails:this.formBuilder.array([]),
      secguarantorDetails:this.formBuilder.array([])
    })
  }


  guarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      guarantorName: [undefined],
      issuedPlace: [undefined]

    })
  }

  secguarantorFormGroup(): FormGroup {
    return this.formBuilder.group({
      guarantorName: [undefined],
      citizenNumber: [undefined],
      issuedYear: [undefined],
      guarantorCDOoffice: [undefined],
      guarantorDistrict: [undefined],
      guarantorMunicipality: [undefined],
      guarantorWadNo: [undefined]

    })
  }

  addGuarantor(): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup());
  }

  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }

  setGuarantors(data) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (data.length===0) {
      this.addGuarantor();
      return;
    }

    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        guarantorName: [value.name],
        issuedPlace: [value.issuedPlace]
      }))
    })


  }
  setsecGuarantors(data) {
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    if (data.length===0) {
      this.addGuarantor();
      return;
    }

    data.forEach((value) => {
      formArray.push(this.formBuilder.group({
        guarantorName: [value.name],
        citizenNumber: [value.citizenNumber],
        issuedYear: [value.issuedYear],
        guarantorCDOoffice: [value.guarantorCDOoffice],
        guarantorDistrict: [value.guarantorDistrict],
        guarantorMunicipality: [value.guarantorMunicipality],
        guarantorWadNo: [value.guarantorWadNo]
      }))
    })


  }
  addsecGuarantor():void{
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.push(this.secguarantorFormGroup());
  }

  removesecGuarantor(index:number):void{
    const formArray = this.form.get('secguarantorDetails') as FormArray;
    formArray.removeAt(index);
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }


}

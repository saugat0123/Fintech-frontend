import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../progressive-offer-letter-const';
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


@Component({
  selector: 'app-guarantee-bond-corporate',
  templateUrl: './guarantee-bond-corporate.component.html',
  styleUrls: ['./guarantee-bond-corporate.component.scss']
})
export class GuaranteeBondCorporateComponent implements OnInit {

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
  constructor(private dialogRef: NbDialogRef<GuaranteeBondCorporateComponent>,
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


  }

  checkOfferLetter() {
    this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
        === this.offerLetterConst.value(this.offerLetterConst.GUARANTEE_BOND_CORPORATE).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.GUARANTEE_BOND_CORPORATE);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      this.setGuarantors(initialInfo.guarantorDetails);
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
            this.offerLetterConst.value(this.offerLetterConst.GUARANTEE_BOND_CORPORATE).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.GUARANTEE_BOND_CORPORATE);
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
      districtName:[undefined],
      municipalityName:[undefined],
      wadNo:[undefined],
      branchName:[undefined],
      registerCompanyName:[undefined],
      date:[undefined],
      ltdNo:[undefined],
      registerDistrict:[undefined],
      regsiterMunicipality:[undefined],
      registerWadNo:[undefined],
      sewaKendra:[undefined],
      certificateNo:[undefined],
      registerDate:[undefined],
      guaranterName:[undefined],
      grandParentName:[undefined],
      grandChildName:[undefined],
      childName:[undefined],
      middleDistrict:[undefined],
      middleMunicipality:[undefined],
      middleWadNo:[undefined],
      age:[undefined],
      customerName:[undefined],
      citizenshipNo:[undefined],
      citizenshipRegDate:[undefined],
      pradanKaryalaya:[undefined],
      regOffice:[undefined],
      regDate:[undefined],
      praliNo:[undefined],
      rajaswaDistrict:[undefined],
      rajaswaMunicipality:[undefined],
      rajaswaWadNo:[undefined],
      sewakendra:[undefined],
      PanNo:[undefined],
      PaNoRegDate:[undefined],
      registered:[undefined],
      amount:[undefined],
      amountInWord:[undefined],
      middleAmount:[undefined],
      middleAmountInWord:[undefined],
      GuaranteeName:[undefined],
      GuaranteeCitizenshipNo:[undefined],
      GuaranteeDate:[undefined],
      GuaranteeCDOoffice:[undefined],
      GuaranteePermanentDistrict:[undefined],
      GuaranteePermanentMunicipality:[undefined],
      GuaranteePermanentWadNo:[undefined],
      sabikVDC:[undefined],
      sabikWadNo:[undefined],
      GuaranteeTempDistrict:[undefined],
      GuaranteeTempMunicipality:[undefined],
      GuaranteeTempWadNo:[undefined],
      sanakhatPersonNAme:[undefined],
      sanakhatPersonSymbNo:[undefined],
      itiSambatYear:[undefined],
      itiSambaMonth:[undefined],
      itiSambatDate:[undefined],
      itiSambatTime:[undefined],
      sicerlyFatherName:[undefined],
      sicerlyGrandFatherName:[undefined],
      sicerlyHusbandName:[undefined],
      itiSambatRojSubham:[undefined],
      guarantorDetails:this.formBuilder.array([])



    })
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

    })


  }

  setGuarantors(data) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
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
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.push(this.guarantorFormGroup())
  }

  removeGuarantor(index: number): void {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    formArray.removeAt(index);
  }

  getNumAmountWord(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
    const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.form.get(wordLabel).patchValue(returnVal);
  }

}

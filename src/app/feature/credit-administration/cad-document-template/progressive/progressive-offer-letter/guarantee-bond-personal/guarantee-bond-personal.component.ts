import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ProgressiveOfferLetterConst} from "../../progressive-offer-letter-const";
import {CustomerOfferLetter} from "../../../../../loan/model/customer-offer-letter";
import {OfferDocument} from "../../../../model/OfferDocument";
import {NbDialogRef} from "@nebular/theme";
import {NepaliToEngNumberPipe} from "../../../../../../@core/pipe/nepali-to-eng-number.pipe";
import {NepaliCurrencyWordPipe} from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import {CreditAdministrationService} from "../../../../service/credit-administration.service";
import {ToastService} from "../../../../../../@core/utils";
import {RouterUtilsService} from "../../../../utils/router-utils.service";
import {CustomerOfferLetterService} from "../../../../../loan/service/customer-offer-letter.service";
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {CadDocStatus} from "../../../../model/CadDocStatus";
import {Alert, AlertType} from "../../../../../../@theme/model/Alert";

@Component({
    selector: 'app-guarantee-bond-personal',
    templateUrl: './guarantee-bond-personal.component.html',
    styleUrls: ['./guarantee-bond-personal.component.scss']
})
export class GuaranteeBondPersonalComponent implements OnInit {
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

    constructor(private dialogRef: NbDialogRef<GuaranteeBondPersonalComponent>,
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
        === this.offerLetterConst.value(this.offerLetterConst.GUARANTEE_BOND_PERSONAL).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.GUARANTEE_BOND_PERSONAL);
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
            this.offerLetterConst.value(this.offerLetterConst.GUARANTEE_BOND_PERSONAL).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.GUARANTEE_BOND_PERSONAL);
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


    buildForm():void{
      this.form=this.formBuilder.group({
        grandParentName:[undefined],
        parentName:[undefined],
        husbandName:[undefined],
        sasuSasura:[undefined],
        district:[undefined],
        municipality:[undefined],
        wadNo:[undefined],
        tempDistrict:[undefined],
        tempMunicipality:[undefined],
        tempWadNo:[undefined],
        date:[undefined],
        cdoOffice:[undefined],
        citizenshipNo:[undefined],
        age:[undefined],
        buttonGrandParentName:[undefined],
        buttonParentName:[undefined],
        buttonhusbandName:[undefined],
        buttonSasuSasura:[undefined],
        buttonDistrict:[undefined],
        buttonMunicipalityt:[undefined],
        buttonWadNo:[undefined],
        buttonTempDistrict:[undefined],
        buttonTempMuniciplity:[undefined],
        buttonTempWadNo:[undefined],
        buttonDate:[undefined],
        buttonCdoOffice:[undefined],
        buttonCitizenshipNo:[undefined],
        buttonAge:[undefined],
        guaranteeNAme:[undefined],
        guaranteeCitizenshipNo:[undefined],
        guaranteeIssueDate:[undefined],
        guaranteeCdoOffice:[undefined],
        guaranteePermanentDistrict:[undefined],
        guaranteePermanentMunicipality:[undefined],
        guaranteePermanentWadNo:[undefined],
        sabikVDC:[undefined],
        sabikWaNo:[undefined],
        guaranteeTempDistrict:[undefined],
        guaranteeTempMunicipality:[undefined],
        guaranteeTempWadNo:[undefined],
        fatherMotherName:[undefined],
        grandFatherGrandmomName:[undefined],
        husbandWifeName:[undefined],
        karmachariName:[undefined],
        karmachariSanketNo:[undefined],
        itiSambatYear:[undefined],
        itiSambatMonth:[undefined],
        itiSambatDate:[undefined],
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

}

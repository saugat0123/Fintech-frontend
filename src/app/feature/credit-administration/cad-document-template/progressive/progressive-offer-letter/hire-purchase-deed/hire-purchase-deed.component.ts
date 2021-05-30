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
  selector: 'app-hire-purchase-deed',
  templateUrl: './hire-purchase-deed.component.html',
  styleUrls: ['./hire-purchase-deed.component.scss']
})
export class HirePurchaseDeedComponent implements OnInit {

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

  constructor( private dialogRef: NbDialogRef<HirePurchaseDeedComponent>,
               private formBuilder: FormBuilder,
               private nepToEngNumberPipe: NepaliToEngNumberPipe,
               private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               private administrationService: CreditAdministrationService,
               private toastService: ToastService,
               private routerUtilsService: RouterUtilsService,
               private customerOfferLetterService: CustomerOfferLetterService,) { }

  ngOnInit() {
this.buildForm();
    this.startingGuarantor();
this.checkOfferLetter();
const ar=this.form.get('guarantorDetail') as FormArray;
this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(value=>{

    const prs=JSON.parse(value.initialInformation);

})

  }

    fillForm() {
        this.nepaliData = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);

        this.form.patchValue({
            customerName: this.nepaliData.name ? this.nepaliData.name : '',
        });
    }

    checkOfferLetter() {
        this.offerLetterDocument = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value => value.docName.toString()
            === this.offerLetterConst.value(this.offerLetterConst.HIRE_PURCHASE_DEED).toString())[0];
        if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
            this.offerLetterDocument = new OfferDocument();
            this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HIRE_PURCHASE_DEED);
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
                    this.offerLetterConst.value(this.offerLetterConst.HIRE_PURCHASE_DEED).toString()) {
                    offerLetterPath.initialInformation = JSON.stringify(this.form.value);
                }
            });
        } else {
            const offerDocument = new OfferDocument();
            offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HIRE_PURCHASE_DEED);
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
            grandParentName:[undefined],
            parentName:[undefined],
            husbandWifeName:[undefined],
            customerDistrict:[undefined],
            customerMunicipality:[undefined],
            customerWadNo:[undefined],
            sabikVDC:[undefined],
            sabikWadNo:[undefined],
            tempMunicipality:[undefined],
            tempWadNo:[undefined],
            age:[undefined],
            customerName:[undefined],
            customerCitizenshipNo:[undefined],
            date:[undefined],
            cdoOffice:[undefined],
            matralayaName:[undefined],
            biBhagCompany:[undefined],
            regOffice:[undefined],
            act:[undefined],
            under:[undefined],
            underDate:[undefined],
            praliNo:[undefined],
            serviceOffice:[undefined],
            serviceDate:[undefined],
            certificateNo:[undefined],
            certifiedDistrict:[undefined],
            certifiedMunicipality:[undefined],
            certifiedWadNo:[undefined],
            secRegOffice:[undefined],
            pratinidhiGrandParent:[undefined],
            pratinidhiParent:[undefined],
            pratinidhiHusbandWifeName:[undefined],
            pratinidhiDistrict:[undefined],
            pratinidhiMunicipality:[undefined],
            pratinidhiWadNo:[undefined],
            pratinidhiTempDistrict:[undefined],
            pratinidhiTempMunicipality:[undefined],
            pratinidhiTempWadNo:[undefined],
            pratinidhiAge:[undefined],
            pratinidhiName:[undefined],
            pratinidhiCitizenshipNo:[undefined],
            pratinidhiDate:[undefined],
            pratinidhiCDOoffice:[undefined],
            kistabandiBranchName:[undefined],
            kistabandiBranchAddress:[undefined],
            tapsilSN:[undefined],
            sawariPrakar:[undefined],
            engineNo:[undefined],
            chasisNo:[undefined],
            regNo:[undefined],
            regDate:[undefined],
            sincerlySign:[undefined],
            akhtiyarName:[undefined],
            akhtiyarCitizenshipNo:[undefined],
            akhtiyarDate:[undefined],
            akhtiyarMuniciplity:[undefined],
            akhtiyarPermanentDistrict:[undefined],
            akhtiyarPermanentMunicipality:[undefined],
            akhtiyarPermanentWadNo:[undefined],
            akhtiyarSabikVDC:[undefined],
            akhtiyarSabikWadNo:[undefined],
            akhtiyarTempDistrict:[undefined],
            akhtiyarTempMunicipality:[undefined],
            akhtiyarTempWadNo:[undefined],
            sicerlyFatherName:[undefined],
            sicerlyMotherName:[undefined],
            sicerlyGrandFatherName:[undefined],
            sicerlyGrandMotherName:[undefined],
            sicerlyHusbandName:[undefined],
            sicerlyWifeNAme:[undefined],
            sanakhatPersonName:[undefined],
            sanakhatPersonSymNo:[undefined],
            itisambatYear:[undefined],
            itisambatMonth:[undefined],
            itisambatDate:[undefined],
            itisambatTime:[undefined],
            itisambatSubham:[undefined],
            guarantorDetail:this.formBuilder.array([])
        });
    }
  guarantorFormGroup():FormGroup{
    return this.formBuilder.group({
      guarantorName:[undefined],
      guarantorSign:[undefined],
      guarantorCitizenshipNo:[undefined],
      guarantorDate:[undefined],
      guarantorCDOoffice:[undefined],
      guarantorDistrict:[undefined],
      guarantorMunicipality:[undefined],
      guarantorWadNo:[undefined]

    })


  }

  addMoreGuarantor():void{
        const formArray=this.form.get('guarantorDetail') as FormArray;
        formArray.push(this.guarantorFormGroup())
    }

    removeGuarantor(index:number):void{
        const formArray=this.form.get('guarantorDetail') as FormArray;
        formArray.removeAt(index);
    }

    startingGuarantor():void
    {
        const formArray=this.form.get('guarantorDetail') as FormArray;
        formArray.push(this.guarantorFormGroup())
    }

}

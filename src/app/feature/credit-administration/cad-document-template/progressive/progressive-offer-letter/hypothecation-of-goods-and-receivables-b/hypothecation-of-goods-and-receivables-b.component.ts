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
  selector: 'app-hypothecation-of-goods-and-receivables-b',
  templateUrl: './hypothecation-of-goods-and-receivables-b.component.html',
  styleUrls: ['./hypothecation-of-goods-and-receivables-b.component.scss']
})
export class HypothecationOfGoodsAndReceivablesBComponent implements OnInit {
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
  constructor(private dialogRef: NbDialogRef<HypothecationOfGoodsAndReceivablesBComponent>,
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
        === this.offerLetterConst.value(this.offerLetterConst.HYPOTHECATION_OF_GOODS_AND_RECEIVABLE_B).toString())[0];
    if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
      this.offerLetterDocument = new OfferDocument();
      this.offerLetterDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HYPOTHECATION_OF_GOODS_AND_RECEIVABLE_B);
      this.fillForm();
    } else {
      const initialInfo = JSON.parse(this.offerLetterDocument.initialInformation);
      this.initialInfoPrint = initialInfo;
      this.existingOfferLetter = true;
      this.setGuarantors(initialInfo.guarantorDetail);
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
            this.offerLetterConst.value(this.offerLetterConst.HYPOTHECATION_OF_GOODS_AND_RECEIVABLE_B).toString()) {
          offerLetterPath.initialInformation = JSON.stringify(this.form.value);
        }
      });
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(this.offerLetterConst.HYPOTHECATION_OF_GOODS_AND_RECEIVABLE_B);
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
      pratinidhiName: [undefined],
      pratinidhiGrandSon: [undefined],
      pratinidhiChild: [undefined],
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
      tapsilSN: [undefined],
      tapsilBibaran: [undefined],
      tapsilMulya: [undefined],
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
      signMotherName: [undefined],
      signGrandFatherName: [undefined],
      signGrandMotherName: [undefined],
      signHusbandName: [undefined],
      signWifeName: [undefined],
      sanakhatPersonName: [undefined],
      sanakhatPersonSymNo: [undefined],
      itisambatYear: [undefined],
      itisambatMonth: [undefined],
      itisambatDate: [undefined],
      itisambatTime: [undefined],
      itisambatSubham: [undefined],
      guarantorDetail: this.formBuilder.array([])
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

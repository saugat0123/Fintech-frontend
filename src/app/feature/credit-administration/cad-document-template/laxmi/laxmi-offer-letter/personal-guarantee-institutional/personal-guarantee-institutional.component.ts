import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {OfferLetterConst} from '../../../../../cad-documents/cad-document-core/srdb-offer-letter/offer-letter-const';
import {CadCheckListTemplateEnum} from '../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-personal-guarantee-institutional',
  templateUrl: './personal-guarantee-institutional.component.html',
  styleUrls: ['./personal-guarantee-institutional.component.scss']
})
export class PersonalGuaranteeInstitutionalComponent implements OnInit {

  form: FormGroup;
  spinner = false;
  offerLetterConst = CadCheckListTemplateEnum;
  constructor(
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      branch: [undefined],
      grandFatherName: [undefined],
      fatherName: [undefined],
      district: [undefined],
      municipality: [undefined],
      age: [undefined],
      customerName: [undefined],
      citizenShipNo: [undefined],
      citizenShipIssuedDistrict: [undefined],
      citizenShipIssuedOffice: [undefined],
      issuedYear: [undefined],
      issuedMonth: [undefined],
      issuedDay: [undefined],
      mantralaya: [undefined],
      karyalaya: [undefined],
      dartaNo: [undefined],
      dartaYear: [undefined],
      dartaMonth: [undefined],
      dartaDay: [undefined],
      dartaDistrict: [undefined],
      dartaMunicipality: [undefined],
      dartaWadNo: [undefined],
      taxOffice: [undefined],
      lekhaNo: [undefined],
      registeredYear: [undefined],
      registeredMonth: [undefined],
      registeredDay: [undefined],
      companyName: [undefined],
      proposedAmount: [undefined],
      amountInWords: [undefined],
    });
  }
onSubmit() {}
}

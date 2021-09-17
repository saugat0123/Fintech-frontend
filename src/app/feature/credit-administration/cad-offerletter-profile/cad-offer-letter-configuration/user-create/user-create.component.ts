import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {CustomerType} from '../../../../customer/model/customerType';
import {Gender} from '../../../../../@core/model/enum/gender';
import {LanguageEnum} from '../../../../../@core/model/enum/lang.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  spinner = false;
  submitted = false;
  form: FormGroup;
  clientType = CustomerType.values();
  gender = Gender.values();
  translatedValues: any;

  constructor(
      private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    console.log(this.clientType);
    this.buildForm();
    this.addEmptyGuarantor();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      clientTypeTrans: [undefined],
      clientType: [undefined],
      nameTrans: [undefined],
      name: [undefined],
      genderTrans: [undefined],
      gender: [undefined],
      fatherNameTrans: [undefined],
      fatherName: [undefined],
      grandFatherNameTrans: [undefined],
      grandFatherName: [undefined],
      relationMediumTrans: [undefined],
      relationMedium: [undefined],
      husbandNameTrans: [undefined],
      husbandName: [undefined],
      fatherInLawNameTrans: [undefined],
      fatherInLawName: [undefined],
      citizenshipNoTrans: [undefined],
      citizenshipNo: [undefined],
      ageTrans: [undefined],
      age: [undefined],
      permanentProvinceTrans: [undefined],
      permanentProvince: [undefined],
      permanentDistrictTrans: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipalityTrans: [undefined],
      permanentMunicipality: [undefined],
      permanentMunTypeTrans: [undefined],
      permanentMunType: [undefined],
      temporaryProvinceTrans: [undefined],
      temporaryProvince: [undefined],
      temporaryDistrictTrans: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipalityTrans: [undefined],
      temporaryMunicipality: [undefined],
      permanentWardTrans: [undefined],
      permanentWard: [undefined],
      temporaryWardTrans: [undefined],
      temporaryWard: [undefined],
      temporaryMunTypeTrans: [undefined],
      temporaryMunType: [undefined],
      citizenshipIssueDistrictTrans: [undefined],
      citizenshipIssueDistrict: [undefined],
      citizenshipIssueDateTrans: [undefined],
      citizenshipIssueDate: [undefined],

      guarantorDetails: this.formBuilder.array([])
    });
  }

  setGuarantors(guarantorDetails: any) {
    const formArray = this.form.get('guarantorDetails') as FormArray;
    if (ObjectUtil.isEmpty(guarantorDetails)) {
      this.addEmptyGuarantor();
      return;
    }

    guarantorDetails.forEach(value => {
      formArray.push(this.formBuilder.group({
        name: [value.name],
        issuedYear: [value.issuedYear],
        issuedPlace: [value.issuedPlace],
        guarantorLegalDocumentAddress: [value.guarantorLegalDocumentAddress],
        relationship: [value.relationship],
        citizenNumber: [value.citizenNumber]
      }));
    });
  }

  addEmptyGuarantor() {
    (this.form.get('guarantorDetails') as FormArray).push(
        this.formBuilder.group({
          name: '',
          issuedYear: '',
          issuedPlace: '',
          guarantorLegalDocumentAddress: '',
          relationship: '',
          citizenNumber: ''
        })
    );
  }

  removeGuarantor(i: any) {
    (this.form.get('guarantorDetails') as FormArray).removeAt(i);
  }


}

import {Component, Input, OnInit} from '@angular/core';
import {NepaliTemplateDataHolder} from '../../../model/nepali-template-data-holder';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-jamani-baseko',
  templateUrl: './jamani-baseko.component.html',
  styleUrls: ['./jamani-baseko.component.scss']
})
export class JamaniBasekoComponent implements OnInit {
  @Input() nepaliTemplates: NepaliTemplateDataHolder[];
  form: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }


  buildForm() {
    this.form = this.formBuilder.group({
      appliedDate: [undefined],
      borrowerName: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      guarantorName: [undefined],
      guarantorDOB: [undefined],
      guarantorAge: [undefined],
      guarantorCitizenShipNo: [undefined],
      guarantorCitizenIssuedDate: [undefined],
      guarantorCitizenIssuedDistrict: [undefined],
      guarantorFatherName: [undefined],
      guarantorGrandFatherName: [undefined],
      guarantorRelation: [undefined],
      guarantorRelationDate: [undefined],
      guarantorPermanentAddress: [undefined],
      guarantorCurrentDistrict: [undefined],
      guarantorCurrentMunicipality: [undefined],
      guarantorCurrentWardNo : [undefined],
      guarantorCurrentStreet: [undefined],
      guarantorPhoneNo: [undefined],
      guarantorCurrentHouseNo: [undefined],
      guarantorMobileNo: [undefined],
      guarantorCurrentLiving: [undefined],
      guarantorCurrentJob: [undefined],
      guarantorOfficeName: [undefined],
      guarantorOfficeAddress: [undefined],
      guarantorOfficePhoneNo: [undefined],
      guarantorOfficeRole: [undefined],
      marriageStatus: [undefined],
      guarantorFamilyName: [undefined],
      guarantorSchoolName: [undefined],
      guarantorGrade: [undefined],
      guarantorFamiliarPersons: this.formBuilder.array([])

    });
    this.addCustomerDetail();
  }

  addCustomerDetail() {
    (this.form.get('guarantorFamiliarPersons') as FormArray).push(
        this.formBuilder.group({
          guarantorRelativeName: [undefined],
          guarantorRelativeAddress: [undefined],
          guarantorRelativePhone: [undefined],
          guarantorRelativeMobNo: [undefined]
        })
    );

  }

  removeCustomerDetail(index) {
    (this.form.get('guarantorFamiliarPersons') as FormArray).removeAt(index);
  }
}

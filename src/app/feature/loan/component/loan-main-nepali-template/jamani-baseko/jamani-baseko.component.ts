import {Component, Input, OnInit} from '@angular/core';
import {NepaliTemplateDataHolder} from '../../../model/nepali-template-data-holder';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {NepaliTemplateType} from '../../../../admin/modal/nepali-template-type.enum';

@Component({
  selector: 'app-jamani-baseko',
  templateUrl: './jamani-baseko.component.html',
  styleUrls: ['./jamani-baseko.component.scss']
})
export class JamaniBasekoComponent implements OnInit {
  @Input() nepaliTemplates: NepaliTemplateDataHolder[];
  form: FormGroup;
  templateIndexInArray: number = undefined;
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
      guarantorFamiliarPersons: this.formBuilder.array([]),
    });
    if (!ObjectUtil.isEmpty(this.nepaliTemplates)) {
      for (let i = 0; i < this.nepaliTemplates.length; i++) {
        if (this.nepaliTemplates[i].type === NepaliTemplateType.getEnum(NepaliTemplateType.JAMANI_BASEKO)) {
          const parsedData = JSON.parse(this.nepaliTemplates[i].data);
          this.form.patchValue(parsedData);
          parsedData.guarantorFamiliarPersons.forEach((value) => {
            console.log(value);
            (this.form.get('guarantorFamiliarPersons') as FormArray).push(
                this.formBuilder.group({
                  guarantorRelativeName: [value.guarantorRelativeName],
                  guarantorRelativeAddress: [value.guarantorRelativeAddress],
                  guarantorRelativePhone: [value.guarantorRelativePhone],
                  guarantorRelativeMobNo: [value.guarantorRelativeMobNo]
                })
            );
          });
          this.templateIndexInArray = i;
          break;
        }
      }

    } else {
      this.addGuarantorFamiliarPersons();
    }
  }
  removeCustomerDetail(index) {
    (this.form.get('guarantorFamiliarPersons') as FormArray).removeAt(index);
  }

  onSubmit(): void {
    console.log(this.templateIndexInArray);
    if (!ObjectUtil.isEmpty(this.templateIndexInArray)) {
      this.nepaliTemplates[this.templateIndexInArray].data = JSON.stringify(this.form.value);
    } else {
      const jamaniBaseko = new NepaliTemplateDataHolder();
      jamaniBaseko.type = NepaliTemplateType.getEnum(NepaliTemplateType.JAMANI_BASEKO);
      jamaniBaseko.data = JSON.stringify(this.form.value);
      this.nepaliTemplates.push(jamaniBaseko);
    }
    console.log(this.nepaliTemplates);
  }

  addGuarantorFamiliarPersons(): void {
    (this.form.get('guarantorFamiliarPersons') as FormArray).push(
        this.formBuilder.group({
          guarantorRelativeName: [undefined],
          guarantorRelativeAddress: [undefined],
          guarantorRelativePhone: [undefined],
          guarantorRelativeMobNo: [undefined]
        })
    );

  }
}

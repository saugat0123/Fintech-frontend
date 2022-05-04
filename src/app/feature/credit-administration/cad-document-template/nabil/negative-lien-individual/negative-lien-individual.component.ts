import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NabilDocumentChecklist} from '../../../../admin/modal/nabil-document-checklist.enum';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {AgeCalculation} from '../../../../../@core/age-calculation';
import {EngNepDatePipe} from 'nepali-patro';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';

@Component({
  selector: 'app-negative-lien-individual',
  templateUrl: './negative-lien-individual.component.html',
  styleUrls: ['./negative-lien-individual.component.scss']
})
export class NegativeLienIndividualComponent implements OnInit {
  @Input() cadData;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  negativeLienForm: FormGroup;
  documentConstant = NabilDocumentChecklist;
  spinner: false;
  individualData;
  customerData;

  constructor(
      private formBuilder: FormBuilder,
      private englishNepaliDatePipe: EngNepDatePipe,
      private engToNepNumberPipe: EngToNepaliNumberPipe,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadData.loanHolder.nepData)) {
      this.individualData = JSON.parse(this.cadData.loanHolder.nepData);
    }
    this.fillForm();
    console.log('this.cadData', this.cadData);
  }

  submit() {

  }

  buildForm() {
    return this.negativeLienForm = this.formBuilder.group({
      nameOfGrandfather: [undefined],
      fatherOrHusbandName: [undefined],
      sonOrDaughterName: [undefined],
      districtName: [undefined],
      municipalityVdcName: [undefined],
      wardNumber: [undefined],
      age: [undefined],
      nameOfBorrower: [undefined],
      citizenshipNumber: [undefined],
      dateOfIssue: [undefined],
      identityIssuedDistrict: [undefined],
      totalDebtor: [undefined],
      sanctionLetterDate: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWord: [undefined],
      ministryOfLandManagement: [undefined],
      landOwnerName: [undefined],
      provinceName: [undefined],
      districtNames: [undefined],
      witnessDistrict1: [undefined],
      witnessMunicipalityOrVdc1: [undefined],
      witnessWardNo1: [undefined],
      witnessAge1: [undefined],
      witnessName1: [undefined],
      witnessDistrict2: [undefined],
      witnessMunicipalityOrVdc2: [undefined],
      witnessWardNo2: [undefined],
      witnessAge2: [undefined],
      witnessName2: [undefined],
      sambhad: [undefined],
      year: [undefined],
      month: [undefined],
      day: [undefined],
      subham: [undefined]
    });
  }
  fillForm() {
    let nameOfFatherOrHusband = '';
    if (!ObjectUtil.isEmpty(this.individualData)) {
      if (this.individualData.relationMedium.en === '0') {
        nameOfFatherOrHusband = this.individualData.husbandName.ct;
      } else {
        nameOfFatherOrHusband = this.individualData.fatherName.ct;
      }
    }
    let todayDate: any = this.englishNepaliDatePipe.transform(new Date(), true);
    todayDate = todayDate.replace(',', '').split(' ');
    const daysInNumber = new Date().getDay();
    let age: any;
    let ageNepaliNumber: string;
    if (!ObjectUtil.isEmpty(this.individualData) &&
        !ObjectUtil.isEmpty(this.individualData.dobDateType) &&
        !ObjectUtil.isEmpty(this.individualData.dobDateType.en)) {
      if (this.individualData.dobDateType.en === 'AD') {
        if (!ObjectUtil.isEmpty(this.individualData.dob)) {
          age = AgeCalculation.calculateAge(this.individualData.dob.en).toString();
        }
      } else {
        if (!ObjectUtil.isEmpty(this.individualData.dobNepali)) {
          age = AgeCalculation.calculateAge(this.individualData.dobNepali.en.eDate).toString();
        }
      }
      ageNepaliNumber = this.engToNepNumberPipe.transform(String(age));
    }
    this.negativeLienForm.patchValue({
      nameOfGrandfather: this.individualData.grandFatherName ? this.individualData.grandFatherName.ct : '',
      fatherOrHusbandName: nameOfFatherOrHusband ? nameOfFatherOrHusband : '',
      sonOrDaughterName: this.individualData.name.ct ? this.individualData.name.ct : '',
      districtName: this.individualData.permanentDistrict ? this.individualData.permanentDistrict.ct : '',
      municipalityVdcName: this.individualData.permanentMunicipality ? this.individualData.permanentMunicipality.ct : '',
      wardNumber: this.individualData.permanentWard ? this.individualData.permanentWard.ct : '',
      age: ageNepaliNumber ? ageNepaliNumber : '',
    });
  }
}

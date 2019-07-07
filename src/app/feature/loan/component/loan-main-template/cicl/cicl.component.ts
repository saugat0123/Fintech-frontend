import {Component, Input, OnInit} from '@angular/core';
import {Cicl} from '../../../../admin/modal/cicl';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Insurance} from '../../../../admin/modal/insurance';

@Component({
  selector: 'app-cicl',
  templateUrl: './cicl.component.html',
  styleUrls: ['./cicl.component.scss']
})
export class CiclComponent implements OnInit {
  @Input() ciclValue: Array<Cicl>;
  @Input() insuranceValue: Insurance;
  @Input() ciclRemark: string;

  ciclForm: FormGroup;
  insuranceForm: FormGroup;
  ciclList: Array<Cicl> = new Array<Cicl>();
  insurance: Insurance = new Insurance();

  constructor(
      private formBuilder: FormBuilder
  ) {
  }

  get insuranceCompany() {
    return this.insuranceForm.get('insuranceCompany');
  }

  get insuredAmount() {
    return this.insuranceForm.get('insuredAmount');
  }

  get premiumAmount() {
    return this.insuranceForm.get('premiumAmount');
  }

  get issuedDate() {
    return this.insuranceForm.get('issuedDate');
  }

  get expiryDate() {
    return this.insuranceForm.get('expiryDate');
  }

  get policyType() {
    return this.insuranceForm.get('policyType');
  }

  get ciclRemarks() {
    return this.ciclForm.get('ciclRemarks');
  }

  get ciclArray() {
    return this.ciclForm.get('ciclArray');
  }

  ngOnInit() {
    if (this.ciclValue !== undefined) {
      this.ciclList = this.ciclValue;
    }
    if (this.insuranceValue !== undefined) {
      this.insurance = this.insuranceValue;
    }

    this.buildCiclForm();
    this.buildInsuranceForm();
  }

  buildCiclForm() {
    this.ciclForm = this.formBuilder.group({
      ciclArray: this.formBuilder.array([]),
      ciclRemarks: [this.ciclRemark === undefined ? '' : this.ciclRemark, Validators.required]
    });

    if (this.ciclList.length > 0) {
      this.patchCiclFormGroup(this.ciclList);
    } else {
      this.addCiclFormGroup();
    }
  }

  addCiclFormGroup() {
    const controls = this.ciclForm.controls.ciclArray as FormArray;
    controls.push(
        this.formBuilder.group({
          fiName: [undefined, Validators.required],
          facilityName: [undefined, Validators.required],
          overdueAmount: [undefined, Validators.required],
          outstandingAmount: [undefined, Validators.required],
          ciclStatus: [undefined, Validators.required]
        }));
  }

  removeCICL(index: number) {
    (this.ciclArray as FormArray).removeAt(index);
  }

  patchCiclFormGroup(ciclList: Array<Cicl>) {
    const controls = this.ciclForm.controls.ciclArray as FormArray;
    ciclList.forEach(cicl => {
      controls.push(
          this.formBuilder.group({
            fiName: [cicl.nameOfFI, Validators.required],
            facilityName: [cicl.facility, Validators.required],
            overdueAmount: [cicl.overdueAmount, Validators.required],
            outstandingAmount: [cicl.outstandingAmount, Validators.required],
            ciclStatus: [cicl.status, Validators.required]
          }));
    });
  }

  buildInsuranceForm() {
    this.insuranceForm = this.formBuilder.group({
      insuranceCompany: [this.insurance.company === undefined ? undefined : this.insurance.company, Validators.required],
      insuredAmount: [this.insurance.insuredAmount === undefined ? undefined : this.insurance.insuredAmount, Validators.required],
      premiumAmount: [this.insurance.premiumAmount === undefined ? undefined : this.insurance.premiumAmount, Validators.required],
      issuedDate: [this.insurance.issuedDate === undefined ? undefined : this.insurance.issuedDate, Validators.required],
      expiryDate: [this.insurance.expiryDate === undefined ? undefined : this.insurance.expiryDate, Validators.required],
      policyType: [this.insurance.policyType === undefined ? undefined : this.insurance.policyType, Validators.required],
    });
  }

  onSubmit() {
    // insurance
    this.insurance.company = this.insuranceCompany.value;
    this.insurance.insuredAmount = this.insuredAmount.value;
    this.insurance.premiumAmount = this.premiumAmount.value;
    this.insurance.issuedDate = this.issuedDate.value;
    this.insurance.expiryDate = this.expiryDate.value;
    this.insurance.policyType = this.policyType.value;

    // CICL
    this.ciclRemark = this.ciclRemarks.value;
    this.ciclList = new Array<Cicl>();
    const ciclControls = this.ciclArray as FormArray;
    for (const arrayControl of ciclControls.controls) {
      const controls = (arrayControl as FormGroup).controls;
      const cicl: Cicl = new Cicl();
      cicl.nameOfFI = controls.fiName.value;
      cicl.facility = controls.facilityName.value;
      cicl.overdueAmount = controls.overdueAmount.value;
      cicl.outstandingAmount = controls.outstandingAmount.value;
      cicl.status = controls.ciclStatus.value;
      this.ciclList.push(cicl);
    }
  }

}

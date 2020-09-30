import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Cicl, CiclArray} from '../../admin/modal/cicl';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {FormUtils} from '../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';

@Component({
  selector: 'app-cicl',
  templateUrl: './cicl.component.html',
  styleUrls: ['./cicl.component.scss']
})
export class CiclComponent implements OnInit {
  @Input() ciclValue: CiclArray;

  @Input() fromProfile: boolean;

  ciclForm: FormGroup;

  ciclList: Array<Cicl> = new Array<Cicl>();
  @Output() ciclDataEmitter = new EventEmitter();

  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private toastService: ToastService
  ) {
  }


  get ciclRemarks() {
    return this.ciclForm.get('ciclRemarks');
  }

  get ciclArray() {
    return this.ciclForm.get('ciclArray');
  }

  get ciclFormControls() {
    return this.ciclForm.controls;
  }


  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.ciclValue)) {
      this.ciclList = JSON.parse(this.ciclValue.data);
    }


    this.buildCiclForm();

  }

  buildCiclForm() {
    this.ciclForm = this.formBuilder.group({
      ciclArray: this.formBuilder.array([]),
      ciclRemarks: [this.ciclValue.remarks === undefined ? '' : this.ciclValue.remarks]
    });
    if (!ObjectUtil.isEmpty(this.ciclList)) {
      if ((this.ciclList.length > 0)) {
        this.patchCiclFormGroup(this.ciclList);
      }
    } else {
      this.addCiclFormGroup();
    }
  }

  addCiclFormGroup() {
    const controls = this.ciclForm.controls.ciclArray as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All CICL Detail To Add More'));
      return;
    }
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


  onSubmit() {

    if (this.ciclForm.invalid) {
      this.submitted = true;
      return;
    }

    // CICL

    console.log(this.ciclRemarks);
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
    const ciclArray: CiclArray = new CiclArray();
    this.ciclValue.remarks = this.ciclRemarks.value;
    this.ciclValue.data = JSON.stringify(this.ciclList);
    this.ciclDataEmitter.emit(this.ciclValue);
  }

}

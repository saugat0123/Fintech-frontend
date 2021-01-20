import {Component, EventEmitter, Input, OnInit, Output, ElementRef} from '@angular/core';
import {Cicl, CiclArray} from '../../admin/modal/cicl';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {FormUtils} from '../../../@core/utils/form.utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {Editor} from '../../../@core/utils/constants/editor';
import {RepaymentTrack} from '../../admin/modal/crg/RepaymentTrack';
import {RelationshipList} from '../../loan/model/relationshipList';
import {CiclRelationListEnum} from '../../loan/model/ciclRelationListEnum';

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
  ckeConfig = Editor.CK_CONFIG;

  repaymentTrack = RepaymentTrack.enumObject();
  relationshipList: RelationshipList = new RelationshipList();
  relationlist;
  ciclRelation = CiclRelationListEnum.pair();
  ciclHistoryFound = false;

  constructor(
      private formBuilder: FormBuilder,
      private toastService: ToastService,
      private el: ElementRef,
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
        this.ciclHistoryFound = true;
      this.ciclList = JSON.parse(this.ciclValue.data);
    } else {
      this.ciclValue = new CiclArray();
    }
    this.buildCiclForm();
    this.relationlist = this.relationshipList.relation;


  }

  buildCiclForm() {
    this.ciclForm = this.formBuilder.group({
      ciclArray: this.formBuilder.array([]),
      ciclRemarks: [ObjectUtil.isEmpty(this.ciclValue) ? '' : this.ciclValue.remarks],
      repaymentTrack: [ObjectUtil.isEmpty(this.ciclValue) ? '' : this.ciclValue.repaymentTrack, Validators.required],
      cibCharge: [ObjectUtil.isEmpty(this.ciclValue) ? undefined : this.ciclValue.cibCharge, [Validators.required, Validators.min(0)]]
    });
    if (!ObjectUtil.isEmpty(this.ciclList)) {
      if ((this.ciclList.length > 0)) {
        this.patchCiclFormGroup(this.ciclList);
      } else {
        this.addCiclFormGroup();
      }
    } else {
      this.addCiclFormGroup();
    }
  }

  addCiclFormGroup() {
    const controls = this.ciclForm.controls.ciclArray as FormArray;

    controls.push(
        this.formBuilder.group({
          borrowerName: [undefined, Validators.required],
          fiName: [undefined, Validators.required],
          facilityName: [undefined, Validators.required],
          overdueAmount: [undefined, Validators.required],
          outstandingAmount: [undefined, Validators.required],
          ciclStatus: [undefined, Validators.required],
          obtaineddate: [undefined, Validators.required],
          loanamount: [undefined, Validators.required],
          overdue: [undefined],
          ciclRelation: [undefined]
        }));
  }

  addCicl() {
    const controls = this.ciclForm.controls.ciclArray as FormArray;
    if (FormUtils.checkEmptyProperties(controls)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All CICL Detail To Add More'));
      return;
    }
    controls.push(
        this.formBuilder.group({
          borrowerName: [undefined, Validators.required],
          fiName: [undefined, Validators.required],
          facilityName: [undefined, Validators.required],
          overdueAmount: [undefined, Validators.required],
          outstandingAmount: [undefined, Validators.required],
          ciclStatus: [undefined, Validators.required],
          obtaineddate: [undefined, Validators.required],
          loanamount: [undefined, Validators.required],
          overdue: [undefined],
          ciclRelation: [undefined]

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
            borrowerName: [cicl.nameOfBorrower, Validators.required],
            fiName: [cicl.nameOfFI, Validators.required],
            facilityName: [cicl.facility, Validators.required],
            overdueAmount: [cicl.overdueAmount, Validators.required],
            outstandingAmount: [cicl.outstandingAmount, Validators.required],
            ciclStatus: [cicl.status, Validators.required],
            obtaineddate: [cicl.obtaineddate, Validators.required],
            loanamount: [cicl.loanamount, Validators.required],
            overdue: [cicl.overdue],
            ciclRelation: [cicl.ciclRelation]

          }));
    });
  }
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
        'form .ng-invalid'
    );
    window.scroll({
      top: this.getTopOffset(firstInvalidControl),
      left: 0,
      behavior: 'smooth'
    });
    firstInvalidControl.focus();
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 50;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }


  onSubmit() {
      this.submitted = true;
      if (this.ciclForm.invalid) {
          this.scrollToFirstInvalidControl();
          return;
      }

      // CICL

      this.ciclList = new Array<Cicl>();
      if (this.ciclHistoryFound) {
      const ciclControls = this.ciclArray as FormArray;
      for (const arrayControl of ciclControls.controls) {
          const controls = (arrayControl as FormGroup).controls;
          const cicl: Cicl = new Cicl();
          cicl.nameOfBorrower = controls.borrowerName.value;
          cicl.nameOfFI = controls.fiName.value;
          cicl.facility = controls.facilityName.value;
          cicl.overdueAmount = controls.overdueAmount.value;
          cicl.outstandingAmount = controls.outstandingAmount.value;
          cicl.status = controls.ciclStatus.value;
          cicl.obtaineddate = controls.obtaineddate.value;
          cicl.loanamount = controls.loanamount.value;
          cicl.overdue = controls.overdue.value;
          cicl.ciclRelation = controls.ciclRelation.value;

          this.ciclList.push(cicl);

      }
      // uncomment if value is need
      this.ciclValue.remarks = this.ciclForm.get('ciclRemarks').value === undefined ? '' : this.ciclForm.get('ciclRemarks').value;
      this.ciclValue.cibCharge = this.ciclForm.get('cibCharge').value === undefined ? '' : this.ciclForm.get('cibCharge').value;
      this.ciclValue.repaymentTrack = this.ciclForm.get('repaymentTrack').value === undefined ? '' :
          this.ciclForm.get('repaymentTrack').value;
      this.ciclValue.data = JSON.stringify(this.ciclList);
      this.ciclDataEmitter.emit(this.ciclValue);
  }
  }

  showCiclHistoryFound(chkValue) {
      if (!chkValue) {
          this.ciclHistoryFound = false;
      } else {
          this.ciclHistoryFound = true;
      }
  }

}
